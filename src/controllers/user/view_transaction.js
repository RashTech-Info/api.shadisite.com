const Transaction = require("../../model/transaction");

exports.View_transaction = async (req, res) => {
  try {
    let data = await Transaction.find();

    if (data.length > 0) {
      return res.status(200).json({
        data: data,
        message: "All Transactions",
        success: true,
      });
    } else {
      return res.status(404).json({
        data: [],
        message: "No Transactions Found",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({
      data: [],
      message: "Internal Server Error",
      success: false,
    });
  }
};
