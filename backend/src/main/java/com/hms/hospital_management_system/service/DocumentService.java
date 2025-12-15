package com.hms.hospital_management_system.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.hms.hospital_management_system.entity.Document;
import com.hms.hospital_management_system.entity.Document.DocumentType;
import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.repository.DocumentRepository;
import com.hms.hospital_management_system.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final PatientRepository patientRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }

    public List<Document> getDocumentsByPatient(Long patientId) {
        return documentRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public List<Document> getDocumentsByType(DocumentType documentType) {
        return documentRepository.findByDocumentType(documentType);
    }

    public List<Document> getDocumentsByPatientAndType(Long patientId, DocumentType documentType) {
        return documentRepository.findByPatientIdAndDocumentType(patientId, documentType);
    }

    public Document uploadDocument(MultipartFile file, Long patientId, DocumentType documentType, 
                                   String description, Long uploadedBy, Boolean isConfidential) throws IOException {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        // Save file
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Create document record
        Document document = Document.builder()
                .patient(patient)
                .fileName(uniqueFileName)
                .originalFileName(originalFileName)
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .filePath(filePath.toString())
                .documentType(documentType)
                .description(description)
                .uploadedBy(uploadedBy)
                .isConfidential(isConfidential != null ? isConfidential : false)
                .build();
        
        return documentRepository.save(document);
    }

    public byte[] downloadDocument(Long id) throws IOException {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
        
        Path filePath = Paths.get(document.getFilePath());
        return Files.readAllBytes(filePath);
    }

    public Document updateDocument(Long id, DocumentType documentType, String description, Boolean isConfidential) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
        
        if (documentType != null) {
            document.setDocumentType(documentType);
        }
        if (description != null) {
            document.setDescription(description);
        }
        if (isConfidential != null) {
            document.setIsConfidential(isConfidential);
        }
        
        return documentRepository.save(document);
    }

    public void deleteDocument(Long id) throws IOException {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
        
        // Delete file from filesystem
        Path filePath = Paths.get(document.getFilePath());
        Files.deleteIfExists(filePath);
        
        // Delete record from database
        documentRepository.deleteById(id);
    }
}
