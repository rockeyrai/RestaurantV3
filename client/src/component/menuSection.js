import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

const CoustomeMenu = ({ menuItems, toggleMenuItemAvailability }) => {
  console.log(`menu section dfata ${menuItems}`);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categories: [], // Changed to array for multiple categories
    availability: true,
    tags: [],
    image_urls: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagsChange = (selectedTags) => {
    setFormData({
      ...formData,
      tags: selectedTags || [], // Set selected tags (array of objects)
    });
  };

  const handleCategoriesChange = (selectCategories) => {
    setFormData({
      ...formData,
      categories: selectCategories || [], // Set selected tags (array of objects)
    });
  };

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_FRONTEND_API,
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    const fetchTagsCategories = async () => {
      try {
        const [tagsResponse, categoriesResponse] = await Promise.all([
          api.get("/tags"),
          api.get("/categories"),
        ]);
        const tagsOptions = tagsResponse.data.map((tag) => ({
          value: tag.tag_id,
          label: tag.name,
        }));

        const categorieOptions = categoriesResponse.data.map((categorie) => ({
          value: categorie.category_id,
          label: categorie.name,
        }));

        setTags(tagsOptions);
        setCategories(categorieOptions);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTagsCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        tags: formData.tags.map((tag) => tag.label), // Send tag IDs to the API
        categories: formData.categories.map((categorie) => categorie.label), // Send tag IDs to the API
        image_urls: formData.image_urls.split(",").map((url) => url.trim()),
      };

      console.log(payload);
      const response = await api.post("/menu", payload);

      setMessage(response.data.message);
      setFormData({
        name: "",
        description: "",
        price: "",
        categories: [],
        availability: true,
        tags: [],
        image_urls: "",
      });
    } catch (err) {
      console.error("Error adding menu item:", err);
      setMessage("Failed to add menu item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full"
            />

            {/* Categories Multi-select */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categories
              </label>
              <Select
                isMulti
                options={categories} // Options fetched from the API
                value={formData.categories} // Selected tags
                onChange={handleCategoriesChange} // Handle tag selection
                placeholder="Select cateories..."
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            {/* Tags Multi-select */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <Select
                isMulti
                options={tags} // Options fetched from the API
                value={formData.tags} // Selected tags
                onChange={handleTagsChange} // Handle tag selection
                placeholder="Select tags..."
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Available</label>
            </div>

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
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Final Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
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
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {item.final_price}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {item.discount_percentage > 0 && (
                    <div className=" bg-red-400 text-white px-2 py-1 rounded-md">
                      {(item.original_price - item.discount_percentage).toFixed(
                        2
                      ) == item.final_price
                        ? `Rs.${Number(item.discount_percentage)} OFF`
                        : `${Number(item.discount_percentage)}% OFF`}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
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

export default CoustomeMenu;
