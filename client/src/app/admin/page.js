'use client'
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UtensilsCrossed, 
  Pizza,
  UserCircle,
} from 'lucide-react';
import Dashboard from '@/component/dashboard';
import Orders from '@/component/orderSection';
import Staff from '@/component/staffSection';
import Tables from '@/component/tableSection';
import Menu from '@/component/menuSection';


function Admin () {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Margherita Pizza', price: 12.99, category: 'Pizza', available: true },
    { id: 2, name: 'Spaghetti Carbonara', price: 14.99, category: 'Pasta', available: true },
    { id: 3, name: 'Caesar Salad', price: 8.99, category: 'Salads', available: true },
    { id: 4, name: 'Tiramisu', price: 6.99, category: 'Desserts', available: false },
  ]);

  const [tables, setTables] = useState([
    { id: 1, table_number: 1, seats: 2, available: false, reservation: { customerName: 'John Doe', time: '19:00' } },
    { id: 2, table_number: 2, seats: 4, available: true },
    { id: 3, table_number: 3, seats: 6, available: true },
    { id: 4, table_number: 4, seats: 2, available: false, reservation: { customerName: 'Jane Smith', time: '20:00' } },
  ]);

  const [orders, setOrders] = useState([
    {
      id: 1,
      table: 1,
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
        { name: 'Caesar Salad', quantity: 2, price: 17.98 }
      ],
      total: 30.97,
      status: 'preparing',
      timestamp: '2024-03-15 18:30'
    },
    {
      id: 2,
      table: 4,
      items: [
        { name: 'Spaghetti Carbonara', quantity: 2, price: 29.98 }
      ],
      total: 29.98,
      status: 'pending',
      timestamp: '2024-03-15 18:45'
    }
  ]);

  const [dailySales] = useState([
    { date: '2024-03-09', amount: 1250 },
    { date: '2024-03-10', amount: 1420 },
    { date: '2024-03-11', amount: 1180 },
    { date: '2024-03-12', amount: 1350 },
    { date: '2024-03-13', amount: 1510 },
    { date: '2024-03-14', amount: 1680 },
    { date: '2024-03-15', amount: 1420 },
  ]);

  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'Michael Chen',
      email: 'michael.chen@restaurant.com',
      phone_number: '555-0101',
      role: 'chef',
      schedule: [
        { id: 1, staff_id: 1, shift_start: '2024-03-15 09:00', shift_end: '2024-03-15 17:00' },
        { id: 2, staff_id: 1, shift_start: '2024-03-16 09:00', shift_end: '2024-03-16 17:00' }
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@restaurant.com',
      phone_number: '555-0102',
      role: 'waiter',
      schedule: [
        { id: 3, staff_id: 2, shift_start: '2024-03-15 12:00', shift_end: '2024-03-15 20:00' }
      ]
    },
    {
      id: 3,
      name: 'David Wilson',
      email: 'david.w@restaurant.com',
      phone_number: '555-0103',
      role: 'manager',
      schedule: [
        { id: 4, staff_id: 3, shift_start: '2024-03-15 08:00', shift_end: '2024-03-15 16:00' }
      ]
    }
  ]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const toggleTableAvailability = (tableId) => {
    setTables(tables.map(table =>
      table.id === tableId ? { ...table, available: !table.available } : table
    ));
  };

  const toggleMenuItemAvailability = (itemId) => {
    setMenuItems(menuItems.map(item =>
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
  };

  const getTotalSales = () => {
    return dailySales.reduce((total, day) => total + day.amount, 0).toFixed(2);
  };

  const getActiveOrders = () => {
    return orders.filter(order => order.status !== 'completed').length;
  };

  const getAvailableTables = () => {
    return tables.filter(table => table.available).length;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Restaurant Admin</h1>
        </div>
        <nav className="mt-6">
          <div
            className={`px-6 py-3 cursor-pointer flex items-center space-x-3 ${
              activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </div>
          <div
            className={`px-6 py-3 cursor-pointer flex items-center space-x-3 ${
              activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span>Orders</span>
          </div>
          <div
            className={`px-6 py-3 cursor-pointer flex items-center space-x-3 ${
              activeTab === 'tables' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('tables')}
          >
            <Users className="w-5 h-5" />
            <span>Tables</span>
          </div>
          <div
            className={`px-6 py-3 cursor-pointer flex items-center space-x-3 ${
              activeTab === 'menu' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('menu')}
          >
            <Pizza className="w-5 h-5" />
            <span>Menu</span>
          </div>
          <div
            className={`px-6 py-3 cursor-pointer flex items-center space-x-3 ${
              activeTab === 'staff' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('staff')}
          >
            <UserCircle className="w-5 h-5" />
            <span>Staff</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            dailySales={dailySales}
            getTotalSales={getTotalSales}
            getActiveOrders={getActiveOrders}
            getAvailableTables={getAvailableTables}
            menuItemsCount={menuItems.length}
          />
        )}
        {activeTab === 'orders' && (
          <Orders
            orders={orders}
            updateOrderStatus={updateOrderStatus}
          />
        )}
        {activeTab === 'tables' && (
          <Tables
            tables={tables}
            toggleTableAvailability={toggleTableAvailability}
          />
        )}
        {activeTab === 'menu' && (
          <Menu
            menuItems={menuItems}
            toggleMenuItemAvailability={toggleMenuItemAvailability}
          />
        )}
        {activeTab === 'staff' && (
          <Staff
            staff={staff}
          />
        )}
      </div>
    </div>
  );
}

export default Admin
