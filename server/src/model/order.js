const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user_id: { type: Number, required: true }, 
  table_id: { type: Number },  // MySQL table ID (from Tables table)
  items: [{
    menu_item_id: { type: Number, required: true },
    quantity: { 
      type: Number, 
      required: true, 
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
      min: 1
    }
  }],  
  total_cost: { type: Number, required: true },
  status: { type: String, enum: ['in_progress', 'completed', 'pending'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Order', OrderSchema);