package com.hms.hospital_management_system.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.Room;
import com.hms.hospital_management_system.entity.Room.RoomStatus;
import com.hms.hospital_management_system.entity.Room.RoomType;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    Optional<Room> findByRoomNumber(String roomNumber);
    
    List<Room> findByRoomType(RoomType roomType);
    
    List<Room> findByStatus(RoomStatus status);
    
    List<Room> findByFloorNumber(Integer floorNumber);
    
    List<Room> findByDepartmentId(Long departmentId);
    
    List<Room> findByRoomTypeAndStatus(RoomType roomType, RoomStatus status);
    
    boolean existsByRoomNumber(String roomNumber);
}
