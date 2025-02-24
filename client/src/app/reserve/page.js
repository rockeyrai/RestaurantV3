'use client'
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { api } from '@/component/clientProvider';
import { useSelector } from 'react-redux';
import { io } from "socket.io-client";

function Reserve() {
  const [date, setDate] = useState(getTodayDate());
  const [time, setTime] = useState('12:00');
  const [guests, setGuests] = useState(2);
  const [tables, setTables] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [selectedTable, setSelectedTable] = useState(null);
  const [maxSeat,setMaxSeat] = useState(null)
  // Fetch table data from the API

  console.log(`stable number ${selectedTable}`)
  console.log(`max seat  ${maxSeat}`)
  console.log(`guesss seat ${guests}`)
  
  useEffect(() => {
    // Fetch initial table data from the API
    const fetchTables = async () => {
      try {
        const response = await api.get('/tables'); // Replace with your API endpoint
        const data = response.data;
  
        // Transform the data: Convert available (1/0) to true/false
        const formattedData = data.map((table) => ({
          id: table.id,
          table_number: table.table_number,
          seats: table.seats,
          available: table.available === 1, // Convert to boolean
        }));
  
        setTables(formattedData);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };
  
    fetchTables();
  
    // Initialize Socket.IO connection
    const socket = io(`${process.env.NEXT_PUBLIC_FRONTEND_API}`); // Replace with your server URL
  
    // Listen for table updates
    socket.on("tableUpdated", (updatedTable) => {
      console.log("Table updated:", updatedTable);
      setTables((prevTables) =>
        prevTables.map((table) =>
          table.id === updatedTable.id // Ensure we're comparing by id
            ? {
                ...table,
                available: updatedTable.available === 1, // Ensure boolean format
              }
            : table
        )
      );
    });
  
    // Listen for new table reservations
    socket.on("tableReserved", (newTable) => {
      console.log("New table reserved:", newTable);
      setTables((prevTables) => [...prevTables, newTable]);
    });
  
    // Cleanup the Socket.IO connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);
  
  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const handleTableSeceletion =(tabaleID,max_seat)=>{
    setSelectedTable(tabaleID)
    setMaxSeat(max_seat)
  }

  const handleReservation = async () => {
    if (!user) {
      alert('Please log in to make a reservation');
      return;
    }
  
    if (!selectedTable) {
      alert('Please select a table');
      return;
    }

    if (guests > maxSeat ){
      alert(`Not enough seat, Please select another table`)
      return;
    }
  
    const reservationData = {
      table_id: selectedTable,
      user_id: user.userId,
      order_id: null, // Assuming order_id is optional
      reserve_time: time,
      available: false, // Mark the table as unavailable after reservation
      reserve_date: date,
      no_of_people: guests,
    };
  
    try {
      const response = await api.post('/tables', reservationData);
  
      if (response.status === 201 || response.status === 200) {
        alert('Reservation successful!');
        // Optionally, refresh the table data or update the state
        setTables((prevTables) =>
          prevTables.map((table) =>
            table.id === selectedTable ? { ...table, available: false } : table
          )
        );
        setSelectedTable(null); // Reset selected table
      } else {
        alert('Failed to make a reservation. Please try again.');
      }
    } catch (error) {
      console.error('Error making reservation:', error);
      alert('An error occurred while making the reservation.');
    }
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
                onClick={() => table.available && handleTableSeceletion(table.id,table.seats)}
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
