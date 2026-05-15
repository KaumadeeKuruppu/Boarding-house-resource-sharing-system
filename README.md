# Boarding House Resource Sharing System

A full-stack web application that enables boarding house residents to list, discover, and manage shared items — fostering a community-driven sharing economy within student accommodations.

---

## Problem Description

Students living in boarding houses often purchase or bring everyday items — kitchenware, electronics, stationery — that sit idle most of the time. Without any organized system, residents have no way of knowing what others have available to borrow or share, which leads to:

- Unnecessary duplicate purchases
- Wasted resources and money
- Missed opportunities for community collaboration

---

## Proposed Solution

The Boarding House Resource Sharing System provides a centralized digital platform where boarders can:

- List items they are willing to share with others
- Browse available items shared by fellow residents
- Manage their own listings with full CRUD capability
- Toggle item availability in real time
- Search and filter items by name, category, or availability status

This promotes a sharing culture, reduces waste, and builds a stronger sense of community in student accommodations.

---

## Features

- View all shared items in a responsive card grid
- Add new items with name, category, boarding address, and contact details
- Edit existing listings at any time
- Delete a listing with a confirmation step to prevent accidents
- Toggle availability between *Available* and *Not Available* with a single click
- Real-time search across item name, category, owner name, and address
- Filter items by category (Kitchen, Study, Electronics, Furniture, and more)
- Filter items by availability status
- Toast notifications for instant feedback on all actions
- Skeleton loading placeholders while data is being fetched
- Responsive layout that works across desktop and mobile screens

---

## Technologies Used

### Backend

- **Node.js** — JavaScript runtime environment
- **Express.js v5** — RESTful API framework
- **MongoDB** — NoSQL database for storing item data
- **Mongoose** — MongoDB ODM for schema modeling
- **dotenv** — Environment variable management
- **cors** — Cross-Origin Resource Sharing
- **body-parser** — Request body parsing middleware
- **nodemon** — Auto-restart server during development

### Frontend

- **React 19** — UI library for building components
- **Axios** — HTTP client for API communication
- **Lucide React** — Icon library
- **React Router DOM** — Client-side routing
- **CSS (Vanilla)** — Custom dark-themed styling

---

## API Endpoints

**Base URL:** `http://localhost:8000/api/item`

---

### POST `/api/item/create`

Create a new shared item listing.

**Request Body**
```json
{
  "itemName": "Electric Kettle",
  "category": "Kitchen",
  "ownerName": "Kaumadee",
  "boardingAddress": "No. 12, Kandy Road, Peradeniya",
  "contact": "0712345678",
  "availability": "Available"
}
```

**Success — 200 OK**
```json
{
  "message": "Item shared successfully!",
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "itemName": "Electric Kettle",
    "category": "Kitchen",
    "ownerName": "Kaumadee",
    "boardingAddress": "No. 12, Kandy Road, Peradeniya",
    "contact": "0712345678",
    "availability": "Available"
  }
}
```

**Error — 400 Bad Request**
```json
{
  "message": "Item name and contact are required"
}
```

---

### GET `/api/item/getall`

Retrieve all shared item listings.

**Success — 200 OK**
```json
[
  {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "itemName": "Electric Kettle",
    "category": "Kitchen",
    "ownerName": "Kaumadee",
    "boardingAddress": "No. 12, Kandy Road, Peradeniya",
    "contact": "0712345678",
    "availability": "Available"
  },
  {
    "_id": "664f1a2b3c4d5e6f7a8b9c0e",
    "itemName": "Study Lamp",
    "category": "Study",
    "ownerName": "Nimal",
    "boardingAddress": "No. 5, Temple Road, Nugegoda",
    "contact": "0776543210",
    "availability": "Not Available"
  }
]
```

**Error — 404 Not Found**
```json
{
  "message": "No items found."
}
```

---

### PUT `/api/item/update/:id`

Update an existing item by its ID.

**URL Parameter:** `:id` — the MongoDB `_id` of the item

**Request Body** (include any field to update)
```json
{
  "availability": "Not Available"
}
```

**Success — 201**
```json
{
  "message": "Item updated successfully!",
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "itemName": "Electric Kettle",
    "category": "Kitchen",
    "ownerName": "Kaumadee",
    "boardingAddress": "No. 12, Kandy Road, Peradeniya",
    "contact": "0712345678",
    "availability": "Not Available"
  }
}
```

**Error — 404 Not Found**
```json
{
  "message": "Item not found."
}
```

---

### DELETE `/api/item/delete/:id`

Delete an item by its ID.

**URL Parameter:** `:id` — the MongoDB `_id` of the item

**Success — 201**
```json
{
  "message": "Item deleted Successfully."
}
```

**Error — 404 Not Found**
```json
{
  "message": "Item Not Found."
}
```

---

## Setup Instructions

### Prerequisites

Ensure the following are installed on your machine:

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string

---

### 1. Clone the Repository

```bash
git clone https://github.com/KaumadeeKuruppu/Boarding-house-resource-sharing-system.git
cd Boarding-house-resource-sharing-system
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT = 8000
MONGO_URL = "mongodb://localhost:27017/boarding_db"
```

> Replace `MONGO_URL` with your MongoDB Atlas URI if using cloud hosting.

### 3. Install Backend Dependencies

```bash
npm install
```

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 5. Admin Login

The frontend includes a **built-in Admin Login** page to protect the dashboard. No backend changes are needed — authentication is handled entirely on the client side.

- **Default Password:** `admin123`
- When you open the app at `http://localhost:3000`, the login screen is shown first
- Enter the admin password and click **Sign In** to access the dashboard
- Your login session is saved in `localStorage` — refreshing the page will keep you logged in
- Click the **Logout** button in the top-right corner of the header to end the session

> **Note:** To change the password, update the `ADMIN_PASSWORD` constant in `frontend/src/App.js`.

---

## How to Run the Project

You need two separate terminals — one for the backend and one for the frontend.

### Terminal 1 — Backend

Run from the root directory:

```bash
npm start
```

Expected output:
```
Database connected successfully.
Server is running on port: 8000
```

### Terminal 2 — Frontend

Run from the `frontend/` directory:

```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!
Local: http://localhost:3000
```

---

## Project Structure

```
Boarding-house-resource-sharing-system/
│
├── controller/
│   └── itemController.js        # CRUD business logic
│
├── model/
│   └── itemModel.js             # Mongoose schema definition
│
├── routes/
│   └── itemRoute.js             # Express route definitions
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ItemCard.js      # Item display card
│       │   ├── ItemModal.js     # Add / Edit modal
│       │   ├── ConfirmDialog.js # Delete / toggle confirmation dialog
│       │   └── Toast.js         # Notification component
│       ├── App.js               # Root application component
│       ├── App.css              # Global styles
│       └── index.js             # React entry point
│
├── index.js                     # Express server entry point
├── package.json                 # Backend dependencies
├── .env                         # Environment variables (not committed)
└── README.md                    # Project documentation
```

---

## Item Data Model

- **`itemName`** *(String, Required)* — Name of the shared item
- **`category`** *(String, Required)* — Category (Kitchen, Study, Electronics, etc.)
- **`ownerName`** *(String, Required)* — Name of the person sharing the item
- **`boardingAddress`** *(String, Required)* — Address of the owner's boarding house
- **`contact`** *(String, Required)* — Contact number (minimum 10 digits)
- **`availability`** *(String, Optional, Default: `"Available"`)* — Current availability status

---

## License

This project is licensed under the ISC License.

---

## Repository

[github.com/KaumadeeKuruppu/Boarding-house-resource-sharing-system](https://github.com/KaumadeeKuruppu/Boarding-house-resource-sharing-system)
