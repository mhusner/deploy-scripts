const express = require('express');
const pino = require('pino');
const config = require('./config');
const { requireAuth } = require('./auth');
const invoices = require('./routes/invoices');

const log = pino({ level: config.logLevel });
const app = express();

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', env: config.env }));
app.use('/api/invoices', requireAuth, invoices);

app.use((err, req, res, next) => {
  log.error(err);
  res.status(500).json({ error: 'internal error' });
});

app.listen(config.port, () => log.info(`billing-service listening on :${config.port}`));
