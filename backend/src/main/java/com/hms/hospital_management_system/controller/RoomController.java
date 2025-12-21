package com.hms.hospital_management_system.controller;

import com.hms.hospital_management_system.entity.Room;
import com.hms.hospital_management_system.entity.Room.RoomStatus;
import com.hms.hospital_management_system.entity.Room.RoomType;
import com.hms.hospital_management_system.service.RoomService;
import com.hms.hospital_management_system.util.AuditHelper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class RoomController {

    private final RoomService roomService;
    private final AuditHelper auditHelper;

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/number/{roomNumber}")
    public ResponseEntity<Room> getRoomByNumber(@PathVariable String roomNumber) {
        return roomService.getRoomByNumber(roomNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{roomType}")
    public ResponseEntity<List<Room>> getRoomsByType(@PathVariable RoomType roomType) {
        return ResponseEntity.ok(roomService.getRoomsByType(roomType));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Room>> getRoomsByStatus(@PathVariable RoomStatus status) {
        return ResponseEntity.ok(roomService.getRoomsByStatus(status));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        return ResponseEntity.ok(roomService.getAvailableRooms());
    }

    @GetMapping("/available/type/{roomType}")
    public ResponseEntity<List<Room>> getAvailableRoomsByType(@PathVariable RoomType roomType) {
        return ResponseEntity.ok(roomService.getAvailableRoomsByType(roomType));
    }

    @GetMapping("/floor/{floorNumber}")
    public ResponseEntity<List<Room>> getRoomsByFloor(@PathVariable Integer floorNumber) {
        return ResponseEntity.ok(roomService.getRoomsByFloor(floorNumber));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Room>> getRoomsByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(roomService.getRoomsByDepartment(departmentId));
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room,
            @RequestParam(required = false) Long departmentId, HttpServletRequest request) {
        try {
            Room createdRoom = roomService.createRoomWithDepartment(room, departmentId);
            auditHelper.logCreate("Room", createdRoom.getId().toString(),
                    "Created room: " + room.getRoomNumber(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRoom);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room room,
            HttpServletRequest request) {
        try {
            Room updatedRoom = roomService.updateRoom(id, room);
            auditHelper.logUpdate("Room", id.toString(), "Updated room: " + room.getRoomNumber(), request);
            return ResponseEntity.ok(updatedRoom);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Room> updateRoomStatus(@PathVariable Long id, @RequestParam RoomStatus status,
            HttpServletRequest request) {
        try {
            Room updatedRoom = roomService.updateRoomStatus(id, status);
            auditHelper.logUpdate("Room", id.toString(), "Room status updated to: " + status, request);
            return ResponseEntity.ok(updatedRoom);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/department/{departmentId}")
    public ResponseEntity<Room> assignDepartment(@PathVariable Long id, @PathVariable Long departmentId,
            HttpServletRequest request) {
        try {
            Room updatedRoom = roomService.assignDepartment(id, departmentId);
            auditHelper.logUpdate("Room", id.toString(), "Assigned to department: " + departmentId, request);
            return ResponseEntity.ok(updatedRoom);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id, HttpServletRequest request) {
        try {
            auditHelper.logDelete("Room", id.toString(), "Deleted room", request);
            roomService.deleteRoom(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
