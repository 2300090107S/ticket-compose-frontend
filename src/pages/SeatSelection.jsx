import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const SeatSelection = () => {
  const { eventId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);

  // Load seats for event
  useEffect(() => {
    api.get(`/seats/${eventId}`).then((res) => {
      setSeats(res.data);
    });
  }, [eventId]);

  // Toggle seat selection
  const toggleSeat = (seat) => {
    if (seat.booked) return; // cannot click booked seats

    if (selected.includes(seat.seatNumber)) {
      setSelected(selected.filter(s => s !== seat.seatNumber));
    } else {
      setSelected([...selected, seat.seatNumber]);
    }
  };

  // Book seats
  const bookSeats = () => {
    api.post(`/seats/book/${eventId}`, selected)
      .then(() => {
        alert("Booking Successful!");
        window.location.reload();
      })
      .catch(() => alert("Error booking seats"));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>🎟 Select Seats</h2>

      <div style={{ display: "inline-block", marginTop: "20px" }}>
        {seats.map((seat) => (
          <div
            key={seat.id}
            onClick={() => toggleSeat(seat)}
            style={{
              display: "inline-block",
              width: "45px",
              padding: "12px",
              margin: "6px",
              borderRadius: "6px",
              cursor: seat.booked ? "not-allowed" : "pointer",
              background: seat.booked
                ? "gray"
                : selected.includes(seat.seatNumber)
                ? "green"
                : "lightblue",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>

      <br />
      <button
        onClick={bookSeats}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "orange",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          borderRadius: "5px",
        }}
      >
        Book Selected Seats
      </button>
    </div>
  );
};

export default SeatSelection;
