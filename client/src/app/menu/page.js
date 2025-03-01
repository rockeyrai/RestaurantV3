"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import MenuFilter from "@/component/MenuFilter";
import MenuCard from "@/component/MenuCard";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { io } from "socket.io-client";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const user = useSelector((state) => state.auth.user);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_FRONTEND_API,
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await api.get("/menu");
        const response1 = await api.get("/categories");
        setMenuItems(response.data);
        console.log(response.data);
        setCategories(response1.data);
      } catch (err) {
        setError("Failed to fetch menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const handleAddToOrder = (menuItem) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.menu_item_id === menuItem.menu_item_id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.menu_item_id === menuItem.menu_item_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...menuItem, quantity: 1 }];
    });
  };

  const handleDeleteItem = (menuItemId) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((item) => item.menu_item_id !== menuItemId)
    );
  };

  const calculateTotalCost = () => {
    const cost = selectedItems.reduce(
      (acc, item) => acc + item.final_price * item.quantity,
      0
    );
    setTotalCost(cost);
  };

  useEffect(() => {
    calculateTotalCost();
  }, [selectedItems]);

  const handleSubmitOrder = async () => {
    if (selectedItems.length === 0) {
      setError("Please add items to your order.");
      return;
    }
    try {
      const user_id = user?.userId|| null
      
      if (user_id == null){
        toast.error("Failed to place the order. Please Login");
        return
      }
      const orderData = {
        user_id,
        items: selectedItems.map(({ menu_item_id, quantity }) => ({
          menu_item_id,
          quantity,
        })),
        total_cost: totalCost,
      };
      const newSocket = io("http://localhost:8000");
      const response = await api.post("/orders", orderData);
      if ((response.status = 200 || 201)) {
        toast.success("Order placed successfully!");
        setSelectedItems([]);
        setTotalCost(0);
        newSocket.emit("tableUpdated"); 
        debugger
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to place the order. Please try again.");
    }
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory
        ? item.category_name === selectedCategory
        : true;

      const matchesSearch =
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(item.tags) &&
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchTerm]);

  const handleIncreaseQuantity = (menuItemId) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.menu_item_id === menuItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (menuItemId) => {
    setSelectedItems(
      (prevItems) =>
        prevItems
          .map((item) =>
            item.menu_item_id === menuItemId && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0) // Remove items with 0 quantity
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <MenuFilter
          categories={categories}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchTerm}
        />

        <div className="curser-pointer grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              className="cursor-pointer"
              key={item.menu_item_id}
              onClick={() => handleAddToOrder(item)}
            >
              <MenuCard item={item} />
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No menu items found matching your criteria.
            </p>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg overflow-x-auto shadow-md mt-8">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedItems.map((item) => (
                <tr key={item.menu_item_id} className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      onClick={() => handleDecreaseQuantity(item.menu_item_id)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>

                    <button
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      onClick={() => handleIncreaseQuantity(item.menu_item_id)}
                    >
                      +
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${(item.final_price * item.quantity).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-red-500 cursor-pointer hover:underline"
                      onClick={() => handleDeleteItem(item.menu_item_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="font-bold mt-4">Total: Rs. {totalCost.toFixed(2)}</h3>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={handleSubmitOrder}
          >
            Submit Order
          </button>
        </div>
      </main>
    </div>
  );
}

export default Menu;
