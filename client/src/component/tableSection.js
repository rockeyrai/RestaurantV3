import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api } from "./clientProvider";

const Tables = ({ tables }) => {
  const [socket, setSocket] = useState(null);
  const [updatedTables, setUpdatedTables] = useState(tables);
  const [showAddTable, setShowAddTable] = useState(false);
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    table_number: "",
    seats: "",
    available: true,
  });

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
        console.log(updatedTable);
        if (socket) {
          socket.emit("tableUpdated", updatedTable); // Emit the updated table data
        }
      }
    } catch (error) {
      console.error("Error updating table availability:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Update formData with the correct types
    const updatedFormData = {
      ...formData,
      table_number: Number(formData.table_number),
      seats: Number(formData.seats),
    };
  
    try {
      setLoading(true);
      console.log("Sending Data: ", JSON.stringify(updatedFormData)); // Log the data being sent
  
      // Send the data to the API
      const response = await api.post("/createtable", updatedFormData);
      
      // Log the full response for debugging purposes
      console.log("Response:", response);
  
      // Check if the response status is 200 or 201 (success)
      if (response.status === 200 || response.status === 201) {
        setMessage(response.data.message);  // Use response.data.message for success
        setFormData({
          table_number: "",
          seats: "",
          available: true,
        });
      } else {
        // If not success, log and show the error message
        setMessage(response.data.message || "Error occurred while adding table");
      }
    } catch (error) {
      // Log the error details for debugging purposes
      console.error("API error:", error);
      setMessage("Error occurred while adding table");
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Tables</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={() => setShowAddTable(!showAddTable)}
        >
          {showAddTable ? "Close Form" : "Add New Table"}
        </button>
      </div>

      {showAddTable && (
        <div className="mb-6">
          {message && <p className="mb-4 text-green-600">{message}</p>}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              type="number"
              name="table_number"
              placeholder="Table Number"
              value={formData.table_number}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full"
            />
            <input
              type="number"
              name="seats"
              placeholder="Seats"
              value={formData.seats}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full"
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={(e) =>
                  setFormData({ ...formData, available: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Available</label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Adding..." : "Add Table"}
            </button>
          </form>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {updatedTables.map((table) => (
          <div key={table.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Table {table.table_number}
              </h3>
              <span className="text-sm text-gray-500">{table.seats} Seats</span>
            </div>
            <div className="flex flex-col gap-2">
              <div
                className={`text-sm ${
                  table.available ? "text-green-600" : "text-red-600"
                }`}
              >
                {table.available ? "Available" : "Occupied"}
              </div>
              {table.reservation && (
                <div className="text-sm text-gray-600">
                  <span className="font-bold">Reserved by: </span>
                  {table.reservation.customerName}
                  <br />
                  <span className="font-bold">Time: </span>
                  {table.reservation.time}
                  <br />
                  <span className="font-bold">Group of: </span>
                  {table.no_of_people}

                </div>
              )}
              <button
                onClick={() => handleToggleAvailability(table.id)}
                className={`mt-4 px-4 py-2 rounded-md text-white ${
                  table.available
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600" 
                }`}
              >
                {table.available ? "Mark as Occupied" : "Mark as Available"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;
