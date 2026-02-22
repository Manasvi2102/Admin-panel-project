import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { mongoDBURL } from '../config.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Author } from '../models/Author.js';
import { Book } from '../models/Book.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoDBURL);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Author.deleteMany({});
    await Book.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Categories
    const customer1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      role: 'user',
      phone: '+1234567891',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
    });

    const customer2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password',
      role: 'user',
      phone: '+1234567892',
    });

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890',
    });

    console.log('👥 Created users');

    // Create Categories
    const categoryData = [
      { name: 'Fiction', description: 'Fictional stories and novels' },
      { name: 'Non-Fiction', description: 'Real-world facts and information' },
      { name: 'Science Fiction', description: 'Sci-fi and fantasy books' },
      { name: 'Mystery & Thriller', description: 'Mystery and thriller novels' },
      { name: 'Romance', description: 'Romance novels' },
      { name: 'Biography', description: 'Biographies and autobiographies' },
      { name: 'History', description: 'Historical books' },
      { name: 'Self-Help', description: 'Self-improvement books' },
      { name: 'Business', description: 'Business and entrepreneurship' },
      { name: 'Technology', description: 'Tech and programming books' },
    ];

    const categories = [];
    for (const cat of categoryData) {
      const category = await Category.create(cat);
      categories.push(category);
    }

    console.log('📚 Created categories');

    // Create Authors
    const authors = await Author.insertMany([
      {
        name: 'J.K. Rowling',
        bio: 'British author, best known for the Harry Potter series',
        nationality: 'British',
        birthDate: '1965-07-31',
      },
      {
        name: 'Stephen King',
        bio: 'American author of horror, supernatural fiction, suspense, and fantasy novels',
        nationality: 'American',
        birthDate: '1947-09-21',
      },
      {
        name: 'Jane Austen',
        bio: 'English novelist known primarily for her six major novels',
        nationality: 'British',
        birthDate: '1775-12-16',
      },
      {
        name: 'George Orwell',
        bio: 'English novelist, essayist, journalist and critic',
        nationality: 'British',
        birthDate: '1903-06-25',
      },
      {
        name: 'Agatha Christie',
        bio: 'English writer known for her detective novels',
        nationality: 'British',
        birthDate: '1890-09-15',
      },
      {
        name: 'Dan Brown',
        bio: 'American author best known for thriller novels',
        nationality: 'American',
        birthDate: '1964-06-22',
      },
      {
        name: 'Paulo Coelho',
        bio: 'Brazilian lyricist and novelist',
        nationality: 'Brazilian',
        birthDate: '1947-08-24',
      },
      {
        name: 'Mark Manson',
        bio: 'American self-help author and blogger',
        nationality: 'American',
        birthDate: '1984-03-09',
      },
    ]);

    console.log('✍️  Created authors');

    // Create Books
    const books = await Book.insertMany([
      {
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: authors[0]._id,
        category: categories[0]._id,
        isbn: '978-0747532699',
        price: 599,
        discount: 10,
        stock: 50,
        description: 'The first book in the Harry Potter series. Discover the magic that changed literature forever.',
        coverImage: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?auto=format&fit=crop&q=80&w=800',
        publisher: 'Bloomsbury',
        publishYear: 1997,
        pages: 223,
        language: 'English',
        format: 'Paperback',
        featured: true,
        bestSeller: true,
      },
      {
        title: 'The Shining',
        author: authors[1]._id,
        category: categories[3]._id,
        isbn: '978-0307743657',
        price: 649,
        discount: 0,
        stock: 30,
        description: 'Jack Torrance\'s new job at the Overlook Hotel is the perfect chance for a fresh start.',
        coverImage: 'https://images.unsplash.com/photo-1543004218-ee141104e14f?auto=format&fit=crop&q=80&w=800',
        publisher: 'Doubleday',
        publishYear: 1977,
        pages: 447,
        language: 'English',
        format: 'Hardcover',
        featured: true,
      },
      {
        title: 'Pride and Prejudice',
        author: authors[2]._id,
        category: categories[4]._id,
        isbn: '978-0141439518',
        price: 499,
        discount: 15,
        stock: 75,
        description: 'A romantic novel that follows the character development of Elizabeth Bennet.',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
        publisher: 'T. Egerton',
        publishYear: 1813,
        pages: 432,
        language: 'English',
        format: 'Paperback',
        bestSeller: true,
      },
      {
        title: '1984',
        author: authors[3]._id,
        category: categories[0]._id,
        isbn: '978-0452284234',
        price: 450,
        discount: 5,
        stock: 40,
        description: 'The definitive dystopian novel about totalitarianism and surveillance.',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
        publisher: 'Secker & Warburg',
        publishYear: 1949,
        pages: 328,
        language: 'English',
        format: 'Paperback',
        featured: true,
        bestSeller: true,
      },
      {
        title: 'The Da Vinci Code',
        author: authors[5]._id,
        category: categories[3]._id,
        isbn: '978-0307474278',
        price: 550,
        discount: 20,
        stock: 35,
        description: 'A conspiracy thriller that challenges history and faith.',
        coverImage: 'https://images.unsplash.com/photo-1511108690759-001951915e7f?auto=format&fit=crop&q=80&w=800',
        publisher: 'Doubleday',
        publishYear: 2003,
        pages: 489,
        language: 'English',
        format: 'Hardcover',
        bestSeller: true,
      },
      {
        title: 'The Alchemist',
        author: authors[6]._id,
        category: categories[0]._id,
        isbn: '978-0061122415',
        price: 480,
        discount: 10,
        stock: 60,
        description: 'A beautiful story about finding your treasure and following your dreams.',
        coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800',
        publisher: 'HarperOne',
        publishYear: 1988,
        pages: 163,
        language: 'English',
        format: 'Paperback',
        featured: true,
        bestSeller: true,
      },
      {
        title: 'The Subtle Art of Not Giving a F*ck',
        author: authors[7]._id,
        category: categories[7]._id,
        isbn: '978-0062457714',
        price: 580,
        discount: 0,
        stock: 45,
        description: 'A counterintuitive approach to living a good life.',
        coverImage: 'https://images.unsplash.com/photo-1491843351663-8511e0dc450e?auto=format&fit=crop&q=80&w=800',
        publisher: 'HarperOne',
        publishYear: 2016,
        pages: 224,
        language: 'English',
        format: 'Hardcover',
        bestSeller: true,
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: authors[0]._id,
        category: categories[1]._id,
        isbn: '978-0062316097',
        price: 620,
        discount: 15,
        stock: 38,
        description: 'How Homo sapiens came to dominate the world.',
        coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d03da42d?auto=format&fit=crop&q=80&w=800',
        publisher: 'Harper',
        publishYear: 2011,
        pages: 443,
        language: 'English',
        format: 'Hardcover',
        featured: true,
      },
      {
        title: 'Atomic Habits',
        author: authors[7]._id,
        category: categories[7]._id,
        isbn: '978-0735211292',
        price: 550,
        discount: 10,
        stock: 50,
        description: 'Small changes that lead to remarkable results.',
        coverImage: 'https://images.unsplash.com/photo-1614849963640-9cc74b2a826f?auto=format&fit=crop&q=80&w=800',
        publisher: 'Avery',
        publishYear: 2018,
        pages: 320,
        language: 'English',
        format: 'Hardcover',
        bestSeller: true,
      },
      {
        title: 'The Midnight Library',
        author: authors[2]._id,
        category: categories[0]._id,
        isbn: '978-0525559474',
        price: 480,
        discount: 15,
        stock: 45,
        description: 'Between life and death there is a library.',
        coverImage: 'https://images.unsplash.com/photo-1507733593714-724ee242770f?auto=format&fit=crop&q=80&w=800',
        publisher: 'Viking',
        publishYear: 2020,
        pages: 288,
        language: 'English',
        format: 'Hardcover',
        bestSeller: true,
      },
      {
        title: 'The Silent Patient',
        author: authors[4]._id,
        category: categories[3]._id,
        isbn: '978-1250301697',
        price: 450,
        discount: 15,
        stock: 35,
        description: 'A shocking psychological thriller about a woman\'s act of violence against her husband.',
        coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800',
        publisher: 'Celadon Books',
        publishYear: 2019,
        pages: 336,
        language: 'English',
        format: 'Hardcover',
        bestSeller: true,
      },
      {
        title: 'गोदान (Godaan)',
        author: authors[0]._id,
        category: categories[0]._id,
        isbn: '978-8126712345',
        price: 350,
        discount: 10,
        stock: 40,
        description: 'A classic Hindi novel by Munshi Premchand about rural life in India.',
        coverImage: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800',
        publisher: 'Loki Books',
        publishYear: 1936,
        pages: 320,
        language: 'Hindi',
        format: 'Paperback',
        featured: true,
      }
    ]);


    // Add some reviews
    books[0].reviews.push(
      {
        user: customer1._id,
        rating: 5,
        comment: 'Amazing book! A must-read for everyone.',
      },
      {
        user: customer2._id,
        rating: 4,
        comment: 'Great story, loved it!',
      }
    );
    books[0].calculateRatings();
    await books[0].save();

    books[3].reviews.push({
      user: customer1._id,
      rating: 5,
      comment: 'A classic that everyone should read.',
    });
    books[3].calculateRatings();
    await books[3].save();

    console.log('📖 Created books');

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: john@example.com / password');
    console.log('User: jane@example.com / password');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

