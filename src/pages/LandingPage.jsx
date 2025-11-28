import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './LandingPage.css';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">Book Tickets for Your Favourite Events</h1>
          <p className="hero-subtitle">Movies, Concerts, Plays, and Sports – All in One Place</p>
          <div className="hero-buttons">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/register" className="btn btn-secondary">Register</Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            )}
          </div>
        </div>
      </section>

      {/* Popular Events */}
      <section className="events-section">
        <h2 className="section-title">Popular Events</h2>
        <div className="events-grid">
          {[1,2,3,4,5,6].map((event) => (
            <div key={event} className="event-card">
              <img src={`https://picsum.photos/300/400?random=${event}`} alt="event" />
              <h3 className="event-title">Event {event}</h3>
              <p className="event-type">Movie | Concert</p>
              {user ? (
                <Link to={`/book/${event}`} className="btn btn-book">Book Now</Link>
              ) : (
                <Link to="/login" className="btn btn-book">Login to Book</Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;