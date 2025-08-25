import express from "express";
import { totalsalespermonth , numberoforderpercustomer, topsellingproducts, averageOrderValue } from "../controllers/report.controllers.js";

const reportrouter = express.Router()

reportrouter.route("/totalsalesreports").post(totalsalespermonth)
reportrouter.route("/orderpercustomer").post( numberoforderpercustomer )
reportrouter.route("/topsellingproducts").post( topsellingproducts )
reportrouter.route("/averageordervalue").post( averageOrderValue  )
export default reportrouter