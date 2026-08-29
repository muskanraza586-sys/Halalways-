const cors = require('cors');
require('dotenv').config();

const express = require('express');
const Razorpay = require('razorpay');

const app = express();
app.use(cors({
  origin: "https://halalways-cd62b.web.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.options("*", cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'HALALWAYS Razorpay server working!' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('HALALWAYS server running on port 3000');
});

app.post('/api/create-order', async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (![500, 1000, 1500].includes(amount)) {
      return res.status(400).json({ error: 'Invalid course amount' });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: 'halalways_' + Date.now()
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create payment order' });
  }
});
