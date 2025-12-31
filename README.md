# GetDoc - Document Management System (DMS)

GetDoc is a professional Document Management System built with a separated MEAN stack architecture (Node.js/Express Backend and React/Next.js Frontend).

## Project Structure
- `/backend`: Node.js/Express server with MongoDB/Mongoose.
- `/frontend`: React/Next.js client interface.

## Prerequisites
- **Node.js**: v18.x or later
- **MongoDB**: Local instance or MongoDB Atlas URI
- **VS Code**: Recommended editor

---

## Step 1: Backend Setup
1. Open a terminal in the `/backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `/backend` and add your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/getdoc
   JWT_SECRET=your_super_secret_key
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

## Step 2: Frontend Setup
1. Open a new terminal in the root or `/frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## UI Screenshots:

<img src="Screenshot 2025-12-31 at 16.12.34.png" width="60%" alt="Dashboard Screenshot" />

---

## Key Features
- **Authentication**: Secure Login/Registration with JWT.
- **Document Management**: Create, Read, Update, and Delete documents.
- **Versioning**: Automatic version tracking on every update.
- **Tagging**: Categorize documents for easy search and filtering.
- **Permissions**: Manage user-level access (Viewer/Editor).

## Troubleshooting
- **CORS Issues**: Ensure the backend `CORS` middleware is configured to allow `http://localhost:3000`.
- **Database Connection**: Verify your MongoDB service is running locally if using `localhost`.
