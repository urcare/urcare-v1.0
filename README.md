# 🏥 UrCare Health - AI-Powered Wellness App

> **Personalized Health & Fitness Plans Powered by AI**

UrCare is a modern, streamlined health and wellness application that creates personalized dietary and workout plans based on user onboarding data. Built with React, TypeScript, and AI integration.

## ✨ Features

### 🎯 **Core Functionality**
- **Smart Onboarding** - Comprehensive health profile collection
- **AI-Powered Custom Plans** - Personalized health recommendations using OpenAI
- **Dietary Planning** - Custom nutrition plans based on goals and preferences
- **Workout Routines** - Tailored fitness plans for individual needs
- **Progress Tracking** - Monitor health metrics and achievements
- **Mobile Ready** - Capacitor integration for cross-platform deployment

### 🤖 **AI Integration**
- **OpenAI GPT-4** - Intelligent health plan generation
- **Fallback System** - Mock data when AI is unavailable
- **Personalized Insights** - Health assessments and recommendations
- **Adaptive Learning** - Plans evolve with user progress

### 💳 **Payment & Subscriptions**
- **Razorpay Integration** - Secure payment processing
- **Flexible Plans** - Monthly and annual subscriptions
- **First-time Pricing** - Special rates for new users

## 🚀 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI Components:** Shadcn/ui + Tailwind CSS
- **Backend:** Vercel Serverless Functions
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4 API
- **Payments:** Razorpay
- **Mobile:** Capacitor 6
- **Deployment:** Vercel

## 📱 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/urcare/urcare-v1.0.git
   cd urcare-v1.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:8081
   ```

## 🔧 Configuration

### Environment Variables (Optional)
The app works out-of-the-box with fallback values, but you can customize:

```bash
# Supabase (optional - fallbacks provided)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (optional - mock data fallback)
VITE_OPENAI_API_KEY=your_openai_api_key

# Razorpay (optional)
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

### Production Deployment
1. **Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**
3. Add your production keys
4. Deploy automatically on git push

## 🏗️ Project Structure

```
urcare-v1.0/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # App pages (onboarding, plans, etc.)
│   ├── contexts/      # React contexts (auth, etc.)
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services
│   ├── config/        # Centralized configuration
│   └── types/         # TypeScript type definitions
├── api/               # Vercel serverless functions
├── supabase/          # Database migrations & functions
└── android/           # Capacitor Android app
```

## 🎯 Key Components

### **Onboarding Flow**
- Health profile collection
- Goal setting
- Preference customization
- Data validation

### **Custom Plan Generation**
- AI-powered health assessments
- Personalized nutrition plans
- Tailored workout routines
- Lifestyle recommendations

### **User Management**
- Authentication (Google, Apple, Email)
- Profile management
- Progress tracking
- Subscription handling

## 📊 API Endpoints

- `POST /api/generate-plan` - Generate personalized health plans
- Supabase functions for user management and subscriptions

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Mobile Build
```bash
npm run android        # Android development
npm run android:build  # Android APK build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/urcare/urcare-v1.0/issues)
- **Documentation:** [Project Wiki](https://github.com/urcare/urcare-v1.0/wiki)
- **Community:** [Discussions](https://github.com/urcare/urcare-v1.0/discussions)

## 🙏 Acknowledgments

- **OpenAI** for AI-powered health insights
- **Supabase** for backend infrastructure
- **Vercel** for seamless deployment
- **Shadcn/ui** for beautiful components

---

**Built with ❤️ for better health and wellness**

*UrCare - Your AI Health Companion*
