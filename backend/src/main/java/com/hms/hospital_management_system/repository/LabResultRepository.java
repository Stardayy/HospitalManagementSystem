package com.hms.hospital_management_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.LabResult;
import com.hms.hospital_management_system.entity.LabResult.ResultStatus;

@Repository
public interface LabResultRepository extends JpaRepository<LabResult, Long> {
    
    List<LabResult> findByLabOrderId(Long labOrderId);
    
    List<LabResult> findByLabTestId(Long labTestId);
    
    List<LabResult> findByResultStatus(ResultStatus resultStatus);
    
    List<LabResult> findByLabOrderIdAndResultStatus(Long labOrderId, ResultStatus resultStatus);
}
