# 📚 BookNest - Online Bookstore Management System

A complete, professional, full-stack online bookstore management system built with React, Node.js, Express, and MongoDB.

## 🎯 Project Overview

BookNest is a comprehensive web-based bookstore platform that centralizes inventory, sales, and customer interactions into one powerful system. It provides a modern, user-friendly interface for both administrators and customers to manage bookstore operations efficiently.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (Admin & Customer)
- Protected routes
- Secure password hashing

### 👤 Customer Features
- Browse books with advanced search and filters
- Detailed book information with reviews
- Shopping cart functionality
- Wishlist management
- Order placement and tracking
- User profile management
- Order history

### 🛠️ Admin Features
- Comprehensive dashboard with statistics
- Book management (Add, Edit, Delete)
- Category and Author management
- User management
- Order management and status updates
- Stock management with low stock alerts
- Sales analytics

### 📚 Book Management
- Book details (title, author, category, ISBN, price, stock, description)
- Book images
- Discounts and pricing
- Ratings and reviews
- Featured and bestseller flags
- Stock tracking

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
book store project/
├── backend/
│   ├── config.js              # Configuration
│   ├── index.js                # Server entry point
│   ├── models/                 # MongoDB models
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Category.js
│   │   ├── Author.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   └── Wishlist.js
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── authorRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middleware/             # Middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── asyncHandler.js
│   ├── utils/                  # Utilities
│   │   └── generateToken.js
│   └── scripts/                # Scripts
│       └── seedData.js
│
└── frontend/
    ├── src/
    │   ├── components/         # Reusable components
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── BookCard.jsx
    │   │   ├── Loading.jsx
    │   │   ├── ErrorMessage.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/              # Page components
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Books.jsx
    │   │   ├── BookDetails.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Orders.jsx
    │   │   ├── OrderDetails.jsx
    │   │   ├── Profile.jsx
    │   │   ├── NotFound.jsx
    │   │   └── admin/
    │   │       ├── Dashboard.jsx
    │   │       ├── BooksManagement.jsx
    │   │       ├── AdminOrders.jsx
    │   │       └── AdminUsers.jsx
    │   ├── context/            # Context providers
    │   │   ├── AuthContext.jsx
    │   │   ├── CartContext.jsx
    │   │   └── WishlistContext.jsx
    │   ├── utils/              # Utilities
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "book store project"
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5555
   MONGODB_URI=mongodb://localhost:27017/booknest
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   ```

   Create a `.env` file in the `frontend` directory (optional):
   ```env
   VITE_API_URL=http://localhost:5555/api
   ```

5. **Seed the Database**
   ```bash
   cd backend
   npm run seed
   ```

   This will create:
   - Admin user: `admin@booknest.com` / `admin123`
   - Customer users: `john@example.com` / `customer123`
   - Sample books, categories, and authors

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   # or for development with auto-reload
   npm run dev
   ```
   The backend will run on `http://localhost:5555`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 📝 Default Login Credentials

After seeding the database, you can use these credentials:

**Admin:**
- Email: `admin@booknest.com`
- Password: `admin123`

**Customer:**
- Email: `john@example.com`
- Password: `customer123`

## 🎨 Features Overview

### Customer Features
- **Home Page**: Hero section, featured books, best sellers, new arrivals, categories
- **Book Listing**: Search, filter by category/price/rating, pagination
- **Book Details**: Full information, reviews, add to cart/wishlist
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout**: Shipping address, payment method selection
- **Order History**: View all past orders with status tracking
- **Profile Management**: Update personal information and password

### Admin Features
- **Dashboard**: Overview statistics, low stock alerts, recent orders
- **Books Management**: CRUD operations for books
- **Orders Management**: View and update order statuses
- **Users Management**: View and manage users

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes with role-based access
- Input validation
- CORS configuration
- Error handling middleware

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updateprofile` - Update profile
- `PUT /api/auth/updatepassword` - Update password

### Books
- `GET /api/books` - Get all books (with filters)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)
- `POST /api/books/:id/reviews` - Add review

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Cart & Wishlist
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:bookId` - Remove from wishlist

## 🧪 Testing

You can test the API endpoints using:
- Postman
- Thunder Client (VS Code extension)
- curl commands

## 📦 Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```
The production build will be in the `frontend/dist` directory.

## 🤝 Contributing

This is a college project. Feel free to fork and modify for your own use.

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Created as a college project submission.

## 🎓 Project Highlights

- **Full-Stack Development**: Complete MERN stack implementation
- **Modern UI/UX**: Responsive design with Tailwind CSS
- **Production-Ready**: Clean code, error handling, validation
- **Scalable Architecture**: Modular structure, reusable components
- **Security**: JWT authentication, password hashing, protected routes
- **Comprehensive Features**: All CRUD operations, search, filters, cart, orders

## 📞 Support

For issues or questions, please check the code comments or create an issue in the repository.

---

**Note**: Make sure MongoDB is running before starting the backend server. For production deployment, update the environment variables and use a secure JWT secret.

