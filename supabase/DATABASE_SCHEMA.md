# URCare Database Schema Documentation

This document provides a comprehensive overview of the URCare database schema, including all tables, their relationships, and usage patterns.

## Table Overview

The database consists of 10 main tables designed to support a comprehensive health and wellness application:

1. **user_profiles** - Core user profile information
2. **onboarding_profiles** - Raw onboarding data collection
3. **health_metrics** - Health measurements over time
4. **health_scores** - Calculated health scores and assessments
5. **daily_activities** - Daily activity tracking
6. **health_plans** - Comprehensive health plans
7. **weekly_milestones** - Weekly milestones for health plans
8. **monthly_assessments** - Monthly health assessments
9. **weekly_progress_tracking** - Weekly progress tracking
10. **daily_plan_execution** - Daily plan execution data

## Table Details

### 1. user_profiles

**Purpose**: Stores comprehensive user profile information collected during onboarding.

**Key Fields**:

- `id` (UUID, Primary Key) - References auth.users(id)
- `full_name` (TEXT) - User's full name
- `age` (INTEGER) - User's age
- `gender` (TEXT) - User's gender (male/female/other)
- `height_cm`, `weight_kg` - Physical measurements
- `health_goals` (TEXT[]) - Array of health goals
- `chronic_conditions` (TEXT[]) - Array of chronic conditions
- `onboarding_completed` (BOOLEAN) - Onboarding completion status

**Relationships**:

- One-to-One with auth.users
- One-to-Many with health_plans
- One-to-Many with health_metrics
- One-to-Many with daily_activities

### 2. onboarding_profiles

**Purpose**: Stores raw onboarding data as collected during the registration process.

**Key Fields**:

- `id` (UUID, Primary Key)
- `user_id` (UUID) - References auth.users(id)
- `details` (JSONB) - Complete onboarding form data
- `onboarding_version` (TEXT) - Version of onboarding flow
- `completion_percentage` (INTEGER) - Percentage completed (0-100)

**Relationships**:

- Many-to-One with auth.users

### 3. health_metrics

**Purpose**: Stores various health measurements and metrics over time.

**Key Fields**:

- `id` (UUID, Primary Key)
- `user_id` (UUID) - References auth.users(id)
- `metric_type` (TEXT) - Type of metric (weight, blood_pressure, etc.)
- `value` (DECIMAL) - Numeric value
- `unit` (TEXT) - Unit of measurement
- `measurement_date` (DATE) - Date of measurement
- `source` (TEXT) - Source of data (manual, wearable, etc.)

**Relationships**:

- Many-to-One with auth.users

### 4. health_scores

**Purpose**: Stores calculated health scores and assessments.

**Key Fields**:

- `id` (UUID, Primary Key)
- `user_id` (UUID) - References auth.users(id)
- `score_type` (TEXT) - Type of score (overall, cardiovascular, etc.)
- `score` (DECIMAL) - Score value (0-100)
- `calculation_date` (DATE) - Date of calculation
- `sub_scores` (JSONB) - Breakdown of composite scores
- `recommendations` (TEXT[]) - Array of recommendations

**Relationships**:

- Many-to-One with auth.users

### 5. daily_activities

**Purpose**: Tracks daily activities and their completion.

**Key Fields**:

- `id` (UUID, Primary Key)
- `user_id` (UUID) - References auth.users(id)
- `activity_date` (DATE) - Date of activity
- `activity_type` (TEXT) - Type of activity
- `is_completed` (BOOLEAN) - Completion status
- `completion_percentage` (INTEGER) - Percentage completed
- `difficulty_rating` (INTEGER) - User difficulty rating (1-5)

**Relationships**:

- Many-to-One with auth.users
- Many-to-One with health_plans (via related_plan_id)

### 6. health_plans

**Purpose**: Stores comprehensive health plans generated for users.

**Key Fields**:

- `id` (UUID, Primary Key)
- `user_id` (UUID) - References auth.users(id)
- `plan_name` (TEXT) - Name of the plan
- `plan_type` (TEXT) - Type of plan (quick_win, habit_formation, etc.)
- `primary_goal` (TEXT) - Main goal of the plan
- `plan_data` (JSONB) - Comprehensive plan structure
- `status` (TEXT) - Plan status (draft, active, completed, etc.)
- `overall_progress_percentage` (INTEGER) - Overall progress (0-100)

**Relationships**:

- Many-to-One with auth.users
- One-to-Many with weekly_milestones
- One-to-Many with monthly_assessments
- One-to-Many with weekly_progress_tracking
- One-to-Many with daily_plan_execution

### 7. weekly_milestones

**Purpose**: Stores weekly milestones for health plans.

**Key Fields**:

- `id` (UUID, Primary Key)
- `plan_id` (UUID) - References health_plans(id)
- `user_id` (UUID) - References auth.users(id)
- `week_number` (INTEGER) - Week number in plan
- `title` (TEXT) - Milestone title
- `success_criteria` (TEXT[]) - Array of success criteria
- `is_achieved` (BOOLEAN) - Achievement status
- `importance` (TEXT) - Importance level (low, medium, high, critical)

**Relationships**:

- Many-to-One with health_plans
- Many-to-One with auth.users

### 8. monthly_assessments

**Purpose**: Stores monthly health assessments for plans.

**Key Fields**:

- `id` (UUID, Primary Key)
- `plan_id` (UUID) - References health_plans(id)
- `user_id` (UUID) - References auth.users(id)
- `month_number` (INTEGER) - Month number in plan
- `overall_progress` (DECIMAL) - Overall progress percentage
- `health_improvements` (JSONB) - Health improvements observed
- `health_concerns` (JSONB) - Health concerns identified
- `plan_modifications` (JSONB) - Plan modifications made

**Relationships**:

- Many-to-One with health_plans
- Many-to-One with auth.users

### 9. weekly_progress_tracking

**Purpose**: Tracks weekly progress for health plans.

**Key Fields**:

- `id` (UUID, Primary Key)
- `plan_id` (UUID) - References health_plans(id)
- `user_id` (UUID) - References auth.users(id)
- `week_number` (INTEGER) - Week number in plan
- `compliance_rate` (DECIMAL) - Weekly compliance rate
- `body_measurements` (JSONB) - Body measurements for the week
- `fitness_metrics` (JSONB) - Fitness metrics for the week
- `milestones_achieved` (TEXT[]) - Achieved milestones

**Relationships**:

- Many-to-One with health_plans
- Many-to-One with auth.users

### 10. daily_plan_execution

**Purpose**: Tracks daily execution of health plans.

**Key Fields**:

- `id` (UUID, Primary Key)
- `plan_id` (UUID) - References health_plans(id)
- `user_id` (UUID) - References auth.users(id)
- `execution_date` (DATE) - Date of execution
- `daily_activities` (JSONB) - Activities for the day
- `completion_percentage` (DECIMAL) - Daily completion percentage
- `energy_level` (INTEGER) - User energy level (1-10)
- `status` (TEXT) - Execution status

**Relationships**:

- Many-to-One with health_plans
- Many-to-One with auth.users

## Data Flow

1. **User Registration**: User signs up → `auth.users` table
2. **Profile Creation**: User profile created → `user_profiles` table
3. **Onboarding**: Raw data collected → `onboarding_profiles` table
4. **Health Plan Generation**: Plan created → `health_plans` table
5. **Daily Tracking**: Activities tracked → `daily_activities` table
6. **Progress Monitoring**: Weekly/monthly progress → `weekly_progress_tracking`, `monthly_assessments` tables
7. **Health Metrics**: Measurements recorded → `health_metrics` table
8. **Health Scores**: Scores calculated → `health_scores` table

## Security

All tables have Row Level Security (RLS) enabled with policies that ensure users can only access their own data. The policies are:

- **SELECT**: Users can view their own records
- **INSERT**: Users can insert records for themselves
- **UPDATE**: Users can update their own records
- **DELETE**: Users can delete their own records

## Indexes

Each table has appropriate indexes for optimal query performance:

- Primary key indexes
- Foreign key indexes
- Frequently queried column indexes
- JSONB GIN indexes for JSON data
- Array GIN indexes for array data

## Triggers

All tables have `updated_at` triggers that automatically update the `updated_at` timestamp when records are modified.

## Usage Examples

### Creating a User Profile

```sql
INSERT INTO user_profiles (id, full_name, age, gender, onboarding_completed)
VALUES (auth.uid(), 'John Doe', 30, 'male', true);
```

### Recording Health Metrics

```sql
INSERT INTO health_metrics (user_id, metric_type, value, unit, measurement_date)
VALUES (auth.uid(), 'weight', 70.5, 'kg', CURRENT_DATE);
```

### Creating a Health Plan

```sql
INSERT INTO health_plans (user_id, plan_name, plan_type, primary_goal, status)
VALUES (auth.uid(), 'Weight Loss Plan', 'health_transformation', 'Lose 10kg', 'active');
```

## Migration Order

The migrations should be run in the following order:

1. `001_create_user_profiles_table.sql`
2. `002_create_onboarding_profiles_table.sql`
3. `003_create_health_metrics_table.sql`
4. `004_create_health_scores_table.sql`
5. `005_create_daily_activities_table.sql`
6. `006_create_health_plans_table.sql`
7. `007_create_weekly_milestones_table.sql`
8. `008_create_monthly_assessments_table.sql`
9. `009_create_weekly_progress_tracking_table.sql`
10. `010_create_daily_plan_execution_table.sql`

This order ensures that all foreign key dependencies are properly established.
