import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { FiSearch, FiSend, FiPaperclip, FiSmile, FiMoreVertical, FiPhone, FiVideo, FiPlus } from 'react-icons/fi';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import '../styles/Pages.css';

const Messages = () => {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await api.get('/messages/conversations');
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await api.get('/users/all');
      // Filter out current user
      const otherUsers = data.filter(u => u.id !== user?.id);
      setUsers(otherUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async (partnerId) => {
    try {
      const data = await api.get(`/messages/conversation/${partnerId}`);
      setMessages(data);
      // Mark messages as read
      data.forEach(msg => {
        if (!msg.read && msg.senderId !== user?.id) {
          api.put(`/messages/${msg.id}/read`).catch(console.error);
        }
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedContact) return;

    try {
      await api.post('/messages/send', {
        receiverId: selectedContact.id,
        content: messageText.trim()
      });
      setMessageText('');
      fetchMessages(selectedContact.id);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewConversation = (userToMessage) => {
    setSelectedContact({
      id: userToMessage.id,
      name: userToMessage.name || `${userToMessage.firstName || ''} ${userToMessage.lastName || ''}`.trim() || userToMessage.email,
      email: userToMessage.email,
      role: userToMessage.role,
      online: true
    });
    setShowNewMessage(false);
    fetchMessages(userToMessage.id);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.partnerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.partnerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    (u.name || `${u.firstName || ''} ${u.lastName || ''}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <Header placeholder="Search messages..." />

        <div className="page-header">
          <h1>Messages</h1>
          <div className="header-actions">
            {totalUnread > 0 && (
              <span className="unread-badge">{totalUnread} unread</span>
            )}
            <button className="add-btn" onClick={() => setShowNewMessage(true)}>
              <FiPlus /> New Message
            </button>
          </div>
        </div>

        <div className="messages-container">
          {/* Contacts List */}
          <div className="contacts-panel">
            <div className="contacts-search">
              <FiSearch />
              <input 
                type="text" 
                placeholder="Search contacts..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="contacts-list">
              {loading ? (
                <div className="loading-text">Loading conversations...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="no-conversations">
                  <p>No conversations yet</p>
                  <button onClick={() => setShowNewMessage(true)}>Start a new conversation</button>
                </div>
              ) : (
                filteredConversations.map(conv => (
                  <div 
                    key={conv.partnerId}
                    className={`contact-item ${selectedContact?.id === conv.partnerId ? 'active' : ''}`}
                    onClick={() => setSelectedContact({
                      id: conv.partnerId,
                      name: conv.partnerName,
                      email: conv.partnerEmail,
                      online: true
                    })}
                  >
                    <div className="contact-avatar">
                      <span>{getInitials(conv.partnerName)}</span>
                      <span className="online-dot"></span>
                    </div>
                    <div className="contact-info">
                      <div className="contact-header">
                        <h4>{conv.partnerName || conv.partnerEmail}</h4>
                        <span className="contact-time">{formatTime(conv.lastMessageTime)}</span>
                      </div>
                      <div className="contact-preview">
                        <p>{conv.lastMessage?.substring(0, 40)}...</p>
                        {conv.unreadCount > 0 && (
                          <span className="unread-count">{conv.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="chat-panel">
            {selectedContact ? (
              <>
                <div className="chat-header">
                  <div className="chat-contact-info">
                    <div className="contact-avatar">
                      <span>{getInitials(selectedContact.name)}</span>
                      <span className="online-dot"></span>
                    </div>
                    <div>
                      <h3>{selectedContact.name}</h3>
                      <span className="contact-status">
                        {selectedContact.email}
                      </span>
                    </div>
                  </div>
                  <div className="chat-actions">
                    <button className="btn-icon"><FiPhone /></button>
                    <button className="btn-icon"><FiVideo /></button>
                    <button className="btn-icon"><FiMoreVertical /></button>
                  </div>
                </div>

                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div className="no-messages">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`message ${message.senderId === user?.id ? 'sent' : 'received'}`}
                      >
                        <div className="message-content">
                          <p>{message.content}</p>
                          <span className="message-time">{formatTime(message.sentAt)}</span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input">
                  <button className="btn-icon"><FiPaperclip /></button>
                  <input 
                    type="text" 
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button className="btn-icon"><FiSmile /></button>
                  <button className="btn-send" onClick={handleSendMessage}>
                    <FiSend />
                  </button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <div className="no-chat-icon">💬</div>
                <h3>Select a conversation</h3>
                <p>Choose a contact from the list to start chatting</p>
              </div>
            )}
          </div>
        </div>

        {/* New Message Modal */}
        {showNewMessage && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>New Message</h2>
                <button className="btn-close" onClick={() => setShowNewMessage(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="search-input">
                  <FiSearch />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="user-list">
                  {filteredUsers.length === 0 ? (
                    <p className="no-results">No users found</p>
                  ) : (
                    filteredUsers.map(u => (
                      <div 
                        key={u.id} 
                        className="user-item"
                        onClick={() => startNewConversation(u)}
                      >
                        <div className="contact-avatar">
                          <span>{getInitials(u.name || `${u.firstName || ''} ${u.lastName || ''}`)}</span>
                        </div>
                        <div className="user-info">
                          <h4>{u.name || `${u.firstName || ''} ${u.lastName || ''}`}</h4>
                          <span>{u.email} • {u.role}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
