"use client";
import React, { useState } from "react";
import { User, Utensils } from "lucide-react";
import CoustomAvatar from "./userAvatar";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import LoginModal from "./login";
import { toggleLoginModal } from "@/redux/slice/auth";

const CoustomeNavbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.user);
  const { showLoginModal } = useSelector((state) => state.auth);
  const [direction, setDirection] = useState("");
  const dispatch = useDispatch();

  const handleNavigation = (path) => {
    if (!isAuthenticated) {
      dispatch(toggleLoginModal());
      setDirection(path); // Update direction with the path
    } else {
      router.push(path);
    }
  };
  return (
    <div>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between">
            <div className="flex justify-between gap-8">
              {/* Logo Section */}
              <div className="flex space-x-3 cursor-pointer" onClick={()=>{router.push('/')}}>
                <Utensils className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">RaiFlavors</h1>
              </div>

              {/* Menu Links */}
              <div className="flex space-x-6 font-bold text-gray-400 relative top-2">
                <p
                  className={`cursor-pointer ${
                    pathname === "/menu" ? "underline text-gray-800" : ""
                  }`}
                  onClick={() => router.push("/menu")}
                >
                  MENU
                </p>
                <p
                  className={`cursor-pointer ${
                    pathname === "/reserve" ? "underline text-gray-800" : ""
                  }`}
                  onClick={() => router.push("/reserve")}
                >
                  RESERVE
                </p>
                <p
                  className={`cursor-pointer ${
                    pathname === "/order" ? "underline text-gray-800" : ""
                  }`}
                  onClick={() => router.push("/order")}
                >
                  ORDER
                </p>
              </div>
            </div>

            {/* Avatar/Login Section */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <CoustomAvatar username={user?.username} />
              ) : (
                <User
                  onClick={() => handleNavigation(`${pathname}`)}
                  className="w-8 h-8 mx-3 flex items-center justify-center rounded-full bg-gray-500 text-white cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {showLoginModal && <LoginModal direction={direction} />}
    </div>
  );
};

export default CoustomeNavbar;
