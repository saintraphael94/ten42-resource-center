# Supabase Setup and Migration Guide for Ten42

This folder contains the complete, production-ready PostgreSQL migrations for the **Ten42 Training and Resource Center** platform.

## Migration Files

1. `001_initial_schema.sql`: Complete relational database schema with custom ENUMs, UUID primary keys, check constraints, foreign keys, and optimized performance indexes.
2. `002_rls_policies.sql`: Comprehensive Row Level Security (RLS) policies enforcing role-based permissions (`super_admin`, `admin`, `front_desk`, `facility_manager`, `member`, `guest`).
3. `003_concurrency_and_functions.sql`: Concurrency-safe reservation procedures, row-level locks, overlap conflict detection, unique reference generators, and atomic payment-to-membership activation.
4. `004_seed_data.sql`: Authentic initial seed data for facilities (including Grand Auditorium and Executive Boardroom), membership plans, and system settings.

## How to Apply Migrations

### Option A: Using the Supabase Dashboard
1. Open your Supabase Project: `https://app.supabase.com/project/<your-project-id>`.
2. Navigate to the **SQL Editor** in the left sidebar.
3. Open and run the migration files in numerical order:
   - Run `001_initial_schema.sql`
   - Run `002_rls_policies.sql`
   - Run `003_concurrency_and_functions.sql`
   - Run `004_seed_data.sql`
4. Confirm tables and functions are created under the `public` schema.

### Option B: Using Supabase CLI
```bash
# Link your local project to your Supabase cloud project
supabase link --project-ref <your-project-ref>

# Push migrations
supabase db push
```

## Creating the Initial Super Admin User

1. Create a user via Supabase Auth (or sign up through the application).
2. Run the following SQL query in the Supabase SQL editor to grant `super_admin` privileges:

```sql
UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'admin@ten42.org';
```

