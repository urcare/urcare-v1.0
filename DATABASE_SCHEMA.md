# Database Schema Documentation

## Table: `profiles`
**Purpose:** Stores user authentication and basic profile data

### Columns:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE | User's unique identifier |
| `email` | TEXT | UNIQUE, NOT NULL | User's email address |
| `full_name` | TEXT | NULLABLE | User's full name |
| `avatar_url` | TEXT | NULLABLE | URL to user's profile picture |
| `provider` | TEXT | NULLABLE | Authentication provider ('google', 'apple', 'email') |
| `last_sign_in` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | When user last signed in |
| `sign_in_count` | INTEGER | DEFAULT 1 | Number of times user has signed in |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | When profile was created |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | When profile was last updated |

### Security:
- **RLS Enabled:** Yes
- **Policies:**
  - Users can view own profile
  - Users can update own profile  
  - Users can insert own profile

### Triggers:
- **`on_auth_user_created`** - Automatically creates profile when user signs up
- **`handle_new_user()`** - Function that populates profile data from auth metadata

### Functions:
- **`handle_new_user()`** - Creates profile with data from auth.users
- **`update_sign_in_stats()`** - Updates sign-in statistics

---

## Future Tables (To Be Added):

### Table: `user_onboarding`
**Purpose:** Stores user onboarding flow data

### Table: `user_health_data`
**Purpose:** Stores user health assessment data

### Table: `user_preferences`
**Purpose:** Stores user app preferences and settings

---

## Last Updated:
- **Date:** 2024-01-15
- **Version:** 1.0
- **Changes:** Initial profiles table creation with authentication tracking
