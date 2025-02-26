"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "@/component/clientProvider";
import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";

const Order = () => {
  const user = useSelector((state) => state.auth.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payableamount, setPayableamount] = useState(null);


  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io("http://localhost:8000"); // Replace with your server URL

    // Listen for real-time updates
    newSocket.on("orderStatusUpdated", (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === updatedOrder._id
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );
    });

    return () => {
      newSocket.disconnect(); // Cleanup socket connection on component unmount
    };
  }, []);

  useEffect(() => {
    // Ensure that userId is available
    if (user?.userId) {
      const fetchOrder = async () => {
        try {
          const response = await api.get(`/customer/orders/${user.userId}`);
          const orderData = response.data.orders;

          // Log and debug the response data
          console.log(orderData);

          // Calculate the total payable amount by summing up all completed order totals
          const totalPayable = orderData
            .filter((order) => order.status === "completed") // Filter only orders with 'completed' status
            .reduce((total, order) => total + parseFloat(order.total), 0) // Sum up the total of completed orders
            .toFixed(2); // Format the result to two decimal places

          setPayableamount(totalPayable);
          setOrders(orderData);
        } catch (err) {
          setError("Failed to fetch orders. Please try again later.");
          console.error("API error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    } else {
      console.log("User ID is not available.");
      setLoading(false); // stop loading if no user
    }
  }, [user?.userId]); // Only run the effect when user.userId changes

  if (loading) {
    <div>Loading ....</div>;
    return;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="h-64 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80)",
        }}
      >
        <div className="h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white"> Review Your Order </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order no
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Table {order.table}
                    </td>
                    <td className="px-6 py-4">
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${order.total ? order.total.toFixed(2) : "N/A"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
          <div className="flex gap-5 items-center">
            <h1 className="text-xl font-semibold">Total Amount</h1>
            <p>{`$${payableamount}`}</p>
          </div>
          <Button>Check Out</Button>
        </div>
      </div>
    </div>
  );
};

export default Order;
