import React, { useState, useEffect } from 'react';

const EventForm = ({ onSubmit, initialData = null, buttonText }) => {
  const [event, setEvent] = useState({
    title: '',
    description: '',
    venue: '',
    dateTime: '',
    price: 0,
    totalSeats: 0
  });

  useEffect(() => {
    if (initialData && initialData.id) {
      setEvent({
        title: initialData.title || '',
        description: initialData.description || '',
        venue: initialData.venue || '',
        dateTime: initialData.dateTime ? initialData.dateTime.substring(0, 16) : '',
        price: initialData.price || 0,
        totalSeats: initialData.totalSeats || 0,
      });
    } else {
      setEvent({
        title: '',
        description: '',
        venue: '',
        dateTime: '',
        price: 0,
        totalSeats: 0
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(event);
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '0.8rem 1rem',
    marginBottom: '1.2rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
    fontFamily: "'Poppins', sans-serif",
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#555',
    fontWeight: '600',
    fontSize: '0.95rem'
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label style={labelStyle}>Title</label>
        <input
          type="text"
          name="title"
          value={event.title}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Enter event title"
          required
          onFocus={(e) => e.target.style.borderColor = '#ff6a00'}
          onBlur={(e) => e.target.style.borderColor = '#ccc'}
        />
      </div>

      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          name="description"
          value={event.description}
          onChange={handleChange}
          style={{
            ...inputStyle,
            minHeight: '100px',
            resize: 'vertical'
          }}
          placeholder="Enter event description"
          required
          onFocus={(e) => e.target.style.borderColor = '#ff6a00'}
          onBlur={(e) => e.target.style.borderColor = '#ccc'}
        />
      </div>

      <div>
        <label style={labelStyle}>Venue</label>
        <input
          type="text"
          name="venue"
          value={event.venue}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Enter venue location"
          required
          onFocus={(e) => e.target.style.borderColor = '#ff6a00'}
          onBlur={(e) => e.target.style.borderColor = '#ccc'}
        />
      </div>

      <div>
        <label style={labelStyle}>Date and Time</label>
        <input
          type="datetime-local"
          name="dateTime"
          value={event.dateTime}
          onChange={handleChange}
          style={inputStyle}
          required
          onFocus={(e) => e.target.style.borderColor = '#ff6a00'}
          onBlur={(e) => e.target.style.borderColor = '#ccc'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Price ($)</label>
          <input
            type="number"
            name="price"
            step="0.01"
            value={event.price}
            onChange={handleChange}
            style={inputStyle}
            placeholder="0.00"
            required
            onFocus={(e) => e.target.style.borderColor = '#ff6a00'}
            onBlur={(e) => e.target.style.borderColor = '#ccc'}
          />
        </div>
        <div>
          <label style={labelStyle}>Total Seats</label>
          <input
            type="number"
            name="totalSeats"
            value={event.totalSeats}
            onChange={handleChange}
            style={inputStyle}
            placeholder="0"
            required
            onFocus={(e) => e.target.style.borderColor = '#ff6a00'}
            onBlur={(e) => e.target.style.borderColor = '#ccc'}
          />
        </div>
      </div>

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '0.8rem',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          color: '#fff',
          transition: '0.3s',
          fontWeight: '600',
          background: 'linear-gradient(135deg, #ff6a00, #ee0979)',
          marginTop: '1rem',
          fontFamily: "'Poppins', sans-serif",
          boxShadow: '0 4px 12px rgba(255, 106, 0, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 16px rgba(255, 106, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(255, 106, 0, 0.3)';
        }}
      >
        {buttonText}
      </button>
    </form>
  );
};

export default EventForm;