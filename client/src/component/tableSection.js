import React from 'react';

const Tables = ({ tables, toggleTableAvailability }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tables.map((table) => (
        <div key={table.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Table {table.table_number}</h3>
            <span className="text-sm text-gray-500">{table.seats} Seats</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className={`text-sm ${table.available ? 'text-green-600' : 'text-red-600'}`}>
              {table.available ? 'Available' : 'Occupied'}
            </div>
            {table.reservation && (
              <div className="text-sm text-gray-600">
  <span className="font-bold">Reserved by: </span>{table.reservation.customerName}<br />
  <span className="font-bold">Time: </span>{table.reservation.time}<br />
  <span className="font-bold">Group of: </span>{table.no_of_people}
</div>

            )}
            <button
              onClick={() => toggleTableAvailability(table.id)}
              className={`mt-4 px-4 py-2 rounded-md text-white ${
                table.available ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {table.available ? 'Mark as Occupied' : 'Mark as Available'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tables;
