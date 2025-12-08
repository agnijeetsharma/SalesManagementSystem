# Architecture Document

## 1. Backend Architecture
The backend is built using Node.js, Express.js, and MongoDB. It follows a modular, service-driven architecture with clear separation between routing, controllers, services, repositories, and models.

### Components
- **Routes**  
  Define API endpoints and map them to controllers. Primary route: `/api/v1/sales`.

- **Controllers**  
  Handle incoming requests, normalize query parameters, invoke service methods, and send responses.

- **Services**  
  Contain business logic for search, filtering, sorting, and pagination. Build MongoDB queries using `$and`, `$text`, and fallback regex logic. Populate related entities when requested.

- **Repositories**  
  Provide data access utilities (upsert for Customer, Product, Employee). Used primarily by the CSV seeder.

- **Models**  
  MongoDB schemas for `Sale`, `Customer`, `Product`, and `Employee`.  
  - `Sale` stores relationships, snapshot values, numeric fields, and raw CSV rows.  
  - Text indexes are defined for search fields.

- **Utils**  
  - `seed.js` ingests CSV, upserts dependencies, and stores sales with raw data.  
  - `createIndexes.js` synchronizes MongoDB indexes.  
  - `parseCurrency.js` handles currency parsing.

### Key Backend Features
- Server-side search using `$text` with relevance score or regex fallback.
- Combined filtering via `$and` logic across region, tags, payment method, product category, gender, and date range.
- Age filtering mapped from UI selections to `ageMin`/`ageMax`.
- Pagination and sorting performed fully on the database.
- Populated fields for customer/product/salesperson during response formatting.

---

## 2. Frontend Architecture
The frontend is a React application structured around modular, reusable components and a single global parameter state.

### Components
- **SearchBar**  
  Debounced search input that updates `q` after pause in typing.

- **FilterDropdown**  
  Generic dropdown with multi-select checkboxes, apply/clear actions, and outside-click closing.

- **Filters**  
  Combines all dropdowns and date inputs to control `params`. All filters update the global state using `updateParams`.

- **SummaryCards**  
  Shows total units sold, total amount, and total discount using aggregated values from the current page.

- **Table**  
  Renders the 13 columns required by the UI specification. Uses populated entities first, falling back to snapshots or raw CSV data.

- **Pagination**  
  Client UI that triggers backend page changes.

- **API Layer (api/sales.js)**  
  Builds query strings, omits empty values, and handles fetch calls.

### Frontend State Flow
- User interacts with search or filters.  
- Component updates global `params`.  
- `useEffect` triggers a backend call with updated params.  
- API returns paginated results and frontend updates UI sections simultaneously.

---

## 3. Data Flow

### CSV → Database
1. CSV is read row-by-row using `csv-parser`.  
2. Customer, Product, and Employee records are upserted.  
3. A Sale document is created using:
   - References to customer/product/employee.
   - Snapshot fields (name, region, product category).
   - Numeric fields (quantity, totals).
   - Complete raw row for fallback use.

### User Request → Backend → Database → Frontend
1. Frontend builds query params (`q`, filters, sort, pagination) and sends a GET request.  
2. Controller normalizes parameters into arrays, numbers, and dates.  
3. Service composes MongoDB filters and builds the final query.  
4. Database returns paginated results with populated relations.  
5. Frontend updates table, filters, summary cards, and pagination simultaneously.

---

## 4. Folder Structure

### Backend
backend/
src/
app.js
db/
index.js
models/
Sale.js
Customer.js
Product.js
Employee.js
repositories/
customerRepo.js
productRepo.js
employeeRepo.js
services/
salesService.js
controllers/
salesController.js
routes/
salesRoutes.js
utils/
seed.js
createIndexes.js
parseCurrency.js


### Frontend


frontend/
src/
index.js
index.css
App.js
api/
sales.js
components/
SearchBar.jsx
FilterDropdown.jsx
Filters.jsx
SummaryCards.jsx
Table.jsx
Pagination.jsx




---

## 5. Module Responsibilities

### Backend Modules
- **db/index.js**  
  Initialize MongoDB connection.

- **models/**  
  Define schemas, indexes, and relationships.

- **repositories/**  
  Handle create/upsert logic for related entities.

- **services/salesService.js**  
  Central query builder: search, filtering, sorting, pagination, populate.

- **controllers/salesController.js**  
  Receive HTTP requests, normalize inputs, return JSON responses.

- **routes/salesRoutes.js**  
  Define REST endpoints.

- **utils/**  
  CSV ingestion, index synchronization, currency parsing.

### Frontend Modules
- **App.js**  
  Global state and data fetch management.

- **SearchBar**  
  Debounced text search.

- **Filters**  
  Filter controls for all supported fields.

- **FilterDropdown**  
  Multi-select dropdown logic.

- **Table**  
  Final 13-column display with snapshot and relation fallback.

- **SummaryCards**  
  KPI metrics computation and display.

- **Pagination**  
  Navigation for pages.

- **sales.js (API)**  
  Builds URL query string, omits empty params, and performs fetch.

---

