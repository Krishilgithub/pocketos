# 💰 PocketOS — Your Money, Organized

PocketOS is a premium, mobile-first, responsive personal finance and wealth management dashboard application. Designed with modern aesthetics including glassmorphism, dark navigation overlays, and fluid transitions, PocketOS makes tracking budgets, splitting expenses, monitoring savings goals, and viewing investments effortless and visually engaging.

Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Supabase (PostgreSQL)**.

---

## 🚀 Key Features

*   **📱 Mobile-First Responsive Design**: Optimized for seamless, native-app-like utility on mobile, tablet, and desktop viewports, featuring an elegant glassmorphism bottom navigation bar and subtle micro-animations.
*   **🏦 Multi-Account Management**: Track cash balances, bank accounts, UPI wallets, and credit cards. Supports custom card visuals, card masking (e.g., `•••• 1234`), and real-time balance calculations.
*   **💳 Transactions & Transfers**: Log income and expenses with customizable categories, notes, tags, and receipt uploads. Seamlessly transfer money between your tracking accounts.
*   **📊 Interactive Analytics & Reports**: Beautiful visual representations of your financial health, monthly savings rates, and expense category distributions using **Recharts**.
*   **🎯 Milestone Savings Goals**: Define savings goals (e.g., *Vacation*, *New Laptop*), log goal-specific deposits/withdrawals, and monitor status tracking (`On Track`, `Falling Behind`, `Completed`).
*   **⚡ Smart Budgets**: Set spending limits per category per month with optional rollover parameters.
*   **📄 Bill Dues Tracker**: Monitor recurring bills (daily, weekly, monthly, yearly, one-time) with due date countdowns, status alerts (e.g., `Overdue`, `Due Today`), and one-click payments.
*   **👥 Bill Splits & Contact Settlements**: Add contacts, create shared expense groups with invite codes, split transactions, track net balances owed/owing, and record quick settlements.
*   **📈 Investment Portfolio**: Monitor your investments (Stocks, Mutual Funds, Cryptocurrencies, Gold, PPF, FD, US Stocks, NPS) with unit tracking, buy/current pricing, and real-time unrealized gains.
*   **🔒 Secure Credentials**: Custom 6-digit PIN signing/sign-up backed by SHA-256 profile hashing as well as Google OAuth.

---

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (using the App Router with React Server Components)
*   **Library**: [React 19](https://react.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS custom variables
*   **Database & Auth**: [Supabase](https://supabase.com/) (Postgres + Supabase Auth + Row Level Security)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) & CSS keyframe animations

---

## 📁 Directory Structure

```text
├── app/                      # Next.js App Router Pages & Layouts
│   ├── accounts/             # Account creation and management
│   ├── add/                  # Transaction entry (with custom numpad)
│   ├── auth/                 # Sign-in, sign-up, and PIN validation screens
│   ├── bills/                # Bill management and tracking dashboard
│   ├── budgets/              # Spending limits configuration
│   ├── contacts/             # Contact splits, group expenses, settlements
│   ├── dashboard/            # Core dashboard displaying financial health
│   ├── reports/              # Interactive spending and savings charts
│   ├── savings/              # Savings goals tracker
│   ├── settings/             # User profile, currency, and theme settings
│   ├── transactions/         # Searchable, filterable transaction history
│   ├── globals.css           # Global custom CSS styles and design tokens
│   └── layout.tsx            # Main layout setup, metadata, and viewport properties
├── components/               # Reusable React components
│   ├── charts/               # Recharts visual dashboards
│   ├── layout/               # Header, bottom nav, and FAB layouts
│   └── ui/                   # Reusable UI cards, inputs, and components
├── lib/                      # Shared business logic and utilities
│   ├── actions/              # Supabase database Server Actions (Auth, Bills, Accounts, etc.)
│   ├── supabase/             # Supabase clients (client, server, and middleware)
│   ├── database.types.ts     # Auto-generated Typescript typings for Postgres schema
│   ├── types.ts              # Custom frontend model type declarations
│   └── utils.ts              # Currency formatting and calculations
├── public/                   # Static icons, manifest, and assets
├── supabase/                 # Database schema migrations
│   └── migrations/           # 001_initial_schema.sql migrations file
├── reload_schema.js          # Helper script to reload PostgREST schema cache
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

---

## ⚙️ Getting Started

Follow these steps to set up and run PocketOS locally:

### 1. Clone the Repository
```bash
git clone https://github.com/YashBhalodiya/pocketos.git
cd pocketos
```

### 2. Install Dependencies
Ensure you have Node.js installed (v18+ recommended), then install the packages:
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to create a `.env.local` file:
```bash
cp .env.example .env.local
```
Open `.env.local` and input your Supabase credentials:
*   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project API URL.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase API Anonymous Key.
*   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role secret key (required for admin bypass operations).

### 4. Set Up the Database
PocketOS relies on PostgreSQL triggers and atomic stored procedures (`PL/pgSQL`).
1.  Go to your **Supabase Dashboard** -> **SQL Editor**.
2.  Open the migration SQL file located at `supabase/migrations/001_initial_schema.sql` in your text editor.
3.  Copy the entire content, paste it into the Supabase SQL editor, and click **Run**.
4.  This script will automatically generate:
    *   All necessary tables (`profiles`, `accounts`, `categories`, `transactions`, `bills`, `contacts`, `splits`, `groups`, `savings_goals`, `budgets`, `investments`).
    *   Atomic database stored procedures (`add_transaction_with_split`, `mark_bill_paid`, `topup_savings_goal`, `settle_contact`, `transfer_between_accounts`).
    *   Database triggers for automatic user profile creation and account seeding on signup.
    *   Row Level Security (RLS) policies for complete user data privacy.
    *   System default categories.

### 5. Reload Schema Cache
After running the SQL migration, force PostgREST to refresh its schema cache to ensure all tables are immediately queryable by the API:
```bash
# If your DB credentials match reload_schema.js, run:
node reload_schema.js
```
*(Otherwise, simply restart your Supabase project instance or execute a reload command in the Supabase console).*

### 6. Run the Application
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to experience **PocketOS**!

---

## 🔒 Security & ACID Compliance
*   **Row Level Security (RLS)**: Every table enforces strict policies. Users can only query and mutate records linked to their own `auth.uid()`.
*   **Atomic Transactions**: Multi-table updates (e.g., adding an expense, deducting from account balance, and logging splits) are handled atomically via DB functions to ensure schema consistency.
*   **Profile Seeding**: User profile records and default accounts (*Cash*, *Bank*, *UPI*) are automatically seeded using Postgres triggers upon auth registration.
