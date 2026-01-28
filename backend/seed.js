import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Import models with correct paths
import User from './src/models/User.js';
import Product from './src/models/Product.js';
import Branch from './src/models/Branch.js';

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermarket_db';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    await Branch.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const branches = [
      { name: 'Nairobi HQ', location: 'Nairobi CBD', isHeadquarter: true },
      { name: 'Kisumu', location: 'Kisumu Town', isHeadquarter: false },
      { name: 'Mombasa', location: 'Mombasa Town', isHeadquarter: false },
      { name: 'Nakuru', location: 'Nakuru Town', isHeadquarter: false },
      { name: 'Eldoret', location: 'Eldoret Town', isHeadquarter: false },
    ];

    const createdBranches = await Branch.insertMany(branches);
    console.log(`✅ Created ${createdBranches.length} branches`);

    const products = [
      { name: 'Coke', price: 150, description: 'Classic Coca Cola' },
      { name: 'Fanta', price: 150, description: 'Fanta Soft Drink' },
      { name: 'Sprite', price: 150, description: 'Sprite Lemonade' },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('\n📊 Database seeded successfully!');
    console.log('\nBranches:');
    createdBranches.forEach((b) => console.log(`  - ${b.name} (${b.location})`));
    console.log('\nProducts:');
    createdProducts.forEach((p) => console.log(`  - ${p.name} (KES ${p.price})`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();