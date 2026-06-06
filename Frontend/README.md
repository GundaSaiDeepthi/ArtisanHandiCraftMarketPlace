# Frontend README Documentation

# Artisan Handicraft Marketplace - Frontend

## Project Overview

The frontend is developed using:

* React.js
* Vite
* React Router DOM
* Axios
* Bootstrap
* Context API
* Socket.io Client

This frontend provides:

* User Authentication
* Product Browsing
* Product Details
* Cart Management
* Wishlist Management
* Checkout
* Order Tracking
* Artisan Dashboard
* Product Management
* Sales Reports
* Admin Order Management

---

# Frontend Folder Structure

```text
src
│
├── assets
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
│
├── components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   └── StarRating.jsx
│
├── context
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   ├── WishlistContext.jsx
│   ├── ThemeContext.jsx
│   └── SocketContext.jsx
│
├── pages
│   │
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── ProductDetails.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   ├── VerifyOTP.jsx
│   ├── ResetPassword.jsx
│   ├── Checkout.jsx
│   ├── MyOrders.jsx
│   ├── AdminOrders.jsx
│   │
│   └── artisan
│       ├── ArtisanDashboard.jsx
│       ├── MyProducts.jsx
│       ├── AddProduct.jsx
│       ├── EditProduct.jsx
│       ├── ArtisanOrders.jsx
│       └── SalesReport.jsx
│
├── routes
│   └── ProtectedRoute.jsx
│
├── services
│   └── api.js
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```
Dependencies / Packages Used
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

# Main Files

## main.jsx

Entry point of React application.

Responsibilities:

* Creates React App
* Wraps Context Providers
* Mounts App component

Example:

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);
```

---

## App.jsx

Handles:

* Routing
* Layout
* Navigation
* Protected Pages

Contains all application routes.

---

# Components Folder

Reusable UI Components.

---

## Navbar.jsx

Displays:

* Logo
* Home
* Shop
* Login
* Register
* Cart
* Wishlist
* Dashboard Links

Used on all pages.

---

## Footer.jsx

Displays:

* Copyright
* Quick Links
* Contact Information

---

## ProductCard.jsx

Reusable product card.

Displays:

```javascript
Product Image
Product Name
Price
Rating
Add To Cart
Wishlist
```

Used in:

```text
Home
Shop
Search Results
```

---

## StarRating.jsx

Displays:

```text
★★★★★
```

Based on product rating.

---

# Context Folder

Global State Management.

---

## AuthContext.jsx

Manages:

```javascript
User Login
User Logout
JWT Token
User Role
Authentication State
```

Functions:

```javascript
login()
logout()
isAuthenticated()
```

---

## CartContext.jsx

Stores:

```javascript
Cart Items
Quantity
Total Price
```

Functions:

```javascript
addToCart()
removeFromCart()
updateQuantity()
clearCart()
```

---

## WishlistContext.jsx

Stores:

```javascript
Wishlist Products
```

Functions:

```javascript
addWishlist()
removeWishlist()
```

---

## ThemeContext.jsx

Handles:

```javascript
Dark Mode
Light Mode
Theme Toggle
```

---

## SocketContext.jsx

Handles:

```javascript
Real-Time Notifications
Socket Connection
```

Used for future realtime updates.

---

# Pages Folder

---

# Home.jsx

Landing Page.

Features:

* Hero Banner
* Featured Products
* Categories
* Trending Products

Route:

```text
/
```

---

# Shop.jsx

Displays all products.

Features:

```javascript
Search Products
Filter Category
Sort Products
Pagination
```

Route:

```text
/shop
```

---

# ProductDetails.jsx

Displays:

```javascript
Product Image
Description
Price
Reviews
Rating
Artisan Information
```

Route:

```text
/product/:id
```

---

# Login.jsx

User Login Page.

Route:

```text
/login
```

Features:

```javascript
Email Login
Password Login
JWT Authentication
```

---

# Register.jsx

User Registration.

Route:

```text
/register
```

---

# ForgotPassword.jsx

Route:

```text
/forgot-password
```

Sends OTP.

---

# VerifyOTP.jsx

Route:

```text
/verify-otp
```

Verifies OTP.

---

# ResetPassword.jsx

Route:

```text
/reset-password
```

Updates Password.

---

# Checkout.jsx

Route:

```text
/checkout
```

Features:

```javascript
Cart Summary
Shipping Details
Order Placement
```

---

# MyOrders.jsx

Route:

```text
/my-orders
```

Displays customer order history.

---

# AdminOrders.jsx

Route:

```text
/admin/orders
```

Displays all marketplace orders.

Admin only.

---

# Artisan Pages

---

# ArtisanDashboard.jsx

Route:

```text
/artisan/dashboard
```

Displays:

```javascript
Total Products
Total Orders
Total Sales
Total Revenue
```

Quick Actions:

```javascript
Add Product
My Products
View Orders
Sales Report
```

Uses API:

```http
GET /artisan-api/dashboard
```

---

# AddProduct.jsx

Route:

```text
/artisan/add-product
```

Features:

```javascript
Upload Product Image
Add Product Details
Add Price
Add Stock
Add Category
```

Uses API:

```http
POST /artisan-api/products
```

---

# MyProducts.jsx

Route:

```text
/artisan/products
```

Displays artisan products.

Features:

```javascript
Edit Product
Enable Product
Disable Product
```

Uses API:

```http
GET /artisan-api/my-products
```

---

# EditProduct.jsx

Route:

```text
/artisan/edit-product/:id
```

Features:

```javascript
Update Product
Change Image
Update Stock
Update Price
```

Uses API:

```http
PUT /artisan-api/products/:id
```

---

# ArtisanOrders.jsx

Route:

```text
/artisan/orders
```

Displays artisan order history.

Uses API:

```http
GET /artisan-api/orders
```

Shows:

```javascript
Customer
Products
Quantity
Order Status
Payment Status
```

---

# SalesReport.jsx

Route:

```text
/artisan/sales-report
```

Displays:

```javascript
Product Name
Quantity Sold
Revenue
Order Date
```

Uses API:

```http
GET /artisan-api/sales-report
```

---

# Routes Folder

## ProtectedRoute.jsx

Protects pages.

Examples:

```javascript
Customer Pages
Admin Pages
Artisan Pages
```

Checks:

```javascript
JWT Token
User Role
```

---

# Services Folder

## api.js

Central Axios Configuration.

Example:

```javascript
const api = axios.create({
 baseURL:
 "https://artisanhandicraftmarketplace.onrender.com"
});
```

Benefits:

```javascript
Single API Configuration
Authorization Headers
Error Handling
```

---

# Environment Variables

Create `.env`

```env
VITE_API_URL=https://artisanhandicraftmarketplace.onrender.com
```

---

# Installation

## Step 1

Navigate to frontend folder

```bash
cd Frontend
```

---

## Step 2

Install dependencies

```bash
npm install
```

---

## Step 3

Start development server

```bash
npm run dev
```

Application starts at:

```text
http://localhost:5173
```

---

# Build for Production

Create production build:

```bash
npm run build
```

Output generated in:

```text
dist/
```

Preview build:

```bash
npm run preview
```

---

# Frontend Deployment (Vercel)

## Step 1

Push frontend code to GitHub.

---

## Step 2

Go to:

[Vercel]

---

## Step 3

Click:

```text
Add New Site
```

---

## Step 4

Import Git Repository.

---

## Step 5

Configure Build Settings

Build Command:

```bash
npm run build
```

Publish Directory:

```bash
dist
```

---

## Step 6

Add Environment Variable

```env
VITE_API_URL=https://artisanhandicraftmarketplace.onrender.com
```

---

## Step 7

Deploy Site

Vercel automatically builds and deploys.
URL:https://artisan-handi-craft-market-place.vercel.app
---

# Frontend Features Completed

✅ Authentication

✅ Registration

✅ Forgot Password

✅ OTP Verification

✅ Password Reset

✅ Product Listing

✅ Product Search

✅ Product Details

✅ Cart Management

✅ Wishlist Management

✅ Checkout

✅ Customer Orders

✅ Artisan Dashboard

✅ Add Product

✅ Edit Product

✅ My Products

✅ Artisan Orders

✅ Sales Report

✅ Admin Orders

✅ Protected Routes

✅ Responsive UI

✅ API Integration

✅ Vercel Deployment Ready


