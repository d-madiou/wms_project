 # WMS Project - Warehouse Management System

A full-stack warehouse management solution designed to track inventory, manage stock levels across multiple locations, and maintain a strict audit log of all movements (receiving and shipping). The system features Role-Based Access Control (RBAC) to ensure secure operations for Admins, Managers, Operators, and Drivers.

## Technology Stack

### Backend
- Python 3.10+
- Django 5.x
- Django REST Framework (DRF)
- JWT Authentication (SimpleJWT)
- PostgreSQL (Production) / SQLite (Development)

### Frontend
- React.js 18
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Axios (API Communication)
- React Router DOM

### Infrastructure
- Docker & Docker Compose

## Features

- **Dashboard**: Real-time visualization of total stock, low stock alerts, and recent activity logs.
- **Inventory Management**: Create and manage product catalogs (SKUs).
- **Stock Operations**: Unified interface for receiving (Inbound) and shipping (Outbound) items.
- **Warehouse Management**: Define multiple storage locations (Zones/Rows/Bins).
- **Audit Logging**: Immutable history of every stock movement linked to a specific user and timestamp.
- **Role-Based Access Control**:
  - **Admin**: Full access to all modules and user management.
  - **Manager**: Can manage products and view reports.
  - **Operator**: Can execute stock movements (Receive/Ship).
  - **Driver**: Read-only access to view assignments (if implemented).

## Project Structure

```plaintext
root/
├── docker-compose.yml       # Container orchestration
├── wms_backend/             # Django Backend
│   ├── manage.py
│   ├── wms_backend/         # Core settings
│   ├── inventory/           # Product management
│   ├── stock/               # Stock levels & movements
│   ├── warehouses/          # Location management
│   └── users/               # Authentication & Roles
└── wms-frontend/            # React Frontend
    ├── package.json
    ├── vite.config.js
    ├── src/
    │   ├── components/      # Reusable UI (Layout, Navbar)
    │   ├── pages/           # Views (Dashboard, StockOps)
    │   └── services/        # API integration (Axios)
```

## Installation and Setup

### Prerequisites
- Docker and Docker Compose installed on your machine.
- Node.js (optional, for local frontend development outside Docker).

### Quick Start (Docker)

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd wms-project
   ```

2. Build and Run containers:
   ```bash
   docker-compose up --build
   ```

3. Access the Application:
   - **Frontend**: http://localhost:3000 (or http://localhost:5173 depending on configuration)
   - **Backend API**: http://localhost:8000/api/
   - **Admin Panel**: http://localhost:8000/admin/

## Setting up the First User (Superuser)

To log in, you need to create an initial administrator account via the backend container.

1. Open a new terminal while Docker is running.
2. Execute the creation command:
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```
3. Follow the prompts to set a username and password.

## API Endpoints Overview

### Authentication
- `POST /api/token/` - Obtain Access & Refresh tokens.
- `POST /api/token/refresh/` - Refresh an expired token.

### Dashboard
- `GET /api/dashboard/stats/` - Retrieve high-level metrics and recent activity.

### Inventory & Stock
- `GET /api/inventory/products/` - List all products.
- `GET /api/stock/items/` - View current stock levels per location.
- `POST /api/stock/movements/` - Create a stock movement (IN/OUT).

## Development Notes

### Backend Migrations
If you make changes to the database models, run migrations inside the container:
```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### Frontend Environment
The frontend relies on the backend running at http://localhost:8000. If you change ports, update the axios base URL in `src/services/`


