# Kamuit 1.0 - Ride Sharing Community

A lightweight ride-sharing MVP web app that connects travelers in local communities. Built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.

## Features

### 🚗 Core Functionality
- **Onboarding Flow**: Collect user information (name, email, city, student status)
- **Ride Posting**: Offer rides or request rides with detailed information
- **Community Wall**: Browse and filter ride posts with sorting options
- **Connection System**: Connect with other users through ride posts

### 🎨 User Experience
- **No Login Required**: Start using the app immediately
- **Student Support**: Special features for university students
- **Hashtag System**: Categorize rides (PetFriendly, SmokeFree, WomenOnly, etc.)
- **Responsive Design**: Works on desktop and mobile devices

### 🔧 Technical Features
- **Email Verification**: Magic link authentication via NextAuth
- **SMS Notifications**: Twilio integration for phone verification and updates
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom components

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide React icons
- **Forms**: React Hook Form with Zod validation
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with magic link
- **Email**: Amazon SES or Postmark
- **SMS**: Twilio
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Twilio account (for SMS)
- Amazon SES or Postmark account (for email)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kamuit-1.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `env.example` to `.env.local` and configure:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kamuit"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (Amazon SES or Postmark)
EMAIL_SERVER_HOST="smtp.amazonaws.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-ses-access-key"
EMAIL_SERVER_PASSWORD="your-ses-secret-key"
EMAIL_FROM="noreply@kamuit.com"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

## Database Schema

The app uses the following main models:

- **User**: User profiles with verification status
- **RidePost**: Ride offers and requests
- **Hashtag**: Categorization tags for rides
- **Connection**: User connections through ride posts

## App Flow

1. **Onboarding**: User provides basic information
2. **Ride Type Selection**: Choose to offer or find a ride
3. **Ride Post Creation**: Fill in ride details and hashtags
4. **Community Wall**: Browse and filter available rides
5. **Connection**: Connect with other users

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database Setup

For production, use a managed PostgreSQL service:
- **Vercel Postgres** (recommended for Vercel deployment)
- **Supabase**
- **Neon**
- **Railway**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@kamuit.com or create an issue in the repository.

---

Built with ❤️ for the ride-sharing community 