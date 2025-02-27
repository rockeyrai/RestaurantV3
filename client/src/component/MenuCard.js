import React, { useState } from "react";
import { Tag, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { api } from "./clientProvider";
import { useSelector } from "react-redux";

const MenuCard = ({ item }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images =
    item.image_urls.length > 0
      ? item.image_urls
      : ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c"];
  const [hoverRating, setHoverRating] = useState(null);
  const [userRating, setUserRating] = useState(item.rating || 0);
  const user = useSelector((state) => state.auth.user);

  console.log(item);
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleMouseEnter = (rating) => {
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  // Inside MenuCard Component

  const handleRatingClick = async (menu_item_id, rating) => {
    setUserRating(rating);
    const user_id = user.userId;
    const ratingData = { menu_item_id, rating, user_id }; // Use the rating passed as an argument

    try {
      const response = await api.put("/rating", ratingData);

      // No need to call .json() with axios
      if (response.status === 200) {
        console.log("Rating updated successfully!");
      } else {
        console.error(response.data.message || "Failed to update rating");
      }
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={images[currentImageIndex]}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        {!item.availability && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">
              Currently Unavailable
            </span>
          </div>
        )}
        {item.discount_percentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md">
            {(item.original_price - item.discount_percentage).toFixed(2) ==
            item.final_price
              ? `Rs. ${Number(item.discount_percentage)} OFF`
              : `${Number(item.discount_percentage)}% OFF`}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
          <div className="text-right">
            {item.discount_percentage > 0 ? (
              <>
                <span className="text-lg font-bold text-green-600">
                  {typeof item.final_price === "number" ||
                  !isNaN(parseFloat(item.final_price))
                    ? `Rs. ${parseFloat(item.final_price).toFixed(2)}`
                    : "N/A"}
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  {typeof item.original_price === "number" ||
                  !isNaN(parseFloat(item.original_price))
                    ? `Rs. ${parseFloat(item.original_price).toFixed(2)}`
                    : "N/A"}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-green-600">
                {typeof item.final_price === "number" ||
                !isNaN(parseFloat(item.final_price))
                  ? `Rs. ${parseFloat(item.final_price).toFixed(2)}`
                  : "N/A"}
              </span>
            )}
          </div>
        </div>
        {/* <p className="text-gray-600 text-sm mb-4">{item.description}</p> */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap justify-between mb-3">
            <div className="flex gap-2" >
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex  items-center bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-600"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 cursor-pointer ${
                    hoverRating !== null
                      ? i < hoverRating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                      : i < Math.floor(userRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                  onClick={() => handleRatingClick(item.menu_item_id, i + 1)} // Pass the rating value
                  onMouseEnter={() => handleMouseEnter(i + 1)}
                  onMouseLeave={handleMouseLeave}
                />
              ))}
              {/* <span className="ml-2 text-sm text-gray-600">({userRating})</span> */}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <span className="text-blue-600">{item.category_name}</span>
          {item.discount_percentage > 0 && (
            <div className="text-xs">
              Offer: {formatDate(item.offer_start_date)} -{" "}
              {formatDate(item.offer_end_date)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
