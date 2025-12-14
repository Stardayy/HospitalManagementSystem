package com.hms.hospital_management_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Find all messages between two users (conversation)
    @Query("SELECT m FROM Message m WHERE " +
           "(m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
           "(m.sender.id = :userId2 AND m.receiver.id = :userId1) " +
           "ORDER BY m.sentAt ASC")
    List<Message> findConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    // Find all messages sent by a user
    List<Message> findBySenderIdOrderBySentAtDesc(Long senderId);

    // Find all messages received by a user
    List<Message> findByReceiverIdOrderBySentAtDesc(Long receiverId);

    // Find unread messages for a user
    List<Message> findByReceiverIdAndIsReadFalseOrderBySentAtDesc(Long receiverId);

    // Count unread messages for a user
    Long countByReceiverIdAndIsReadFalse(Long receiverId);

    // Count unread messages from a specific sender
    Long countBySenderIdAndReceiverIdAndIsReadFalse(Long senderId, Long receiverId);

    // Find latest message in each conversation for a user
    @Query("SELECT m FROM Message m WHERE m.id IN " +
           "(SELECT MAX(m2.id) FROM Message m2 WHERE m2.sender.id = :userId OR m2.receiver.id = :userId " +
           "GROUP BY CASE WHEN m2.sender.id = :userId THEN m2.receiver.id ELSE m2.sender.id END) " +
           "ORDER BY m.sentAt DESC")
    List<Message> findLatestMessagesForUser(@Param("userId") Long userId);

    // Find all user IDs who have conversations with a specific user (as senders)
    @Query("SELECT DISTINCT m.receiver.id FROM Message m WHERE m.sender.id = :userId")
    List<Long> findReceiverIdsForUser(@Param("userId") Long userId);
    
    // Find all user IDs who have conversations with a specific user (as receivers)
    @Query("SELECT DISTINCT m.sender.id FROM Message m WHERE m.receiver.id = :userId")
    List<Long> findSenderIdsForUser(@Param("userId") Long userId);
}
