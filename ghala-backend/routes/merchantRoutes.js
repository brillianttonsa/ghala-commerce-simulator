import express from "express"
import {
  getAllMerchants,
  getMerchantById,
  createOrUpdateMerchant,
} from "../controllers/merchantController.js"

const router = express.Router()

router.get("/", getAllMerchants)
router.get("/:id", getMerchantById)
router.post("/", createOrUpdateMerchant)

export default router
