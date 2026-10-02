const express = require('express');
const db = require('../db');
const { sendInvoiceEmail } = require('../services/mailer');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, number, customer_id, amount, currency, status, created_at FROM invoices ORDER BY created_at DESC LIMIT 100'
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM invoices WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { customer_id, amount, currency = 'USD' } = req.body;
    const { rows } = await db.query(
      `INSERT INTO invoices (customer_id, amount, currency, status)
       VALUES ($1, $2, $3, 'draft') RETURNING *`,
      [customer_id, amount, currency]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.post('/:id/send', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT i.*, c.email FROM invoices i JOIN customers c ON c.id = i.customer_id WHERE i.id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'not found' });
    await sendInvoiceEmail(rows[0].email, rows[0]);
    await db.query(`UPDATE invoices SET status = 'sent' WHERE id = $1`, [req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
