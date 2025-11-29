package com.hms.hospital_management_system.service;

import com.hms.hospital_management_system.entity.Room;
import com.hms.hospital_management_system.entity.Room.RoomStatus;
import com.hms.hospital_management_system.entity.Room.RoomType;
import com.hms.hospital_management_system.entity.Department;
import com.hms.hospital_management_system.repository.RoomRepository;
import com.hms.hospital_management_system.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomService {

    private final RoomRepository roomRepository;
    private final DepartmentRepository departmentRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public Optional<Room> getRoomByNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber);
    }

    public Room createRoom(Room room) {
        if (roomRepository.existsByRoomNumber(room.getRoomNumber())) {
            throw new RuntimeException("Room with number " + room.getRoomNumber() + " already exists");
        }
        return roomRepository.save(room);
    }

    public Room createRoomWithDepartment(Room room, Long departmentId) {
        if (departmentId != null) {
            Department department = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new RuntimeException("Department not found with id: " + departmentId));
            room.setDepartment(department);
        }
        return createRoom(room);
    }

    public Room updateRoom(Long id, Room roomDetails) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));

        room.setRoomNumber(roomDetails.getRoomNumber());
        room.setRoomType(roomDetails.getRoomType());
        room.setFloorNumber(roomDetails.getFloorNumber());
        room.setBedCount(roomDetails.getBedCount());
        room.setDailyRate(roomDetails.getDailyRate());
        room.setStatus(roomDetails.getStatus());
        room.setFacilities(roomDetails.getFacilities());

        return roomRepository.save(room);
    }

    public Room updateRoomStatus(Long id, RoomStatus status) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
        
        room.setStatus(status);
        return roomRepository.save(room);
    }

    public Room assignDepartment(Long roomId, Long departmentId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + departmentId));
        
        room.setDepartment(department);
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }

    public List<Room> getRoomsByType(RoomType roomType) {
        return roomRepository.findByRoomType(roomType);
    }

    public List<Room> getRoomsByStatus(RoomStatus status) {
        return roomRepository.findByStatus(status);
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findByStatus(RoomStatus.AVAILABLE);
    }

    public List<Room> getAvailableRoomsByType(RoomType roomType) {
        return roomRepository.findByRoomTypeAndStatus(roomType, RoomStatus.AVAILABLE);
    }

    public List<Room> getRoomsByFloor(Integer floorNumber) {
        return roomRepository.findByFloorNumber(floorNumber);
    }

    public List<Room> getRoomsByDepartment(Long departmentId) {
        return roomRepository.findByDepartmentId(departmentId);
    }
}
