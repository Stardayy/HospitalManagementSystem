package com.hms.hospital_management_system.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hms.hospital_management_system.entity.Document;
import com.hms.hospital_management_system.entity.Document.DocumentType;
import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.security.CustomUserDetails;
import com.hms.hospital_management_system.service.DocumentService;
import com.hms.hospital_management_system.service.PatientService;
import com.hms.hospital_management_system.util.AuditHelper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class DocumentController {

    private final DocumentService documentService;
    private final PatientService patientService;
    private final AuditHelper auditHelper;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
        }
        return null;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUser();
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        User currentUser = getCurrentUser();
        // If user is a doctor, only return documents for their patients
        if (currentUser != null && currentUser.getRole() == User.Role.DOCTOR && currentUser.getDoctorId() != null) {
            List<Patient> doctorPatients = patientService.getPatientsByDoctor(currentUser.getDoctorId());
            List<Long> patientIds = doctorPatients.stream().map(Patient::getId).toList();
            List<Document> allDocuments = documentService.getAllDocuments();
            List<Document> filteredDocuments = allDocuments.stream()
                    .filter(d -> d.getPatient() != null && patientIds.contains(d.getPatient().getId()))
                    .toList();
            return ResponseEntity.ok(filteredDocuments);
        }
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Document>> getDocumentsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(documentService.getDocumentsByPatient(patientId));
    }

    @GetMapping("/type/{documentType}")
    public ResponseEntity<List<Document>> getDocumentsByType(@PathVariable DocumentType documentType) {
        return ResponseEntity.ok(documentService.getDocumentsByType(documentType));
    }

    @GetMapping("/patient/{patientId}/type/{documentType}")
    public ResponseEntity<List<Document>> getDocumentsByPatientAndType(
            @PathVariable Long patientId,
            @PathVariable DocumentType documentType) {
        return ResponseEntity.ok(documentService.getDocumentsByPatientAndType(patientId, documentType));
    }

    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam Long patientId,
            @RequestParam(required = false) DocumentType documentType,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Boolean isConfidential,
            HttpServletRequest request) {
        try {
            Long uploadedBy = getCurrentUserId();
            Document document = documentService.uploadDocument(file, patientId, documentType,
                    description, uploadedBy, isConfidential);
            auditHelper.logCreate("Document", document.getId().toString(),
                    "Uploaded document: " + file.getOriginalFilename() + " for patient " + patientId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(document);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id)
                    .orElseThrow(() -> new RuntimeException("Document not found"));

            byte[] fileContent = documentService.downloadDocument(id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(document.getFileType()));
            headers.setContentDispositionFormData("attachment", document.getOriginalFileName());
            headers.setContentLength(fileContent.length);

            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(
            @PathVariable Long id,
            @RequestParam(required = false) DocumentType documentType,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Boolean isConfidential,
            HttpServletRequest request) {
        Document updated = documentService.updateDocument(id, documentType, description, isConfidential);
        auditHelper.logUpdate("Document", id.toString(), "Updated document metadata", request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id, HttpServletRequest request) {
        try {
            auditHelper.logDelete("Document", id.toString(), "Deleted document", request);
            documentService.deleteDocument(id);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
