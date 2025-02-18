/**
 * @typedef {Object} MenuItem
 * @property {number} menu_item_id
 * @property {string} name
 * @property {string} description
 * @property {number} original_price
 * @property {number} final_price
 * @property {number} discount_percentage
 * @property {string} offer_start_date
 * @property {string} offer_end_date
 * @property {string} category_name
 * @property {boolean} availability
 * @property {string[]} tags
 * @property {string[]} image_urls
 */

/**
 * @typedef {Object} Category
 * @property {number} category_id
 * @property {string} name
 */



export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

export interface Table {
  id: number;
  table_number: number;
  seats: number;
  available: boolean;
  reservation?: {
    customerName: string;
    time: string;
  };
}

export interface Order {
  id: number;
  table: number;
  items: { name: string; quantity: number; price: number; }[];
  total: number;
  status: 'pending' | 'preparing' | 'served' | 'completed';
  timestamp: string;
}

export interface DailySales {
  date: string;
  amount: number;
}

export interface Staff {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role: 'manager' | 'chef' | 'waiter' | 'cashier';
  schedule?: StaffSchedule[];
}

export interface StaffSchedule {
  id: number;
  staff_id: number;
  shift_start: string;
  shift_end: string;
}
