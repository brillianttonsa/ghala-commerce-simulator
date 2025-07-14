import pool from "../db/db.js"

export const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, m.name as merchant_name, m.email as merchant_email 
      FROM orders o 
      JOIN merchants m ON o.merchant_id = m.id 
      ORDER BY o.created_at DESC
    `)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}

export const createOrder = async (req, res) => {
  const { merchant_id, customer_name, customer_email, product_name, total_amount } = req.body

  try {
    const result = await pool.query(
      "INSERT INTO orders (merchant_id, customer_name, customer_email, product_name, total_amount, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [merchant_id, customer_name, customer_email, product_name, total_amount, "pending"],
    )

    // Simulate payment status
    setTimeout(async () => {
      try {
        const randomOutcome = Math.random() > 0.2 ? "paid" : "failed"
        await pool.query(
          "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
          [randomOutcome, result.rows[0].id]
        )
        console.log(`Order ${result.rows[0].id} updated to ${randomOutcome}`)
      } catch (err) {
        console.error("Error in automatic payment update:", err)
      }
    }, 5000)

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}

export const confirmPayment = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  try {
    const result = await pool.query(
      "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
