import pool from "../db/db.js"

export const getAllMerchants = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM merchants ORDER BY created_at DESC")
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}

export const getMerchantById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query("SELECT * FROM merchants WHERE id = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Merchant not found" })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}

export const createOrUpdateMerchant = async (req, res) => {
  const { name, email, payment_method, payment_config } = req.body
  try {
    const existingMerchant = await pool.query("SELECT * FROM merchants WHERE email = $1", [email])

    let result
    if (existingMerchant.rows.length > 0) {
      result = await pool.query(
        "UPDATE merchants SET name = $1, payment_method = $2, payment_config = $3, updated_at = CURRENT_TIMESTAMP WHERE email = $4 RETURNING *",
        [name, payment_method, JSON.stringify(payment_config), email],
      )
    } else {
      result = await pool.query(
        "INSERT INTO merchants (name, email, payment_method, payment_config) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, email, payment_method, JSON.stringify(payment_config)],
      )
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
