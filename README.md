# Sales Management System

## 1. Overview
A MERN-based Sales Management System that ingests CSV data and provides a unified dashboard for searching, filtering, sorting, and exploring transactional sales records. The system supports full-text search, multi-select filters, date range queries, and server-side pagination with a clean UI matching the given design.

#LIVE LINK--
Live Demo Link(https://sales-management-system-beige.vercel.app/)

## 2. Tech Stack
**Frontend:** React (CRA), JavaScript, Plain CSS  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Utilities:** csv-parser, dotenv, nodemon  
**Database:** MongoDB with text and field indexes  
**Deployment:** Local development environment

## 3. Search Implementation Summary
- Backend supports text search using MongoDB `$text` index on Sale snapshot fields.
- If text index is unavailable, a regex-based fallback search is used.
- Search looks across customer name, product category, employee name, and raw CSV fields.
- Frontend uses a debounced search bar that sends `q` to the backend only after user stops typing.
- Results are sorted by relevance when using text score.

## 4. Filter Implementation Summary
- Filters implemented: Customer Region, Gender, Age Range, Product Category, Tags, Payment Method, Date Range.
- Each filter uses a dropdown with multi-select checkboxes.
- Frontend normalizes filter values as arrays and omits empty parameters.
- Backend normalizes all query params and constructs combined `$and` filters.
- Age ranges are mapped to `ageMin`/`ageMax` and applied on both snapshot (`raw.Age`) and populated customer fields.

## 5. Sorting Implementation Summary
- Supported sort fields: Date, Customer Name, Quantity, Relevance.
- Default sort: Date (newest first).
- Relevance sort uses MongoDB text score when `$text` search is active.
- Sort direction controlled by `sortDir`.

## 6. Pagination Implementation Summary
- Server-side pagination using `page` and `pageSize`.
- Backend returns: `total`, `page`, `pageSize`, `totalPages`, and `items`.
- Frontend pagination component displays page numbers and next/previous navigation.
- Changing pages triggers a fresh backend query.

## 7. Setup Instructions
### Backend
cd backend
npm install
cp .env.example .env

Set MONGODB_URI and PORT

node src/utils/seed.js src/data/sales.csv
node src/utils/createIndexes.js
npm run dev


### Frontend


cd frontend
npm install
npm start


### Access Application
- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000/api/v1/sales
