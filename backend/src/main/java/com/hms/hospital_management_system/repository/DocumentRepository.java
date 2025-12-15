package com.hms.hospital_management_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.Document;
import com.hms.hospital_management_system.entity.Document.DocumentType;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    List<Document> findByPatientId(Long patientId);
    
    List<Document> findByDocumentType(DocumentType documentType);
    
    List<Document> findByPatientIdAndDocumentType(Long patientId, DocumentType documentType);
    
    List<Document> findByUploadedBy(Long userId);
    
    List<Document> findByPatientIdOrderByCreatedAtDesc(Long patientId);
}
