# RuScribe Notes App

## Overview

RuScribe is a full-stack notes application that enables users to securely create, update, delete, and manage their notes with an intuitive and seamless user experience. The application uses JWT authentication for secure access, with tokens stored in cookies to perform CRUD operations and account deletions. Additionally, Framer Motion is used for smooth UI animations, while SweetAlert is integrated for alerts and confirmation messages.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Authentication & Authorization:** JSON Web Tokens (JWT) stored in cookies
- **Animations:** Framer Motion
- **Styling:** Webkit considerations, responsive design
- **Alerts & Warnings:** SweetAlert for confirmation messages
- **Deployment:** Vercel (Frontend), Railway (Backend & Database)

## Features

- **User Authentication:** Secure login and registration using JWT authentication. The JWT token is stored in cookies, which are used to authenticate requests.
- **CRUD Operations(with Authorization):** Create, read, update, and delete notes with JWT authentication. Only authorized users (those with a valid JWT token in cookies) can access and modify notes.
- **Delete Account:**  A secure endpoint to delete user accounts, requiring JWT authentication stored in cookies.
- **Error Handling:** Proper validation and error messages ensure a smooth user experience, including handling unauthorized actions.
- **Responsive & Styled UI:** Optimized for different screen sizes, styled with Webkit considerations.
- **Smooth Animations:** Framer Motion provides sleek UI transitions and animations.
- **User Warnings & Alerts:** SweetAlert used for confirmation before deleting, logging out, or saving actions.
- **Deployment:** Hosted on Vercel and Railway for seamless access.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and receive a token
- `DELETE /api/auth/delete-account` - Delete user account (requires JWT authentication and authorization)

### Notes CRUD

- `GET /api/notes` - Fetch all notes (requires JWT authorization)
- `POST /api/notes` - Create a new note (requires JWT authorization)
- `PUT /api/notes/:id` - Update a note (requires JWT authorization)
- `DELETE /api/notes/:id` - Delete a note (requires JWT authorization)

## Author

Developed by **Rutuja Ravindra Padale**. Feedback is welcome!

