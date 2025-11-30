import React, { useState } from 'react';
import { FiSearch, FiSettings, FiBell, FiSend, FiPaperclip, FiSmile, FiMoreVertical, FiPhone, FiVideo } from 'react-icons/fi';
import Sidebar from '../component/Sidebar';
import '../styles/Pages.css';

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for messages (since there's no messages backend)
  const [contacts] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Wilson',
      role: 'Cardiologist',
      avatar: 'S',
      lastMessage: 'The patient report is ready for review.',
      time: '10:30 AM',
      unread: 3,
      online: true
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      role: 'Neurologist',
      avatar: 'M',
      lastMessage: 'Can we discuss the MRI results?',
      time: '09:45 AM',
      unread: 1,
      online: true
    },
    {
      id: 3,
      name: 'Dr. Emily Brown',
      role: 'Pediatrician',
      avatar: 'E',
      lastMessage: 'Thanks for the referral!',
      time: 'Yesterday',
      unread: 0,
      online: false
    },
    {
      id: 4,
      name: 'Nurse Jennifer',
      role: 'Head Nurse',
      avatar: 'J',
      lastMessage: 'Room 204 needs attention.',
      time: 'Yesterday',
      unread: 0,
      online: true
    },
    {
      id: 5,
      name: 'Dr. Robert Taylor',
      role: 'Orthopedic Surgeon',
      avatar: 'R',
      lastMessage: 'Surgery scheduled for 3 PM.',
      time: 'Mon',
      unread: 0,
      online: false
    }
  ]);

  const [conversations] = useState({
    1: [
      { id: 1, sender: 'them', text: 'Hi, I need to discuss the patient in Room 305.', time: '10:15 AM' },
      { id: 2, sender: 'me', text: 'Sure, what about the patient?', time: '10:18 AM' },
      { id: 3, sender: 'them', text: 'The ECG results show some irregularities. I think we should schedule an echocardiogram.', time: '10:22 AM' },
      { id: 4, sender: 'me', text: 'I agree. Let me check the schedule and get back to you.', time: '10:25 AM' },
      { id: 5, sender: 'them', text: 'The patient report is ready for review.', time: '10:30 AM' }
    ],
    2: [
      { id: 1, sender: 'them', text: 'Good morning! Do you have the MRI results for patient #1023?', time: '09:30 AM' },
      { id: 2, sender: 'me', text: 'Good morning! Yes, I received them this morning.', time: '09:35 AM' },
      { id: 3, sender: 'them', text: 'Can we discuss the MRI results?', time: '09:45 AM' }
    ],
    3: [
      { id: 1, sender: 'me', text: 'I have a young patient who needs pediatric consultation.', time: 'Yesterday 2:30 PM' },
      { id: 2, sender: 'them', text: 'Sure, send them over to my office.', time: 'Yesterday 2:45 PM' },
      { id: 3, sender: 'them', text: 'Thanks for the referral!', time: 'Yesterday 4:00 PM' }
    ],
    4: [
      { id: 1, sender: 'them', text: 'Dr. Westervelt, we need more supplies in the ICU.', time: 'Yesterday 11:00 AM' },
      { id: 2, sender: 'me', text: 'I will notify the inventory department.', time: 'Yesterday 11:15 AM' },
      { id: 3, sender: 'them', text: 'Room 204 needs attention.', time: 'Yesterday 3:30 PM' }
    ],
    5: [
      { id: 1, sender: 'them', text: 'The knee replacement surgery is confirmed for Monday.', time: 'Mon 9:00 AM' },
      { id: 2, sender: 'me', text: 'Great, I will prepare the pre-op checklist.', time: 'Mon 9:30 AM' },
      { id: 3, sender: 'them', text: 'Surgery scheduled for 3 PM.', time: 'Mon 10:00 AM' }
    ]
  });

  const handleSendMessage = () => {
    if (messageText.trim() && selectedContact) {
      // In a real app, this would send to backend
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnread = contacts.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="top-bar">
          <div className="search-bar">
            <FiSearch />
            <input type="text" placeholder="Search messages..." />
          </div>
          <div className="user-tools">
            <FiSettings />
            <FiBell />
            <div className="user-profile">
              <img src="https://via.placeholder.com/30" alt="User" />
              <span>Alfredo Westervelt</span>
            </div>
          </div>
        </header>

        <div className="page-header">
          <h1>Messages</h1>
          {totalUnread > 0 && (
            <span className="unread-badge">{totalUnread} unread</span>
          )}
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
              {filteredContacts.map(contact => (
                <div 
                  key={contact.id}
                  className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="contact-avatar">
                    <span>{contact.avatar}</span>
                    {contact.online && <span className="online-dot"></span>}
                  </div>
                  <div className="contact-info">
                    <div className="contact-header">
                      <h4>{contact.name}</h4>
                      <span className="contact-time">{contact.time}</span>
                    </div>
                    <div className="contact-preview">
                      <p>{contact.lastMessage}</p>
                      {contact.unread > 0 && (
                        <span className="unread-count">{contact.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="chat-panel">
            {selectedContact ? (
              <>
                <div className="chat-header">
                  <div className="chat-contact-info">
                    <div className="contact-avatar">
                      <span>{selectedContact.avatar}</span>
                      {selectedContact.online && <span className="online-dot"></span>}
                    </div>
                    <div>
                      <h3>{selectedContact.name}</h3>
                      <span className="contact-status">
                        {selectedContact.online ? 'Online' : 'Offline'}
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
                  {conversations[selectedContact.id]?.map(message => (
                    <div 
                      key={message.id} 
                      className={`message ${message.sender === 'me' ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        <p>{message.text}</p>
                        <span className="message-time">{message.time}</span>
                      </div>
                    </div>
                  ))}
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
      </main>
    </div>
  );
};

export default Messages;
