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
        await mongoose.connect(mongoDBURL);
        console.log('✅ Connected to MongoDB');

        await Category.deleteMany({});
        await Author.deleteMany({});
        await Book.deleteMany({});
        console.log('🗑️  Cleared existing data');

        const categoryData = [
            { name: 'Finance', description: 'Wealth and investing' },
            { name: 'Self-Help', description: 'Personal growth' },
            { name: 'Business', description: 'Entrepreneurship' },
            { name: 'Technology', description: 'Coding & AI' },
            { name: 'Fiction', description: 'Literature' },
            { name: 'Psychology', description: 'Behavior' },
            { name: 'Science', description: 'Nature' },
            { name: 'Biography', description: 'Life stories' },
            { name: 'Mystery', description: 'Thriller' },
            { name: 'Philosophy', description: 'Stoicism & Wisdom' },
            { name: 'History', description: 'Global events' },
            { name: 'Children', description: 'Kids books' }
        ];

        const categories = [];
        for (const cat of categoryData) {
            const c = await Category.create(cat);
            categories.push(c);
        }

        const authorData = [
            { name: 'Morgan Housel' }, { name: 'James Clear' }, { name: 'Robert Kiyosaki' },
            { name: 'Robin Sharma' }, { name: 'Cal Newport' }, { name: 'Viktor Frankl' },
            { name: 'Héctor García' }, { name: 'Peter Thiel' }, { name: 'Paulo Coelho' },
            { name: 'George Orwell' }, { name: 'J.K. Rowling' }, { name: 'Robert Greene' },
            { name: 'Yuval Noah Harari' }, { name: 'Simon Sinek' }, { name: 'Dale Carnegie' },
            { name: 'Ryan Holiday' }, { name: 'Mark Manson' }, { name: 'Nassim Taleb' },
            { name: 'Stephen King' }, { name: 'Agatha Christie' }, { name: 'Dan Brown' },
            { name: 'Elon Musk' }, { name: 'Steve Jobs' }, { name: 'Benjamin Graham' }
        ];

        const authors = await Author.insertMany(authorData);

        const booksData = [
            // CATEGORY 0: FINANCE
            { title: 'The Psychology of Money', author: authors[0]._id, category: categories[0]._id, isbn: 'FIN001', price: 399, discount: 10, stock: 100, description: 'Behavioral finance.', coverImage: 'https://images.unsplash.com/photo-1592492159418-39f319320569?q=80&w=800', publishYear: 2020, pages: 252, bestSeller: true, featured: true },
            { title: 'Rich Dad Poor Dad', author: authors[2]._id, category: categories[0]._id, isbn: 'FIN002', price: 499, discount: 20, stock: 80, description: 'Personal finance classic.', coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800', publishYear: 1997, pages: 336, bestSeller: true },
            { title: 'The Intelligent Investor', author: authors[23]._id, category: categories[0]._id, isbn: 'FIN003', price: 650, discount: 15, stock: 50, description: 'Value investing bible.', coverImage: 'https://images.unsplash.com/photo-1550565118-3a14e8d0386f?q=80&w=800', publishYear: 1949, pages: 640 },
            { title: 'The Little Book of Common Sense Investing', author: authors[23]._id, category: categories[0]._id, isbn: 'FIN004', price: 350, discount: 5, stock: 60, description: 'Index funds focus.', coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800', publishYear: 2007, pages: 216 },

            // CATEGORY 1: SELF-HELP
            { title: 'Atomic Habits', author: authors[1]._id, category: categories[1]._id, isbn: 'SH001', price: 550, discount: 15, stock: 120, description: 'Build better habits.', coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800', publishYear: 2018, pages: 320, bestSeller: true, featured: true },
            { title: 'The 5 AM Club', author: authors[3]._id, category: categories[1]._id, isbn: 'SH002', price: 450, discount: 5, stock: 65, description: 'Elite morning routine.', coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800', publishYear: 2018, pages: 336, featured: true },
            { title: 'Deep Work', author: authors[4]._id, category: categories[1]._id, isbn: 'SH003', price: 599, discount: 0, stock: 50, description: 'Focus in a distracted world.', coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800', publishYear: 2016, pages: 304, featured: true },
            { title: 'The Daily Stoic', author: authors[15]._id, category: categories[1]._id, isbn: 'SH004', price: 420, discount: 10, stock: 75, description: 'Wisdom on perseverance.', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800', publishYear: 2016, pages: 416, bestSeller: true },
            { title: 'Can\'t Hurt Me', author: authors[15]._id, category: categories[1]._id, isbn: 'SH005', price: 599, discount: 10, stock: 90, description: 'Endurance mindset.', coverImage: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=800', publishYear: 2018, pages: 364 },

            // CATEGORY 2: BUSINESS
            { title: 'Zero to One', author: authors[7]._id, category: categories[2]._id, isbn: 'BUS001', price: 480, discount: 10, stock: 95, description: 'Build the future.', coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800', publishYear: 2014, pages: 224, bestSeller: true },
            { title: 'Lean Startup', author: authors[7]._id, category: categories[2]._id, isbn: 'BUS002', price: 550, discount: 15, stock: 40, description: 'Modern entrepreneurship.', coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800', publishYear: 2011, pages: 336 },
            { title: 'Start With Why', author: authors[13]._id, category: categories[2]._id, isbn: 'BUS003', price: 420, discount: 5, stock: 60, description: 'Leadership purpose.', coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800', publishYear: 2009, pages: 256 },

            // CATEGORY 3: TECHNOLOGY
            { title: 'Clean Code', author: authors[4]._id, category: categories[3]._id, isbn: 'TECH001', price: 899, discount: 5, stock: 35, description: 'Craftsmanship.', coverImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800', publishYear: 2008, pages: 464, featured: true },
            { title: 'The Pragmatic Programmer', author: authors[4]._id, category: categories[3]._id, isbn: 'TECH002', price: 950, discount: 10, stock: 25, description: 'Developer journey.', coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800', publishYear: 1999, pages: 352 },
            { title: 'Grokking Algorithms', author: authors[4]._id, category: categories[3]._id, isbn: 'TECH003', price: 650, discount: 0, stock: 45, description: 'Visual algorithms guide.', coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800', publishYear: 2016, pages: 256 },

            // CATEGORY 4: FICTION
            { title: 'Harry Potter 1', author: authors[10]._id, category: categories[4]._id, isbn: 'FIC001', price: 499, discount: 10, stock: 200, description: 'Magical journey.', coverImage: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?q=80&w=800', publishYear: 1997, pages: 309, bestSeller: true, featured: true },
            { title: '1984', author: authors[9]._id, category: categories[4]._id, isbn: 'FIC002', price: 299, discount: 0, stock: 150, description: 'Dystopian world.', coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800', publishYear: 1949, pages: 328 },
            { title: 'The Alchemist', author: authors[8]._id, category: categories[4]._id, isbn: 'FIC003', price: 350, discount: 20, stock: 250, description: 'Personal legend.', coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800', publishYear: 1988, pages: 208, bestSeller: true, featured: true },
            { title: 'The Shining', author: authors[18]._id, category: categories[4]._id, isbn: 'FIC004', price: 450, discount: 10, stock: 65, description: 'Horror masterpiece.', coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800', publishYear: 1977, pages: 447 },
            { title: 'The Great Gatsby', author: authors[9]._id, category: categories[4]._id, isbn: 'FIC005', price: 380, discount: 5, stock: 50, description: 'American dream.', coverImage: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800', publishYear: 1925, pages: 180 },

            // CATEGORY 5: PSYCHOLOGY
            { title: 'Thinking, Fast and Slow', author: authors[5]._id, category: categories[5]._id, isbn: 'PSY001', price: 599, discount: 15, stock: 40, description: 'Human thought systems.', coverImage: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=800', publishYear: 2011, pages: 499, bestSeller: true },
            { title: 'Man\'s Search for Meaning', author: authors[5]._id, category: categories[5]._id, isbn: 'PSY002', price: 299, discount: 10, stock: 100, description: 'Finding purpose.', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800', publishYear: 1946, pages: 165, bestSeller: true, featured: true },

            // CATEGORY 6: SCIENCE
            { title: 'Sapiens', author: authors[12]._id, category: categories[6]._id, isbn: 'SCI001', price: 620, discount: 15, stock: 100, description: 'Brief history.', coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800', publishYear: 2011, pages: 443, bestSeller: true, featured: true },
            { title: 'Brief Answers to Big Questions', author: authors[12]._id, category: categories[6]._id, isbn: 'SCI002', price: 450, discount: 0, stock: 55, description: 'Hawking\'s final thoughts.', coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800', publishYear: 2018, pages: 256 },

            // CATEGORY 7: BIOGRAPHY
            { title: 'Elon Musk', author: authors[21]._id, category: categories[7]._id, isbn: 'BIO001', price: 799, discount: 10, stock: 60, description: 'SpaceX vision.', coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800', publishYear: 2015, pages: 400, featured: true },
            { title: 'Steve Jobs', author: authors[22]._id, category: categories[7]._id, isbn: 'BIO002', price: 699, discount: 15, stock: 45, description: 'Apple story.', coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800', publishYear: 2011, pages: 656, featured: true },

            // CATEGORY 8: MYSTERY
            { title: 'The Da Vinci Code', author: authors[20]._id, category: categories[8]._id, isbn: 'MYS001', price: 550, discount: 20, stock: 130, description: 'Conspiracy mystery.', coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800', publishYear: 2003, pages: 489, bestSeller: true },
            { title: 'And Then There Were None', author: authors[19]._id, category: categories[8]._id, isbn: 'MYS002', price: 350, discount: 10, stock: 80, description: 'Christie classic.', coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800', publishYear: 1939, pages: 272, bestSeller: true },

            // CATEGORY 9: PHILOSOPHY
            { title: 'Ikigai', author: authors[6]._id, category: categories[9]._id, isbn: 'PHI001', price: 450, discount: 25, stock: 150, description: 'Reason for being.', coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800', publishYear: 2017, pages: 208, featured: true, bestSeller: true },
            { title: 'Meditations', author: authors[15]._id, category: categories[9]._id, isbn: 'PHI002', price: 320, discount: 0, stock: 70, description: 'Marcus Aurelius.', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800', publishYear: 180, pages: 256, featured: true },

            // CATEGORY 10: HISTORY
            { title: 'Guns, Germs, and Steel', author: authors[12]._id, category: categories[10]._id, isbn: 'HIS001', price: 580, discount: 15, stock: 35, description: 'World development.', coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800', publishYear: 1997, pages: 480 },
            { title: 'The Silk Roads', author: authors[12]._id, category: categories[10]._id, isbn: 'HIS002', price: 620, discount: 5, stock: 40, description: 'Global trade path.', coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800', publishYear: 2015, pages: 656 },

            // CATEGORY 11: CHILDREN
            { title: 'The Little Prince', author: authors[10]._id, category: categories[11]._id, isbn: 'CHI001', price: 299, discount: 10, stock: 120, description: 'Wisdom for kids.', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800', publishYear: 1943, pages: 96, bestSeller: true },
            { title: 'Charlie and the Chocolate Factory', author: authors[10]._id, category: categories[11]._id, isbn: 'CHI002', price: 320, discount: 0, stock: 100, description: 'Magical factory.', coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800', publishYear: 1964, pages: 176 },

            // MORE RANDOM ADDITIONS TO HIT 40+
            { title: 'Blink', author: authors[5]._id, category: categories[5]._id, isbn: 'PSY003', price: 450, discount: 10, stock: 60, description: 'Snap judgments.', coverImage: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=800', publishYear: 2005, pages: 304 },
            { title: 'Outliers', author: authors[5]._id, category: categories[5]._id, isbn: 'PSY004', price: 499, discount: 5, stock: 55, description: 'Success story.', coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800', publishYear: 2008, pages: 320 },
            { title: 'The 4-Hour Workweek', author: authors[1]._id, category: categories[1]._id, isbn: 'SH006', price: 540, discount: 15, stock: 45, description: 'Lifestyle design.', coverImage: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=800', publishYear: 2007, pages: 308 },
            { title: 'Shoe Dog', author: authors[2]._id, category: categories[2]._id, isbn: 'BUS004', price: 580, discount: 20, stock: 50, description: 'Nike story.', coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800', publishYear: 2016, pages: 400, featured: true },
            { title: 'Originals', author: authors[2]._id, category: categories[2]._id, isbn: 'BUS005', price: 520, discount: 0, stock: 40, description: 'How non-conformists move the world.', coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800', publishYear: 2016, pages: 336 },
            { title: 'Principles', author: authors[0]._id, category: categories[0]._id, isbn: 'FIN005', price: 750, discount: 10, stock: 35, description: 'Ray Dalio life principles.', coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800', publishYear: 2017, pages: 592, featured: true },
        ];

        const books = await Book.insertMany(booksData);
        console.log(`📖 Success! Added ${books.length} Premium Books to MongoDB.`);

        const demoUser = await User.findOne({ email: 'john@example.com' });
        if (demoUser) {
            for (let b of books) {
                if (Math.random() > 0.5) {
                    b.reviews.push({ user: demoUser._id, rating: Math.floor(Math.random() * 2) + 4, comment: 'Absolutely immersive read. A staple for every intellectual bookshelf!' });
                    b.calculateRatings();
                    await b.save();
                }
            }
        }

        console.log('\n✅ Your database is now overflowing with high-quality artifacts!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during library expansion:', error);
        process.exit(1);
    }
};

seedData();
