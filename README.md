# Immersive Alarm

An intelligent alarm system that integrates with Google Calendar and IoT devices to provide a comprehensive wake-up solution for users who have difficulty waking up with traditional alarms.

## Features

### 🗓️ Smart Calendar Integration
- **Google Calendar Sync**: Automatically fetch and display upcoming events
- **Event-based Alarms**: Convert calendar events into customizable alarm triggers
- **Real-time Synchronization**: Keep calendar data updated across sessions

### 🏠 Advanced IoT Device Control
- **Device Binding**: Secure pairing of user accounts with physical alarm devices
- **Multi-sensor Monitoring**: Integrate pressure mats, infrared sensors, cameras, and microphones
- **Remedial Actions**: Trigger water spray, slapping device, and other wake-up mechanisms

### 📊 Comprehensive Activity Tracking
- **Historical Data**: Record all alarm activities and user responses
- **Performance Analytics**: Track success rates, average wake-up times, and patterns
- **Export Functionality**: Download activity data as CSV for analysis

### 🎨 Modern User Interface
- **Responsive Design**: Optimized for desktop and mobile devices
- **Glass Morphism**: Modern UI with frosted glass effects
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Dark Mode Ready**: Prepared for theme switching (coming soon)

## Tech Stack

- **Framework**: Next.js 14 with App Router and TypeScript
- **State Management**: React Context API
- **Styling**: Tailwind CSS with custom utilities
- **UI Components**: 
  - Radix UI primitives
  - Shadcn/ui components
  - Custom animated components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Next.js built-in compiler

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Google account for calendar integration

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your configuration

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Authentication
The application uses a secure authentication system:
- **Path**: `/auth` for login/register
- **Google OAuth**: Required for calendar integration
- **Session Management**: Secure token-based authentication

## Project Structure

```
frontend/
├── docs/                    # Project documentation
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── auth/          # Authentication routes
│   │   ├── calendar/      # Calendar view
│   │   └── activity/      # Activity tracking
│   ├── components/         # React components
│   │   ├── layout/        # Navigation and layout components
│   │   ├── ui/            # Reusable UI components
│   │   └── views/         # Full-page view components
│   ├── contexts/          # React Context providers
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
└── Configuration files
```

## Features in Detail

### Calendar View
- **Monthly/Weekly Views**: Toggle between different calendar layouts
- **Event Management**: Create, edit, and delete calendar events
- **Alarm Settings**: Configure wake-up parameters for each event

### Activity Tracking
- **Historical View**: Timeline of all alarm activities
- **Success Metrics**: Visual representation of wake-up success rate
- **Detailed Logs**: Sensor data and device activation records

### User Settings
- **Profile Management**: Update user information and preferences
- **Device Configuration**: Manage connected IoT devices
- **Notification Settings**: Configure email and push notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

