# 🔐 Authentication & Onboarding Logging Guide

## Overview
This document explains all the logging that happens during authentication and onboarding checks. Every backend operation is now logged with detailed information.

## 🔍 **Logging Categories**

### **1. Authentication Process (`🔐 AUTH:`)**
All authentication-related operations are logged with the `🔐 AUTH:` prefix.

#### **User Authentication Start**
```
🔐 AUTH: Starting user authentication process
🔐 AUTH: User authenticated: { id, email, created_at, last_sign_in }
```

#### **Profile Operations**
```
🔐 AUTH: Starting profile operations with timeout protection
🔐 AUTH: Step 1 - Ensuring user profile exists
🔐 AUTH: Step 2 - Fetching user profile with timeout
🔐 AUTH: Step 3 - Checking onboarding_profiles table
```

#### **Database Queries**
```
🔐 AUTH: ensureUserProfile - Querying user_profiles table
🔐 AUTH: fetchUserProfile - Querying user_profiles with timeout protection
🔐 AUTH: ensureUserProfile - Profile not found (PGRST116), creating new profile
```

#### **Results & Fallbacks**
```
🔐 AUTH: Profile fetch result: { hasProfile, profileId, onboardingCompleted, profileKeys }
🔐 AUTH: Onboarding profiles check result: { hasData, onboardingCompleted, error }
🔐 AUTH: Recovery - checking onboarding_profiles as fallback
🔐 AUTH: Final fallback - created minimal profile with onboarding_completed: false
```

### **2. Route Protection (`🛡️ PROTECTED_ROUTE:`)**
All route protection checks are logged with the `🛡️ PROTECTED_ROUTE:` prefix.

#### **Component State**
```
🛡️ PROTECTED_ROUTE: CleanProtectedRoute checks: {
  hasUser, userId, hasProfile, profileId, onboardingCompleted,
  loading, isInitialized, requireOnboardingComplete, pathname, timestamp
}
```

#### **Redirect Logic**
```
🛡️ PROTECTED_ROUTE: Evaluating redirect logic: {
  hasRedirected, hasUser, hasProfile, requireOnboardingComplete,
  onboardingCompleted, pathname
}
```

#### **Redirect Decisions**
```
🛡️ PROTECTED_ROUTE: No user - redirecting to landing
🛡️ PROTECTED_ROUTE: Require onboarding but no profile - waiting for profile to load
🛡️ PROTECTED_ROUTE: Onboarding not completed - redirecting to onboarding
🛡️ PROTECTED_ROUTE: Onboarding already completed but on onboarding page - redirecting to dashboard
🛡️ PROTECTED_ROUTE: No redirect needed - rendering children
```

### **3. Smart Routing (`🧭 SMART_ROUTE:`)**
All smart routing decisions are logged with the `🧭 SMART_ROUTE:` prefix.

#### **Route Handler State**
```
🧭 SMART_ROUTE: SmartRouteHandler effect triggered: {
  isInitialized, loading, hasUser, userId, hasProfile, profileId,
  onboardingCompleted, pathname, timestamp
}
```

#### **Routing Decisions**
```
🧭 SMART_ROUTE: Auth not ready - skipping routing logic
🧭 SMART_ROUTE: On public route - skipping routing logic
🧭 SMART_ROUTE: No user - redirecting to landing
🧭 SMART_ROUTE: Onboarding not completed - redirecting to onboarding
🧭 SMART_ROUTE: Onboarding completed but on onboarding page - redirecting to dashboard
🧭 SMART_ROUTE: On dashboard but onboarding not completed - redirecting to onboarding
🧭 SMART_ROUTE: No redirect needed - staying on current route
```

## 📊 **Complete Authentication Flow Logging**

### **Step 1: Authentication Start**
```
🔐 AUTH: Starting user authentication process
🔐 AUTH: User authenticated: { id: "user-id", email: "user@example.com", created_at: "2024-01-01T00:00:00Z", last_sign_in: "2024-01-01T00:00:00Z" }
```

### **Step 2: Profile Operations**
```
🔐 AUTH: Starting profile operations with timeout protection
🔐 AUTH: Step 1 - Ensuring user profile exists
🔐 AUTH: ensureUserProfile - Checking if profile exists for user: user-id
🔐 AUTH: ensureUserProfile - Querying user_profiles table
🔐 AUTH: ensureUserProfile - Query result: { hasProfile: true, profileId: "user-id", onboardingCompleted: false, error: null, errorCode: null }
🔐 AUTH: ensureUserProfile - Profile already exists, skipping creation
```

### **Step 3: Profile Fetching**
```
🔐 AUTH: Step 2 - Fetching user profile with timeout
🔐 AUTH: fetchUserProfile - Starting profile fetch for user: user-id
🔐 AUTH: fetchUserProfile - Cache miss or expired, fetching from database
🔐 AUTH: fetchUserProfile - Querying user_profiles with timeout protection
🔐 AUTH: fetchUserProfile - Database query result: { hasData: true, dataLength: 1, error: null, errorCode: null }
🔐 AUTH: fetchUserProfile - Profile processing result: { hasResult: true, resultId: "user-id", onboardingCompleted: false, profileKeys: ["id", "full_name", "onboarding_completed", ...] }
🔐 AUTH: fetchUserProfile - Caching profile result
```

### **Step 4: Profile Setting**
```
🔐 AUTH: Profile fetch result: { hasProfile: true, profileId: "user-id", onboardingCompleted: false, profileKeys: ["id", "full_name", "onboarding_completed", ...] }
🔐 AUTH: Setting user profile from database
🔐 AUTH: Authentication process completed
```

### **Step 5: Route Protection**
```
🛡️ PROTECTED_ROUTE: CleanProtectedRoute checks: {
  hasUser: true, userId: "user-id", hasProfile: true, profileId: "user-id",
  onboardingCompleted: false, loading: false, isInitialized: true,
  requireOnboardingComplete: true, pathname: "/dashboard", timestamp: "2024-01-01T00:00:00.000Z"
}
🛡️ PROTECTED_ROUTE: Evaluating redirect logic: {
  hasRedirected: false, hasUser: true, hasProfile: true, requireOnboardingComplete: true,
  onboardingCompleted: false, pathname: "/dashboard"
}
🛡️ PROTECTED_ROUTE: Onboarding not completed - redirecting to onboarding
```

### **Step 6: Smart Routing**
```
🧭 SMART_ROUTE: SmartRouteHandler effect triggered: {
  isInitialized: true, loading: false, hasUser: true, userId: "user-id",
  hasProfile: true, profileId: "user-id", onboardingCompleted: false,
  pathname: "/dashboard", timestamp: "2024-01-01T00:00:00.000Z"
}
🧭 SMART_ROUTE: On dashboard but onboarding not completed - redirecting to onboarding
```

## 🎯 **Key Information Logged**

### **Database Operations**
- ✅ **Table queries** (user_profiles, onboarding_profiles)
- ✅ **Query results** (data, errors, response times)
- ✅ **Cache hits/misses** (performance optimization)
- ✅ **Timeout handling** (error prevention)

### **Authentication State**
- ✅ **User information** (ID, email, timestamps)
- ✅ **Profile data** (onboarding status, profile keys)
- ✅ **Loading states** (initialization, loading flags)
- ✅ **Error handling** (timeouts, fallbacks)

### **Routing Decisions**
- ✅ **Route protection** (authentication requirements)
- ✅ **Onboarding checks** (completion status)
- ✅ **Redirect logic** (where to send users)
- ✅ **Public routes** (routes that don't need auth)

### **Performance Metrics**
- ✅ **Cache performance** (hit/miss rates)
- ✅ **Database response times** (query performance)
- ✅ **Component render cycles** (optimization tracking)
- ✅ **Redirect frequency** (routing efficiency)

## 🔧 **How to Use These Logs**

### **Debugging Authentication Issues**
1. Look for `🔐 AUTH:` logs to see authentication flow
2. Check for database errors in query results
3. Verify profile creation and fetching
4. Verify onboarding status checks

### **Debugging Routing Issues**
1. Look for `🛡️ PROTECTED_ROUTE:` logs to see route protection
2. Check for `🧭 SMART_ROUTE:` logs to see routing decisions
3. Verify redirect logic and conditions
4. Check for race conditions between components

### **Performance Optimization**
1. Monitor cache hit/miss rates
2. Check database query performance
3. Identify redundant operations
4. Track component render cycles

## 📝 **Log Format**

All logs include:
- **Timestamp** (when the operation occurred)
- **Component** (which component logged it)
- **Operation** (what operation was performed)
- **Data** (relevant data for debugging)
- **Result** (success/failure status)

This comprehensive logging system allows you to track every backend operation and understand exactly what's happening during authentication and onboarding checks.
