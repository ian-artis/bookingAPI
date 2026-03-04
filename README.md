CourseBookingAPI — README.md
A fully functional Course Booking REST API built with Node.js, Express, and PostgreSQL, featuring JWT authentication, role‑based access control, and admin‑restricted course/user management.
This MVP is designed for real‑world backend learning and future expansion.

Features
Authentication
- User registration (public)
- User login (public)
- JWT‑based authentication
- Admin role support
Role‑Based Access
Admin can:
- Create users
- Create courses
- Update courses
- Toggle user active/inactive
- Toggle course active/inactive
- View all users
- View all courses
- View all enrollments
- Delete users
- Delete courses
- Delete enrollments
User can:
- Register
- Login
- Enroll in active courses only
- View their own enrollments

Project Structure
project/
  config/
    db.js
  controllers/
    authController.js
    userController.js
    courseController.js
    enrollmentController.js
  middleware/
    auth.js
  routes/
    authRoutes.js
    userRoutes.js
    courseRoutes.js
    enrollmentRoutes.js
  index.js
  README.md
  .env.example
  package.json



🛠 Installation
1. Clone the repository
git clone https://github.com/yourusername/CourseBookingAPI.git
cd CourseBookingAPI


2. Initialize the project and install dependencies
npm init -y
npm install

change type in package.json
from
{
    "type":"commonjs" 
}
to
{
    "type":"module" 
}
add scripts to package.json
"scripts": {
  "start": "node index",
  "dev": "nodemon index"
}



3. Create .env file
Copy .env.example → .env and fill in:
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_NAME=coursebooking
DB_PORT=5432

JWT_SECRET=your_secret_key
PORT=4000



🗄 Database Setup
1. Create database
CREATE DATABASE coursebooking;


2. Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile_no VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


3. Create your first admin manually
INSERT INTO users (first_name, last_name, email, password, is_admin)
VALUES ('Admin', 'User', 'admin@example.com', '<hashed_password>', TRUE);


To generate a hashed password:
node -e "console.log(require('bcrypt').hashSync('yourpassword', 10))"



Running the Server
npm run dev


Server runs at:
http://localhost:4000



API Routes

AUTH ROUTES (Public)
POST /auth/register
Register a normal user.
POST /auth/login
Login and receive JWT token.

 USER ROUTES (Admin Only)

METHOD    | Endpoint            | Description
POST      | /users              | Create user
GET       | /users              | Get all users
GET       | /users/:id          | Get single user
PUT       | /users/:id          | Update user
PATCH     | /users/:id/toggle   | Toggle active/inactive
DELETE    | /users/:id          | Delete user

 COURSE ROUTES (Admin Only)

METHOD    | Endpoint            | Description
POST      | /courses            | Create course
GET       | /courses            | Get all courses
GET       | /courses/:id        | Get single course
PUT       | /courses/:id        | Update course
PATCH     | /courses/:id/toggle | Toggle active/inactive
DELETE    | /courses/:id        | Delete Course


 ENROLLMENT ROUTES

User Only

METHOD    | Endpoint            | Description
POST      | /enrollments        | Enroll in active course
GET       | /enrollments/me     | View my enrollments

Admin Only

METHOD    | Endpoint            | Description
POST      | /enrollments        | View all enrollments
DELETE    | /enrollments/id     | Delete enrollment



Authentication Header
For protected routes, include:
Authorization: Bearer <your_token_here>



Roadmap (Future Enhancements)
- Refresh tokens
- Password reset
- Pagination
- Search & filtering
- Admin dashboard UI
- Frontend integration (React/Vue)

Contributing
Pull requests are welcome.
For major changes, open an issue first to discuss what you’d like to change.

