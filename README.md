# Library Management System

A web-based Library Management System built with Bootstrap, MySQL, Express, NodeJS.

### Features

  . Responsive UI with Bootstrap and static HTML pages
  . User and staff login with session-based authentication
  . User registration with password hashing (bcrypt)
  . Validation of data using express-validator
  . Display of Members and Books
  . Display of total number of books

### Setup

  1. Clone the repository
  2. Install dependancies with "npm install" command
  3. Set up your environment variables
       . Create a .env file
       .  Add your MySQL and session secret credentials
     
            DB_HOST=your_db_host
            DB_USER=your_db_user
            DB_PASSWORD=your_db_password
            SESSION_SECRET=your_secret_key

  5. Start the server with "npm start" command

### API Endpoints

  POST /api/user/register - Register a new user.
  POST /api/user/login - Login for users.
  POST /api/staff/login - Login for staff.
  GET /api/get-books - Retrieve available books.
  GET /api/get-members - Retrieve library members.
  POST /api/user/logout - Log out from the session.
