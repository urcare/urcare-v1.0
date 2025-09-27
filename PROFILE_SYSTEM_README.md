# User Profile & Onboarding System

This document describes the updated user profile and onboarding system that matches the latest database structure.

## 🏗️ Architecture Overview

### Database Structure

- **`user_profiles`** - Main user profile table with all personal and health information
- **`onboarding_profiles`** - Raw onboarding data storage for reference
- **`health_metrics`** - Detailed health tracking data
- **`health_scores`** - User health scores and streaks
- **`daily_activities`** - Daily activity completion tracking

### Service Layer

- **`UserProfileService`** - Core service for all profile operations
- **`useUserProfile`** - React hook for easy component integration
- **Migration utilities** - Tools for data migration and cleanup

## 📁 File Structure

```
src/
├── services/
│   └── userProfileService.ts          # Core profile service
├── hooks/
│   └── useUserProfile.ts              # React hook for profile operations
├── components/
│   ├── onboarding/
│   │   └── UpdatedOnboarding.tsx     # New onboarding component
│   └── profile/
│       └── ProfileManager.tsx        # Profile management component
└── utils/
    └── profileMigration.ts            # Migration utilities
```

## 🚀 Quick Start

### 1. Database Setup

Run the clean database schema:

```sql
\i simple_clean_database.sql
```

### 2. Using the Profile Service

```typescript
import { userProfileService } from "@/services/userProfileService";

// Save onboarding data
const result = await userProfileService.saveOnboardingData(
  userId,
  onboardingData
);

// Get user profile
const profile = await userProfileService.getUserProfile(userId);

// Update profile
const success = await userProfileService.updateUserProfile(userId, updates);
```

### 3. Using the React Hook

```typescript
import { useUserProfile } from "@/hooks/useUserProfile";

function MyComponent() {
  const {
    profile,
    isLoading,
    saveOnboardingData,
    updateProfile,
    hasCompletedOnboarding,
    profileCompleteness,
  } = useUserProfile();

  // Use the hook data and methods
}
```

## 📋 API Reference

### UserProfileService

#### `saveOnboardingData(userId: string, data: OnboardingData)`

Saves complete onboarding data to user profile.

**Parameters:**

- `userId` - User ID
- `data` - Complete onboarding data object

**Returns:** `Promise<{ success: boolean; error?: string }>`

#### `getUserProfile(userId: string)`

Retrieves user profile by ID.

**Returns:** `Promise<UserProfile | null>`

#### `updateUserProfile(userId: string, updates: ProfileUpdateData)`

Updates user profile with provided data.

**Parameters:**

- `userId` - User ID
- `updates` - Partial profile data to update

**Returns:** `Promise<{ success: boolean; error?: string }>`

#### `hasCompletedOnboarding(userId: string)`

Checks if user has completed onboarding.

**Returns:** `Promise<boolean>`

#### `getUserProfileStats(userId: string)`

Gets user profile statistics including completeness and health metrics.

**Returns:** `Promise<{ profileCompleteness: number; healthScore: number; daysActive: number; error?: string }>`

### useUserProfile Hook

#### Return Values

- `profile` - Current user profile data
- `isLoading` - Loading state for profile operations
- `isSaving` - Saving state for profile updates
- `saveOnboardingData` - Function to save onboarding data
- `updateProfile` - Function to update profile
- `refreshProfile` - Function to refresh profile data
- `hasCompletedOnboarding` - Boolean indicating onboarding completion
- `profileCompleteness` - Profile completion percentage
- `healthScore` - User's current health score
- `daysActive` - Number of active days
- `error` - Current error message
- `clearError` - Function to clear errors

## 🎯 Onboarding Data Structure

```typescript
interface OnboardingData {
  // Basic Information
  fullName: string;
  age: number;
  dateOfBirth: string;
  gender: string;

  // Physical Metrics
  unitSystem: "metric" | "imperial";
  heightFeet?: string;
  heightInches?: string;
  heightCm?: string;
  weightLb?: string;
  weightKg?: string;

  // Schedule & Lifestyle
  wakeUpTime: string;
  sleepTime: string;
  workStart: string;
  workEnd: string;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  workoutTime: string;

  // Health Information
  chronicConditions: string[];
  takesMedications: string;
  medications: string[];
  hasSurgery: string;
  surgeryDetails: string[];
  healthGoals: string[];
  dietType: string;
  bloodGroup: string;

  // Lifestyle Factors
  routineFlexibility: string;
  workoutType: string;
  smoking: string;
  drinking: string;
  usesWearable: string;
  wearableType: string;
  trackFamily: string;
  shareProgress: string;

  // Safety & Medical
  emergencyContactName: string;
  emergencyContactPhone: string;
  criticalConditions: string;
  hasHealthReports: string;
  healthReports: string[];
  referralCode: string;
  saveProgress: string;

  // Additional Data
  preferences: Record<string, any>;
}
```

## 🔄 Migration Guide

### From Legacy System

1. **Run Migration Script:**

```typescript
import { migrateUserProfiles } from "@/utils/profileMigration";

const result = await migrateUserProfiles();
console.log(`Migrated ${result.migrated} profiles`);
```

2. **Check Migration Status:**

```typescript
import { getMigrationStats } from "@/utils/profileMigration";

const stats = await getMigrationStats();
console.log(`Total profiles: ${stats.totalProfiles}`);
console.log(`Needs migration: ${stats.needsMigration}`);
```

3. **Clean Up Legacy Data:**

```typescript
import { cleanupLegacyData } from "@/utils/profileMigration";

const result = await cleanupLegacyData();
```

## 🧩 Component Usage

### Updated Onboarding Component

```typescript
import { UpdatedOnboarding } from "@/components/onboarding/UpdatedOnboarding";

// Use in your routing
<Route path="/onboarding" element={<UpdatedOnboarding />} />;
```

### Profile Manager Component

```typescript
import { ProfileManager } from "@/components/profile/ProfileManager";

// Use in your profile page
<Route path="/profile" element={<ProfileManager />} />;
```

## 🔒 Security Features

### Row Level Security (RLS)

All tables have comprehensive RLS policies:

- Users can only access their own data
- Proper authentication checks
- Secure data isolation

### Data Validation

- Client-side validation for all forms
- Server-side validation in services
- Type safety with TypeScript interfaces

## 📊 Performance Features

### Optimized Queries

- Proper database indexing
- Efficient data fetching
- Cached profile data in React context

### Lazy Loading

- Components load data only when needed
- Efficient re-rendering with React hooks
- Optimized state management

## 🐛 Error Handling

### Service Level

- Comprehensive error catching
- Detailed error messages
- Graceful fallbacks

### Component Level

- User-friendly error messages
- Loading states
- Retry mechanisms

### Database Level

- Transaction safety
- Constraint validation
- Data integrity checks

## 🧪 Testing

### Unit Tests

```typescript
// Test service methods
describe("UserProfileService", () => {
  it("should save onboarding data", async () => {
    const result = await userProfileService.saveOnboardingData(userId, data);
    expect(result.success).toBe(true);
  });
});
```

### Integration Tests

```typescript
// Test React hook
describe("useUserProfile", () => {
  it("should load profile data", () => {
    const { profile, isLoading } = useUserProfile();
    expect(profile).toBeDefined();
  });
});
```

## 🚀 Deployment

### Database Migration

1. Run `simple_clean_database.sql`
2. Run migration utilities if needed
3. Verify data integrity

### Application Update

1. Deploy new service files
2. Update component imports
3. Test onboarding flow
4. Verify profile management

## 📈 Monitoring

### Key Metrics

- Profile completion rates
- Onboarding abandonment points
- Data quality metrics
- Performance metrics

### Logging

- Service operation logs
- Error tracking
- User interaction analytics

## 🔧 Troubleshooting

### Common Issues

1. **Profile not loading:**

   - Check user authentication
   - Verify database connection
   - Check RLS policies

2. **Onboarding data not saving:**

   - Validate data structure
   - Check required fields
   - Verify user permissions

3. **Migration errors:**
   - Check data compatibility
   - Verify database schema
   - Run cleanup utilities

### Debug Tools

- Database query logs
- Service error logs
- Component state inspection
- Network request monitoring

## 📚 Additional Resources

- [Database Schema Documentation](./simple_clean_database.sql)
- [API Documentation](./src/services/userProfileService.ts)
- [Component Examples](./src/components/)
- [Migration Utilities](./src/utils/profileMigration.ts)
