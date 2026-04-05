# 🚀 FinSecure API

A secure and scalable **Finance Management Backend API** built using **Node.js, Express, and MongoDB**.
It supports **role-based access control, financial record management, dashboard analytics, filtering, and secure authentication**.

---

# 📌 Overview

FinSecure is designed as a backend system for a finance dashboard where users can manage financial records (income & expenses) with proper access control.

It demonstrates:

* Clean backend architecture
* Role-based authorization
* Secure authentication
* Aggregation-based analytics

---

# ✨ Features

## 🔐 Authentication & Security

* User registration & login
* Cookie-based JWT authentication
* Password hashing using bcrypt
* Protected routes via middleware

---

## 👥 Role-Based Access Control (RBAC)

| Role    | Permissions                          |
| ------- | ------------------------------------ |
| Admin   | Full access (CRUD + user management) |
| Analyst | Read records + dashboard             |
| Viewer  | Dashboard only                       |

---

## 💰 Financial Records Management

* Create records (Admin only)
* Read records (Admin + Analyst)
* Update/Delete records (Admin only)
* Filtering by:

  * type (income/expense)
  * category
  * date range

---

## 📊 Dashboard Analytics

* Total Income
* Total Expense
* Net Balance
* Category-wise totals
* Recent activity (latest transactions)

---

## 👤 User Management (Admin Only)

* Get all users
* Update user role
* Activate / deactivate users
* First registered user becomes Admin automatically

---

## ⚠️ Validation & Error Handling

* Input validation for all APIs
* Proper HTTP status codes
* Meaningful error responses

---

# 🛠️ Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB + Mongoose
* **Authentication**: JWT + Cookies
* **Security**: bcrypt

---

# 📁 Project Structure

```
finsecure-api/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── config/
│   └── app.js
├── server.js
├── .env
├── package.json
```

---

# ⚙️ Setup & Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Ramank07/finsecureApi.git
cd finsecure-api
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Create `.env` File

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 4️⃣ Run the Server

### Development

```bash
npm run dev
```

### Production

```bash
node server.js
```

---

## 🌐 Server Runs On

```
http://localhost:5000
```

---

# 🔐 Authentication Flow

1. Register user
2. Login → JWT stored in cookie 🍪
3. Cookie used automatically in requests
4. Middleware verifies user

---

# 📡 API Endpoints

---

## 🔑 Auth APIs

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register user |
| POST   | `/api/auth/login`    | Login         |
| POST   | `/api/auth/logout`   | Logout        |

---

## 💰 Record APIs

| Method | Endpoint           | Role           |
| ------ | ------------------ | -------------- |
| POST   | `/api/records`     | Admin          |
| GET    | `/api/records`     | Admin, Analyst |
| PATCH  | `/api/records/:id` | Admin          |
| DELETE | `/api/records/:id` | Admin          |

---

### 🔍 Filtering Example

```
GET /api/records?type=expense&category=food&startDate=2026-04-01
```

---

## 📊 Dashboard API

| Method | Endpoint         | Role |
| ------ | ---------------- | ---- |
| GET    | `/api/dashboard` | All  |

---

## 👤 User APIs (Admin Only)

| Method | Endpoint                | Description   |
| ------ | ----------------------- | ------------- |
| GET    | `/api/users`            | Get all users |
| PATCH  | `/api/users/:id/role`   | Change role   |
| PATCH  | `/api/users/:id/status` | Update status |

---

# 📊 Dashboard Response Example

```json
{
  "totalIncome": 50000,
  "totalExpense": 20000,
  "netBalance": 30000,
  "categoryWiseTotal": [
    { "_id": "salary", "total": 50000 },
    { "_id": "food", "total": 7000 }
  ],
  "recentActivity": [
    {
      "amount": 2000,
      "type": "expense",
      "category": "food"
    }
  ]
}
```

---

# ⚠️ Error Handling

| Code | Meaning      |
| ---- | ------------ |
| 400  | Bad request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not found    |
| 500  | Server error |

---

# 🔐 Security Features

* Password hashing (bcrypt)
* JWT authentication (cookies)
* Role-based authorization
* Input validation
* Protected routes

---

# 🧠 Key Design Decisions

* First user auto becomes Admin
* Roles enforced via middleware
* Aggregation used for dashboard
* Separation of concerns (MVC pattern)

---

# 🏆 What This Project Demonstrates

✔ Backend architecture design
✔ Role-based access control
✔ Secure authentication
✔ Data aggregation & analytics
✔ API design best practices

---

# 👤 Author

**Raman Kumar**

---

# 🚀 Future Improvements

* Pagination & sorting
* Advanced analytics (monthly trends)
* Rate limiting
* Refresh tokens
* API documentation (Swagger)

---

# 📄 License

ISC

---
