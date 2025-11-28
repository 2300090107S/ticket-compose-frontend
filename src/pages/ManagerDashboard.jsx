import React from 'react';

const managedEvents = [
  { id: 1, name: 'Avengers: Endgame', date: '25 Sep 2025', sold: 50 },
  { id: 2, name: 'Inception', date: '30 Sep 2025', sold: 30 },
];

const ManagerDashboard = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {managedEvents.map(event => (
          <div key={event.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">{event.name}</h2>
            <p className="text-gray-500">Date: {event.date}</p>
            <p className="text-gray-500">Tickets Sold: {event.sold}</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Manage Event
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerDashboard;
