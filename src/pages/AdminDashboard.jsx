import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EventForm from '../components/Admin/EventForm';
import UserList from '../components/Admin/UserList';
import Spinner from '../components/common/Spinner';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      const seats = [];
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const seatsPerRow = Math.ceil(eventData.totalSeats / rows.length);

      let seatCount = 0;
      for (let row of rows) {
        for (let num = 1; num <= seatsPerRow && seatCount < eventData.totalSeats; num++) {
          seats.push({
            seatNumber: `${row}${num}`,
            booked: false
          });
          seatCount++;
        }
      }

      const eventWithSeats = { ...eventData, seats };
      await api.post('/events', eventWithSeats);
      
      alert('✅ Event created successfully!');
      setShowEventForm(false);
      fetchEvents();
    } catch (err) {
      console.error('Failed to create event:', err);
      alert('❌ Failed to create event. Please try again.');
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      await api.put(`/events/${editingEvent.id}`, eventData);
      alert('✅ Event updated successfully!');
      setEditingEvent(null);
      setShowEventForm(false);
      fetchEvents();
    } catch (err) {
      console.error('Failed to update event:', err);
      alert('❌ Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        alert('✅ Event deleted successfully!');
        fetchEvents();
      } catch (err) {
        console.error('Failed to delete event:', err);
        alert('❌ Failed to delete event. Please try again.');
      }
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleCancelForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  if (loading) return <Spinner />;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff6a00, #ee0979)',
      padding: '2rem',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Card */}
        <div style={{
          background: '#fff',
          borderRadius: '15px',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#ff6a00',
            marginBottom: '0.5rem'
          }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            Manage events and users efficiently
          </p>
        </div>

        {/* Tabs Card */}
        <div style={{
          background: '#fff',
          borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex' }}>
            <button
              onClick={() => setActiveTab('events')}
              style={{
                flex: 1,
                padding: '1.2rem',
                border: 'none',
                background: activeTab === 'events' ? 'linear-gradient(135deg, #ff6a00, #ee0979)' : '#f5f5f5',
                color: activeTab === 'events' ? '#fff' : '#666',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              📅 Events Management
            </button>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                flex: 1,
                padding: '1.2rem',
                border: 'none',
                background: activeTab === 'users' ? 'linear-gradient(135deg, #ff6a00, #ee0979)' : '#f5f5f5',
                color: activeTab === 'users' ? '#fff' : '#666',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              👥 Users Management
            </button>
          </div>
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <>
            {/* Add Event Button */}
            {!showEventForm && (
              <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <button
                  onClick={() => setShowEventForm(true)}
                  style={{
                    padding: '1rem 2.5rem',
                    background: '#fff',
                    color: '#ff6a00',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s',
                    fontFamily: "'Poppins', sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                  }}
                >
                  ➕ Create New Event
                </button>
              </div>
            )}

            {/* Event Form */}
            {showEventForm && (
              <div style={{
                background: '#fff',
                borderRadius: '15px',
                padding: '2rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                marginBottom: '2rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <h2 style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: '#ff6a00'
                  }}>
                    {editingEvent ? '✏️ Edit Event' : '➕ Create New Event'}
                  </h2>
                  <button
                    onClick={handleCancelForm}
                    style={{
                      padding: '0.6rem 1.2rem',
                      background: '#fee',
                      color: '#c33',
                      border: '1px solid #fcc',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    ✖️ Cancel
                  </button>
                </div>
                <EventForm
                  onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
                  initialData={editingEvent}
                  buttonText={editingEvent ? 'Update Event' : 'Create Event'}
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{
                background: '#fee',
                color: '#c33',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                border: '1px solid #fcc',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            {/* Events Grid */}
            {events.length === 0 ? (
              <div style={{
                background: '#fff',
                borderRadius: '15px',
                padding: '4rem 2rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>🎭</p>
                <p style={{
                  color: '#666',
                  fontSize: '1.2rem'
                }}>
                  No events created yet. Create your first event!
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {events.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      background: '#fff',
                      borderRadius: '15px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                    }}
                  >
                    <div style={{
                      height: '180px',
                      background: 'linear-gradient(135deg, #ff6a00, #ee0979)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '4rem' }}>🎬</span>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '0.8rem'
                      }}>
                        {event.title}
                      </h3>
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#666',
                        marginBottom: '1rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {event.description}
                      </p>
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#555',
                        marginBottom: '1rem',
                        lineHeight: '1.8'
                      }}>
                        <div>📍 <strong>{event.venue}</strong></div>
                        <div>📅 {new Date(event.dateTime).toLocaleString()}</div>
                        <div>💰 ${event.price} per ticket</div>
                        <div>🪑 {event.totalSeats} total seats</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button
                          onClick={() => handleEdit(event)}
                          style={{
                            flex: 1,
                            padding: '0.8rem',
                            background: '#51a78a',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.3s',
                            fontFamily: "'Poppins', sans-serif"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#316d8e';
                            e.target.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#51a78a';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          style={{
                            flex: 1,
                            padding: '0.8rem',
                            background: '#ff6a00',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.3s',
                            fontFamily: "'Poppins', sans-serif"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#ee5400';
                            e.target.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#ff6a00';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{
            background: '#fff',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <UserList />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;