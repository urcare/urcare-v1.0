# 🏥 UrCare - Health & Fitness Management Platform

A comprehensive React-based health and fitness management application built with modern web technologies.

## 🚀 Features

- **Health Assessment**: Comprehensive health evaluation and tracking
- **Fitness Tracking**: Workout planning and activity monitoring
- **Diet Management**: Nutrition tracking and meal planning
- **Progress Monitoring**: Visual progress tracking with charts and analytics
- **Subscription Management**: Flexible subscription plans with payment integration
- **Mobile Support**: Capacitor-based mobile app support
- **Admin Dashboard**: Complete admin panel for user management

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: React Query + Context API
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Payments**: Razorpay + PhonePe integration
- **Mobile**: Capacitor
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/urcare/urcare-v1.0.git
   cd urcare-v1.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   # Configure your environment variables
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Build & Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Mobile Development
```bash
npm run android      # Build and open Android project
npm run cap:sync     # Sync web assets to mobile
```

### Production
```bash
npm run build        # Build optimized production bundle
npm run start        # Start production server
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Radix UI)
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   ├── health/         # Health-related components
│   └── payment/        # Payment integration components
├── pages/              # Route components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── lib/                # Third-party library configurations
```

## 🔧 Configuration

### Environment Variables
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_RAZORPAY_KEY`: Razorpay API key
- `VITE_PHONEPE_MERCHANT_ID`: PhonePe merchant ID

### Vite Configuration
- Optimized build with code splitting
- Terser minification for production
- Manual chunk splitting for better caching
- Tree shaking for unused code elimination

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of routes and components
- **Bundle Optimization**: Manual chunk splitting for better caching
- **Image Optimization**: Lazy loading and responsive images
- **Caching**: Optimized dependency caching
- **Tree Shaking**: Unused code elimination

## 📱 Mobile Support

Built with Capacitor for native mobile app support:
- Android APK generation
- Native device features access
- Push notifications
- Camera integration
- File system access

## 🔐 Security

- JWT-based authentication
- Protected routes with role-based access
- Secure payment processing
- Environment variable protection
- CORS configuration

## 📊 Monitoring & Analytics

- User activity tracking
- Performance monitoring
- Error boundary implementation
- Admin dashboard analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for better health management**