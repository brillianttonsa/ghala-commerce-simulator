import express from "express"
import {
  getAllOrders,
  createOrder,
  confirmPayment,
} from "../controllers/orderController.js"

const router = express.Router()

router.get("/", getAllOrders)
router.post("/", createOrder)
router.post("/:id/confirm-payment", confirmPayment)

export default router
