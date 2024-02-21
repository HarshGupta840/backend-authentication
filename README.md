# Node.js Express MongoDB Authentication Backend Starter

Welcome to the repository for your Node.js, Express, and MongoDB backend starter with basic authentication features!

## Introduction

This repository contains the basic setup for a backend server using Node.js, Express framework, and MongoDB database with authentication functionalities such as sign-in, sign-out, forgot password, and email verification.

## Features

- **Express Server**: Setting up a server using the Express framework for handling HTTP requests and responses.
- **MongoDB Integration**: Connecting to a MongoDB database using Mongoose for data modeling and interaction.
- **User Authentication**: Implementing user authentication features including sign-in, sign-out, forgot password, and email verification.
- **JWT (JSON Web Tokens)**: Generating and verifying JWT tokens for user authentication and authorization.
- **Password Encryption**: Encrypting user passwords for enhanced security using bcryptjs.
- **Email Sending**: Integrating with an email service for sending verification emails and password reset links.I do have used nodemailer service for sending the mail
- **Environment Configuration**: Utilizing environment variables for configuring the server, database connection, and email service.
- **Error Handling**: Implementing error handling middleware for managing errors gracefully.

## Getting Started

1. **Clone the Repository**: 
    ```
    git clone https://github.com/HarshGupta840/backent-authentication.git
    ```

2. **Install Dependencies**: 
    ```
    cd your-auth-backend-starter
    npm install
    ```

3. **Set Environment Variables**: Create a `.env` file in the root directory and define the following variables:
    ```
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    EMAIL_SERVICE=your_email_service_provider
    EMAIL_USERNAME=your_email_username
    EMAIL_PASSWORD=your_email_password
    ```

4. **Run the Server**: 
    ```
    npm run dev
    ```

5. **Test Authentication Endpoints**: Use tools like Postman or curl to test the authentication endpoints defined in the `routes/auth.js` file.

## Project Structure

- `index.js`: Entry point of the application where the Express server is initialized.
- `routes/auth.js`: Route handlers for user authentication endpoints (sign-in, sign-out, forgot password, email verification).
- `schema/User.js`: Mongoose model for defining the user schema and methods for authentication.
- `middlewares/auth.js`: Middleware for verifying JWT tokens and protecting routes.
- `controllers/auth`: Controller functions for handling user authentication logic.
- `utils/email.js`: Utility function for sending emails for email verification and password reset.
- `config/`: Directory for configuration files and environment variables.

## Customization

- **Email Templates**: Customize the email templates and content in the `utils/email.js` file.
- **JWT Expiry Time**: Adjust the expiry time for JWT tokens in the `config` or `.env` file.
- **Error Handling**: Customize error messages and handling logic in the route handlers and middleware.

## Deployment

Deploy your authentication-enabled backend application on platforms like Heroku, AWS, or Azure. Ensure to set up environment variables for production deployment.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcryptjs (for password encryption)

