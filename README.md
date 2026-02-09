# Customer Service Marketplace - Backend

A comprehensive Node.js backend API for a service marketplace platform that connects service providers with consumers. Built with Express.js, MongoDB, and JWT authentication.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication Flow](#authentication-flow)
- [What We've Built](#what-weve-built)
- [What We're Building Next](#what-were-building-next)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🎯 Overview

The Customer Service Marketplace backend provides a complete API for managing a three-sided marketplace:

- **Consumers** can browse services, request services, and track their requests
- **Providers** can create service listings, manage their profiles, and handle service requests
- **Admins** can approve providers and manage the platform

### Key Capabilities

✅ **User Management**
- Registration with email verification
- Secure JWT-based authentication
- Role-based access control (Consumer, Provider, Admin)
- Password reset functionality

✅ **Service Management**
- Service creation and listing
- Category-based organization
- Active/inactive service status

✅ **Request Management**
- Service request creation
- Status tracking (pending, accepted, completed, cancelled)
- Provider-consumer communication flow

✅ **Provider Approval Workflow**
- Providers require admin approval before creating services
- Ensures quality control

---

## ✨ Features

### Authentication & Authorization
- ✅ User registration with email verification
- ✅ Email verification via token
- ✅ Secure login with JWT tokens
- ✅ Password reset via email
- ✅ Role-based access control
- ✅ Provider approval system

### User Roles
- **Consumer**: Browse and request services
- **Provider**: Create services and manage requests (requires approval)
- **Admin**: Approve providers and manage platform

### Service Management
- ✅ Create, read, update services
- ✅ Category-based organization
- ✅ Active/inactive status
- ✅ Provider-linked services

### Request Management
- ✅ Create service requests
- ✅ Track request status
- ✅ Update request status (provider)
- ✅ View request history

---

## 🛠 Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | Latest | Runtime environment |
| Express.js | ^4.19.2 | Web framework |
| MongoDB | ^8.14.1 | NoSQL database |
| Mongoose | ^8.14.1 | MongoDB ODM |

### Security & Authentication
| Package | Version | Purpose |
|---------|---------|---------|
| jsonwebtoken | ^9.0.2 | JWT authentication |
| bcrypt | ^5.1.1 | Password hashing |
| crypto | ^1.0.1 | Token generation |

### Validation & Middleware
| Package | Version | Purpose |
|---------|---------|---------|
| express-validator | ^7.2.1 | Input validation |
| cors | ^2.8.5 | CORS support |
| morgan | ^1.10.0 | HTTP logging |

### Email & File Handling
| Package | Version | Purpose |
|---------|---------|---------|
| nodemailer | ^7.0.2 | Email service |
| multer | ^2.0.1 | File uploads |
| cloudinary | ^1.41.3 | Cloud storage |

### Payment Integration (Planned)
| Package | Version | Purpose |
|---------|---------|---------|
| stripe | ^18.2.1 | Payment processing |
| esewajs | ^2.0.0 | eSewa gateway |

---

## 📁 Project Structure

```
backend/
├── controller/              # Business logic handlers
│   ├── adminController.js       # Admin operations
│   ├── consumerController.js    # Consumer operations
│   ├── providerController.js    # Provider operations
│   ├── userController.js        # User authentication & management
│   ├── categoryController.js    # Category management
│   ├── productController.js     # Product operations
│   ├── orderItemsController.js  # Order items
│   ├── PaymentController.js     # Payment handling
│   └── EsewaController.js       # eSewa integration
│
├── models/                  # Database schemas
│   ├── userModel.js            # User schema
│   ├── serviceModel.js         # Service schema
│   ├── serviceRequestModel.js  # Service request schema
│   ├── providerProfileModel.js # Provider profile schema
│   ├── tokenModel.js           # Verification tokens
│   ├── productModel.js         # Product schema (legacy)
│   ├── categoryModel.js        # Category schema
│   ├── orderModel.js           # Order schema
│   ├── orderItemsModel.js      # Order items
│   └── TransactionModel.js     # Transactions
│
├── routes/                  # API route definitions
│   ├── userRoutes.js           # Auth & user routes
│   ├── adminRoutes.js          # Admin routes
│   ├── providerRoutes.js       # Provider routes
│   ├── consumerRoutes.js       # Consumer routes
│   ├── categoryRoutes.js       # Category routes
│   ├── productRoutes.js        # Product routes
│   ├── orderRoutes.js          # Order routes
│   └── paymentRoutes.js        # Payment routes
│
├── middleware/              # Custom middleware
│   ├── emailSend.js            # Email service
│   ├── validationScript.js     # Input validation
│   └── fileUpload.js           # File upload handling
│
├── database/                # Database configuration
│   └── connection.js           # MongoDB connection
│
├── index.js                 # Application entry point
├── package.json             # Dependencies
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd CustomerService/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE=mongodb://localhost:27017/customer_service
# OR for MongoDB Atlas:
# DATABASE=mongodb+srv://username:password@cluster.mongodb.net/customer_service

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Frontend URL (for email verification links)
FRONTEND_URL=http://localhost:3000

# SMTP Configuration (for email service)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateways (optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
ESEWA_MERCHANT_ID=your_esewa_merchant_id
ESEWA_SECRET_KEY=your_esewa_secret_key
```

### Step 4: Start MongoDB
```bash
# If using local MongoDB
mongod
```

### Step 5: Run the Server
```bash
# Development mode (with auto-restart)
npm start

# Production mode
node index.js
```

You should see:
```
Server Started successfully at port 5000
DATABASE CONNECTED SUCCESSFULLY
```

---

## ⚙️ Configuration

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `DATABASE` | MongoDB connection string | `mongodb://localhost:27017/db_name` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_min_32_chars` |
| `FRONTEND_URL` | Frontend URL for email links | `http://localhost:3000` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email account | `your_email@gmail.com` |
| `SMTP_PASS` | Email password/app password | `your_app_password` |

### Gmail Setup for Email Service

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security
   - Under "2-Step Verification", click "App passwords"
   - Generate a new app password
   - Use this password in `SMTP_PASS`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "consumer"  // or "provider"
}
```

**Response:**
```json
{
  "message": "User Register Successfully"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "role": "consumer",
    "user": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Verify Email
```http
GET /api/auth/verify/:token
```

#### Forgot Password
```http
POST /api/auth/forgotPassword
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /api/auth/resetPassword/:token
Content-Type: application/json

{
  "password": "NewSecurePass123!"
}
```

### Consumer Routes (`/api/consumer`)

#### Get All Services
```http
GET /api/consumer/services
```

**Response:**
```json
[
  {
    "_id": "service_id",
    "title": "Plumbing Services",
    "description": "Professional plumbing...",
    "price": 5000,
    "category": "Home Services",
    "providerId": {
      "username": "john_plumber",
      "email": "john@example.com"
    },
    "isActive": true
  }
]
```

#### Request Service
```http
POST /api/consumer/request
Authorization: <JWT_TOKEN>
Content-Type: application/json

{
  "serviceId": "service_object_id",
  "providerId": "provider_object_id"
}
```

#### Get My Requests
```http
GET /api/consumer/my-requests
Authorization: <JWT_TOKEN>
```

### Provider Routes (`/api/provider`)

#### Create Service
```http
POST /api/provider/service
Authorization: <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Plumbing Services",
  "description": "Professional plumbing for homes and offices",
  "price": 5000,
  "category": "Home Services"
}
```

#### Update Profile
```http
POST /api/provider/profile
Authorization: <JWT_TOKEN>
Content-Type: application/json

{
  "servicesOffered": ["Plumbing", "Pipe Repair"],
  "experience": "5 years",
  "location": "Kathmandu"
}
```

#### Get Requests
```http
GET /api/provider/requests
Authorization: <JWT_TOKEN>
```

#### Update Request Status
```http
PUT /api/provider/request-status
Authorization: <JWT_TOKEN>
Content-Type: application/json

{
  "requestId": "request_object_id",
  "status": "accepted"  // or "completed", "cancelled"
}
```

### Admin Routes (`/api/admin`)

#### Get All Providers
```http
GET /api/admin/providers
Authorization: <ADMIN_JWT_TOKEN>
```

#### Approve Provider
```http
PUT /api/admin/approve/:providerId
Authorization: <ADMIN_JWT_TOKEN>
```

---

## 🗄️ Database Models

### User Model
```javascript
{
  username: String (required, unique, 3-20 chars),
  email: String (required, unique),
  password: String (required, hashed),
  isVerified: Boolean (default: false),
  role: String (enum: ["consumer", "provider", "admin"]),
  isActive: Boolean (default: true),
  isApproved: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Service Model
```javascript
{
  providerId: ObjectId (ref: User),
  title: String (required),
  description: String (required),
  price: Number (required),
  category: String (required),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Service Request Model
```javascript
{
  consumerId: ObjectId (ref: User),
  providerId: ObjectId (ref: User),
  serviceId: ObjectId (ref: Service),
  status: String (enum: ["pending", "accepted", "completed", "cancelled"]),
  createdAt: Date,
  updatedAt: Date
}
```

### Provider Profile Model
```javascript
{
  userId: ObjectId (ref: User, unique),
  servicesOffered: [String],
  experience: String,
  location: String,
  rating: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication Flow

### Registration Flow
```
1. User submits registration form
2. Backend validates input (username, email, password)
3. Password is hashed using bcrypt (10 salt rounds)
4. User created with isVerified: false
5. Verification token generated (crypto.randomBytes)
6. Verification email sent with link
7. User clicks link → isVerified: true
8. User can now login
```

### Login Flow
```
1. User submits email and password
2. Backend finds user by email
3. Password compared using bcrypt
4. Check if user is verified
5. Generate JWT token with user data
6. Return token + user info
7. Client stores token for future requests
```

### Protected Route Flow
```
1. Client sends request with Authorization header
2. Middleware extracts and verifies JWT token
3. If valid, attach user data to request
4. Controller processes request
5. Return response
```

---

## ✅ What We've Built

### Phase 1: Foundation (Completed)
- [x] Project setup with Express.js
- [x] MongoDB connection
- [x] Environment configuration
- [x] Basic server structure

### Phase 2: Authentication (Completed)
- [x] User registration
- [x] Email verification system
- [x] Login with JWT
- [x] Password reset
- [x] Role-based access control
- [x] Input validation

### Phase 3: Core Features (Completed)
- [x] Service model and CRUD operations
- [x] Service request system
- [x] Provider profile management
- [x] Admin approval workflow
- [x] Consumer service browsing

### Phase 4: Middleware (Completed)
- [x] Authentication middleware
- [x] Authorization middleware
- [x] Email service
- [x] Input validation
- [x] File upload support

---

## 🚧 What We're Building Next

### Phase 5: Enhanced Features (Planned)
- [ ] Review and rating system
- [ ] Advanced search and filtering
- [ ] Notification system
- [ ] Real-time chat
- [ ] Analytics dashboard

### Phase 6: Payment Integration (Planned)
- [ ] Stripe payment processing
- [ ] eSewa integration
- [ ] Transaction history
- [ ] Invoice generation

### Phase 7: Optimization (Planned)
- [ ] Database indexing
- [ ] Caching with Redis
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] Comprehensive testing

### Phase 8: Security Enhancements (Planned)
- [ ] Helmet.js for security headers
- [ ] Input sanitization
- [ ] HTTPS enforcement
- [ ] Rate limiting
- [ ] Logging with Winston

---

## 🧪 Testing

### Manual Testing with Postman

1. **Register a User**
```bash
POST http://localhost:5000/api/auth/register
Body: {
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test@1234",
  "role": "consumer"
}
```

2. **Login**
```bash
POST http://localhost:5000/api/auth/login
Body: {
  "email": "test@example.com",
  "password": "Test@1234"
}
```

3. **Get Services**
```bash
GET http://localhost:5000/api/consumer/services
```

### Automated Testing (Planned)
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage
```

---

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Configure MongoDB Atlas
- [ ] Set up SMTP service (SendGrid, Mailgun)
- [ ] Configure Cloudinary
- [ ] Enable HTTPS
- [ ] Set up reverse proxy (Nginx)
- [ ] Configure CORS for production domain
- [ ] Set up monitoring (PM2, New Relic)
- [ ] Configure logging
- [ ] Set up backup strategy

### Deployment Platforms
- **Heroku**: Easy deployment, free tier
- **Railway**: Modern platform, great DX
- **DigitalOcean**: VPS with full control
- **AWS EC2**: Scalable, enterprise-grade
- **Render**: Simple deployment

### Using PM2 (Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start index.js --name customer-service-api

# View logs
pm2 logs customer-service-api

# Restart
pm2 restart customer-service-api

# Auto-start on system boot
pm2 startup
pm2 save
```

---

## 📝 Scripts

```bash
# Start development server (with nodemon)
npm start

# Start production server
node index.js

# Install dependencies
npm install

# Run tests (when implemented)
npm test
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Team

- **Developer**: Your Name
- **Project**: Customer Service Marketplace
- **Version**: 1.0.0

---

## 📞 Support

For questions or support:
- **Email**: support@customerservice.com
- **GitHub Issues**: [Create an issue](https://github.com/your-repo/issues)

---

**Last Updated**: February 9, 2026  
**Status**: Active Development
