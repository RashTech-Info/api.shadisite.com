let express = require("express");
const {
  View_transaction
} = require("../../controllers/user/view_transaction");
let router = express.Router();

router.get("/viewtransaction", View_transaction);

module.exports = router;
