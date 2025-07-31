# Full Stack User Management App

## Backend Setup

**Step 1:** Set up MongoDB database and Express backend  
- Created `User` model using Mongoose  
- Configured environment variables and MongoDB connection  
- Initialized Express server

**Step 2:** Set up frontend with React.js  
- React frontend created using `create-react-app` or Vite  
- TailwindCSS or basic CSS used for styling

**Step 3:** Create a user  
- API: `POST /api/users`  
- Accepts form data with profile image using `multer`

**Step 4:** Get all users  
- API: `GET /api/users`  
- Used to fetch all users for the listing page

**Step 5:** Get user by ID  
- API: `GET /api/users/:id`  
- Used when viewing or editing a specific user

**Step 6:** Update user  
- API: `PUT /api/users/:id`  
- Updates user details with profile image support

**Step 7:** Delete user  
- API: `DELETE /api/users/:id`

**Step 8:** All APIs tested in Postman

## File Upload & Export Features

**Step 9:** Set up `multer` middleware for file uploads  
- Stores profile images in `/uploads` directory

**Step 10:** Search API already created  
- Supports searching users by name/email/mobile

**Step 11:** Export users to CSV  
- API: `GET /api/users/export/csv`  
- Downloads all user data in CSV format

**Step 12:** All API functionalities tested via Postman

## Frontend Setup & Features

**Step 13:** Frontend integrated with backend APIs using `axios`

**Step 14:** User list table with:
- Profile photo, name, email, mobile, status
- Search bar to filter users
- "Edit", "Delete", and "View" buttons per user
- 3-dot menu implemented using `headlessui`

**Step 15:** Create User Form
- Adds new user with validation
- Profile image upload with preview

**Step 16:** Edit User Form
- Pre-populates fields with existing user data
- Allows updating user details and profile image

**Step 17:** View User Page
- Displays user details in read-only mode
- Shows full image and metadata

**Step 18:** Export to CSV button on UI
- Triggers backend CSV download API

**Step 19:** Loader/spinner added during data fetch
- Used `react-spinners` for React 19 compatibility

**Step 20:** Responsive UI using TailwindCSS

---


