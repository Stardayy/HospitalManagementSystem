package com.hms.hospital_management_system.service;

import com.hms.hospital_management_system.entity.Admission;
import com.hms.hospital_management_system.entity.Appointment;
import com.hms.hospital_management_system.entity.Bill;
import com.hms.hospital_management_system.entity.LabOrder;
import com.hms.hospital_management_system.entity.LabResult;
import com.hms.hospital_management_system.entity.MedicalRecord;
import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.entity.VitalSigns;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfService {

    private static final Font TITLE_FONT = new Font(Font.HELVETICA, 18, Font.BOLD, Color.DARK_GRAY);
    private static final Font HEADER_FONT = new Font(Font.HELVETICA, 12, Font.BOLD, Color.WHITE);
    private static final Font SUBHEADER_FONT = new Font(Font.HELVETICA, 12, Font.BOLD, Color.DARK_GRAY);
    private static final Font NORMAL_FONT = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.BLACK);
    private static final Font LABEL_FONT = new Font(Font.HELVETICA, 10, Font.BOLD, Color.DARK_GRAY);
    private static final Color HEADER_BG_COLOR = new Color(41, 128, 185);
    private static final Color ALTERNATE_ROW_COLOR = new Color(245, 245, 245);

    public byte[] generatePatientReport(Patient patient, List<MedicalRecord> medicalRecords, 
                                         List<Appointment> appointments, List<VitalSigns> vitalSigns) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try {
            PdfWriter.getInstance(document, baos);
            document.open();
            
            // Header
            addHeader(document, "Patient Medical Report");
            
            // Patient Information
            addSectionTitle(document, "Patient Information");
            PdfPTable patientTable = new PdfPTable(2);
            patientTable.setWidthPercentage(100);
            addTableRow(patientTable, "Name:", patient.getFirstName() + " " + patient.getLastName());
            addTableRow(patientTable, "Date of Birth:", patient.getDateOfBirth() != null ? 
                patient.getDateOfBirth().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "N/A");
            addTableRow(patientTable, "Gender:", patient.getGender() != null ? patient.getGender() : "N/A");
            addTableRow(patientTable, "Blood Type:", patient.getBloodType() != null ? patient.getBloodType() : "N/A");
            addTableRow(patientTable, "Phone:", patient.getPhone() != null ? patient.getPhone() : "N/A");
            addTableRow(patientTable, "Email:", patient.getEmail() != null ? patient.getEmail() : "N/A");
            addTableRow(patientTable, "Address:", patient.getAddress() != null ? patient.getAddress() : "N/A");
            document.add(patientTable);
            document.add(Chunk.NEWLINE);
            
            // Vital Signs (Latest)
            if (vitalSigns != null && !vitalSigns.isEmpty()) {
                addSectionTitle(document, "Latest Vital Signs");
                VitalSigns latest = vitalSigns.get(0);
                PdfPTable vitalsTable = new PdfPTable(4);
                vitalsTable.setWidthPercentage(100);
                addVitalCell(vitalsTable, "Temperature", latest.getTemperature() != null ? latest.getTemperature() + "°C" : "N/A");
                addVitalCell(vitalsTable, "Blood Pressure", latest.getBloodPressureSystolic() + "/" + latest.getBloodPressureDiastolic() + " mmHg");
                addVitalCell(vitalsTable, "Heart Rate", latest.getHeartRate() != null ? latest.getHeartRate() + " bpm" : "N/A");
                addVitalCell(vitalsTable, "SpO2", latest.getOxygenSaturation() != null ? latest.getOxygenSaturation() + "%" : "N/A");
                document.add(vitalsTable);
                document.add(Chunk.NEWLINE);
            }
            
            // Medical Records
            if (medicalRecords != null && !medicalRecords.isEmpty()) {
                addSectionTitle(document, "Medical History");
                PdfPTable recordsTable = new PdfPTable(new float[]{1, 2, 2, 3});
                recordsTable.setWidthPercentage(100);
                addHeaderCell(recordsTable, "Date");
                addHeaderCell(recordsTable, "Diagnosis");
                addHeaderCell(recordsTable, "Doctor");
                addHeaderCell(recordsTable, "Notes");
                
                boolean alternate = false;
                for (MedicalRecord record : medicalRecords) {
                    Color bgColor = alternate ? ALTERNATE_ROW_COLOR : Color.WHITE;
                    addDataCell(recordsTable, record.getRecordDate() != null ? 
                        record.getRecordDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "N/A", bgColor);
                    addDataCell(recordsTable, record.getDiagnosis() != null ? record.getDiagnosis() : "N/A", bgColor);
                    addDataCell(recordsTable, record.getDoctor() != null ? 
                        "Dr. " + record.getDoctor().getFirstName() + " " + record.getDoctor().getLastName() : "N/A", bgColor);
                    addDataCell(recordsTable, record.getNotes() != null ? record.getNotes() : "N/A", bgColor);
                    alternate = !alternate;
                }
                document.add(recordsTable);
                document.add(Chunk.NEWLINE);
            }
            
            // Appointments
            if (appointments != null && !appointments.isEmpty()) {
                addSectionTitle(document, "Appointment History");
                PdfPTable apptTable = new PdfPTable(new float[]{1.5f, 1, 1.5f, 1, 2});
                apptTable.setWidthPercentage(100);
                addHeaderCell(apptTable, "Date");
                addHeaderCell(apptTable, "Time");
                addHeaderCell(apptTable, "Doctor");
                addHeaderCell(apptTable, "Status");
                addHeaderCell(apptTable, "Reason");
                
                boolean alternate = false;
                for (Appointment appt : appointments) {
                    Color bgColor = alternate ? ALTERNATE_ROW_COLOR : Color.WHITE;
                    addDataCell(apptTable, appt.getAppointmentDate() != null ? 
                        appt.getAppointmentDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "N/A", bgColor);
                    addDataCell(apptTable, appt.getAppointmentTime() != null ? 
                        appt.getAppointmentTime().format(DateTimeFormatter.ofPattern("HH:mm")) : "N/A", bgColor);
                    addDataCell(apptTable, appt.getDoctor() != null ? 
                        "Dr. " + appt.getDoctor().getFirstName() + " " + appt.getDoctor().getLastName() : "N/A", bgColor);
                    addDataCell(apptTable, appt.getStatus() != null ? appt.getStatus().toString() : "N/A", bgColor);
                    addDataCell(apptTable, appt.getReason() != null ? appt.getReason() : "N/A", bgColor);
                    alternate = !alternate;
                }
                document.add(apptTable);
            }
            
            // Footer
            addFooter(document);
            
        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        } finally {
            document.close();
        }
        
        return baos.toByteArray();
    }

    public byte[] generateBillReport(Bill bill) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try {
            PdfWriter.getInstance(document, baos);
            document.open();
            
            // Header
            addHeader(document, "Invoice / Bill");
            
            // Bill Information
            Paragraph billInfo = new Paragraph();
            billInfo.add(new Chunk("Bill #: " + bill.getId() + "\n", SUBHEADER_FONT));
            billInfo.add(new Chunk("Date: " + (bill.getBillDate() != null ? 
                bill.getBillDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "N/A") + "\n", NORMAL_FONT));
            billInfo.add(new Chunk("Status: " + (bill.getPaymentStatus() != null ? bill.getPaymentStatus() : "N/A") + "\n", NORMAL_FONT));
            billInfo.setSpacingAfter(20);
            document.add(billInfo);
            
            // Patient Information
            addSectionTitle(document, "Patient Details");
            PdfPTable patientTable = new PdfPTable(2);
            patientTable.setWidthPercentage(100);
            if (bill.getPatient() != null) {
                addTableRow(patientTable, "Patient Name:", 
                    bill.getPatient().getFirstName() + " " + bill.getPatient().getLastName());
                addTableRow(patientTable, "Phone:", 
                    bill.getPatient().getPhone() != null ? bill.getPatient().getPhone() : "N/A");
            }
            document.add(patientTable);
            document.add(Chunk.NEWLINE);
            
            // Charges Table
            addSectionTitle(document, "Charges");
            PdfPTable chargesTable = new PdfPTable(new float[]{3, 1});
            chargesTable.setWidthPercentage(100);
            addHeaderCell(chargesTable, "Description");
            addHeaderCell(chargesTable, "Amount");
            
            addDataCell(chargesTable, "Medical Services", Color.WHITE);
            addDataCell(chargesTable, String.format("$%.2f", bill.getTotalAmount()), Color.WHITE);
            
            // Total Row
            PdfPCell totalLabelCell = new PdfPCell(new Phrase("Total Amount", SUBHEADER_FONT));
            totalLabelCell.setBackgroundColor(new Color(230, 230, 230));
            totalLabelCell.setPadding(8);
            chargesTable.addCell(totalLabelCell);
            
            PdfPCell totalAmountCell = new PdfPCell(new Phrase(String.format("$%.2f", bill.getTotalAmount()), SUBHEADER_FONT));
            totalAmountCell.setBackgroundColor(new Color(230, 230, 230));
            totalAmountCell.setPadding(8);
            chargesTable.addCell(totalAmountCell);
            
            document.add(chargesTable);
            document.add(Chunk.NEWLINE);
            
            // Payment Information
            if (bill.getPaymentMethod() != null) {
                addSectionTitle(document, "Payment Information");
                PdfPTable paymentTable = new PdfPTable(2);
                paymentTable.setWidthPercentage(100);
                addTableRow(paymentTable, "Payment Method:", bill.getPaymentMethod().toString());
                if (bill.getPaymentDate() != null) {
                    addTableRow(paymentTable, "Payment Date:", 
                        bill.getPaymentDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
                }
                document.add(paymentTable);
            }
            
            // Footer
            addFooter(document);
            
        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        } finally {
            document.close();
        }
        
        return baos.toByteArray();
    }

    public byte[] generateLabReport(LabOrder labOrder, List<LabResult> results) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try {
            PdfWriter.getInstance(document, baos);
            document.open();
            
            // Header
            addHeader(document, "Laboratory Report");
            
            // Order Information
            addSectionTitle(document, "Order Information");
            PdfPTable orderTable = new PdfPTable(2);
            orderTable.setWidthPercentage(100);
            addTableRow(orderTable, "Order #:", labOrder.getId().toString());
            addTableRow(orderTable, "Order Date:", labOrder.getOrderDate() != null ? 
                labOrder.getOrderDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm")) : "N/A");
            addTableRow(orderTable, "Status:", labOrder.getStatus() != null ? labOrder.getStatus().toString() : "N/A");
            addTableRow(orderTable, "Priority:", labOrder.getPriority() != null ? labOrder.getPriority() : "NORMAL");
            document.add(orderTable);
            document.add(Chunk.NEWLINE);
            
            // Patient Information
            addSectionTitle(document, "Patient Information");
            PdfPTable patientTable = new PdfPTable(2);
            patientTable.setWidthPercentage(100);
            if (labOrder.getPatient() != null) {
                addTableRow(patientTable, "Patient Name:", 
                    labOrder.getPatient().getFirstName() + " " + labOrder.getPatient().getLastName());
                addTableRow(patientTable, "Date of Birth:", labOrder.getPatient().getDateOfBirth() != null ?
                    labOrder.getPatient().getDateOfBirth().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "N/A");
                addTableRow(patientTable, "Gender:", labOrder.getPatient().getGender() != null ? 
                    labOrder.getPatient().getGender() : "N/A");
            }
            if (labOrder.getDoctor() != null) {
                addTableRow(patientTable, "Ordering Physician:", 
                    "Dr. " + labOrder.getDoctor().getFirstName() + " " + labOrder.getDoctor().getLastName());
            }
            document.add(patientTable);
            document.add(Chunk.NEWLINE);
            
            // Test Results
            if (results != null && !results.isEmpty()) {
                addSectionTitle(document, "Test Results");
                PdfPTable resultsTable = new PdfPTable(new float[]{2, 1.5f, 1, 1.5f, 1});
                resultsTable.setWidthPercentage(100);
                addHeaderCell(resultsTable, "Test Name");
                addHeaderCell(resultsTable, "Result");
                addHeaderCell(resultsTable, "Unit");
                addHeaderCell(resultsTable, "Reference Range");
                addHeaderCell(resultsTable, "Status");
                
                boolean alternate = false;
                for (LabResult result : results) {
                    Color bgColor = alternate ? ALTERNATE_ROW_COLOR : Color.WHITE;
                    
                    // Highlight abnormal results
                    if (result.getResultStatus() != null && 
                        (result.getResultStatus().toString().contains("ABNORMAL") || 
                         result.getResultStatus().toString().equals("CRITICAL"))) {
                        bgColor = new Color(255, 235, 235); // Light red for abnormal
                    }
                    
                    addDataCell(resultsTable, result.getLabTest() != null ? result.getLabTest().getName() : "N/A", bgColor);
                    addDataCell(resultsTable, result.getResultValue() != null ? result.getResultValue() : "N/A", bgColor);
                    addDataCell(resultsTable, result.getUnit() != null ? result.getUnit() : "N/A", bgColor);
                    addDataCell(resultsTable, result.getReferenceRange() != null ? result.getReferenceRange() : "N/A", bgColor);
                    addDataCell(resultsTable, result.getResultStatus() != null ? result.getResultStatus().toString() : "PENDING", bgColor);
                    alternate = !alternate;
                }
                document.add(resultsTable);
            }
            
            // Notes
            if (labOrder.getNotes() != null && !labOrder.getNotes().isEmpty()) {
                document.add(Chunk.NEWLINE);
                addSectionTitle(document, "Notes");
                Paragraph notes = new Paragraph(labOrder.getNotes(), NORMAL_FONT);
                document.add(notes);
            }
            
            // Footer
            addFooter(document);
            
        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        } finally {
            document.close();
        }
        
        return baos.toByteArray();
    }

    public byte[] generateAdmissionSummary(Admission admission, List<VitalSigns> vitalSigns, 
                                           List<MedicalRecord> records) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try {
            PdfWriter.getInstance(document, baos);
            document.open();
            
            // Header
            addHeader(document, "Admission Summary Report");
            
            // Admission Information
            addSectionTitle(document, "Admission Details");
            PdfPTable admissionTable = new PdfPTable(2);
            admissionTable.setWidthPercentage(100);
            addTableRow(admissionTable, "Admission #:", admission.getId().toString());
            addTableRow(admissionTable, "Admission Date:", admission.getAdmissionDate() != null ? 
                admission.getAdmissionDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "N/A");
            addTableRow(admissionTable, "Admission Time:", admission.getAdmissionTime() != null ? 
                admission.getAdmissionTime().format(DateTimeFormatter.ofPattern("HH:mm")) : "N/A");
            addTableRow(admissionTable, "Room:", admission.getRoom() != null ? 
                admission.getRoom().getRoomNumber() : "N/A");
            addTableRow(admissionTable, "Bed Number:", admission.getBedNumber() != null ? admission.getBedNumber() : "N/A");
            addTableRow(admissionTable, "Admission Type:", admission.getAdmissionType() != null ? 
                admission.getAdmissionType().toString() : "N/A");
            addTableRow(admissionTable, "Status:", admission.getStatus() != null ? admission.getStatus().toString() : "N/A");
            if (admission.getActualDischargeDate() != null) {
                addTableRow(admissionTable, "Discharge Date:", 
                    admission.getActualDischargeDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
            }
            document.add(admissionTable);
            document.add(Chunk.NEWLINE);
            
            // Patient Information
            addSectionTitle(document, "Patient Information");
            PdfPTable patientTable = new PdfPTable(2);
            patientTable.setWidthPercentage(100);
            if (admission.getPatient() != null) {
                addTableRow(patientTable, "Patient Name:", 
                    admission.getPatient().getFirstName() + " " + admission.getPatient().getLastName());
                addTableRow(patientTable, "Date of Birth:", admission.getPatient().getDateOfBirth() != null ?
                    admission.getPatient().getDateOfBirth().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "N/A");
                addTableRow(patientTable, "Blood Type:", admission.getPatient().getBloodType() != null ? 
                    admission.getPatient().getBloodType() : "N/A");
            }
            if (admission.getAdmittingDoctor() != null) {
                addTableRow(patientTable, "Attending Physician:", 
                    "Dr. " + admission.getAdmittingDoctor().getFirstName() + " " + admission.getAdmittingDoctor().getLastName());
            }
            document.add(patientTable);
            document.add(Chunk.NEWLINE);
            
            // Diagnosis
            if (admission.getDiagnosis() != null) {
                addSectionTitle(document, "Diagnosis");
                Paragraph diagnosis = new Paragraph(admission.getDiagnosis(), NORMAL_FONT);
                document.add(diagnosis);
                document.add(Chunk.NEWLINE);
            }
            
            // Vital Signs History
            if (vitalSigns != null && !vitalSigns.isEmpty()) {
                addSectionTitle(document, "Vital Signs History");
                PdfPTable vitalsTable = new PdfPTable(new float[]{1.5f, 1, 1.5f, 1, 1, 1});
                vitalsTable.setWidthPercentage(100);
                addHeaderCell(vitalsTable, "Date/Time");
                addHeaderCell(vitalsTable, "Temp");
                addHeaderCell(vitalsTable, "BP");
                addHeaderCell(vitalsTable, "HR");
                addHeaderCell(vitalsTable, "SpO2");
                addHeaderCell(vitalsTable, "Resp");
                
                boolean alternate = false;
                for (VitalSigns vs : vitalSigns) {
                    Color bgColor = alternate ? ALTERNATE_ROW_COLOR : Color.WHITE;
                    addDataCell(vitalsTable, vs.getRecordedAt() != null ? 
                        vs.getRecordedAt().format(DateTimeFormatter.ofPattern("MM/dd HH:mm")) : "N/A", bgColor);
                    addDataCell(vitalsTable, vs.getTemperature() != null ? vs.getTemperature() + "°C" : "N/A", bgColor);
                    addDataCell(vitalsTable, vs.getBloodPressureSystolic() + "/" + vs.getBloodPressureDiastolic(), bgColor);
                    addDataCell(vitalsTable, vs.getHeartRate() != null ? vs.getHeartRate() + " bpm" : "N/A", bgColor);
                    addDataCell(vitalsTable, vs.getOxygenSaturation() != null ? vs.getOxygenSaturation() + "%" : "N/A", bgColor);
                    addDataCell(vitalsTable, vs.getRespiratoryRate() != null ? vs.getRespiratoryRate() + "/min" : "N/A", bgColor);
                    alternate = !alternate;
                }
                document.add(vitalsTable);
                document.add(Chunk.NEWLINE);
            }
            
            // Discharge Summary
            if (admission.getDischargeSummary() != null) {
                addSectionTitle(document, "Discharge Summary");
                Paragraph summary = new Paragraph(admission.getDischargeSummary(), NORMAL_FONT);
                document.add(summary);
            }
            
            // Footer
            addFooter(document);
            
        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        } finally {
            document.close();
        }
        
        return baos.toByteArray();
    }

    // Helper methods
    private void addHeader(Document document, String title) throws DocumentException {
        Paragraph header = new Paragraph();
        header.add(new Chunk("Hospital Management System\n", new Font(Font.HELVETICA, 14, Font.BOLD, HEADER_BG_COLOR)));
        header.add(new Chunk(title + "\n\n", TITLE_FONT));
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);
        
        // Add a horizontal line
        LineSeparator line = new LineSeparator();
        line.setLineColor(HEADER_BG_COLOR);
        document.add(new Chunk(line));
        document.add(Chunk.NEWLINE);
    }

    private void addSectionTitle(Document document, String title) throws DocumentException {
        Paragraph section = new Paragraph(title, SUBHEADER_FONT);
        section.setSpacingBefore(10);
        section.setSpacingAfter(5);
        document.add(section);
    }

    private void addTableRow(PdfPTable table, String label, String value) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, LABEL_FONT));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(5);
        table.addCell(labelCell);
        
        PdfPCell valueCell = new PdfPCell(new Phrase(value, NORMAL_FONT));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPadding(5);
        table.addCell(valueCell);
    }

    private void addHeaderCell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, HEADER_FONT));
        cell.setBackgroundColor(HEADER_BG_COLOR);
        cell.setPadding(8);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }

    private void addDataCell(PdfPTable table, String text, Color bgColor) {
        PdfPCell cell = new PdfPCell(new Phrase(text, NORMAL_FONT));
        cell.setBackgroundColor(bgColor);
        cell.setPadding(6);
        table.addCell(cell);
    }

    private void addVitalCell(PdfPTable table, String label, String value) {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.BOX);
        cell.setPadding(10);
        cell.setBackgroundColor(new Color(245, 250, 255));
        
        Paragraph p = new Paragraph();
        p.add(new Chunk(label + "\n", LABEL_FONT));
        p.add(new Chunk(value, new Font(Font.HELVETICA, 14, Font.BOLD, Color.BLACK)));
        p.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(p);
        
        table.addCell(cell);
    }

    private void addFooter(Document document) throws DocumentException {
        document.add(Chunk.NEWLINE);
        LineSeparator line = new LineSeparator();
        line.setLineColor(Color.LIGHT_GRAY);
        document.add(new Chunk(line));
        
        Paragraph footer = new Paragraph();
        footer.add(new Chunk("\nGenerated by Hospital Management System\n", 
            new Font(Font.HELVETICA, 8, Font.ITALIC, Color.GRAY)));
        footer.add(new Chunk("This document is confidential and intended for authorized personnel only.", 
            new Font(Font.HELVETICA, 8, Font.NORMAL, Color.GRAY)));
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);
    }
}
