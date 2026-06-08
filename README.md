# Artisan Handicraft Marketplace

## Complete Project Documentation

---

# Project Title

**Artisan Handicraft Marketplace**

A full-stack MERN application that connects artisans with customers, allowing artisans to showcase and sell handmade products while customers can browse, purchase, review, and track orders.

---

# Project Objective

The objective of this project is to:

* Promote local artisans
* Provide an online platform for handmade products
* Allow secure online purchasing
* Manage artisan approvals
* Track orders and sales
* Provide admin management capabilities

---

# Technology Stack

## Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Bootstrap
* Bootstrap Icons
* Context API
* Socket.io Client

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcrypt
* Multer
* Cloudinary
* CORS
* dotenv

## Deployment

* Frontend: Vercel:https://artisan-handi-craft-market-place.vercel.app/
* Backend: Render:https://artisanhandicraftmarketplace.onrender.com
* Database: [MongoDB Atlas](https://www.mongodb.com/atlas?utm_source=chatgpt.com)
* Image Storage: [Cloudinary](https://cloudinary.com?utm_source=chatgpt.com)

---

# System Architecture

```text
Customer
     |
     v
Frontend (React)
     |
 Axios API Calls
     |
     v
Backend (Express)
     |
 JWT Authentication
     |
     v
MongoDB Atlas
     |
     v
Cloudinary (Images)
```
For your README Documentation, add a separate section called:

Dependencies / Packages Used
Backend Packages

Install using:

npm install

or individually:

Core Packages
Express
npm install express

Purpose:

Backend Server
API Routing
Middleware Support

Used in:

import exp from "express";
Mongoose
npm install mongoose

Purpose:

MongoDB Connection
Database Models
Queries

Used in:

import mongoose from "mongoose";
dotenv
npm install dotenv

Purpose:

Environment Variables

Used in:

import dotenv from "dotenv";
dotenv.config();
cors
npm install cors

Purpose:

Frontend and Backend Communication

Used in:

app.use(cors());
bcrypt
npm install bcrypt

Purpose:

Password Hashing
Secure Authentication

Used in:

bcrypt.hash()
bcrypt.compare()
jsonwebtoken
npm install jsonwebtoken

Purpose:

JWT Authentication
Protected Routes

Used in:

jwt.sign()
jwt.verify()
File Upload Packages
multer
npm install multer

Purpose:

Handle Image Uploads

Used in:

upload.single("image")
cloudinary
npm install cloudinary

Purpose:

Store Product Images
Store Profile Images

Used in:

cloudinary.uploader.upload()
streamifier
npm install streamifier

Purpose:

Upload Buffer Images to Cloudinary

Used in:

streamifier.createReadStream()
Development Packages
nodemon
npm install nodemon --save-dev

Purpose:

Auto Restart Backend Server

Run:

npm run dev
Backend package.json Example
{
  "dependencies": {
    "bcrypt": "^5.x",
    "cloudinary": "^2.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "express": "^5.x",
    "jsonwebtoken": "^9.x",
    "mongoose": "^8.x",
    "multer": "^2.x",
    "streamifier": "^0.1.x"
  },
  "devDependencies": {
    "nodemon": "^3.x"
  }
}
Frontend Packages

Install using:

npm install
Core Packages
React
npm install react react-dom

Purpose:

Build User Interface

Used in:

import React from "react";
React Router DOM
npm install react-router-dom

Purpose:

Page Navigation
Protected Routes

Used in:

import {
 BrowserRouter,
 Routes,
 Route
} from "react-router-dom";
Axios
npm install axios

Purpose:

API Requests

Used in:

axios.get()
axios.post()
axios.put()
axios.delete()
Bootstrap
npm install bootstrap

Purpose:

Responsive UI
Styling Components

Used in:

import "bootstrap/dist/css/bootstrap.min.css";
Bootstrap Icons
npm install bootstrap-icons

Purpose:

Icons

Used in:

<i className="bi bi-cart"></i>
Real-Time Communication
socket.io-client
npm install socket.io-client

Purpose:

Real-time Notifications
Future Chat Support

Used in:

import io from "socket.io-client";
Development Packages
Vite

Installed during project creation.

Purpose:

Fast Development Server
Production Build

Commands:

npm run dev
npm run build
ESLint

Purpose:

Code Quality
Error Detection

Command:

npm run lint
Frontend package.json Example
{
  "dependencies": {
    "axios": "^1.x",
    "bootstrap": "^5.x",
    "bootstrap-icons": "^1.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "react-router-dom": "^7.x",
    "socket.io-client": "^4.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.x",
    "eslint": "^9.x",
    "vite": "^7.x"
  }
}
Commands Used
Backend

Install Packages

npm install

Development Server

npm run dev

Production Server

npm start
Frontend

Install Packages

npm install

Start Development Server

npm run dev

Create Production Build

npm run build

Preview Build

npm run preview
---

# User Roles

## Customer

Can:

* Register
* Login
* Browse Products
* Search Products
* Add to Cart
* Add to Wishlist
* Place Orders
* Review Products
* View Order History

---

## Artisan

Can:

* Register as Artisan
* Upload Profile Image
* Add Products
* Edit Products
* Disable Products
* View Orders
* View Dashboard
* View Sales Reports

---

## Admin

Can:

* Manage Users
* Approve Artisans
* View Products
* View Orders
* Access Analytics Dashboard

---

# Frontend Folder Structure

```text
src
│
├── assets
├── components
├── context
├── pages
│   ├── artisan
│   ├── admin
│   └── customer
├── routes
├── services
├── App.jsx
├── main.jsx
└── index.css
```

---

# Backend Folder Structure

```text
backend
│
├── config
├── middlewares
├── models
├── routes
├── services
├── .env
├── server.js
└── package.json
```

---

# Database Models

---

## User Model

Stores:

```javascript
{
 firstName,
 lastName,
 email,
 password,
 role,
 profileImageUrl,
 isArtisanApproved
}
```

Roles:

```javascript
CUSTOMER
ARTISAN
ADMIN
```

---

## Product Model

Stores:

```javascript
{
 title,
 description,
 price,
 image,
 category,
 stock,
 artisan,
 rating,
 reviewsCount,
 isAvailable,
 tags,
 material,
 dimensions,
 totalSales
}
```

---

## Cart Model

```javascript
{
 user,
 product,
 quantity
}
```

---

## Wishlist Model

```javascript
{
 user,
 product
}
```

---

## Order Model

```javascript
{
 user,
 products:[
   {
      product,
      quantity
   }
 ],
 totalAmount,
 paymentStatus,
 orderStatus
}
```

---

## Review Model

```javascript
{
 user,
 product,
 rating,
 comment
}
```

---

# Authentication Flow

## Registration

```text
User Registers
      |
      v
Password Encrypted
      |
      v
Stored in MongoDB
```

---

## Login

```text
User Login
      |
      v
Verify Password
      |
      v
Generate JWT
      |
      v
Return Token
```

---

## Protected Routes

```text
JWT Token
      |
      v
verifyToken()
      |
      v
Access Granted
```

---

# Backend APIs

---

# Authentication APIs

### Register

```http
POST /auth-api/register
```

### Login

```http
POST /auth-api/login
```

### Profile

```http
GET /auth-api/profile
```

---

# Artisan APIs

### Register Artisan

```http
POST /artisan-api/users
```

---

### Add Product

```http
POST /artisan-api/products
```

---

### My Products

```http
GET /artisan-api/my-products
```

---

### Product Details

```http
GET /artisan-api/products/:id
```

---

### Product Search

```http
GET /artisan-api/products
```

Supports:

* Search
* Category Filter
* Price Filter
* Sorting
* Pagination

---

### Update Product

```http
PUT /artisan-api/products/:id
```

---

### Disable Product

```http
PATCH /artisan-api/products/:id/status
```

---

### Artisan Dashboard

```http
GET /artisan-api/dashboard
```

Returns:

```javascript
{
 totalProducts,
 totalOrders,
 totalSales,
 totalRevenue
}
```

---

### Artisan Orders

```http
GET /artisan-api/orders
```

---

### Sales Report

```http
GET /artisan-api/sales-report
```

---

# Cart APIs

### Add Cart Item

```http
POST /cart-api
```

### Get Cart

```http
GET /cart-api
```

### Update Quantity

```http
PUT /cart-api/:id
```

### Delete Cart Item

```http
DELETE /cart-api/:id
```

---

# Wishlist APIs

### Add Wishlist

```http
POST /wishlist-api
```

### Get Wishlist

```http
GET /wishlist-api
```

### Delete Wishlist Item

```http
DELETE /wishlist-api/:id
```

---

# Order APIs

### Create Order

```http
POST /order-api
```

### User Orders

```http
GET /order-api
```

---

# Review APIs

### Add Review

```http
POST /review-api
```

### Product Reviews

```http
GET /review-api/:productId
```

---

# Admin APIs

### Get Users

```http
GET /admin-api/users
```

### Approve Artisan

```http
PATCH /admin-api/artisans/:id
```

### Admin Dashboard

```http
GET /admin-api/dashboard
```

### Orders

```http
GET /admin-api/orders
```

---

# Frontend Pages

---

## Public Pages

### Home

Route:

```text
/
```

Features:

* Hero Section
* Featured Products
* Categories

---

### Shop

Route:

```text
/shop
```

Features:

* Product Listing
* Search
* Filters
* Sorting

---

### Product Details

Route:

```text
/product/:id
```

Features:

* Product Info
* Reviews
* Artisan Details

---

## Authentication Pages

### Login

```text
/login
```

### Register

```text
/register
```

### Forgot Password

```text
/forgot-password
```

### Verify OTP

```text
/verify-otp
```

### Reset Password

```text
/reset-password
```

---

## Customer Pages

### Cart

```text
/cart
```

### Wishlist

```text
/wishlist
```

### Checkout

```text
/checkout
```

### My Orders

```text
/my-orders
```

---

## Artisan Pages

### Dashboard

```text
/artisan/dashboard
```

### Add Product

```text
/artisan/add-product
```

### My Products

```text
/artisan/products
```

### Edit Product

```text
/artisan/edit-product/:id
```

### Orders

```text
/artisan/orders
```

### Sales Report

```text
/artisan/sales-report
```

---

## Admin Pages

### Dashboard

```text
/admin/dashboard
```

### Manage Users

```text
/admin/users
```

### Manage Orders

```text
/admin/orders
```

### Approve Artisans

```text
/admin/artisans
```

---

# Context API

## AuthContext

Stores:

```javascript
User
Token
Role
Login
Logout
```

---

## CartContext

Stores:

```javascript
Cart Items
Quantity
Total Amount
```

---

## WishlistContext

Stores:

```javascript
Wishlist Items
```

---

## ThemeContext

Stores:

```javascript
Dark Mode
Light Mode
```

---

# Image Upload Flow

```text
Artisan Uploads Image
        |
        v
Multer Receives Image
        |
        v
Cloudinary Upload
        |
        v
Image URL Stored In MongoDB
```

---

# Environment Variables

## Backend

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

## Frontend

```env
VITE_API_URL=https://artisanhandicraftmarketplace.onrender.com
```

---

# Installation Guide

## Clone Repository

```bash
git clone repository_url
```

---

## Backend Setup

### Navigate

```bash
cd backend
```

### Install Packages

```bash
npm install
```

### Run Backend

```bash
npm run dev
```

Server:

```text
http://localhost:5000
```

---

## Frontend Setup

### Navigate

```bash
cd frontend
```

### Install Packages

```bash
npm install
```

### Run Frontend

```bash
npm run dev
```

Application:

```text
http://localhost:5173
```

---

# Deployment

## Backend Deployment

Platform:

Render:https://artisanhandicraftmarketplace.onrender.com

Build Command:

```bash
npm install
```

Start Command:

```bash
npm start
```

---

## Frontend Deployment

Platform:

Vercel:https://artisan-handi-craft-market-place.vercel.app/

Build Command:

```bash
npm run build
```

Publish Directory:

```text
dist
```

---

# Project Features Completed

### Authentication

✅ Register

✅ Login

✅ JWT Authentication

✅ Role Based Access

---

### Customer

✅ Browse Products

✅ Search Products

✅ Filters

✅ Cart

✅ Wishlist

✅ Checkout

✅ Orders

✅ Reviews

---

### Artisan

✅ Register Artisan

✅ Upload Products

✅ Edit Products

✅ Disable Products

✅ Dashboard

✅ Orders

✅ Sales Report

---

### Admin

✅ User Management

✅ Artisan Approval

✅ Order Management

✅ Dashboard Analytics

---

### Additional Features

✅ Cloudinary Image Upload

✅ MongoDB Atlas Integration

✅ Pagination

✅ Product Search

✅ Sorting

✅ Protected Routes

✅ Responsive Design

✅ Deployment Ready

---

# Future Enhancements

* Razorpay Payment Gateway
* Email Notifications
* Product Recommendations
* Real-Time Chat
* Live Order Tracking
* Advanced Admin Analytics
* Product Search Suggestions
* Sales Charts and Graphs

---

# Conclusion

The **Artisan Handicraft Marketplace** is a complete MERN-stack e-commerce platform that enables artisans to sell handmade products online, customers to purchase and review products, and administrators to manage the marketplace efficiently. The application includes authentication, product management, cart, wishlist, orders, reviews, artisan dashboards, sales reporting, cloud image storage, and deployment-ready architecture.
