# Final Setup Guide for GetDoc DMS

Follow these steps exactly to resolve CORS and 404 issues.

## 1. Backend Setup
1. Open a terminal in the `backend` folder.
2. Ensure you have the `.env` file with the following (check your MongoDB string):
   ```env
   MONGODB_URI=mongodb+srv://getdocs:<password>@cluster.mongodb.net/getdoc
   JWT_SECRET=hello123
   PORT=5000
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```
   Check for: `🚀 [GetDoc] Server running on http://localhost:5000`

## 2. Frontend Setup
1. Open a **new** terminal in the root folder (or `frontend` if separated).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
   Check for: `Started server on http://localhost:3000`

## 3. Troubleshooting CORS
If you still see CORS errors:
- Restart both terminals (Ctrl+C and run the commands again).
- Clear your browser cache or try an Incognito window.
- Ensure the Backend URL in `components/auth-form.tsx` is `http://localhost:5000`.
