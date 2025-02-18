'use client'
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

function Reserve() {
  const [date, setDate] = useState(getTodayDate());
  const [time, setTime] = useState('12:00');
  const [guests, setGuests] = useState(2);
  const [tables, setTables] = useState([
    { id: 1, table_number: 1, seats: 2, available: true },
    { id: 2, table_number: 2, seats: 4, available: true },
    { id: 3, table_number: 3, seats: 6, available: true },
    { id: 4, table_number: 4, seats: 2, available: false },
    { id: 5, table_number: 5, seats: 4, available: true },
  ]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const handleReservation = () => {
    if (!user) {
      alert('Please log in to make a reservation');
      return;
    }

    if (!selectedTable) {
      alert('Please select a table');
      return;
    }

    // Here you would typically make an API call to your backend
    const reservation = {
      userId: user.id,
      tableId: selectedTable,
      date,
      time,
      guests,
    };

    console.log('Reservation made:', reservation);
    alert('Reservation successful!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="h-64 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80)'
        }}
      >
        <div className="h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Reserve Your Table</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Reservation Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline-block w-4 h-4 mr-2" />
                Date
              </label>
              <input
                type="date"
                min={getTodayDate()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline-block w-4 h-4 mr-2" />
                Time
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, '0');
                  return `${hour}:00`;
                }).map((timeSlot) => (
                  <option key={timeSlot} value={timeSlot}>
                    {timeSlot}
                  </option>
                ))}
              </select>
            </div>

            {/* Guest Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline-block w-4 h-4 mr-2" />
                Number of Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Available Tables */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Available Tables</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                className={
                  `
                  p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${table.available ? 
                    selectedTable === table.id ?
                      'border-green-500 bg-green-50' :
                      'border-gray-200 hover:border-green-300' :
                    'border-red-200 bg-red-50 cursor-not-allowed'
                  }
                `
                }
                onClick={() => table.available && setSelectedTable(table.id)}
              >
                <h3 className="font-medium">Table {table.table_number}</h3>
                <p className="text-sm text-gray-600">{table.seats} Seats</p>
                <p className={`text-sm ${table.available ? 'text-green-600' : 'text-red-600'}`}>
                  {table.available ? 'Available' : 'Reserved'}
                </p>
              </div>
            ))}
          </div>

          {/* Reserve Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleReservation}
              disabled={!selectedTable || !user}
              className={
                `
                px-8 py-3 rounded-lg font-medium text-white
                ${selectedTable && user ?
                  'bg-green-600 hover:bg-green-700' :
                  'bg-gray-400 cursor-not-allowed'
                }
              `
              }
            >
              {!user ? 'Please Log In to Reserve' : 'Confirm Reservation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reserve;
