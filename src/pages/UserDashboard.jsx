import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Spinner from '../components/common/Spinner';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => (
  <div
    style={{
      background: '#fff',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'transform 0.3s',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-8px)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
  >
    <div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#555', textTransform: 'uppercase' }}>
        {title}
      </div>
      <div style={{ fontSize: '36px', fontWeight: 'bold', color }}>{value}</div>
    </div>
    <div style={{ fontSize: '28px', opacity: 0.2 }}>{icon}</div>
  </div>
);

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'bookings'
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user || !user.userId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Fetch all events
      const eventsRes = await api.get('/events');
      setEvents(eventsRes.data);

      // Fetch user bookings
      const bookingsRes = await api.get(`/bookings/user/${user.userId}`);
      const enrichedBookings = await Promise.all(
        bookingsRes.data.map(async (booking) => {
          const eventRes = await api.get(`/events/${booking.event.id}`);
          return { ...booking, event: eventRes.data };
        })
      );
      setBookings(enrichedBookings);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error)
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>{error}</div>
    );

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => b.status === 'BOOKED').length;

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '30px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#222' }}>
          Welcome, {user ? user.sub : 'Guest'}! 👋
        </h1>
        <p style={{ fontSize: '16px', color: '#555', marginTop: '8px' }}>
          Explore exciting events and manage your bookings
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        <StatCard title="Total Bookings" value={totalBookings} icon="🎟️" color="#3b82f6" />
        <StatCard title="Active Bookings" value={activeBookings} icon="✅" color="#10b981" />
        <StatCard title="Available Events" value={events.length} icon="🎬" color="#f59e0b" />
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderRadius: '16px', marginBottom: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #f0f0f0' }}>
          <button
            onClick={() => setActiveTab('events')}
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              background: activeTab === 'events' ? '#fff' : 'transparent',
              color: activeTab === 'events' ? '#e11d48' : '#666',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              borderBottom: activeTab === 'events' ? '3px solid #e11d48' : 'none',
              transition: 'all 0.3s',
            }}
          >
            🎬 Browse Events
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              background: activeTab === 'bookings' ? '#fff' : 'transparent',
              color: activeTab === 'bookings' ? '#e11d48' : '#666',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              borderBottom: activeTab === 'bookings' ? '3px solid #e11d48' : 'none',
              transition: 'all 0.3s',
            }}
          >
            📋 My Bookings
          </button>
        </div>
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          {events.length === 0 ? (
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '60px 20px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎭</p>
              <p style={{ fontSize: '18px', color: '#666' }}>
                No events available at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px',
              }}
            >
              {events.map((event) => (
                <div
                  key={event.id}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Event Image */}
                  <div
                    style={{
                      height: '180px',
                      background: 'linear-gradient(135deg, #e11d48, #f97316)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: '64px' }}>🎬</span>
                  </div>

                  {/* Event Details */}
                  <div style={{ padding: '20px' }}>
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#222',
                        marginBottom: '12px',
                      }}
                    >
                      {event.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#666',
                        marginBottom: '16px',
                        height: '40px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {event.description}
                    </p>

                    <div style={{ marginBottom: '16px', fontSize: '14px', color: '#555' }}>
                      <div style={{ marginBottom: '8px' }}>
                        📍 <strong>Venue:</strong> {event.venue}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        📅 <strong>Date:</strong>{' '}
                        {new Date(event.dateTime).toLocaleString()}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        💰 <strong>Price:</strong> ${event.price} per ticket
                      </div>
                      <div>
                        🪑 <strong>Seats:</strong> {event.totalSeats} available
                      </div>
                    </div>

                    <Link
                      to={`/book/${event.id}`}
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        padding: '12px',
                        background: '#e11d48',
                        color: '#fff',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'background 0.3s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#be123c')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#e11d48')}
                    >
                      🎫 Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#222',
              marginBottom: '20px',
            }}
          >
            My Booking History
          </h2>
          {bookings.length > 0 ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    borderRadius: '12px',
                    background: '#f9f9f9',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f9f9f9')}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: '600',
                        fontSize: '18px',
                        color: '#222',
                        marginBottom: '8px',
                      }}
                    >
                      {booking.event.title}
                    </div>
                    <div style={{ fontSize: '14px', color: '#555', marginBottom: '4px' }}>
                      📅 {new Date(booking.event.dateTime).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '14px', color: '#555' }}>
                      🎫 {booking.seatsBooked?.length || 0} seat(s) booked
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span
                      style={{
                        padding: '8px 16px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor:
                          booking.status === 'BOOKED' ? '#d1fae5' : '#fee2e2',
                        color: booking.status === 'BOOKED' ? '#065f46' : '#b91c1c',
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#555' }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
              <p style={{ fontSize: '16px' }}>You haven't booked any events yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;