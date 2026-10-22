# FoodDecode — Serverless Food Ingredient Analysis Platform

> **Modern food ingredient intelligence platform** built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB Atlas**, optimized for zero-maintenance serverless deployment on **Vercel**.

---

## 🌟 Platform Highlights

- **Live Camera Barcode Scanner**: Browser-compatible camera scanner using `html5-qrcode` (supports UPC, EAN-13, EAN-8, Code-128, and QR). Features instant 1-click sample barcodes for quick desktop testing.
- **Scientific Nutritional Profiling**:
  - **Nutri-Score Algorithm (A to E)**: Evaluates positive nutrients (protein, dietary fiber) against energy density, saturated fats, sugars, and sodium.
  - **NOVA Food Classification (1 to 4)**: Unmasks industrial markers of ultra-processing (chemical texturizers, hydrogenated oils, artificial flavors, and emulsifiers).
  - **UK FSA Nutritional Traffic Lights**: Visual Green/Amber/Red indicators for fat, saturated fat, sugars, and salt.
  - **FoodDecode Overall Score (0-100)**: Proprietary multi-factor score highlighting overall dietary health value.
- **Hazardous Additive & Allergen Detection**:
  - Highlights additives with regulatory restrictions (e.g., Titanium Dioxide E171 banned in EU, Potassium Bromate, BHA, BHT, synthetic azo dyes Red 40, Yellow 5).
  - Detects palm oil derivatives and refined sweeteners.
  - Identifies major food allergens (Milk, Gluten, Soy, Peanuts, Tree Nuts, etc.).
- **Interactive Ingredient Explanations**: Clicking any ingredient displays its biochemical description, regulatory status (FDA/EFSA), and associated health risks.
- **Healthier Product Alternatives**: Automatically recommends higher-scoring, less processed alternatives within the same food category.
- **Side-by-Side Product Comparison Matrix (`/compare`)**: Compare 2 to 4 foods across sugar, sodium, protein, additives, and Nutri-Scores with highlighted winners.
- **Community Product Contribution (`/submit`)**: Crowd-sourced product submission with verification queue.
- **Open Food Facts API Synchronization**: Automatic real-time query and persistence when an unlisted barcode is scanned.
- **Comprehensive Admin Control Plane (`/admin`)**:
  - MongoDB connection diagnostics and ping check.
  - Product catalogue management (search, edit, verify, delete).
  - Community submission review and approval into the live catalogue.
  - Custom ingredient hazard rule manager.
  - Bulk JSON product ingestion with `importJobs` tracking.
  - Scoring algorithm versioning and 1-click catalogue recalculation.
  - Real-time audit trail logging.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Vercel Global CDN                    │
│      Next.js App Router (React 19 + TypeScript)        │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
   Serverless Route Handlers      Static / SSR Web Pages
   - GET  /api/products           - / (Homepage)
   - GET  /api/products/[id]      - /products (Directory)
   - GET  /api/products/barcode   - /products/[id] (Analysis)
   - POST /api/products/compare   - /scan (Barcode Camera)
   - POST /api/admin/*            - /compare (Side-by-Side)
              │                   - /admin (Dashboard)
              ▼
    lib/mongodb.ts (Warm Connection Pool)
              │
              ▼
   ┌─────────────────────────────────────────────────────┐
   │             MongoDB Atlas Database                  │
   │  products · ingredients · categories · brands       │
   │  analysisRules · productSubmissions · importJobs    │
   └─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd fooddecode
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=fooddecode
ADMIN_SECRET_KEY=fooddecode_admin_secret_key_change_in_production
```

> **Note:** If `MONGODB_URI` is not provided, the platform automatically starts in **Demo Mode**, utilizing a rich in-memory catalogue of verified products, categories, and ingredients.

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Tests
```bash
npm test
```
Executes the test suite covering the Nutri-Score algorithm, NOVA classification, ingredient hazard matcher, and UK FSA traffic light thresholds.

### 5. Seed Database (Optional)
To seed MongoDB Atlas with starter verified products, categories, brands, and rules:
```bash
npm run db:seed
```
*(Or click **Seed MongoDB** in the Admin Dashboard at `/admin`)*

---

## ☁️ Production Deployment on Vercel

### Step 1: Set Up MongoDB Atlas
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Security → Database Access**, create a user (e.g. `fooddecode_user`) with read and write permissions.
4. Under **Security → Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere) so Vercel's dynamic serverless functions can connect.
5. In **Database → Clusters**, click **Connect → Drivers (Node.js)** and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: Push Project to GitHub
Initialize and push your repository:
```bash
git add .
git commit -m "Initial commit: Complete FoodDecode serverless platform"
git remote add origin https://github.com/<your-username>/fooddecode.git
git branch -M main
git push -u origin main
```

### Step 3: Import into Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New… → Project** and select your GitHub repository.
3. In **Configure Project**, under **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `MONGODB_DB_NAME`: `fooddecode`
   - `ADMIN_SECRET_KEY`: A secure 32+ character administrative key.
4. Click **Deploy**.

Vercel will compile the Next.js App Router project and deploy the serverless functions globally across the edge CDN.

---

## 📡 Serverless API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Search, filter, and paginate products |
| `GET` | `/api/products/[id]` | Get detailed product by ID |
| `GET` | `/api/products/[id]/analysis` | Breakdown of ingredients, hazard summary & traffic lights |
| `GET` | `/api/products/[id]/alternatives`| Find cleaner, higher-scoring alternatives |
| `GET` | `/api/products/barcode/[barcode]` | Lookup barcode in MongoDB with Open Food Facts fallback |
| `GET` | `/api/products/search` | Fast typeahead search for navbar |
| `POST`| `/api/products/compare` | Compare 2 to 4 products side-by-side |
| `GET` | `/api/categories` | List categories with dynamic item counts |
| `GET` | `/api/brands` | List brands catalogue |
| `GET` | `/api/ingredients/search` | Search ingredient database and regulatory statuses |
| `POST`| `/api/product-submissions` | Submit new unlisted product to review queue |
| `GET` | `/api/admin/stats` | Database ping, collection counts, completeness |
| `POST`| `/api/admin/products` | Create/edit verified product (Admin Key required) |
| `POST`| `/api/admin/ingredients` | Add custom ingredient hazard rule (Admin Key required) |
| `POST`| `/api/admin/import` | Bulk JSON ingestion with `importJobs` tracking |
| `POST`| `/api/admin/recalculate` | Recalculate catalogue scores using updated rule version |
| `PUT` | `/api/admin/submissions` | Approve or reject community submissions |
| `POST`| `/api/admin/seed` | 1-click database initialization |

---

## 📄 License & Attribution

- Built under the MIT License.
- External product data powered in part by [Open Food Facts](https://world.openfoodfacts.org/) under the Open Database License (ODbL).
