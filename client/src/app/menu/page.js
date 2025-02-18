'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Utensils } from 'lucide-react';
import MenuFilter from '@/component/MenuFilter';
import MenuCard from '@/component/MenuCard';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_FRONTEND_API,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get('/menu');
        setMenuItems(response.data);
      } catch (err) {
        setError("Failed to fetch menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory ? item.category_name === selectedCategory : true;
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchTerm]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const categories = [
    { category_id: 1, name: "Pizza" },
    { category_id: 2, name: "Main Course" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Utensils className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Our Menu</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <MenuFilter
          categories={categories}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchTerm}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuCard key={item.menu_item_id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No menu items found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Menu;
