package com.hms.hospital_management_system.service;

import com.hms.hospital_management_system.entity.Medicine;
import com.hms.hospital_management_system.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Optional<Medicine> getMedicineById(Long id) {
        return medicineRepository.findById(id);
    }

    public Optional<Medicine> getMedicineByName(String name) {
        return medicineRepository.findByName(name);
    }

    public Medicine createMedicine(Medicine medicine) {
        if (medicineRepository.existsByName(medicine.getName())) {
            throw new RuntimeException("Medicine with name " + medicine.getName() + " already exists");
        }
        return medicineRepository.save(medicine);
    }

    public Medicine updateMedicine(Long id, Medicine medicineDetails) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found with id: " + id));

        medicine.setName(medicineDetails.getName());
        medicine.setGenericName(medicineDetails.getGenericName());
        medicine.setManufacturer(medicineDetails.getManufacturer());
        medicine.setDescription(medicineDetails.getDescription());
        medicine.setDosageForm(medicineDetails.getDosageForm());
        medicine.setStrength(medicineDetails.getStrength());
        medicine.setPrice(medicineDetails.getPrice());
        medicine.setStockQuantity(medicineDetails.getStockQuantity());
        medicine.setExpiryDate(medicineDetails.getExpiryDate());
        medicine.setReorderLevel(medicineDetails.getReorderLevel());

        return medicineRepository.save(medicine);
    }

    public Medicine updateStock(Long id, Integer quantity) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found with id: " + id));
        
        medicine.setStockQuantity(medicine.getStockQuantity() + quantity);
        return medicineRepository.save(medicine);
    }

    public void deleteMedicine(Long id) {
        if (!medicineRepository.existsById(id)) {
            throw new RuntimeException("Medicine not found with id: " + id);
        }
        medicineRepository.deleteById(id);
    }

    public List<Medicine> searchMedicinesByName(String name) {
        return medicineRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Medicine> getMedicinesByManufacturer(String manufacturer) {
        return medicineRepository.findByManufacturer(manufacturer);
    }

    public List<Medicine> getLowStockMedicines() {
        return medicineRepository.findLowStockMedicines();
    }

    public List<Medicine> getExpiredMedicines() {
        return medicineRepository.findExpiredMedicines(LocalDate.now());
    }

    public List<Medicine> getMedicinesExpiringSoon(int days) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(days);
        return medicineRepository.findMedicinesExpiringBetween(today, endDate);
    }

    public List<Medicine> filterMedicines(String dosageForm, Boolean lowStock, Boolean expired, 
            Boolean expiringSoon, String sortBy, String sortOrder) {
        List<Medicine> medicines = medicineRepository.findAll();
        LocalDate today = LocalDate.now();
        
        List<Medicine> filtered = medicines.stream()
            .filter(m -> dosageForm == null || dosageForm.isEmpty() || dosageForm.equals(m.getDosageForm()))
            .filter(m -> {
                if (lowStock != null && lowStock) {
                    return m.getStockQuantity() <= (m.getReorderLevel() != null ? m.getReorderLevel() : 10);
                }
                return true;
            })
            .filter(m -> {
                if (expired != null && expired) {
                    return m.getExpiryDate() != null && m.getExpiryDate().isBefore(today);
                }
                return true;
            })
            .filter(m -> {
                if (expiringSoon != null && expiringSoon) {
                    return m.getExpiryDate() != null && 
                           m.getExpiryDate().isAfter(today) && 
                           m.getExpiryDate().isBefore(today.plusDays(30));
                }
                return true;
            })
            .toList();

        if (sortBy != null && !sortBy.isEmpty()) {
            Comparator<Medicine> comparator = getMedicineComparator(sortBy);
            if (comparator != null) {
                if ("desc".equalsIgnoreCase(sortOrder)) {
                    comparator = comparator.reversed();
                }
                filtered = filtered.stream().sorted(comparator).toList();
            }
        }
        
        return filtered;
    }

    private Comparator<Medicine> getMedicineComparator(String sortBy) {
        return switch (sortBy) {
            case "name" -> Comparator.comparing(Medicine::getName, Comparator.nullsLast(Comparator.naturalOrder()));
            case "genericName" -> Comparator.comparing(Medicine::getGenericName, Comparator.nullsLast(Comparator.naturalOrder()));
            case "manufacturer" -> Comparator.comparing(Medicine::getManufacturer, Comparator.nullsLast(Comparator.naturalOrder()));
            case "price" -> Comparator.comparing(Medicine::getPrice, Comparator.nullsLast(Comparator.naturalOrder()));
            case "stock" -> Comparator.comparing(Medicine::getStockQuantity, Comparator.nullsLast(Comparator.naturalOrder()));
            case "expiryDate" -> Comparator.comparing(Medicine::getExpiryDate, Comparator.nullsLast(Comparator.naturalOrder()));
            case "dosageForm" -> Comparator.comparing(Medicine::getDosageForm, Comparator.nullsLast(Comparator.naturalOrder()));
            default -> null;
        };
    }
}
