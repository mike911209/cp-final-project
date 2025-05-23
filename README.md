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
- **Accessibility**: WCAG 2.1 compliant with proper ARIA labels
- **Dark Mode Ready**: Prepared for theme switching (coming soon)

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Turbopack (Next.js dev server)

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

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Login
For demonstration purposes, use these credentials:
- **Email**: `demo@example.com`
- **Password**: `password`

## Usage Guide

### 1. Authentication
- **Login**: Use the demo credentials or register a new account
- **Registration**: Requires a device serial number and Google OAuth token
- **Google Integration**: Click "Connect Google Calendar & Gmail" to authorize access

### 2. Calendar Management
- **View Events**: See your upcoming calendar events organized by date
- **Enable Alarms**: Toggle the alarm switch for each event you want to wake up for
- **Configure Settings**: Click the settings gear to customize remedial actions
  - Enable water spray or slapping device
  - Add custom voice messages
  - Set emergency contact notifications

### 3. Activity History
- **View Statistics**: See overview cards with total triggers, success rate, and average wake-up time
- **Explore Timeline**: Expand activity details to see sensor data and remedial actions
- **Export Data**: Download your activity history as CSV for analysis
- **Filter Results**: Use date range filters to focus on specific time periods

## Project Structure

```
frontend/
├── docs/                    # Project documentation
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # React components
│   │   ├── layout/        # Navigation and layout components
│   │   ├── ui/            # Reusable UI components
│   │   └── views/         # Full-page view components
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
└── Configuration files
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Components

#### UI Components
- **Button**: Multi-variant button component
- **Input**: Form input with validation support
- **Card**: Container components for content organization
- **Switch**: Toggle switches for alarm enable/disable
- **Dialog**: Modal dialogs for settings and confirmations

#### Views
- **LoginView**: Authentication and registration
- **CalendarView**: Event management and alarm configuration
- **ActivityView**: Historical data and analytics

### State Management
The application uses React's built-in state management with hooks. State is organized into:
- Authentication state (user, login status)
- Calendar state (events, filters, sync status)
- Activity state (history, statistics, filters)

## Configuration

### Environment Variables
Create a `.env.local` file for environment-specific settings:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Tailwind Configuration
The project uses a custom Tailwind configuration optimized for the design system. Colors, spacing, and breakpoints are configured in `tailwind.config.ts`.

## API Integration

Currently, the application uses mock data for demonstration. For production use, implement these API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/google` - Google OAuth handling

### Calendar
- `GET /api/calendar/events` - Fetch calendar events
- `PUT /api/calendar/events/:id/alarm` - Update alarm settings

### Activity
- `GET /api/activity` - Fetch activity history
- `GET /api/activity/statistics` - Get analytics data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use the existing component patterns
- Ensure accessibility compliance
- Add proper error handling
- Update documentation for new features

## Troubleshooting

### Common Issues

**Build Errors**
- Ensure all dependencies are installed: `npm install`
- Clear Next.js cache: `rm -rf .next`
- Check TypeScript errors: `npm run lint`

**Google OAuth Issues**
- Verify your Google client configuration
- Check CORS settings for your domain
- Ensure proper redirect URLs are configured

**Styling Issues**
- Verify Tailwind CSS is properly configured
- Check for conflicting CSS classes
- Ensure proper responsive breakpoints

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the [documentation](./docs/)
- Review [known issues](./docs/TASK.md#known-issues)
- Open an issue on GitHub

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
