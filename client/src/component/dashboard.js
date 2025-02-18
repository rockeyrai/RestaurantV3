import React from 'react';
import { DollarSign, ChefHat, Users, UtensilsCrossed } from 'lucide-react';

const Dashboard = ({
  dailySales,
  getTotalSales,
  getActiveOrders,
  getAvailableTables,
  menuItemsCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Summary Cards */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Total Sales (Week)</h3>
          <DollarSign className="w-6 h-6 text-green-500" />
        </div>
        <p className="text-2xl font-bold">${getTotalSales()}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Active Orders</h3>
          <ChefHat className="w-6 h-6 text-orange-500" />
        </div>
        <p className="text-2xl font-bold">{getActiveOrders()}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Available Tables</h3>
          <Users className="w-6 h-6 text-blue-500" />
        </div>
        <p className="text-2xl font-bold">{getAvailableTables()}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Menu Items</h3>
          <UtensilsCrossed className="w-6 h-6 text-purple-500" />
        </div>
        <p className="text-2xl font-bold">{menuItemsCount}</p>
      </div>

      {/* Sales Chart */}
      <div className="col-span-full bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Weekly Sales</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {dailySales.map((day, index) => (
            <div key={index} className="flex flex-col items-center w-full">
              <div 
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${(day.amount / 2000) * 100}%` }}
              ></div>
              <p className="text-sm text-gray-600 mt-2">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
