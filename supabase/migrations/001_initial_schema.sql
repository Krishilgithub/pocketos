-- ================================================================
-- PocketOS Database Schema — ACID-Compliant
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ================================================================

-- ── Extensions ──────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Profiles (extends auth.users) ──────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  currency TEXT NOT NULL DEFAULT 'INR',
  pin_hash TEXT,
  pin_enabled BOOLEAN DEFAULT false,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Accounts ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cash','bank','upi','credit')),
  balance NUMERIC(15,2) NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#4F6EF7',
  icon TEXT NOT NULL DEFAULT '💳',
  last_four TEXT CHECK (last_four IS NULL OR length(last_four) = 4),
  credit_limit NUMERIC(15,2) CHECK (credit_limit IS NULL OR credit_limit >= 0),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT credit_requires_limit CHECK (
    (type = 'credit' AND credit_limit IS NOT NULL) OR type != 'credit'
  )
);

CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);

-- ── Categories ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  bg_color TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense','income','both')),
  is_default BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id);

-- ── Transactions ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  amount NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('expense','income','transfer')),
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  note TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  receipt_url TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT,
  split_group_id UUID,
  transfer_pair_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON transactions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id);

-- ── Bills ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  due_day INTEGER CHECK (due_day IS NULL OR due_day BETWEEN 1 AND 31),
  frequency TEXT NOT NULL CHECK (frequency IN ('daily','weekly','monthly','yearly','one_time')),
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  last_paid_at TIMESTAMPTZ,
  next_due_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  icon TEXT DEFAULT '📄',
  reminder_days INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bills_user_due ON bills(user_id, next_due_at);

-- ── Contacts ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  upi_id TEXT,
  avatar_url TEXT,
  avatar_color TEXT DEFAULT '#4F6EF7',
  net_balance NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contacts_user ON contacts(user_id);

-- ── Splits ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  payer_user_id UUID NOT NULL REFERENCES profiles(id),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  amount NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  is_settled BOOLEAN DEFAULT false,
  settled_at TIMESTAMPTZ,
  settlement_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_splits_contact ON splits(contact_id);
CREATE INDEX IF NOT EXISTS idx_splits_transaction ON splits(transaction_id);

-- ── Groups ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '👥',
  invite_code TEXT UNIQUE DEFAULT substring(gen_random_uuid()::text, 1, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS group_members (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (group_id, contact_id)
);

CREATE TABLE IF NOT EXISTS group_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Savings Goals ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '🎯',
  target_amount NUMERIC(15,2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  target_date DATE NOT NULL,
  monthly_contribution NUMERIC(15,2) DEFAULT 0,
  color TEXT DEFAULT '#22C55E',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS savings_goal_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES savings_goals(id) ON DELETE CASCADE,
  amount NUMERIC(15,2) NOT NULL CHECK (amount != 0),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_savings_goals_user ON savings_goals(user_id);

-- ── Budgets ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  limit_amount NUMERIC(15,2) NOT NULL CHECK (limit_amount > 0),
  rollover BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, category_id, month, year)
);

-- ── Investments ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mutual_fund','stock','fd','ppf','gold','crypto','us_stock','nps')),
  name TEXT NOT NULL,
  buy_price NUMERIC(15,2) NOT NULL CHECK (buy_price > 0),
  units NUMERIC(20,6) NOT NULL CHECK (units > 0),
  buy_date DATE NOT NULL,
  current_price NUMERIC(15,2) CHECK (current_price IS NULL OR current_price >= 0),
  notes TEXT DEFAULT '',
  color TEXT DEFAULT '#4F6EF7',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================================
-- STORED PROCEDURES (Atomic Operations)
-- ================================================================

-- ATOMIC: Add transaction + update account balance + optional splits
CREATE OR REPLACE FUNCTION add_transaction_with_split(
  p_user_id UUID,
  p_account_id UUID,
  p_category_id UUID,
  p_amount NUMERIC,
  p_type TEXT,
  p_date TIMESTAMPTZ,
  p_note TEXT,
  p_splits JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_tx_id UUID;
  v_split JSONB;
BEGIN
  INSERT INTO transactions(user_id, account_id, category_id, amount, type, date, note)
  VALUES (p_user_id, p_account_id, p_category_id, p_amount, p_type, p_date, p_note)
  RETURNING id INTO v_tx_id;

  IF p_type = 'expense' THEN
    UPDATE accounts SET balance = balance - p_amount WHERE id = p_account_id AND user_id = p_user_id;
  ELSIF p_type = 'income' THEN
    UPDATE accounts SET balance = balance + p_amount WHERE id = p_account_id AND user_id = p_user_id;
  END IF;

  IF p_splits IS NOT NULL THEN
    FOR v_split IN SELECT * FROM jsonb_array_elements(p_splits) LOOP
      INSERT INTO splits(transaction_id, payer_user_id, contact_id, amount)
      VALUES (
        v_tx_id,
        p_user_id,
        (v_split->>'contact_id')::UUID,
        (v_split->>'amount')::NUMERIC
      );
      UPDATE contacts
      SET net_balance = net_balance + (v_split->>'amount')::NUMERIC
      WHERE id = (v_split->>'contact_id')::UUID AND user_id = p_user_id;
    END LOOP;
  END IF;

  RETURN v_tx_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ATOMIC: Mark bill as paid → create expense transaction
CREATE OR REPLACE FUNCTION mark_bill_paid(
  p_bill_id UUID,
  p_user_id UUID
) RETURNS UUID AS $$
DECLARE
  v_bill bills%ROWTYPE;
  v_tx_id UUID;
  v_next_due TIMESTAMPTZ;
BEGIN
  SELECT * INTO v_bill FROM bills WHERE id = p_bill_id AND user_id = p_user_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Bill not found'; END IF;

  -- Create expense transaction
  INSERT INTO transactions(user_id, account_id, category_id, amount, type, date, note)
  VALUES (
    p_user_id,
    v_bill.account_id,
    v_bill.category_id,
    v_bill.amount,
    'expense',
    now(),
    'Bill: ' || v_bill.name
  )
  RETURNING id INTO v_tx_id;

  -- Deduct from account
  IF v_bill.account_id IS NOT NULL THEN
    UPDATE accounts SET balance = balance - v_bill.amount
    WHERE id = v_bill.account_id AND user_id = p_user_id;
  END IF;

  -- Calculate next due date
  v_next_due := CASE v_bill.frequency
    WHEN 'monthly'  THEN v_bill.next_due_at + INTERVAL '1 month'
    WHEN 'weekly'   THEN v_bill.next_due_at + INTERVAL '1 week'
    WHEN 'yearly'   THEN v_bill.next_due_at + INTERVAL '1 year'
    WHEN 'daily'    THEN v_bill.next_due_at + INTERVAL '1 day'
    ELSE NULL
  END;

  UPDATE bills
  SET last_paid_at = now(),
      next_due_at = COALESCE(v_next_due, v_bill.next_due_at),
      is_active = CASE WHEN v_bill.frequency = 'one_time' THEN false ELSE true END
  WHERE id = p_bill_id;

  RETURN v_tx_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ATOMIC: Top up savings goal
CREATE OR REPLACE FUNCTION topup_savings_goal(
  p_goal_id UUID,
  p_user_id UUID,
  p_amount NUMERIC,
  p_note TEXT DEFAULT ''
) RETURNS VOID AS $$
BEGIN
  UPDATE savings_goals
  SET current_amount = current_amount + p_amount, updated_at = now()
  WHERE id = p_goal_id AND user_id = p_user_id;

  IF NOT FOUND THEN RAISE EXCEPTION 'Goal not found'; END IF;

  INSERT INTO savings_goal_transactions(goal_id, amount, note)
  VALUES (p_goal_id, p_amount, p_note);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ATOMIC: Settle with a contact
CREATE OR REPLACE FUNCTION settle_contact(
  p_user_id UUID,
  p_contact_id UUID,
  p_amount NUMERIC,
  p_note TEXT DEFAULT ''
) RETURNS VOID AS $$
BEGIN
  UPDATE splits
  SET is_settled = true, settled_at = now(), settlement_note = p_note
  WHERE contact_id = p_contact_id
    AND payer_user_id = p_user_id
    AND is_settled = false;

  UPDATE contacts
  SET net_balance = 0
  WHERE id = p_contact_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ATOMIC: Transfer between accounts
CREATE OR REPLACE FUNCTION transfer_between_accounts(
  p_user_id UUID,
  p_from_account_id UUID,
  p_to_account_id UUID,
  p_amount NUMERIC,
  p_note TEXT DEFAULT 'Transfer'
) RETURNS VOID AS $$
BEGIN
  UPDATE accounts SET balance = balance - p_amount
  WHERE id = p_from_account_id AND user_id = p_user_id;

  UPDATE accounts SET balance = balance + p_amount
  WHERE id = p_to_account_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- TRIGGERS
-- ================================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles(id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, ''),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-seed default accounts + categories for new user
CREATE OR REPLACE FUNCTION seed_new_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Default accounts
  INSERT INTO accounts(user_id, name, type, balance, color, icon, is_default) VALUES
    (NEW.id, 'Cash', 'cash', 0, '#22C55E', '💵', true),
    (NEW.id, 'Bank Account', 'bank', 0, '#4F6EF7', '🏦', false),
    (NEW.id, 'UPI Wallet', 'upi', 0, '#A855F7', '📱', false);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION seed_new_user_data();

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goal_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "users_own_profile" ON profiles FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Accounts
CREATE POLICY "users_own_accounts" ON accounts FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Categories: see own + system defaults
CREATE POLICY "users_see_own_and_default_categories" ON categories FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "users_manage_own_categories" ON categories FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "users_update_own_categories" ON categories FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "users_delete_own_categories" ON categories FOR DELETE USING (user_id = auth.uid());

-- Transactions
CREATE POLICY "users_own_transactions" ON transactions FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Bills
CREATE POLICY "users_own_bills" ON bills FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Contacts
CREATE POLICY "users_own_contacts" ON contacts FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Splits
CREATE POLICY "users_own_splits" ON splits FOR ALL USING (payer_user_id = auth.uid());

-- Savings Goals
CREATE POLICY "users_own_goals" ON savings_goals FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "users_own_goal_tx" ON savings_goal_transactions FOR ALL USING (
  goal_id IN (SELECT id FROM savings_goals WHERE user_id = auth.uid())
);

-- Budgets
CREATE POLICY "users_own_budgets" ON budgets FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Investments
CREATE POLICY "users_own_investments" ON investments FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ================================================================
-- DEFAULT CATEGORIES (system-wide, user_id = NULL)
-- ================================================================

INSERT INTO categories (user_id, name, icon, color, bg_color, type, is_default, sort_order) VALUES
  (NULL, 'Food & Mess',      '🍽️', '#F97316', '#FFEDD5', 'expense', true, 1),
  (NULL, 'Rent',             '🏠', '#4F6EF7', '#EEF2FF', 'expense', true, 2),
  (NULL, 'Travel',           '✈️', '#22C55E', '#DCFCE7', 'expense', true, 3),
  (NULL, 'Education',        '📚', '#A855F7', '#F5F3FF', 'expense', true, 4),
  (NULL, 'Groceries',        '🛒', '#EAB308', '#FEF9C3', 'expense', true, 5),
  (NULL, 'Health',           '💊', '#EF4444', '#FEE2E2', 'expense', true, 6),
  (NULL, 'Entertainment',    '🎬', '#EC4899', '#FCE7F3', 'expense', true, 7),
  (NULL, 'Utilities',        '⚡', '#14B8A6', '#CCFBF1', 'expense', true, 8),
  (NULL, 'Tech & Gadgets',   '💻', '#6366F1', '#EEF2FF', 'expense', true, 9),
  (NULL, 'Cafe & Snacks',    '☕', '#92400E', '#FEF3C7', 'expense', true, 10),
  (NULL, 'Fuel',             '⛽', '#64748B', '#F1F5F9', 'expense', true, 11),
  (NULL, 'Clothing',         '👗', '#F43F5E', '#FFE4E6', 'expense', true, 12),
  (NULL, 'Personal Care',    '🧴', '#8B5CF6', '#EDE9FE', 'expense', true, 13),
  (NULL, 'Gifts',            '🎁', '#EC4899', '#FCE7F3', 'expense', true, 14),
  (NULL, 'Other',            '📦', '#6B7280', '#F3F4F6', 'expense', true, 15),
  (NULL, 'Salary',           '💰', '#22C55E', '#DCFCE7', 'income',  true, 16),
  (NULL, 'Freelance',        '💼', '#4F6EF7', '#EEF2FF', 'income',  true, 17),
  (NULL, 'Pocket Money',     '👜', '#F97316', '#FFEDD5', 'income',  true, 18),
  (NULL, 'Dividends',        '📈', '#10B981', '#D1FAE5', 'income',  true, 19),
  (NULL, 'Bonus',            '🎉', '#A855F7', '#F5F3FF', 'income',  true, 20),
  (NULL, 'Scholarship',      '🎓', '#4F6EF7', '#EEF2FF', 'income',  true, 21),
  (NULL, 'Side Income',      '🚀', '#14B8A6', '#CCFBF1', 'income',  true, 22)
ON CONFLICT DO NOTHING;
