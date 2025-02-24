"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { toggleLoginModal } from "../redux/slice/auth";
import LoginModal from "@/component/login";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { showLoginModal } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [direction, setDirection] = useState("");

  const socket = io(`${process.env.NEXT_PUBLIC_FRONTEND_API}`); // Replace with your server URL
  
  useEffect(() => {
    const socket = io("http://localhost:8000");
  
    socket.on("connect", () => console.log("Connected"));
    socket.on("disconnect", () => console.log("Disconnected"));
  
    return () => socket.disconnect(); // Cleanup
  }, []);
  
    
    // Listen for messages from the server
    socket.on("message", (data) => {
      console.log("Message from server:", data);
    });
    
    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

  const handleNavigation = (path) => {
    if (!isAuthenticated) {
      dispatch(toggleLoginModal());
      setDirection(path); // Update direction with the path
    } else {
      router.push(path);
    }
  };

  // const handleLogout = () => {
  //   dispatch(logout());
  // };
  console.log(user);
  return (
    <div className="min-h-screen bg-gray-50">
      {showLoginModal && <LoginModal direction={direction} />}
      <>
        {/* Hero Section */}
        <div
          className="relative h-[600px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="text-white">
                <h1 className="text-5xl font-bold mb-4">La Belle Cuisine</h1>
                <p className="text-xl mb-8">
                  Experience the finest French dining in town
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => handleNavigation("/reserve")}
                    className="bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 transition duration-300"
                  >
                    Reserve a Table
                  </button>
                  <button
                    onClick={() => handleNavigation("/menu")}
                    className="bg-white text-yellow-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
                  >
                    Order Food
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Welcome to La Belle Cuisine
            </h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-600 mb-6">
                Established in 1995, La Belle Cuisine brings the authentic taste
                of French cuisine to your table. Our award-winning chefs create
                memorable dining experiences using the finest ingredients and
                traditional recipes.
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <FaPhone className="text-4xl text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Contact</h3>
                <p className="text-gray-600">(555) 123-4567</p>
              </div>
              <div className="text-center">
                <FaMapMarkerAlt className="text-4xl text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Location</h3>
                <p className="text-gray-600">123 Gourmet Street, Foodville</p>
              </div>
              <div className="text-center">
                <FaClock className="text-4xl text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Hours</h3>
                <p className="text-gray-600">
                  Mon-Sat: 11:00 AM - 10:00 PM
                  <br />
                  Sun: 12:00 PM - 9:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 La Belle Cuisine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
