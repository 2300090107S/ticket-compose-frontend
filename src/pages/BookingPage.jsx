import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';

// Booking Confirmation Modal (same as before)
const BookingConfirmationModal = ({ booking, onClose }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        animation: 'slideIn 0.3s ease-out',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          background: '#10b981',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}
      >
        <span style={{ fontSize: '48px', color: '#fff' }}>✓</span>
      </div>

      <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#222', marginBottom: '16px' }}>
        Booking Confirmed! 🎉
      </h2>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
        Your booking has been successfully confirmed.
      </p>

      <div
        style={{
          background: '#f9f9f9',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          textAlign: 'left'
        }}
      >
        <p><strong>Event:</strong> {booking.event.title}</p>
        <p><strong>Date & Time:</strong> {new Date(booking.event.dateTime).toLocaleString()}</p>
        <p><strong>Venue:</strong> {booking.event.venue}</p>
        <p><strong>No. of Seats:</strong> {booking.numSeats}</p>
        <p><strong>Total Amount:</strong> ${booking.totalPrice.toFixed(2)}</p>
      </div>

      <button
        onClick={onClose}
        style={{
          width: '100%',
          padding: '14px',
          background: 'linear-gradient(135deg, #ff6a00, #ee0979)',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Go to Dashboard
      </button>
    </div>
  </div>
);

const BookingPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numSeats, setNumSeats] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${eventId}`);
      setEvent(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!numSeats || numSeats < 1) {
      alert('Please select a valid number of seats.');
      return;
    }

    setIsBooking(true);
    try {
      const bookingData = {
        user: { id: user.userId },
        event: { id: event.id },
        seatsBooked: [], // no specific seats now
        status: 'BOOKED',
        numSeats: numSeats,
        bookingDate: new Date().toISOString(),
      };

      await api.post('/bookings', bookingData);

      setConfirmedBooking({
        event: event,
        numSeats: numSeats,
        totalPrice: event.price * numSeats,
      });
      setShowConfirmation(true);
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    navigate('/dashboard');
  };

  if (loading) return <Spinner />;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: '#c33' }}>{error}</div>;

  const totalPrice = (event.price * numSeats).toFixed(2);

  return (
    <>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff6a00, #ee0979)',
        padding: '2rem',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: '#fff',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}>
          <h1 style={{
            textAlign: 'center',
            color: '#ff6a00',
            marginBottom: '1rem'
          }}>
            {event.title}
          </h1>

          <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
            📅 {new Date(event.dateTime).toLocaleString()} <br />
            📍 {event.venue}
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 'bold', color: '#333' }}>Number of Seats:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={numSeats}
              onChange={(e) => setNumSeats(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                marginTop: '0.5rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            <span>Total:</span>
            <span style={{ color: '#10b981' }}>${totalPrice}</span>
          </div>

          <button
            onClick={handleBooking}
            disabled={isBooking}
            style={{
              marginTop: '2rem',
              width: '100%',
              padding: '1rem',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: isBooking ? 'not-allowed' : 'pointer',
              color: '#fff',
              background: isBooking
                ? '#ccc'
                : 'linear-gradient(135deg, #ff6a00, #ee0979)'
            }}
          >
            {isBooking ? '⏳ Processing...' : '✓ Confirm Booking'}
          </button>
        </div>
      </div>

      {showConfirmation && confirmedBooking && (
        <BookingConfirmationModal
          booking={confirmedBooking}
          onClose={handleCloseConfirmation}
        />
      )}
    </>
  );
};

export default BookingPage;
