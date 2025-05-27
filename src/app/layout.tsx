import '@/lib/awsConfig';
import type { Metadata } from "next";
import "./globals.css";
import { Navbar} from "@/components/layout/navbar";
import { UserProvider } from '@/contexts/UserContext';

// Import AWS configuration to initialize Amplify


export const metadata: Metadata = {
  title: "Immersive Alarm",
  description: "An intelligent alarm system with Google Calendar integration and IoT device control",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UserProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar/>
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
