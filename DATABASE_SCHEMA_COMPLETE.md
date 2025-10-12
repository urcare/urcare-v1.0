# UrCare Database Schema - Complete Documentation

## 📊 **Database Overview**
This document contains the complete database schema for the UrCare health application, including all tables, columns, relationships, and constraints.

---

## 🔐 **Authentication Tables**

### **`auth.users` (Supabase Auth)**
- **Purpose**: Core user authentication managed by Supabase
- **Key Fields**: `id`, `email`, `raw_user_meta_data`, `app_metadata`
- **Relationships**: Referenced by all user-related tables

### **`public.profiles`**
- **Purpose**: User profile information and authentication tracking
- **Primary Key**: `id` (uuid)
- **Foreign Key**: `id` → `auth.users(id)` ON DELETE CASCADE

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | - | Primary key, references auth.users |
| `email` | text | NO | - | User email address |
| `full_name` | text | YES | - | User's full name |
| `avatar_url` | text | YES | - | Profile picture URL |
| `provider` | text | YES | - | Auth provider (email/google) |
| `last_sign_in` | timestamptz | YES | NOW() | Last sign in timestamp |
| `sign_in_count` | integer | YES | 1 | Number of sign ins |
| `created_at` | timestamptz | YES | NOW() | Profile creation time |
| `updated_at` | timestamptz | YES | NOW() | Last update time |

**Constraints:**
- `profiles_pkey` PRIMARY KEY (id)
- `profiles_email_key` UNIQUE (email)
- `profiles_id_fkey` FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE

**RLS Policies:**
- Users can view/insert/update/delete their own profiles only

---

## 💳 **Subscription & Payment Tables**

### **`public.subscription_plans`**
- **Purpose**: Available subscription plans with pricing

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | gen_random_uuid() | Primary key |
| `name` | text | NO | - | Plan name |
| `slug` | text | NO | - | URL-friendly identifier |
| `description` | text | YES | - | Plan description |
| `price_monthly` | numeric | NO | - | Monthly price in INR |
| `price_annual` | numeric | NO | - | Annual price in INR |
| `original_price_monthly` | numeric | YES | - | Original monthly price |
| `original_price_annual` | numeric | YES | - | Original annual price |
| `features` | jsonb | YES | - | Plan features array |
| `is_active` | boolean | YES | - | Whether plan is available |
| `created_at` | timestamptz | YES | NOW() | Creation time |
| `updated_at` | timestamptz | YES | NOW() | Last update time |

### **`public.user_subscriptions`**
- **Purpose**: User subscription records and status

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | gen_random_uuid() | Primary key |
| `user_id` | uuid | NO | - | User ID (FK to profiles) |
| `plan_id` | uuid | NO | - | Plan ID (FK to subscription_plans) |
| `status` | text | NO | - | Subscription status |
| `billing_cycle` | text | NO | - | monthly/annual |
| `razorpay_subscription_id` | text | YES | - | Razorpay subscription ID |
| `razorpay_payment_id` | text | YES | - | Razorpay payment ID |
| `current_period_start` | timestamptz | YES | - | Current period start |
| `current_period_end` | timestamptz | YES | - | Current period end |
| `cancelled_at` | timestamptz | YES | - | Cancellation time |
| `trial_ends_at` | timestamptz | YES | - | Trial end time |
| `created_at` | timestamptz | YES | NOW() | Creation time |
| `updated_at` | timestamptz | YES | NOW() | Last update time |

### **`public.payment_transactions`**
- **Purpose**: Payment transaction history

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | gen_random_uuid() | Primary key |
| `user_id` | uuid | NO | - | User ID (FK to profiles) |
| `subscription_id` | uuid | YES | - | Subscription ID (FK to user_subscriptions) |
| `razorpay_payment_id` | text | NO | - | Razorpay payment ID |
| `razorpay_order_id` | text | YES | - | Razorpay order ID |
| `amount` | numeric | NO | - | Payment amount |
| `currency` | text | YES | 'INR' | Currency code |
| `status` | text | NO | - | Payment status |

---

## 🏥 **Health & Analysis Tables**

### **`public.health_analysis`**
- **Purpose**: Health assessment results and analysis

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | gen_random_uuid() | Primary key |
| `user_id` | uuid | NO | - | User ID (FK to profiles) |
| `health_score` | integer | NO | - | Health score (0-100) |
| `display_analysis` | jsonb | NO | '{}' | Analysis display data |
| `ai_provider` | text | NO | 'groq' | AI provider used |
| `ai_model` | text | NO | 'llama-3.3-70b-versatile' | AI model used |
| `calculation_method` | text | NO | 'groq_ai_analysis' | Calculation method |
| `user_input` | text | YES | - | User input text |
| `uploaded_files` | jsonb | YES | - | Uploaded file data |
| `voice_transcript` | text | YES | - | Voice transcript |
| `factors_considered` | text[] | NO | '{}' | Factors considered array |
| `generation_parameters` | jsonb | NO | '{}' | Generation parameters |
| `analysis_date` | date | NO | CURRENT_DATE | Analysis date |
| `is_latest` | boolean | NO | true | Whether this is the latest analysis |
| `created_at` | timestamptz | NO | NOW() | Creation time |
| `updated_at` | timestamptz | NO | NOW() | Last update time |

### **`public.health_plans`**
- **Purpose**: AI-generated health plans for users

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | gen_random_uuid() | Primary key |
| `user_id` | uuid | NO | - | User ID (FK to profiles) |
| `plan_name` | varchar(255) | NO | - | Plan name |
| `plan_type` | varchar(100) | YES | 'health_transformation' | Plan type |
| `primary_goal` | text | YES | - | Primary health goal |
| `secondary_goals` | text[] | YES | - | Secondary goals array |
| `start_date` | date | YES | - | Plan start date |
| `target_end_date` | date | YES | - | Target end date |
| `duration_weeks` | integer | YES | - | Plan duration in weeks |
| `health_analysis_id` | uuid | YES | - | Related health analysis ID |
| `user_input` | text | YES | - | User input for plan |
| `plan_data` | jsonb | NO | - | Complete plan data |
| `status` | varchar(50) | YES | 'draft' | Plan status |
| `generation_model` | varchar(100) | YES | - | AI model used |
| `generation_parameters` | jsonb | YES | - | Generation parameters |
| `created_at` | timestamptz | YES | NOW() | Creation time |
| `updated_at` | timestamptz | YES | NOW() | Last update time |
| `plan_data_json` | jsonb | YES | - | Additional plan data |

### **`public.daily_activities`**
- **Purpose**: Daily activity tracking and schedules

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | gen_random_uuid() | Primary key |
| `user_id` | uuid | NO | - | User ID (FK to profiles) |
| `plan_id` | uuid | YES | - | Plan ID (FK to health_plans) |
| `activity_date` | date | NO | CURRENT_DATE | Activity date |
| `activity_time` | varchar(10) | NO | - | Activity time (HH:MM) |
| `activity` | varchar(255) | NO | - | Activity name |
| `duration` | varchar(20) | NO | - | Activity duration |
| `category` | varchar(50) | NO | - | Activity category |
| `food` | text | YES | - | Food-related content |
| `exercise` | text | YES | - | Exercise content |
| `instructions` | text[] | YES | - | Instructions array |
| `health_tip` | text | YES | - | Health tip |
| `is_completed` | boolean | YES | false | Completion status |
| `completed_at` | timestamptz | YES | - | Completion timestamp |
| `notes` | text | YES | - | User notes |
| `created_at` | timestamptz | YES | NOW() | Creation time |
| `updated_at` | timestamptz | YES | NOW() | Last update time |

### **`public.user_health_reports`**
- **Purpose**: User uploaded health reports

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | gen_random_uuid() | Primary key |
| `user_id` | uuid | NO | - | User ID (FK to profiles) |
| `report_name` | text | NO | - | Report name |
| `file_path` | text | YES | - | File storage path |
| `file_size` | bigint | YES | - | File size in bytes |
| `mime_type` | text | YES | - | File MIME type |
| `upload_date` | timestamptz | YES | - | Upload timestamp |
| `created_at` | timestamptz | YES | NOW() | Creation time |

---

## 👤 **User Onboarding Tables**

### **`public.onboarding_profiles`**
- **Purpose**: User onboarding data and preferences

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | gen_random_uuid() | Primary key |
| `user_id` | uuid | NO | - | User ID (FK to profiles) |
| `full_name` | text | YES | - | User's full name |
| `age` | integer | YES | - | User's age |
| `birth_month` | text | YES | - | Birth month |
| `birth_day` | text | YES | - | Birth day |
| `birth_year` | text | YES | - | Birth year |
| `gender` | text | YES | - | User's gender |
| `height_feet` | text | YES | - | Height in feet |
| `height_inches` | text | YES | - | Height in inches |
| `height_cm` | text | YES | - | Height in cm |
| `weight_kg` | text | YES | - | Weight in kg |
| `country` | text | YES | - | Country |
| `state` | text | YES | - | State |
| `district` | text | YES | - | District |
| `wake_up_time` | text | YES | - | Wake up time |
| `sleep_time` | text | YES | - | Sleep time |
| `work_start` | text | YES | - | Work start time |
| `work_end` | text | YES | - | Work end time |
| `blood_group` | text | YES | - | Blood group |
| `critical_conditions` | text | YES | - | Critical health conditions |
| `diet_type` | text | YES | - | Diet type preference |
| `breakfast_time` | text | YES | - | Breakfast time |
| `lunch_time` | text | YES | - | Lunch time |
| `dinner_time` | text | YES | - | Dinner time |
| `workout_time` | text | YES | - | Workout time |
| `routine_flexibility` | text | YES | - | Routine flexibility |
| `workout_type` | text | YES | - | Workout type preference |
| `smoking` | text | YES | - | Smoking status |
| `drinking` | text | YES | - | Drinking status |
| `track_family` | text | YES | - | Family tracking preference |
| `referral_code` | text | YES | - | Referral code |
| `medications` | jsonb | YES | '[]' | Medications array |
| `chronic_conditions` | jsonb | YES | '[]' | Chronic conditions array |
| `surgery_details` | jsonb | YES | '[]' | Surgery details array |
| `health_goals` | jsonb | YES | '[]' | Health goals array |
| `onboarding_completed` | boolean | YES | false | Onboarding completion status |
| `health_assessment_completed` | boolean | YES | false | Health assessment completion |
| `completion_percentage` | integer | YES | 0 | Completion percentage (0-100) |
| `created_at` | timestamptz | YES | NOW() | Creation time |
| `updated_at` | timestamptz | YES | NOW() | Last update time |

---

## 🔧 **Database Functions & Triggers**

### **Authentication Functions**
- `handle_new_user()` - Creates profile when user signs up
- `handle_user_sign_in()` - Updates profile on sign in
- `handle_user_metadata_update()` - Updates profile when metadata changes
- `update_profiles_updated_at()` - Updates timestamp on profile changes

### **Triggers**
- `on_auth_user_created` - Triggered on new user creation
- `on_auth_user_sign_in` - Triggered on user sign in
- `on_auth_user_metadata_update` - Triggered on metadata changes
- `update_profiles_updated_at` - Triggered on profile updates

---

## 🔒 **Security & RLS**

### **Row Level Security (RLS)**
All tables have RLS enabled with policies ensuring users can only access their own data:

- **profiles**: Users can view/insert/update/delete their own profile
- **health_analysis**: Users can access their own health analysis
- **health_plans**: Users can access their own health plans
- **daily_activities**: Users can access their own activities
- **user_subscriptions**: Users can access their own subscriptions
- **payment_transactions**: Users can access their own transactions
- **onboarding_profiles**: Users can access their own onboarding data
- **user_health_reports**: Users can access their own health reports

---

## 📈 **Indexes for Performance**

### **Profiles Table**
- `idx_profiles_email` - Email lookup
- `idx_profiles_provider` - Provider filtering
- `idx_profiles_last_sign_in` - Sign in tracking
- `idx_profiles_created_at` - Creation time sorting

### **Other Tables**
- Foreign key indexes on all `user_id` columns
- Composite indexes on frequently queried columns
- JSONB indexes on plan_data and analysis fields

---

## 🚀 **Migration Status**

### **Applied Migrations**
- ✅ `20250115000000_fix_authentication_flow.sql` - Authentication setup
- ✅ `20250115000001_cleanup_unified_tables.sql` - Unified table cleanup

### **Current Schema Version**
- **Version**: 1.0
- **Last Updated**: January 15, 2025
- **Status**: Production Ready

---

## 🔍 **Common Queries**

### **Get User Profile**
```sql
SELECT * FROM profiles WHERE id = $1;
```

### **Get User Health Analysis**
```sql
SELECT * FROM health_analysis WHERE user_id = $1 AND is_latest = true;
```

### **Get User Active Subscription**
```sql
SELECT * FROM user_subscriptions WHERE user_id = $1 AND status = 'active';
```

### **Get User Daily Activities**
```sql
SELECT * FROM daily_activities WHERE user_id = $1 AND activity_date = CURRENT_DATE;
```

---

## ⚠️ **Important Notes**

1. **Authentication**: All authentication is handled through Supabase Auth with automatic profile creation
2. **Data Privacy**: RLS ensures users can only access their own data
3. **Performance**: Proper indexing for common query patterns
4. **Scalability**: JSONB fields for flexible data storage
5. **Backup**: Regular backups recommended for production use

---

*This schema is maintained and updated as the application evolves.*
