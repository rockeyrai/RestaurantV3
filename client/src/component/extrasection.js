"use client";
import { useState } from "react";
import AddForm from "./formsample";
import axios from "axios";
import { toast } from "sonner";
import { Dela_Gothic_One } from "next/font/google";

const ExtraSection = () => {
  // State for Category, Tag, and Offer Inputs
  const [categoryName, setCategoryName] = useState("");
  const [tagName, setTagName] = useState("");

  const [menuItemId, setMenuItemId] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [offerType, setOfferType] = useState("percentage");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Handle Category Submit
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/categories", { name: categoryName })
      .then((response) => {
        setCategoryName("");
        toast.success(response.data.msg || "Category created successfully!");
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.msg || "An error occurred!";
        toast.error(errorMessage);
      });
  };

  // Handle Tag Submit
  const handleTagSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/tags", { name: tagName })
      .then((response) => {
        setTagName("");
        toast.success(response.data.msg || "Tag placed successfully!");
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.msg || "An error occurred!";
        toast.error(errorMessage);
      });
  };

  // Handle Offer Submit
  const handleOfferSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/offers", {
        menu_item_id: menuItemId,
        discount_percentage: discountPercentage,
        offer_type: offerType,
        start_date: startDate,
        end_date: endDate,
      })
      .then((response) => {
        setMenuItemId("");
        setDiscountPercentage("");
        setOfferType("");
        setStartDate("");
        setEndDate("");
        toast.success(response.data.msg || "Offer placed successfully!");
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.msg || "An error occurred!";
        toast.error(errorMessage);
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Extra Feature</h1>

      {/* Categories Section */}
      <AddForm
        title="Add Category"
        onSubmit={handleCategorySubmit}
        inputs={[
          {
            label: "Category Name",
            type: "text",
            value: categoryName,
            onChange: (e) => setCategoryName(e.target.value),
            placeholder: "Enter category name",
          },
        ]}
        buttonText="Add Category"
      />

      {/* Tags Section */}
      <AddForm
        title="Add Tag"
        onSubmit={handleTagSubmit}
        inputs={[
          {
            label: "Tag Name",
            type: "text",
            value: tagName,
            onChange: (e) => setTagName(e.target.value),
            placeholder: "Enter tag name",
          },
        ]}
        buttonText="Add Tag"
      />

      {/* Offers Section */}
      <AddForm
        title="Add Offer"
        onSubmit={handleOfferSubmit}
        inputs={[
          {
            label: "Menu Item ID",
            type: "text",
            value: menuItemId,
            onChange: (e) => setMenuItemId(e.target.value),
            placeholder: "Enter menu item ID",
          },
          {
            label: "Discount Percentage",
            type: "number",
            value: discountPercentage,
            onChange: (e) => setDiscountPercentage(e.target.value),
            placeholder: "Enter discount percentage",
          },
          {
            label: "Offer Type",
            type: "select",
            value: offerType,
            onChange: (e) => setOfferType(e.target.value),
            options: [
              { value: "percentage", label: "Percentage" },
              { value: "fixed_price", label: "Fixed Price" },
            ],
          },
          {
            label: "Start Date",
            type: "date",
            value: startDate,
            onChange: (e) => setStartDate(e.target.value),
            placeholder: "Select start date",
          },
          {
            label: "End Date",
            type: "date",
            value: endDate,
            onChange: (e) => setEndDate(e.target.value),
            placeholder: "Select end date",
          },
        ]}
        buttonText="Add Offer"
      />
    </div>
  );
};

export default ExtraSection;
