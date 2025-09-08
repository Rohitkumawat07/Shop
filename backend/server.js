const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const Product = require('./models/Product');

const app = express();

app.use(cors({
  origin: "https://shop-4f26.vercel.app",
  credentials: true
}));

app.use(express.json());

// ✅ MongoDB connect
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// ✅ Sample products
const sampleProducts = [
  { name: 'Smartphone X1', description: 'Latest smartphone with advanced features', price: 699, category: 'Electronics', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
  { name: 'Laptop Pro', description: 'High-performance laptop for professionals', price: 1299, category: 'Electronics', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
  { name: 'Running Shoes', description: 'Comfortable running shoes for all terrains', price: 129, category: 'Sports', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { name: 'Coffee Maker', description: 'Premium coffee maker for home use', price: 89, category: 'Home', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400' },
  { name: 'Wireless Headphones', description: 'Noise-cancelling wireless headphones', price: 249, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { name: 'Fitness Tracker', description: 'Smart fitness tracker with heart rate monitor', price: 199, category: 'Sports', image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400' }
];

// ✅ Initialize sample data
async function initializeData() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(sampleProducts);
      console.log('Sample products added to database');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  initializeData();
});

// ✅ PORT setup
const PORT = process.env.PORT || 5000;

// Local + Render
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// ✅ Export (for Vercel)
module.exports = app;
