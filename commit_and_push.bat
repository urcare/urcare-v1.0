@echo off
echo Starting git operations...

echo.
echo Adding all changes...
git add .

echo.
echo Committing changes...
git commit -m "feat: implement complete authentication system with routing

- Add AuthProvider to App.tsx for global auth state management
- Add RouteGuard component for protected routes with smart routing
- Implement handleUserRouting with database checks for:
  - profiles table (create if not exists)
  - onboarding_profiles table (check onboarding_completed)
  - health_assessment_completed status
  - user_subscription table (check active subscription)
- Add comprehensive error handling and logging
- Route users based on completion status:
  - No profile -> create profile
  - No onboarding -> /onboarding
  - No health assessment -> /health-assessment  
  - No active subscription -> /paywall
  - All complete -> /dashboard
- Remove timeouts and bypasses for clean routing
- Add proper loading states and error handling"

echo.
echo Pushing to remote...
git push origin main

echo.
echo Done! Authentication system is now implemented.
pause
