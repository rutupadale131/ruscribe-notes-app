# RuScribe Notes App

## Overview

RuScribe is a full-stack notes application that allows users to securely create, update, delete, and manage their notes with a smooth user experience. It features JWT authentication, a REST API for CRUD operations, and a visually appealing UI with Framer Motion animations.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Authentication:** JSON Web Tokens (JWT)
- **Animations:** Framer Motion
- **Styling:** Webkit considerations, responsive design
- **Alerts & Warnings:** SweetAlert for confirmation messages
- **Deployment:** Vercel (Frontend), Railway (Backend & Database)

## Features

- **User Authentication:** Secure login and registration using JWT authentication.
- **CRUD Operations:** Create, read, update, and delete notes through a REST API.
- **Delete Account:** API for securely deleting user accounts.
- **Error Handling:** Proper validation and error messages to ensure a smooth user experience.
- **Responsive & Styled UI:** Optimized for different screen sizes, styled with Webkit considerations.
- **Smooth Animations:** Framer Motion provides sleek UI transitions and animations.
- **User Warnings & Alerts:** SweetAlert used for confirmation before deleting, logging out, or saving actions.
- **Deployment:** Hosted on Vercel and Railway for seamless access.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and receive a token
- `DELETE /api/auth/delete-account` - Delete user account

### Notes CRUD

- `GET /api/notes` - Fetch all notes
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Author

Developed by **Rutuja Ravindra Padale**. Feedback is welcome!

