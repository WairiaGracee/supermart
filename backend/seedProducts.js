// backend/seed-products.js
// Run this to add products with images to your database
// Uses ES Modules (import/export)

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supermarket')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ Failed to connect:', err);
    process.exit(1);
  });

// Product Schema with image
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String, // URL to product image
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Product Data with Image URLs
const products = [
  {
    name: 'Coca-Cola',
    description: 'Ice-cold Coca-Cola 500ml bottle',
    price: 150,
    category: 'Soft Drinks',
    image: 'https://images.unsplash.com/photo-1554866585-e1d8d3f61c5e?w=500&h=500&fit=crop'
  },
  {
    name: 'Fanta Orange',
    description: 'Refreshing Fanta Orange 500ml',
    price: 150,
    category: 'Soft Drinks',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=500&fit=crop'
  },
  {
    name: 'Sprite',
    description: 'Crisp Sprite Lemon-Lime 500ml',
    price: 150,
    category: 'Soft Drinks',
    image: 'https://images.unsplash.com/photo-1554866585-e1d8d3f61c5e?w=500&h=500&fit=crop'
  },
  {
    name: 'Fanta Grape',
    description: 'Delicious Fanta Grape 500ml',
    price: 150,
    category: 'Soft Drinks',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=500&fit=crop'
  },
  {
    name: 'Pepsi',
    description: 'Classic Pepsi 500ml bottle',
    price: 150,
    category: 'Soft Drinks',
    image: 'https://images.unsplash.com/photo-1554866585-e1d8d3f61c5e?w=500&h=500&fit=crop'
  },
  {
    name: 'Mountain Dew',
    description: 'Energizing Mountain Dew 500ml',
    price: 180,
    category: 'Soft Drinks',
    image: 'https://images.unsplash.com/photo-1600788148184-7fdde50b5837?w=500&h=500&fit=crop'
  },
  {
    name: 'Minute Maid Orange',
    description: 'Minute Maid Orange Juice 500ml',
    price: 200,
    category: 'Juices',
    image: 'https://images.unsplash.com/photo-1600788148184-7fdde50b5837?w=500&h=500&fit=crop'
  },
  {
    name: 'Tropika Mango',
    description: 'Tropical Tropika Mango 500ml',
    price: 180,
    category: 'Juices',
    image: 'https://images.unsplash.com/photo-1600788148184-7fdde50b5837?w=500&h=500&fit=crop'
  }
];

async function seedProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('✅ Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log(`✅ Created ${products.length} products with images`);

    // Show created products
    const allProducts = await Product.find();
    console.log('\n📦 Products in Database:');
    allProducts.forEach(p => {
      console.log(`   - ${p.name}: KES ${p.price}`);
    });

    console.log('\n✅ Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();