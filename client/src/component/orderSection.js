import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { api } from "./clientProvider";

const Orders = ({ orders }) => {
  const [socket, setSocket] = useState(null);
  const [updatedOrders, setUpdatedOrders] = useState([]);

  useEffect(() => {
    // Initialize the orders state from props
    setUpdatedOrders(orders);
  }, [orders]);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io("http://localhost:8000"); // Replace with your server URL
    setSocket(newSocket);

    // Listen for real-time updates
    newSocket.on("orderStatusUpdated", (updatedOrder) => {
      setUpdatedOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === updatedOrder._id
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );
    },
    newSocket.on("orderUpdated", async () => {
        try {

          const response = await api.get("/admin/orders");
          const orderData = response.data.orders;
          setUpdatedOrders(orderData);
        } catch (err) {
          alert("Failed to fetch orders. Please try again later.");
        }
      }
    )
  );

    return () => {
      newSocket.disconnect(); // Cleanup socket connection on component unmount
    };
  }, []);

  const handleOrderUpdate = async (orderId, newStatus) => {
    
    try {
      const response = await axios.post("http://localhost:8000/update-status", {
        orderId,
        newStatus,
      });

      if (response.status === 200) {
        const updatedTable = response.data.order; // Assuming your API responds with updated table data

        // Emit the updated table to all connected clients via Socket.IO
        console.log(updatedTable)
        if (socket) {
          socket.emit("tableUpdated", updatedTable); // Emit the updated table data
          socket.emit("orderStatusUpdated",newStatus); // Emit the updated table data
        }
      }
      if (response.data.success) {
        console.log("Order status updated successfully");
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Table
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {updatedOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">Table {order.table}</td>
                <td className="px-6 py-4">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      {item.quantity}x {item.name}
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "preparing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    className="rounded border-gray-300 text-sm"
                    value={order.status}
                    onChange={(e) => handleOrderUpdate(order.order_id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;