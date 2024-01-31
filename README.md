
# Node.js Authentication System

This Node.js application implements a robust authentication system with both local and Google OAuth authentication strategies. It includes features like user registration, login, password reset, and email verification.

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
4. [Usage](#usage)
5. [License](#license)
6. [Author](#author)

## Features

- User Registration with Email Verification
- Local and Google OAuth Login
- Password Reset Functionality
- Flash Messages for Feedback
- Session-based User Authentication

## Technology Stack

- Node.js: JavaScript runtime for the backend.
- Express.js: Web application framework for Node.js.
- Passport.js: Authentication middleware for Node.js.
- MongoDB: NoSQL database for storing user data.
- Mongoose: MongoDB object modeling for Node.js.
- EJS: Templating engine to render HTML.
- Nodemailer: Module to send emails.
- Bcrypt.js: Library for hashing passwords.
- Dotenv: Module to load environment variables.

## Getting Started

### Prerequisites

- Node.js (version 14 or above)
- MongoDB instance (local or MongoDB Atlas)
- Google API credentials for OAuth
- SMTP server for sending emails

### Installation

1. **Clone the Repository git clone [https://github.com/mrjha2014/nodejs_authentication.git](https://github.com/mrjha2014/nodejs_authentication.git)
   cd nodejs_authentication**
2. **Install Dependencie**

3. **Set up Environment Variables**
   Create a .env file in the root directory of the project. Use .env.example as a template.
   Include your environment variables here.
4. **Run the Application**

npm start

The application will be available at http://localhost:3000.

## Usage

Navigate to http://localhost:3000 and explore the various authentication functionalities:

- Register a new account
- Log in with a local account or Google OAuth
- Reset the password if forgotten
- Verify email after registration
