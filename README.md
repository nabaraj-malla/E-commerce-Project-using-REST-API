## Description
This is a RESTful API that provides endpoints for managing users, products, carts, and orders in an e-commerce platform. The API is designed to be scalable and secure, providing essential features for an e-commerce application.

## Features
##### User Model
```bash
**Signup**: Create a new user account.
**Signin**: Authenticate users with their credentials.
**Password Reset**: Allow users to reset their password securely.
**Update Profile**: Users can update their personal information.
##### Product Model
**Add New Product**: Admins can add new products to the catalog.
**Get All Products**: Retrieve a list of all available products.
**Get Product by ID**: Fetch details of a specific product using its ID.
**Filter Products**: Filter products based on categories, price range, etc.
**Add Rating**: Users can rate products they've purchased.
**Get Average Rating**: Retrieve the average rating of a specific product.
**Add Product Category**: Admins can create and assign categories to products.
#### Cart Model
**Add Item to Cart**: Users can add products to their shopping cart.
**Get Cart Items**: Retrieve all items currently in the user's cart.
**Delete Cart Items**: Remove items from the user's cart.
#### Order Model
**View Order Details:** Users can view details of their past orders, including items purchased, total amount, and order status.
## Technologies Used
**Backend**: Node.js, Express.js
**Database**: MongoDB
**Authentication**: JSON Web Tokens (JWT)
**Version Control**: Git
**Other Tools**: Mongoose (for MongoDB), bcrypt (for password hashing), dotenv (for environment variables)
