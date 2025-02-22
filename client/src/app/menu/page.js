"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { User, Utensils } from "lucide-react";
import MenuFilter from "@/component/MenuFilter";
import MenuCard from "@/component/MenuCard";
import CoustomAvatar from "@/component/userAvatar";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";


function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

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
        setCategories(response1.data);
      } catch (err) {
        setError("Failed to fetch menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // const categories = [
  //   { category_id: 1, name: "Pizza" },
  //   { category_id: 2, name: "Main Course" },
  // ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory
        ? item.category_name === selectedCategory
        : true;

      const matchesSearch =
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false ||
        (Array.isArray(item.tags) &&
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchTerm]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
alert(pathname)
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <Utensils className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">RaiFlavors</h1>
              </div>
              <div className=" cursor-pointer flex space-x-3 font-bold  items-center text-gray-400">
                <p
                  className={pathname === "/menu" ? "underline" : ""}
                  onClick={() => router.push("/menu")}
                >
                  MENU
                </p>
                <p
                  className={pathname === "/reserve" ? "underline" : ""}
                  onClick={() => router.push("/reserve")}
                >
                  RESERVE
                </p>
              </div>
            </div>
            <div className="flex justify-end text-white">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <CoustomAvatar username={user?.username} />
                </div>
              ) : (
                <User className="w-8 h-8 m-5 flex items-center justify-center rounded-full bg-gray-500 text-white cursor-pointer" />
              )}
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
            <p className="text-gray-500 text-lg">
              No menu items found matching your criteria.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Menu;
