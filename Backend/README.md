# Backend Documentation

## Project Overview

The Backend is built using:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* Cloudinary
* bcrypt
* CORS

This backend provides APIs for:

* User Authentication
* Artisan Registration
* Product Management
* Cart Management
* Wishlist Management
* Orders
* Reviews
* Admin Management
* Artisan Dashboard
* Sales Reports

---

# Backend Folder Structure

```text
backend
│
├── config
│   ├── cloudinary.js
│   ├── cloudinaryUpload.js
│   ├── db.js
│   └── multer.js
│
├── middlewares
│   ├── errorHandler.js
│   └── verifyToken.js
│
├── models
│   ├── UserModel.js
│   ├── ProductModel.js
│   ├── CartModel.js
│   ├── WishlistModel.js
│   ├── OrderModel.js
│   └── ReviewModel.js
│
├── routes
│   ├── authRoute.js
│   ├── artisanRoute.js
│   ├── adminRoute.js
│   ├── cartRoute.js
│   ├── wishlistRoute.js
│   ├── orderRoute.js
│   └── reviewRoute.js
│
├── services
│   └── authService.js
│
├── .env
├── server.js
├── package.json
└── package-lock.json
```
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
---

# Config Folder

## 1. db.js

Purpose:

Connects Express application to MongoDB Atlas.

Example:

```javascript
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI);
```

---

## 2. cloudinary.js

Purpose:

Stores Cloudinary configuration.

Used for:

* Product Images
* Artisan Profile Images

Example:

```javascript
cloudinary.config({
 cloud_name: process.env.CLOUD_NAME,
 api_key: process.env.API_KEY,
 api_secret: process.env.API_SECRET
});
```

---

## 3. cloudinaryUpload.js

Purpose:

Uploads image buffer from multer to Cloudinary.

Used in:

```javascript
artisanRoute.js
adminRoute.js
```

---

## 4. multer.js

Purpose:

Handles image uploads.

Example:

```javascript
upload.single("image")
```

---

# Models Folder

---

## UserModel.js

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
ADMIN
ARTISAN
CUSTOMER
```

---

## ProductModel.js

Stores product details.

Fields:

```javascript
title
description
price
image
category
stock
artisan
rating
reviewsCount
isAvailable
tags
material
dimensions
isFeatured
totalSales
```

Indexes:

```javascript
Text Search
Category
Price
Rating
Artisan
CreatedAt
```

---

## CartModel.js

Stores customer cart items.

Example:

```javascript
{
 user,
 product,
 quantity
}
```

---

## WishlistModel.js

Stores wishlist products.

Example:

```javascript
{
 user,
 product
}
```

---

## OrderModel.js

Stores orders.

Example:

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

Payment Status:

```javascript
PENDING
PAID
```

Order Status:

```javascript
PLACED
SHIPPED
DELIVERED
```

---

## ReviewModel.js

Stores reviews.

Example:

```javascript
{
 user,
 product,
 rating,
 comment
}
```

---

# Services Folder

## authService.js

Handles:

### User Registration

```javascript
register()
```

### Password Encryption

```javascript
bcrypt.hash()
```

### Login Validation

```javascript
bcrypt.compare()
```

### JWT Token Generation

```javascript
jwt.sign()
```

---

# Middleware Folder

---

## verifyToken.js

Purpose:

Protects APIs.

Checks:

```javascript
JWT Token
```

Roles:

```javascript
ADMIN
ARTISAN
CUSTOMER
```

Example:

```javascript
verifyToken("ADMIN")
```

---

## errorHandler.js

Global error handling.

Returns:

```javascript
{
 success:false,
 message:"Error"
}
```

---

# Route Files

---

# authRoute.js

Authentication APIs

### Register

```http
POST /auth-api/register
```

### Login

```http
POST /auth-api/login
```

### Get User

```http
GET /auth-api/profile
```

---

# artisanRoute.js

Handles Artisan Operations.

---

### Register Artisan

```http
POST /artisan-api/users
```

Uploads profile image.

Creates Artisan account.

---

### Add Product

```http
POST /artisan-api/products
```

Requirements:

```javascript
ARTISAN Role
Approved Artisan
```

Uploads image to Cloudinary.

---

### Get My Products

```http
GET /artisan-api/my-products
```

Returns artisan products.

---

### Get Product By Id

```http
GET /artisan-api/products/:productId
```

---

### Product Search

```http
GET /artisan-api/products
```

Supports:

```javascript
search
category
price filter
pagination
sorting
```

---

### Update Product

```http
PUT /artisan-api/products/:productId
```

---

### Disable Product

```http
PATCH /artisan-api/products/:id/status
```

Soft delete.

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

Returns orders containing artisan products.

---

### Sales Report

```http
GET /artisan-api/sales-report
```

Returns:

```javascript
[
 {
   productName,
   quantity,
   price,
   total,
   orderDate
 }
]
```

---

# adminRoute.js

Admin Management APIs

---

### Get All Users

```http
GET /admin-api/users
```

---

### Approve Artisan

```http
PATCH /admin-api/artisans/:id
```

---

### Get Products

```http
GET /admin-api/products
```

---

### Dashboard

```http
GET /admin-api/dashboard
```

Returns:

```javascript
Users
Products
Orders
Revenue
```

---

# cartRoute.js

Cart Management

### Add To Cart

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

### Remove Item

```http
DELETE /cart-api/:id
```

---

# wishlistRoute.js

Wishlist Management

### Add Wishlist

```http
POST /wishlist-api
```

### Get Wishlist

```http
GET /wishlist-api
```

### Remove Wishlist Item

```http
DELETE /wishlist-api/:id
```

---

# orderRoute.js

Order Management

### Create Order

```http
POST /order-api
```

### Get User Orders

```http
GET /order-api
```

---

# reviewRoute.js

Review APIs

### Add Review

```http
POST /review-api
```

### Get Product Reviews

```http
GET /review-api/:productId
```

---

# Environment Variables

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

# Local Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Run Production

```bash
npm start
```

Server starts at:

```text
http://localhost:5000
```

---

# Deployment (Render)

## Step 1

Push backend code to GitHub.

---

## Step 2

Login to:

[Render]

---

## Step 3

Click:

```text
New +
```

Select:

```text
Web Service
```

---

## Step 4

Connect GitHub Repository.

---

## Step 5

Configure

### Build Command

```bash
npm install
```

### Start Command

```bash
npm start
```

---

## Step 6

Add Environment Variables

```env
PORT
MONGO_URI
JWT_SECRET

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

---

## Step 7

Click:

```text
Create Web Service
```

Render will deploy automatically.

---

# Production Backend URL Example

URL:https://artisanhandicraftmarketplace.onrender.com

Example API:

```text
https://artisanhandicraftmarketplace.onrender.com/artisan-api/products
```

---

# Backend Features Completed

✅ JWT Authentication

✅ Role Based Authorization

✅ Artisan Registration

✅ Product CRUD

✅ Product Search & Filters

✅ Wishlist

✅ Cart

✅ Orders

✅ Reviews

✅ Admin Panel APIs

✅ Artisan Dashboard API

✅ Artisan Orders API

✅ Sales Report API

✅ Cloudinary Image Upload

✅ MongoDB Atlas Integration

✅ Render Deployment Ready

