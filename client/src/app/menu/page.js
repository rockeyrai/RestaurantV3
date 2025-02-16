'use client'
import React, { useState, useMemo } from 'react';
import { Utensils } from 'lucide-react';
import MenuFilter from '@/component/MenuFilter';
import MenuCard from '@/component/MenuCard';


// Sample data - replace with your actual data fetching logic
const sampleMenuItems = [
  {
    menu_item_id: 1,
    name: "Classic Margherita Pizza",
    description: "Fresh tomatoes, mozzarella, basil, and our signature sauce",
    original_price: 14.99,
    final_price: 11.99,
    discount_percentage: 20,
offer_start_date: "2024-02-20T00:00:00Z",
offer_end_date: "2024-03-20T23:59:59Z",
    category_name: "Pizza",
    availability: true,
    tags: ["Vegetarian", "Italian", "Chef's Special"],
    image_urls: [
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591"
    ]
  },
  {
    menu_item_id: 2,
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with seasonal vegetables",
    original_price: 24.99,
    final_price: 24.99,
    discount_percentage: 0,
    offer_start_date: "N/A",
    offer_end_date: "N/A",
    category_name: "Main Course",
    availability: true,
    tags: ["Seafood", "Healthy", "Gluten-Free"],
    image_urls: [
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288"
    ]
  },
];

const categories = [
  { category_id: 1, name: "Pizza" },
  { category_id: 2, name: "Main Course" },
];

function Menu() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    return sampleMenuItems.filter((item) => {
      const matchesCategory = selectedCategory ? item.category_name === selectedCategory : true;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

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
