const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },

  userEmail: {
    type: String,
    required: true,
  },
  order_id: {
    type: String,
  },
  payment_id: {
    type: String,
  },
  paymentStatus: {
    type: String,
  },
  userName: {
    type: String,
    required: true,
  },
  template_id: {
    type: String,
    required: true,
  },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
