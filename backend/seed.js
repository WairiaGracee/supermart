import dotenv from 'dotenv';

dotenv.config();

import { Branch, Product, syncDatabase, sequelize } from './src/models/index.js';

const seedDatabase = async () => {
  try {
    // Sync database (creates tables if they don't exist)
    await syncDatabase({ force: true });
    console.log('Database synchronized');

    // Clear existing data
    await Branch.destroy({ where: {} });
    await Product.destroy({ where: {} });
    console.log('Cleared existing data');

    const branches = [
      { name: 'Nairobi HQ', location: 'Nairobi CBD', isHeadquarter: true },
      { name: 'Kisumu', location: 'Kisumu Town', isHeadquarter: false },
      { name: 'Mombasa', location: 'Mombasa Town', isHeadquarter: false },
      { name: 'Nakuru', location: 'Nakuru Town', isHeadquarter: false },
      { name: 'Eldoret', location: 'Eldoret Town', isHeadquarter: false },
    ];

    const createdBranches = await Branch.bulkCreate(branches);
    console.log(`Created ${createdBranches.length} branches`);

    const products = [
      { name: 'Coke', price: 150, description: 'Classic Coca Cola' },
      { name: 'Fanta', price: 150, description: 'Fanta Soft Drink' },
      { name: 'Sprite', price: 150, description: 'Sprite Lemonade' },
    ];

    const createdProducts = await Product.bulkCreate(products);
    console.log(`Created ${createdProducts.length} products`);

    console.log('\nDatabase seeded successfully!');
    console.log('\nBranches:');
    createdBranches.forEach((b) => console.log(`  - ${b.name} (${b.location})`));
    console.log('\nProducts:');
    createdProducts.forEach((p) => console.log(`  - ${p.name} (KES ${p.price})`));

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
