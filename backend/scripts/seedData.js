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
        price: 500,
        discount: 10,
        stock: 50,
        description: 'The first book in the Harry Potter series. Follow Harry as he discovers he is a wizard and begins his journey at Hogwarts School of Witchcraft and Wizardry.',
        coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
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
        price: 600,
        discount: 0,
        stock: 30,
        description: 'A horror novel about a writer who takes a job as an off-season caretaker at an isolated hotel.',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
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
        price: 400,
        discount: 15,
        stock: 75,
        description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet.',
        coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
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
        description: 'A dystopian social science fiction novel about totalitarian control and surveillance.',
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        publisher: 'Secker & Warburg',
        publishYear: 1949,
        pages: 328,
        language: 'English',
        format: 'Paperback',
        featured: true,
        bestSeller: true,
      },
      {
        title: 'Murder on the Orient Express',
        author: authors[4]._id,
        category: categories[3]._id,
        isbn: '978-0062693662',
        price: 350,
        discount: 0,
        stock: 25,
        description: 'A detective novel featuring Hercule Poirot investigating a murder on a train.',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        publisher: 'Collins Crime Club',
        publishYear: 1934,
        pages: 256,
        language: 'English',
        format: 'Paperback',
      },
      {
        title: 'The Da Vinci Code',
        author: authors[5]._id,
        category: categories[3]._id,
        isbn: '978-0307474278',
        price: 550,
        discount: 20,
        stock: 35,
        description: 'A mystery thriller novel about a murder in the Louvre Museum and a conspiracy involving the Catholic Church.',
        coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
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
        description: 'A philosophical novel about a young Andalusian shepherd who travels from Spain to Egypt in search of treasure.',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
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
        description: 'A self-help book that offers a counterintuitive approach to living a good life.',
        coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
        publisher: 'HarperOne',
        publishYear: 2016,
        pages: 224,
        language: 'English',
        format: 'Hardcover',
        bestSeller: true,
      },
      {
        title: 'To Kill a Mockingbird',
        author: authors[0]._id, // Using existing author
        category: categories[0]._id,
        isbn: '978-0061120084',
        price: 360,
        discount: 12,
        stock: 55,
        description: 'A novel about racial inequality and loss of innocence in the American South.',
        coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        publisher: 'J.B. Lippincott & Co.',
        publishYear: 1960,
        pages: 376,
        language: 'English',
        format: 'Paperback',
      },
      {
        title: 'The Great Gatsby',
        author: authors[0]._id,
        category: categories[0]._id,
        isbn: '978-0743273565',
        price: 380,
        discount: 8,
        stock: 42,
        description: 'A novel about the American Dream set in the Jazz Age.',
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        publisher: 'Charles Scribner\'s Sons',
        publishYear: 1925,
        pages: 180,
        language: 'English',
        format: 'Paperback',
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: authors[0]._id,
        category: categories[1]._id,
        isbn: '978-0062316097',
        price: 620,
        discount: 15,
        stock: 38,
        description: 'A book that explores how Homo sapiens came to dominate the world.',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        publisher: 'Harper',
        publishYear: 2011,
        pages: 443,
        language: 'English',
        format: 'Hardcover',
        featured: true,
      },
      {
        title: 'Dune',
        author: authors[1]._id,
        category: categories[2]._id,
        isbn: '978-0441013593',
        price: 650,
        discount: 0,
        stock: 28,
        description: 'An epic science fiction novel set on the desert planet Arrakis.',
        coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
        publisher: 'Chilton Books',
        publishYear: 1965,
        pages: 688,
        language: 'English',
        format: 'Paperback',
        bestSeller: true,
      },
      {
        title: 'The Catcher in the Rye',
        author: authors[0]._id,
        category: categories[0]._id,
        isbn: '978-0316769488',
        price: 420,
        discount: 5,
        stock: 40,
        description: 'A controversial novel about teenage rebellion and alienation.',
        coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
        publisher: 'Little, Brown and Company',
        publishYear: 1951,
        pages: 277,
        language: 'English',
        format: 'Paperback',
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
        description: 'A comprehensive guide to breaking bad habits and adopting good ones.',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        publisher: 'Avery',
        publishYear: 2018,
        pages: 320,
        language: 'English',
        format: 'Hardcover',
        bestSeller: true,
      },
      {
        title: 'Educated',
        author: authors[0]._id,
        category: categories[5]._id,
        isbn: '978-0399590504',
        price: 520,
        discount: 0,
        stock: 35,
        description: 'A memoir about a woman who grows up in a survivalist family and eventually gets a PhD from Cambridge.',
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        publisher: 'Random House',
        publishYear: 2018,
        pages: 334,
        language: 'English',
        format: 'Paperback',
        featured: true,
      },
      {
        title: 'The Midnight Library',
        author: authors[2]._id,
        category: categories[0]._id,
        isbn: '978-0525559474',
        price: 480,
        discount: 15,
        stock: 45,
        description: 'A novel about a woman who finds herself in a library between life and death, able to live out different versions of her life.',
        coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        publisher: 'Viking',
        publishYear: 2020,
        pages: 288,
        language: 'English',
        format: 'Hardcover',
        bestSeller: true,
      },
      {
        title: 'Thinking, Fast and Slow',
        author: authors[0]._id,
        category: categories[1]._id,
        isbn: '978-0374533557',
        price: 620,
        discount: 5,
        stock: 30,
        description: 'A groundbreaking book about how we think, make decisions, and the two systems that drive the way we think.',
        coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
        publisher: 'Farrar, Straus and Giroux',
        publishYear: 2011,
        pages: 499,
        language: 'English',
        format: 'Paperback',
        featured: true,
      },
      {
        title: 'The Seven Husbands of Evelyn Hugo',
        author: authors[2]._id,
        category: categories[0]._id,
        isbn: '978-1250859235',
        price: 550,
        discount: 10,
        stock: 40,
        description: 'A captivating novel about a reclusive Hollywood icon who reveals her life story to a young journalist.',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        publisher: 'Atria Books',
        publishYear: 2017,
        pages: 400,
        language: 'English',
        format: 'Hardcover',
        bestSeller: true,
      },
      {
        title: 'Becoming',
        author: authors[0]._id,
        category: categories[5]._id,
        isbn: '978-1524763138',
        price: 580,
        discount: 0,
        stock: 50,
        description: 'The memoir of former First Lady Michelle Obama, sharing her life story and experiences.',
        coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
        publisher: 'Crown',
        publishYear: 2018,
        pages: 448,
        language: 'English',
        format: 'Paperback',
        featured: true,
      },
      {
        title: 'The Silent Patient',
        author: authors[4]._id,
        category: categories[3]._id,
        isbn: '978-1250301697',
        price: 450,
        discount: 15,
        stock: 35,
        description: 'A psychological thriller about a woman who refuses to speak after allegedly murdering her husband.',
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        publisher: 'Celadon Books',
        publishYear: 2019,
        pages: 336,
        language: 'English',
        format: 'Hardcover',
        bestSeller: true,
      },
      {
        title: 'गोदान (Godaan)',
        author: authors[0]._id, // Assigning to existing author
        category: categories[0]._id,
        isbn: '978-8126712345',
        price: 350,
        discount: 10,
        stock: 40,
        description: 'A classic Hindi novel by Munshi Premchand about rural life and social issues in India.',
        coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        publisher: 'Loki Books',
        publishYear: 1936,
        pages: 320,
        language: 'Hindi',
        format: 'Paperback',
        featured: true,
      },
      {
        title: 'रामायण (Ramayana)',
        author: authors[1]._id,
        category: categories[6]._id, // Mythology
        isbn: '978-8126712346',
        price: 600,
        discount: 0,
        stock: 30,
        description: 'The epic tale of Lord Rama, Sita, and the battle against evil, in Hindi.',
        coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
        publisher: 'Gita Press',
        publishYear: -500, // Ancient
        pages: 500,
        language: 'Hindi',
        format: 'Hardcover',
        bestSeller: true,
      },
      {
        title: 'गीतांजलि (Gitanjali)',
        author: authors[2]._id,
        category: categories[8]._id, // Poetry
        isbn: '978-8126712347',
        price: 250,
        discount: 5,
        stock: 50,
        description: 'A collection of poems by Rabindranath Tagore, winner of the Nobel Prize in Literature.',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        publisher: 'Macmillan',
        publishYear: 1910,
        pages: 150,
        language: 'Hindi',
        format: 'Paperback',
        featured: true,
      },
      {
        title: 'महाभारत (Mahabharata)',
        author: authors[3]._id,
        category: categories[6]._id,
        isbn: '978-8126712348',
        price: 800,
        discount: 15,
        stock: 20,
        description: 'The great epic of India, containing the story of the Kauravas and Pandavas.',
        coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
        publisher: 'Gita Press',
        publishYear: -400,
        pages: 800,
        language: 'Hindi',
        format: 'Hardcover',
        bestSeller: true,
      },
      {
        title: 'गुलजार के गीत (Gulzar Ke Geet)',
        author: authors[4]._id,
        category: categories[8]._id,
        isbn: '978-8126712349',
        price: 400,
        discount: 0,
        stock: 35,
        description: 'A collection of lyrics and poems by the renowned poet and lyricist Gulzar.',
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        publisher: 'Rajkamal Prakashan',
        publishYear: 2000,
        pages: 200,
        language: 'Hindi',
        format: 'Paperback',
        featured: true,
      },
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

