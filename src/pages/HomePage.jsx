import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.slice(0, 6)); // Get first 6 events
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Unable to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <section className="home-hero">
        <h1>🎬 Discover Amazing Events!</h1>
        <p>Book tickets for Movies, Concerts, and Events happening near you.</p>
      </section>

      <section className="carousel-section">
        <h2 className="section-title">🔥 Trending Events</h2>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <div className="loader" style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #e50914',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
            <p style={{ marginTop: '1rem' }}>Loading events...</p>
          </div>
        )}

        {error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: '#e63232',
            background: '#fee',
            borderRadius: '8px',
            margin: '1rem 0'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '1rem' }}>🎭</p>
            <p style={{ color: '#666', fontSize: '18px' }}>
              No events available at the moment. Check back soon!
            </p>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="carousel">
            {events.map((event) => (
              <div key={event.id} className="carousel-card">
                <div style={{
                  width: '100%',
                  height: '280px',
                  background: 'linear-gradient(135deg, #e11d48, #f97316)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px 12px 0 0'
                }}>
                  <span style={{ fontSize: '80px' }}>🎬</span>
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 className="card-title">{event.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0' }}>
                    📍 {event.venue}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.5rem' }}>
                    📅 {new Date(event.dateTime).toLocaleDateString()}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#e50914', fontWeight: 'bold', marginBottom: '1rem' }}>
                    💰 ${event.price} per ticket
                  </p>
                  <Link to={`/book/${event.id}`} className="btn btn-book-small">
                    🎫 Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;