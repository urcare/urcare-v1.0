# Health Plan Feature Setup Guide

This guide explains how to set up and use the personalized health plan feature in the UrCare app.

## Features

- **AI-Generated Health Plans**: Uses OpenAI GPT-4 to create personalized 2-day health plans based on user onboarding data
- **Timetable-Style Display**: Shows activities in a calendar-like format with specific times and durations
- **Progress Tracking**: Users can mark activities as completed and track their daily progress
- **Automatic Plan Generation**: Automatically generates new 2-day plans when the current plan is completed
- **Real-time Updates**: Progress is saved to Supabase and synced across devices

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your deployment platform (Vercel, Netlify, etc.):

```bash
# OpenAI API Key (required for health plan generation)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (already configured)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Setup

The following database tables are already created via migrations:

- `two_day_health_plans`: Stores the generated health plans
- `plan_progress`: Tracks individual activity completion
- `user_profiles`: Contains user onboarding data used for plan generation

### 3. Supabase Functions

Deploy the health plan generation function:

```bash
# Deploy the function to Supabase
supabase functions deploy generate-health-plan
```

### 4. OpenAI API Key Configuration

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your environment variables as `OPENAI_API_KEY`
3. The key is used securely in the Supabase Edge Function, not exposed to the client

## How It Works

### 1. Plan Generation

When a user first visits the planner page or requests a new plan:

1. The app fetches the user's profile data from the `user_profiles` table
2. This data is sent to the Supabase Edge Function `generate-health-plan`
3. The function uses OpenAI GPT-4 to create a personalized 2-day health plan
4. The plan is saved to the `two_day_health_plans` table

### 2. Plan Structure

Each health plan contains:

- **Day 1 & Day 2 Plans**: Complete schedules with activities
- **Activities**: Include workouts, meals, hydration, sleep, meditation, etc.
- **Activity Details**: Title, description, start/end times, duration, priority, instructions, and tips
- **Summary**: Total activities, workout time, meal count, sleep hours, and focus areas

### 3. Progress Tracking

- Users can mark individual activities as completed
- Progress is tracked in the `plan_progress` table
- Completion percentage is calculated and displayed
- When all activities for a day are completed, the day is marked as done

### 4. Automatic Plan Generation

- When both days of a plan are completed, a new 2-day plan is automatically generated
- Plans are also automatically generated if the current plan's end date has passed
- This ensures users always have an active plan to follow

## Usage

### For Users

1. **Access the Planner**: Click the planner icon in the navigation bar
2. **Generate First Plan**: If no plan exists, click "Generate Health Plan"
3. **View Activities**: Switch between Day 1 and Day 2 to see your schedule
4. **Mark Complete**: Click the circle next to any activity to mark it as completed
5. **Track Progress**: View your completion percentage and daily summary

### For Developers

The health plan feature is implemented with:

- **Frontend**: `src/pages/Planner.tsx` - Main planner page component
- **Service**: `src/services/healthPlanService.ts` - API interactions
- **Hook**: `src/hooks/useHealthPlan.ts` - React hook for state management
- **Backend**: `supabase/functions/generate-health-plan/index.ts` - AI plan generation

## Customization

### Modifying Plan Generation

To customize how plans are generated, edit the prompt in `supabase/functions/generate-health-plan/index.ts`:

```typescript
const prompt = `You are an expert health and wellness AI coach...`;
```

### Adding New Activity Types

To add new activity types, update the `HealthPlanActivity` interface in `src/services/healthPlanService.ts`:

```typescript
type: "workout" |
  "meal" |
  "hydration" |
  "sleep" |
  "meditation" |
  "break" |
  "other" |
  "new_type";
```

### Styling

The planner uses Tailwind CSS classes and can be customized by modifying the component styles in `src/pages/Planner.tsx`.

## Troubleshooting

### Common Issues

1. **"OpenAI not configured" error**: Ensure `OPENAI_API_KEY` is set in your environment variables
2. **"User profile not found" error**: User must complete onboarding first
3. **Plan generation fails**: Check OpenAI API key validity and quota
4. **Progress not saving**: Verify Supabase RLS policies are correctly configured

### Testing

Use the test script to verify the health plan generation:

```bash
# Run the test script
npx tsx api/test-health-plan.ts
```

## Security

- OpenAI API key is stored securely in environment variables
- All API calls go through Supabase Edge Functions (server-side)
- User data is protected by Row Level Security (RLS) policies
- No sensitive data is exposed to the client

## Performance

- Plans are cached in the database to avoid repeated API calls
- Progress updates are batched for better performance
- Automatic plan generation happens in the background
- Loading states provide good user experience

## Future Enhancements

Potential improvements for the health plan feature:

1. **Plan Templates**: Pre-defined plan templates for different goals
2. **Social Features**: Share progress with friends or family
3. **Analytics**: Detailed progress analytics and insights
4. **Integration**: Connect with fitness trackers and health apps
5. **Customization**: Allow users to modify generated plans
6. **Notifications**: Reminders for upcoming activities
7. **Gamification**: Points, streaks, and achievements
