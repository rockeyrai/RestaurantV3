import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from './clientProvider';

const Tables = ({ tables }) => {
  const [socket, setSocket] = useState(null);
  const [updatedTables, setUpdatedTables] = useState(tables);

  // Use effect to update the tables when the parent component's `tables` prop changes
  useEffect(() => {
    setUpdatedTables(tables);
  }, [tables]); 
  // Runs whenever `tables` prop changes

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io("http://localhost:8000"); // Replace with your server URL
    setSocket(newSocket);

    // Listen for table updates in real-time
    newSocket.on("tableUpdated", (updatedTable) => {
      // Update the table data in state based on the received updatedTable
      setUpdatedTables((prevTables) => 
        prevTables.map((table) => 
          table.id === updatedTable.id ? { ...table, ...updatedTable } : table
        )
      );
    });
    return () => {
      newSocket.disconnect(); // Cleanup when component unmounts
    };
  }, []);

  const handleToggleAvailability = async (tableId) => {
    try {
      // Call your API to toggle the table availability in the database
      const response = await api.put(`tables/${tableId}/availability`); // Adjust the API endpoint for availability toggle

      if (response.status === 200) {
        const updatedTable = response.data; // Assuming your API responds with updated table data

        // Emit the updated table to all connected clients via Socket.IO
        console.log(updatedTable)
        if (socket) {
          socket.emit("tableUpdated", updatedTable); // Emit the updated table data
        }
      }
    } catch (error) {
      console.error("Error updating table availability:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {updatedTables.map((table) => (
        <div key={table.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Table {table.table_number}</h3>
            <span className="text-sm text-gray-500">{table.seats} Seats</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className={`text-sm ${table.available ? 'text-green-600' : 'text-red-600'}`}>
              {table.available ? 'Available' : 'Occupied'}
            </div>
            {table.reservation && (
              <div className="text-sm text-gray-600">
                <span className="font-bold">Reserved by: </span>{table.reservation.customerName}<br />
                <span className="font-bold">Time: </span>{table.reservation.time}<br />
                <span className="font-bold">Group of: </span>{table.no_of_people}
              </div>
            )}
            <button
              onClick={() => handleToggleAvailability(table.id)}
              className={`mt-4 px-4 py-2 rounded-md text-white ${table.available ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {table.available ? 'Mark as Occupied' : 'Mark as Available'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tables;
