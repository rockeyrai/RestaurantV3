'use client'
import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import { useRouter } from 'next/navigation';


function Admin () {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const router = useRouter()

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_FRONTEND_API,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useEffect(()=>{
    if(user.role !== "admin"){
      router.push("/")
    }else{
      fetchMenu()
      fetchOrder()
      fetchTables()
      
  // Initialize Socket.IO and listen for real-time updates
      const newSocket = io("http://localhost:8000"); // Replace with your server URL

      // Listen for 'tableUpdated' event
      newSocket.on("tableUpdated", () => {
        fetchTables(); // Fetch the latest tables when an update occurs
      });
  
      // Fetch initial table data when the component mounts
      fetchTables();
  
      return () => {
        newSocket.disconnect(); // Cleanup socket connection when component unmounts
      };
    }
  },[])

    const fetchMenu = async () => {
      try {
        const response = await api.get('/menu');
        const formattedData = response.data.map(item => ({
          id: item.menu_item_id,
          name: item.name,
          price: parseFloat(item.final_price),
          category: item.category_name,
          available: Boolean(item.availability),
          discount: parseFloat(item.discount_percentage),
        }));
        setMenuItems(formattedData);
      } catch (err) {
        setError("Failed to fetch menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchOrder = async () => {
      try {
        const response = await api.get('/admin/orders');
        const orderData =response.data.orders
        setOrders(orderData);
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  

  const fetchTables = async () => {
    try {
      const response = await api.get('/admin/tables');
      console.log(response.data);
      const data = response.data.map((table) => ({
        id: table.id,
        table_number: table.table_number,
        seats: table.seats,
        available: table.available,
        reservation: table.customer_name ? { customerName: table.customer_name, time: table.reserve_time } : null,
        reserve_date: table.reserve_date ? new Date(table.reserve_date).toLocaleString() : null, // Format the date
        no_of_people: table.no_of_people || 0,  // Handle null/undefined no_of_people
      }));
      setTables(data);
      console.log(data); // Log the formatted data
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };
    

  const [dailySales] = useState([
    { date: "2025-01-01", sale: 134 },
    { date: "2025-01-02", sale: 178 },
    { date: "2025-01-03", sale: 190 },
    { date: "2025-01-04", sale: 157 },
    { date: "2025-01-05", sale: 211 },
    { date: "2025-01-06", sale: 165 },
    { date: "2025-01-07", sale: 223 },
    { date: "2025-01-08", sale: 187 },
    { date: "2025-01-09", sale: 203 },
    { date: "2025-01-10", sale: 192 },
    { date: "2025-01-11", sale: 176 },
    { date: "2025-01-12", sale: 198 },
    { date: "2025-01-13", sale: 211 },
    { date: "2025-01-14", sale: 233 },
    { date: "2025-01-15", sale: 178 },
    { date: "2025-01-16", sale: 197 },
    { date: "2025-01-17", sale: 205 },
    { date: "2025-01-18", sale: 181 },
    { date: "2025-01-19", sale: 210 },
    { date: "2025-01-20", sale: 194 },
    { date: "2025-01-21", sale: 183 },
    { date: "2025-01-22", sale: 222 },
    { date: "2025-01-23", sale: 190 },
    { date: "2025-01-24", sale: 202 },
    { date: "2025-01-25", sale: 172 },
    { date: "2025-01-26", sale: 185 },
    { date: "2025-01-27", sale: 201 },
    { date: "2025-01-28", sale: 219 },
    { date: "2025-01-29", sale: 176 },
    { date: "2025-01-30", sale: 188 },
    { date: "2025-01-31", sale: 223 },
    { date: "2025-02-01", sale: 245 },
    { date: "2025-02-02", sale: 198 },
    { date: "2025-02-03", sale: 176 },
    { date: "2025-02-04", sale: 190 },
    { date: "2025-02-05", sale: 203 },
    { date: "2025-02-06", sale: 222 },
    { date: "2025-02-07", sale: 214 },
    { date: "2025-02-08", sale: 173 },
    { date: "2025-02-09", sale: 189 },
    { date: "2025-02-10", sale: 205 },
    { date: "2025-02-11", sale: 182 },
    { date: "2025-02-12", sale: 199 },
    { date: "2025-02-13", sale: 230 },
    { date: "2025-02-14", sale: 207 },
    { date: "2025-02-15", sale: 218 },
    { date: "2025-02-16", sale: 224 },
    { date: "2025-02-17", sale: 180 },
    { date: "2025-02-18", sale: 196 },
    { date: "2025-02-19", sale: 200 },
    { date: "2025-02-20", sale: 212 },
    { date: "2025-02-21", sale: 201 },
    { date: "2025-02-22", sale: 189 },
    { date: "2025-02-23", sale: 215 },
  ]);
  
  
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetachemployee = async () => {
      try {
        const response = await api.get('/employee');
        const transformedData = response.data.map(employee => ({
          id: employee.id,
          name: employee.name,
          email: employee.email,
          phone_number: employee.phone_number,
          role: employee.role,
          schedule: employee.schedule.map(schedule => ({
            id: schedule.id,
            staff_id: schedule.staff_id,
            shift_start: new Date(schedule.shift_start).toISOString().slice(0, 16).replace('T', ' '),
            shift_end: new Date(schedule.shift_end).toISOString().slice(0, 16).replace('T', ' ')
          }))
        }));
        console.log(`Transformed Employee Data: ${JSON.stringify(transformedData)}`);
        setStaff(transformedData);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetachemployee();
  }, []);


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
    return dailySales.reduce((total, day) => total + day.sale, 0).toFixed(2);
  };

  const getActiveOrders = () => {
    return orders.filter((order) => order.status !== 'completed').length;
  };
  
  console.log(getActiveOrders());
  

  console.log(getActiveOrders)
  const getAvailableTables = () => {
    return tables.filter(table => table.available).length ; 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
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
