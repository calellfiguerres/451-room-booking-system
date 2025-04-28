import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect, useState } from "react";
import { api } from "~/.client/Providers/trpc";
import eventStore from "./services/eventService";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Events initializer component
const EventsInitializer = () => {
  // Track user connection status
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const initializeEvents = async () => {
      try {
        // First check if user is logged in
        const isLoggedIn = await api.auth.checkAuth.query();
        
        if (isLoggedIn) {
          try {
            // Use the new getCurrentUser procedure
            const currentUser = await api.auth.getCurrentUser.query();
            
            // Only connect if user is a student
            if (currentUser && currentUser.type === 'student') {
              if (!connected) {
                console.log(`Connecting events for student: ${currentUser.id}`);
                eventStore.connect(currentUser.id);
                setConnected(true);
              }
            } else if (connected) {
              // Disconnect if user is not a student
              console.log('User is not a student, disconnecting events');
              eventStore.disconnect();
              setConnected(false);
            }
          } catch (error) {
            console.error('Error getting current user:', error);
            
            // Fallback to admin.getStudents for testing if getCurrentUser fails
            if (!connected) {
              try {
                const students = await api.admin.getStudents.query();
                if (students && students.length > 0) {
                  console.log(`TESTING MODE: Connecting events with first student ID: ${students[0].id}`);
                  eventStore.connect(students[0].id);
                  setConnected(true);
                }
              } catch (fallbackError) {
                console.error('Fallback error:', fallbackError);
              }
            }
          }
        } else if (connected) {
          // Disconnect if previously connected but now logged out
          console.log('User logged out, disconnecting events');
          eventStore.disconnect();
          setConnected(false);
        }
      } catch (error) {
        console.error("Error initializing events:", error);
      }
    };
    
    // Initialize on component mount
    initializeEvents();
    
    // Set up interval to check auth status periodically
    const intervalId = setInterval(initializeEvents, 30000); // Check every 30 seconds
    
    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      eventStore.disconnect();
      setConnected(false);
    };
  }, [connected]);
  
  // This component doesn't render anything
  return null;
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <EventsInitializer />
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
