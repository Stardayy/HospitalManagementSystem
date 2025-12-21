package com.hms.hospital_management_system.controller;

import com.hms.hospital_management_system.entity.Department;
import com.hms.hospital_management_system.service.DepartmentService;
import com.hms.hospital_management_system.util.AuditHelper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class DepartmentController {

    private final DepartmentService departmentService;
    private final AuditHelper auditHelper;

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
        return departmentService.getDepartmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Department> getDepartmentByName(@PathVariable String name) {
        return departmentService.getDepartmentByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Department>> searchDepartments(@RequestParam String name) {
        return ResponseEntity.ok(departmentService.searchDepartmentsByName(name));
    }

    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody Department department,
            HttpServletRequest request) {
        try {
            Department createdDepartment = departmentService.createDepartment(department);
            auditHelper.logCreate("Department", createdDepartment.getId().toString(),
                    "Created department: " + department.getName(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDepartment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable Long id, @RequestBody Department department,
            HttpServletRequest request) {
        try {
            Department updatedDepartment = departmentService.updateDepartment(id, department);
            auditHelper.logUpdate("Department", id.toString(), "Updated department: " + department.getName(), request);
            return ResponseEntity.ok(updatedDepartment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id, HttpServletRequest request) {
        try {
            auditHelper.logDelete("Department", id.toString(), "Deleted department", request);
            departmentService.deleteDepartment(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
