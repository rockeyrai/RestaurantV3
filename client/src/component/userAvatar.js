'use client'
import { signOut } from '@/redux/slice/auth';
import { useDispatch, useSelector } from 'react-redux';
import { persistStore } from 'redux-persist';  // Import persistStore
import React, { useState } from 'react';
import { store } from '@/redux/store';

const CoustomAvatar = ({ username }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  // Get the initials from the username
  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    return nameParts
      .map((part) => part[0]?.toUpperCase())
      .join('')
      .slice(0, 2); // Get up to two initials
  };

  const initials = getInitials(username);

  const handleAvatarClick = () => {
    // Toggle dropdown visibility
    setIsDropdownOpen((prev) => !prev);
  };
  
  const handleLogout = () => {
    // Dispatch the signOut action
    dispatch(signOut());
  
    // Clear localStorage if needed
    localStorage.removeItem('user');
    // Optionally, purge redux persist state
    const persistor = persistStore(store);
    persistor.purge();
  
    // Optionally, refresh the page
    window.location.reload();
  };
  
  
  return (
    <div className="relative">
      {/* Avatar */}
      <div
        className="w-8 h-8 flex mx-5 ring-2 ring-gray-300 dark:ring-gray-500 items-center justify-center rounded-full bg-blue-500 text-white font-bold cursor-pointer"
        title={username}
        onClick={handleAvatarClick}
      >
        {username && <span className="top-0 left-12 absolute  w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>}
        {initials}
      </div>

      {/* Dropdown */}
      {isDropdownOpen && 
        <div className="absolute right-0 mt-2 mx-4 w-auto z-50 bg-white border border-gray-200 rounded-lg shadow-lg">
          <button
            className="w-full px-2 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
}
    </div>
  );
};

export default CoustomAvatar;
