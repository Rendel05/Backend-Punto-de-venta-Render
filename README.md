# E-commerce Backend API

## Description
This repository contains the backend API for an e-commerce/POS platform. It centralizes authentication, catalog and content management, customer and internal user administration, online order checkout, Mercado Pago payment processing, and post-payment order tracking.

The backend exposes REST endpoints under `/api` and persists data in MySQL using direct SQL queries via `mysql2/promise`.

## Features
- **Authentication & authorization**
  - Login with alias/password.
  - JWT generation and validation.
  - Role-based access control (`Admin`, `Cajero`, `Cliente`).
- **Catalog management**
  - Product CRUD (with status toggling).
  - Product image upload to Cloudinary.
  - Category filtering, text search, and popular products.
  - Offer management (create/update/activate/deactivate + active offers listing).
- **Customer and staff management**
  - Customer registration and profile/password updates.
  - Admin management of internal users.
  - Supplier listing.
- **Order management**
  - Customer order history and order detail endpoints.
  - Approved online orders retrieval by authenticated customer.
- **Payment processing (Mercado Pago)**
  - Checkout preference creation from cart data.
  - Pending order creation before payment.
  - Webhook-based payment status reconciliation.
  - Stock discount only on approved payments.
- **Additional business modules**
  - Product reviews.
  - Editable static page content.
  - Cashier sales/withdrawals history and daily cash-out cut.
  - Customer-growth summary and projection module.

## Tech Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** MySQL (`mysql2/promise` connection pool)
- **Authentication/Security:** `jsonwebtoken`, `bcrypt`
- **Payments:** `mercadopago` SDK
- **File upload/media:** `multer`, `cloudinary`, `streamifier`
- **Other:** `cors`, `dotenv`, `nodemon`

## Architecture
The project follows a **layered MVC-style API structure**:

- `src/routes/` → HTTP route definitions and middleware composition.
- `src/controllers/` → request validation/flow orchestration + HTTP responses.
- `src/models/` → data access layer with SQL queries.
- `src/services/` → domain logic utilities (prediction math).
- `src/middlewares/` → JWT auth, RBAC, upload handling, Cloudinary upload.
- `src/config/` → database pool and Cloudinary setup.
- `app.js` → global middleware + route mounting.
- `server.js` → application bootstrap and port binding.

## API Endpoints
> Base URL prefix: `http://<host>:<port>/api`

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/login` | Public | Authenticates user and returns JWT token. |

### Products
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/products` | Admin | Paginated list of all products. |
| GET | `/products/active` | Public | Paginated list of active products (offer-aware view). |
| GET | `/products/search?search=&page=&limit=` | Public | Search active products by name/description/category. |
| GET | `/products/popular` | Public | Top popular active products. |
| GET | `/products/category/:id` | Public | Active products by category. |
| GET | `/products/:id` | Public | Single active product detail. |
| POST | `/products` | Admin | Creates product (supports multipart image upload). |
| PUT | `/products/:id` | Admin | Updates product (supports image replacement). |
| PUT | `/products/:id/status` | Admin | Activates/deactivates product. |

### Orders
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/orders?order=ASC|DESC&limit=` | Cliente | Returns approved orders for authenticated customer. |
| GET | `/orders/:id` | Cliente | Returns detail for one approved customer order. |

### Payments
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/payment/create-preference` | Cliente | Validates cart, creates pending online sale, returns Mercado Pago checkout URL (`init_point`). |
| POST | `/webhook/mercadopago` | Public (provider callback) | Receives Mercado Pago payment notifications and updates order status/stock. |

### Customers
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/customers` | Public | Registers a new customer account + profile. |
| GET | `/customers/:id` | Cliente | Gets customer profile by user id. |
| PUT | `/customers/:id` | Cliente | Updates customer profile. |
| PUT | `/customers/:id/password` | Cliente | Updates customer password. |
| DELETE | `/customers/:id` | Cliente | Soft-deactivates customer user. |

### Users (Admin/Cashier accounts)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin | Lists internal users (`Admin`, `Cajero`). |
| GET | `/users/:id` | Admin | Gets user detail. |
| POST | `/users` | Admin | Creates internal user. |
| PUT | `/users/:id` | Admin | Updates user info/password/status. |
| PUT | `/users/:id/status` | Admin | Updates active status. |

### Offers
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/offers` | Admin | Paginated offers list. |
| GET | `/offers/active` | Public | Active offers valid for current date. |
| GET | `/offers/:id` | Admin | Gets one offer. |
| POST | `/offers` | Admin | Creates offer. |
| PUT | `/offers/:id` | Admin | Updates offer. |
| PUT | `/offers/:id/status` | Admin | Activates/deactivates offer. |

### Content / CMS-like pages
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/pages` | Public | Lists static pages. |
| GET | `/pages/:id` | Public | Gets content blocks for a page. |
| POST | `/pages/content` | Admin | Creates content block. |
| PUT | `/pages/content/:id` | Admin | Updates content block. |
| DELETE | `/pages/content/:id` | Admin | Deletes content block. |

### Reviews
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/reviews/:id` | Public | Lists product reviews + stats. |
| POST | `/reviews` | Cliente | Creates review for product. |
| DELETE | `/reviews/:id` | Cliente | Deletes own review. |

### Operations / POS support
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/suppliers` | Admin | Lists suppliers. |
| GET | `/categories` | Public | Lists categories. |
| GET | `/cashier/:id/sales?days=` | Cajero | Recent cashier sales. |
| GET | `/cashier/:id/withdrawals?days=` | Cajero | Recent cashier withdrawals. |
| POST | `/cashOut` | Admin | Creates daily cash cut if none exists for current date. |
| GET | `/cashOut` | Admin | Gets today's merged sales/withdrawal movements. |

### Prediction module
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/prediction/resumen` | Admin | Historical monthly customer growth summary + current total. |
| POST | `/prediction` | Admin | Exponential projection to target month (`fechaObjetivo`). |

## Authentication
- Login endpoint issues a signed JWT containing:
  - `id`
  - `nickname`
  - `role`
- Token expiry: **2 hours**.
- Protected endpoints require header:
  - `Authorization: Bearer <token>`
- Middleware chain:
  1. `verifyToken` validates JWT using `JWT_SECRET`.
  2. `authorizeRoles(...)` enforces role-based access per route.

## Payment Integration (Mercado Pago)
### Checkout flow
1. Customer calls `POST /api/payment/create-preference` with `carrito`.
2. Backend validates products and stock from `vw_productos_con_oferta`.
3. Backend creates a **pending** record in `ventas_online` and inserts `detalle_ventas_online` rows in a DB transaction.
4. Backend creates Mercado Pago preference with:
   - `external_reference = venta_id`
   - configured `back_urls`
   - `notification_url` pointing to webhook endpoint.
5. Backend stores preference/payment reference and returns `init_point`.

### Webhook handling
- Endpoint: `POST /api/webhook/mercadopago`.
- Processes only events where `type === "payment"`.
- Fetches payment status via Mercado Pago API.
- If approved:
  - validates stock again,
  - decrements stock in `productos`,
  - marks `ventas_online` as `aprobado` with payment metadata.
- If rejected: marks sale as `rechazado`.
- Otherwise: keeps/sets status `pendiente`.

## Database
Main entities and detected relationships:

- `usuarios` (internal users + customer auth credentials)
  - 1:1 with `clientes` through `clientes.usuario_id` (for customer profiles).
- `clientes`
  - linked to online sales via `ventas_online.cliente_id`.
- `productos`
  - belongs to `categorias` (`categoria_id`) and `proveedores` (`proveedor_id`).
  - related to `ofertas`, `resenas`, and sale details.
- `ofertas`
  - references `productos.producto_id`.
- `ventas_online`
  - references `clientes.cliente_id`.
  - has many `detalle_ventas_online` items.
- `detalle_ventas_online`
  - references `ventas_online.venta_id` and `productos.producto_id`.
- Additional operational/content tables detected:
  - `ventas`, `detalle_ventas`, `retiros_caja`, `corte_caja`
  - `paginas_estaticas`, `pagina_contenidos`
  - `resenas`

Also used in queries:
- View: `vw_productos_con_oferta`
- DB functions: `fn_total_ventas_hoy()`, `fn_total_gastos_hoy()`, `next_block_order(...)`

## Installation
1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd Backend-Punto-de-venta-Render
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Create `.env` in project root (see section below).
4. **Run server**
   - Production mode:
     ```bash
     npm start
     ```
   - Development mode:
     ```bash
     npm run dev
     ```

## Environment Variables
Create a `.env` file with:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
DB_PORT=3306

JWT_SECRET=your_jwt_secret

MP_ACCESS_TOKEN=your_mercadopago_access_token

CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

## Usage
- Use Postman/Insomnia (or frontend client) against `/api` routes.
- Typical flow to validate core business logic:
  1. `POST /api/login` to obtain JWT.
  2. Use Bearer token for protected routes.
  3. Browse public product endpoints.
  4. Register customer / place checkout preference.
  5. Confirm webhook updates payment/order status.
  6. Query `/api/orders` and `/api/orders/:id` as customer.

## Project Status
- **Status:** Completed
- **Production readiness:** Near-production backend with real payment integration and role-based authorization; final readiness depends on deployment hardening, monitoring, and comprehensive automated tests.

## Notes / Limitations
- There is no automated test suite configured in this repository (`npm test` script is not defined).
- Some behaviors rely on existing MySQL artifacts (views/functions) that must exist in the target database.
- Order listing endpoints return only orders with `estado = 'aprobado'`.
- Cash-out and cashier modules depend on POS tables (`ventas`, `retiros_caja`, `corte_caja`) in the same database.
