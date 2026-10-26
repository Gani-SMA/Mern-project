# ResolveIT - Multi-Tenant Customer Support Platform

ResolveIT is a multi-tenant customer support and complaint management web application built on the MERN stack (MongoDB, Express, React, Node.js). It allows multiple companies to run their own branded support desks with isolated data, custom FAQs, ticket workflows, priority response deadlines, and customer feedback ratings.

---

## What It Does

Most support tools are either single-company or very expensive enterprise software. ResolveIT gives multiple businesses a shared platform with strict data separation:

- Each company gets its own public help center URL (example: `/s/technova` or `/s/quickcart`).
- Customers can search FAQs, submit tickets, track status using ticket IDs, chat with assigned agents, and leave star ratings once resolved.
- Support teams have an internal portal (example: `/portal/technova`) to view ticket queues, add private team notes, reply to customers, and track response times.
- Super Admins have a global dashboard to add new companies, assign developer accounts, and monitor overall ticket volumes across all companies.

---

## User Roles and Access

ResolveIT has four distinct user roles:

### 1. Super Admin
- Platform-wide control.
- Creates and manages companies.
- Creates and assigns Developer accounts for each company.
- Views system-wide ticket counts, response times, and resolution rates.
- URL: `/admin`

### 2. Company Developer (Company Lead)
- Configures company-specific settings and branding.
- Adds and customizes FAQ articles and ticket categories.
- Hires and manages support agents (Employees).
- Views company-level performance analytics and customer ratings.
- URL: `/portal/:companySlug`

### 3. Support Employee (Agent)
- Assigned to incoming customer tickets.
- Replies directly to customer messages in a live thread.
- Leaves internal notes visible only to teammates.
- Updates ticket status (Open, In Progress, Resolved, Closed).
- Monitored by response deadlines based on ticket priority.
- URL: `/portal/:companySlug`

### 4. Customer
- Accesses the public service page (`/s/:companySlug`).
- Reads FAQs to find answers quickly.
- Signs in via Google authentication to submit complaints.
- Tracks complaint progress in real time using their ticket ID.
- Rates resolved tickets from 1 to 5 stars.

---

## Tech Stack

### Frontend
- React 19
- Vite
- React Router v7
- Lucide React (icons)
- Vanilla CSS design system (responsive, dark/light theme support)

### Backend
- Node.js & Express.js
- MongoDB Atlas with Mongoose ODM
- JSON Web Tokens (JWT) for staff session management
- Google OAuth 2.0 (`google-auth-library`) for customer login
- bcryptjs for password hashing

---

## Project Structure

```
ICL/
├── server/
│   ├── config/             # Database connection setup
│   ├── middleware/         # JWT auth and role check middleware
│   ├── models/             # Mongoose schemas (User, Company, Ticket, Category, Article)
│   ├── routes/             # Express route handlers (auth, admin, companies, tickets, etc.)
│   ├── app.js              # Express app setup and middleware
│   ├── index.js            # Server entry point (port 5000)
│   ├── seedData.js         # Initial seed script for demo companies and accounts
│   └── resetDb.js          # Database reset and clean re-seed script
├── src/
│   ├── components/         # Shared UI components and ProtectedRoute wrapper
│   ├── context/            # AuthContext (state, tokens, user session)
│   ├── pages/
│   │   ├── admin/          # Super Admin pages (Dashboard, Companies, Developers)
│   │   ├── portal/         # Company internal staff pages (Dashboard, Tickets, Agents, Customizer)
│   │   ├── service/        # Public customer pages (Help desk, Complaint form, Tracker, History)
│   │   └── LandingPage.jsx # Main platform landing page
│   ├── App.jsx             # Client routing configuration
│   └── index.css           # Global stylesheet and responsive design system
├── .env.example            # Template for environment variables
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite build configuration
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm
- MongoDB Atlas account or a local MongoDB database

### 1. Clone the repository
```bash
git clone https://github.com/LakkakulaPenchalaPrasad/ICL.git
cd ICL
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root based on `.env.example`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
CLIENT_URL=http://localhost:5173
```

### 4. Seed sample data
Populate the database with default companies, admin accounts, sample tickets, and FAQs:

```bash
node server/seedData.js
```

If you ever need to reset and re-seed from scratch:
```bash
node server/resetDb.js
```

### 5. Start the development servers
Run both the Express backend and Vite frontend together:

```bash
npm start
```

Or run them individually in separate terminals:
- Backend: `npm run server` (runs on `http://localhost:5000`)
- Frontend: `npm run dev` (runs on `http://localhost:5173`)

---

## Default Login Credentials

Use these seeded accounts to test different roles:

| Role | Email | Password | Access Area |
|---|---|---|---|
| Super Admin | `admin@resolveit.com` | `admin123` | Platform Control (`/admin`) |
| TechNova Lead (Developer) | `dev@technova.com` | `dev123` | TechNova Portal (`/portal/technova`) |
| TechNova Agent (Employee) | `agent@technova.com` | `agent123` | TechNova Tickets (`/portal/technova`) |
| QuickCart Lead (Developer) | `dev@quickcart.com` | `dev123` | QuickCart Portal (`/portal/quickcart`) |
| QuickCart Agent (Employee) | `agent@quickcart.com` | `agent123` | QuickCart Tickets (`/portal/quickcart`) |

Customers sign in with their Google account directly on any public service desk page.

---

## Key URLs

- Home Page: `http://localhost:5173/`
- Super Admin Dashboard: `http://localhost:5173/admin`
- TechNova Public Desk: `http://localhost:5173/s/technova`
- TechNova Staff Portal: `http://localhost:5173/portal/technova`
- QuickCart Public Desk: `http://localhost:5173/s/quickcart`
- QuickCart Staff Portal: `http://localhost:5173/portal/quickcart`
- Ticket Tracking Sample: `http://localhost:5173/s/technova/track/TNS-2026-0001`

---

## API Endpoints

### Auth
- `POST /api/auth/login` - Staff email/password login
- `POST /api/auth/google` - Customer Google OAuth verification
- `GET /api/auth/me` - Fetch currently authenticated user session

### Super Admin
- `GET /api/admin/stats` - Cross-tenant ticket metrics and resolution rates
- `GET /api/admin/companies` - List all registered companies
- `POST /api/admin/companies` - Create a new company
- `PUT /api/admin/companies/:id` - Update company details
- `DELETE /api/admin/companies/:id` - Delete a company
- `GET /api/admin/developers` - List all company developer accounts
- `POST /api/admin/developers` - Create or assign a developer account

### Company Portal
- `GET /api/companies/:slug` - Get public company branding, categories, and settings
- `PUT /api/companies/:id` - Update company branding, logo, and categories
- `GET /api/companies/:companyId/employees` - List company support agents
- `POST /api/companies/:companyId/employees` - Add a new support agent
- `DELETE /api/companies/:companyId/employees/:employeeId` - Remove a support agent

### Tickets
- `GET /api/tickets` - List company tickets (supports status/priority filters)
- `GET /api/tickets/:id` - Get ticket details and conversation thread
- `POST /api/tickets` - Submit a new ticket (generates reference code like `TNS-2026-0001`)
- `PUT /api/tickets/:id` - Update status, priority, or assigned agent
- `POST /api/tickets/:id/messages` - Add public reply or private internal note
- `POST /api/tickets/:id/rating` - Customer satisfaction star rating (1 to 5)
- `GET /api/tickets/track/:referenceId` - Public tracking endpoint by ticket code
- `GET /api/tickets/customer/my-tickets` - List logged-in customer's tickets

### Knowledge Base & Analytics
- `GET /api/articles` - Public FAQ articles filtered by company
- `POST /api/articles` - Create FAQ article (staff only)
- `PUT /api/articles/:id` - Edit FAQ article
- `DELETE /api/articles/:id` - Delete FAQ article
- `GET /api/analytics/company/:companyId` - Ticket volume, average resolution time, and rating metrics
