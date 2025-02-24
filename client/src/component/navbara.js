'use client'
import React, { useState } from 'react'
import { User, Utensils } from "lucide-react";
import CoustomAvatar from './userAvatar';
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import LoginModal from "./login";
import { toggleLoginModal } from '@/redux/slice/auth';

const CoustomeNavbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.user);
  const { showLoginModal } = useSelector((state) => state.auth);
  const [direction,setDirection] = useState("")
  const dispatch = useDispatch()

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
    <div className="container mx-auto px-4 py-2">
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
            <p
              className={pathname === "/order" ? "underline" : ""}
              onClick={() => router.push("/order")}
            >
              ORDER
            </p>
          </div>
        </div>
        <div className="flex justify-end text-white">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <CoustomAvatar username={user?.username} />
            </div>
          ) : (
          <User onClick={() => handleNavigation(`${pathname}`)} className="w-8 h-8 m-5 flex items-center justify-center rounded-full bg-gray-500 text-white cursor-pointer" />
          )}
        </div>

      </div>
    </div>
  </header>
  {showLoginModal && <LoginModal direction={direction} />}
  </div>
  )
}

export default CoustomeNavbar
