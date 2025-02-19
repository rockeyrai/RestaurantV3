import React, { useState } from "react";
import axios from "axios";

const Menu = ({ menuItems = [], toggleMenuItemAvailability }) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_name: "", // Changed to category_name instead of category_id
    availability: true,
    tags: "",
    image_urls: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_FRONTEND_API,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()), // Convert tags to array
        image_urls: formData.image_urls.split(",").map((url) => url.trim()), // Convert image URLs to array
      };

      const response = await api.post('/menu', payload);

      setMessage(response.data.message);
      setFormData({
        name: "",
        description: "",
        price: "",
        category_name: "", // Reset category_name field
        availability: true,
        tags: "",
        image_urls: "",
      });
    } catch (err) {
      console.error("Error adding menu item:", err);
      setMessage("Failed to add menu item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Menu Items</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          {showAddMenu ? "Close Form" : "Add New Item"}
        </button>
      </div>

      {showAddMenu && (
        <div className="mb-6">
          {message && <p className="mb-4 text-green-600">{message}</p>}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              type="text"
              name="name"
              placeholder="Menu Item Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            ></textarea>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full"
            />
            <input
              type="text"
              name="category_name" // Changed to category_name
              placeholder="Category Name"
              value={formData.category_name}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.checked })
                }
              />
              <label className="ml-2">Available</label>
            </div>
            <input
              type="text"
              name="tags"
              placeholder="Tags (comma-separated)"
              value={formData.tags}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
            <input
              type="text"
              name="image_urls"
              placeholder="Image URLs (comma-separated)"
              value={formData.image_urls}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {loading ? "Adding..." : "Add Menu Item"}
            </button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.discount}%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleMenuItemAvailability(item.id)}
                    className={`px-3 py-1 rounded-md text-white ${
                      item.available
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {item.available ? "Mark Unavailable" : "Mark Available"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Menu;

