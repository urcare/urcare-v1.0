# UrCare Backend Architecture & Connections

## 🏗️ **Backend Overview**

UrCare uses a **serverless architecture** built on **Supabase** with **Edge Functions** for backend processing. The system is designed for scalability, security, and real-time capabilities.

## 🔗 **Core Backend Components**

### 1. **Database Layer (Supabase PostgreSQL)**
- **Primary Database**: PostgreSQL with Row Level Security (RLS)
- **Real-time**: WebSocket connections for live updates
- **Storage**: File storage for health reports, images
- **Auth**: Built-in authentication with JWT tokens

### 2. **Authentication System**
```
Frontend → Supabase Auth → JWT Token → Protected Routes
```

**Authentication Flow:**
1. **User Registration/Login** → Supabase Auth
2. **JWT Token Generation** → Automatic token refresh
3. **Profile Creation** → `user_profiles` table
4. **Session Management** → Automatic session persistence

**Supported Auth Methods:**
- ✅ **Google OAuth** - Production & Development
- ✅ **Apple OAuth** - Production & Development  
- ✅ **Email/Password** - Direct signup
- ✅ **Email Verification** - Email confirmation flow

### 3. **Payment Processing**
```
Frontend → Razorpay/PhonePe → Edge Functions → Database
```

**Payment Providers:**
- **Razorpay** - Primary payment gateway
- **PhonePe** - Alternative payment method
- **Subscription Management** - Recurring billing

## 🗄️ **Database Schema (10 Core Tables)**

### **User Management Tables**
1. **`user_profiles`** - Core user information
2. **`onboarding_profiles`** - Raw onboarding data

### **Health Data Tables**
3. **`health_metrics`** - Health measurements over time
4. **`health_scores`** - Calculated health assessments
5. **`daily_activities`** - Daily activity tracking

### **Health Plans Tables**
6. **`health_plans`** - Comprehensive health plans
7. **`weekly_milestones`** - Weekly plan milestones
8. **`monthly_assessments`** - Monthly health assessments
9. **`weekly_progress_tracking`** - Weekly progress data
10. **`daily_plan_execution`** - Daily plan execution

### **Subscription Tables**
- **`subscription_plans`** - Available subscription plans
- **`unified_subscriptions`** - User subscriptions
- **`subscription_usage`** - Feature usage tracking

## 🔧 **Backend Services Architecture**

### **1. Authentication Services**
```typescript
// AuthContext.tsx - Main authentication context
- User state management
- Profile management  
- Session handling
- OAuth flows (Google, Apple)
- Email authentication
```

### **2. User Flow Services**
```typescript
// userFlowService.ts - User journey management
- New user detection
- Onboarding flow control
- Subscription status checking
- Route redirection logic
```

### **3. Payment Services**
```typescript
// razorpayService.ts - Payment processing
- Order creation
- Payment verification
- Subscription management
- Webhook handling
```

### **4. Health Services**
```typescript
// healthScoreService.ts - Health calculations
- AI-powered health scoring
- Health analysis generation
- Progress tracking
- Recommendation engine
```

### **5. Subscription Services**
```typescript
// subscriptionService.ts - Subscription management
- Plan management
- Usage tracking
- Feature access control
- Billing management
```

## 🌐 **API Endpoints (Supabase Edge Functions)**

### **Payment Endpoints**
```
/api/razorpay/create-order     - Create Razorpay order
/api/razorpay/verify-payment   - Verify payment
/api/phonepe/create-order      - Create PhonePe order
/api/phonepe/payment-status    - Check payment status
```

### **Health Endpoints**
```
/api/health-score-optimized    - Calculate health scores
/api/health-plans-optimized    - Generate health plans
/api/plan-activities-optimized  - Get plan activities
```

### **Utility Endpoints**
```
/api/test-claude-keys          - Test AI service keys
/api/phonepe-status           - PhonePe service status
```

## 🔄 **Data Flow Architecture**

### **1. User Registration Flow**
```
Landing Page → Auth Options → Supabase Auth → Profile Creation → Onboarding
```

### **2. Health Assessment Flow**
```
Onboarding → Health Data Collection → AI Analysis → Health Score → Health Plan
```

### **3. Subscription Flow**
```
Health Assessment → Payment Gateway → Subscription Activation → Dashboard Access
```

### **4. Daily Usage Flow**
```
Dashboard → Feature Usage → Usage Tracking → Progress Updates → Health Insights
```

## 🔐 **Security Implementation**

### **Row Level Security (RLS)**
- **User Isolation**: Users can only access their own data
- **Policy Enforcement**: Automatic data filtering
- **Secure Queries**: All database queries are user-scoped

### **Authentication Security**
- **JWT Tokens**: Secure token-based authentication
- **Token Refresh**: Automatic token renewal
- **Session Management**: Secure session handling

### **API Security**
- **CORS Configuration**: Proper cross-origin setup
- **Rate Limiting**: Built-in Supabase rate limiting
- **Input Validation**: Server-side validation

## 📊 **Real-time Features**

### **Live Data Updates**
- **Health Metrics**: Real-time health data updates
- **Progress Tracking**: Live progress monitoring
- **Notifications**: Real-time notifications

### **WebSocket Connections**
- **Supabase Realtime**: Built-in real-time subscriptions
- **Live Updates**: Automatic UI updates
- **Collaborative Features**: Multi-user real-time features

## 🚀 **Deployment Architecture**

### **Frontend Deployment**
- **Vercel**: Primary hosting platform
- **CDN**: Global content delivery
- **Edge Functions**: Serverless backend processing

### **Database Deployment**
- **Supabase Cloud**: Managed PostgreSQL
- **Global Replication**: Multi-region data replication
- **Backup & Recovery**: Automated backups

### **Environment Configuration**
```typescript
// Development
- Local Supabase instance
- Development API keys
- Localhost redirects

// Production  
- Supabase Cloud
- Production API keys
- Vercel domain redirects
```

## 🔧 **Development vs Production**

### **Development Mode**
- **Local Supabase**: Development database
- **Debug Logging**: Console logs enabled
- **Test Users**: Mock authentication
- **Localhost URLs**: Development redirects

### **Production Mode**
- **Supabase Cloud**: Production database
- **Minimal Logging**: Production-optimized logging
- **Real Authentication**: OAuth providers
- **Production URLs**: Live domain redirects

## 📈 **Performance Optimizations**

### **Database Optimizations**
- **Indexing**: Optimized database indexes
- **Query Optimization**: Efficient SQL queries
- **Connection Pooling**: Managed connections

### **Caching Strategy**
- **Profile Caching**: User profile caching (10 minutes)
- **Query Caching**: Supabase built-in caching
- **CDN Caching**: Static asset caching

### **Real-time Optimizations**
- **Selective Subscriptions**: Only subscribe to needed data
- **Connection Management**: Efficient WebSocket usage
- **Data Pagination**: Large dataset pagination

## 🔄 **Backend Service Connections**

### **Service Dependencies**
```
AuthContext → userFlowService → subscriptionService → healthScoreService
     ↓              ↓                    ↓                    ↓
Supabase Auth → Database → Payment APIs → AI Services
```

### **Data Flow Chain**
1. **Authentication** → User profile creation
2. **User Flow** → Onboarding completion
3. **Subscription** → Payment processing
4. **Health Services** → AI-powered analysis
5. **Real-time Updates** → Live data synchronization

## 🛠️ **Backend Maintenance**

### **Monitoring**
- **Supabase Dashboard**: Database monitoring
- **Vercel Analytics**: Performance monitoring
- **Error Tracking**: Built-in error handling

### **Scaling**
- **Auto-scaling**: Supabase automatic scaling
- **Edge Functions**: Serverless scaling
- **Database Scaling**: Managed PostgreSQL scaling

This architecture provides a robust, scalable, and secure backend for the UrCare health platform with real-time capabilities and comprehensive user management.
