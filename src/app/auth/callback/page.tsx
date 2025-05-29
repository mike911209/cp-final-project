'use client'
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import Loading from '@/components/ui/loading'

function CallbackContent() {
  const router = useRouter() // Keep router for potential error redirects
  const { checkAuthState, user, isLoading, error } = useUser()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const verifier = typeof window !== 'undefined'
    ? localStorage.getItem('code_verifier')
    : null

  useEffect(() => {
    // This initial checkAuthState might be for an existing session before the new OAuth code is processed.
    // It's good for initial loading, but the one after backend call is more important for the new session.
    checkAuthState();
  }, []); // Run once on mount

  useEffect(() => {
    if (!code || !verifier) {
      // If code or verifier is missing, it might be an error or incomplete redirect.
      // Optionally, redirect to an error page or /auth
      if (!isLoading && !user) { // Only redirect if not already loading or logged in
        // router.replace('/auth?error=missing_oauth_params');
      }
      return;
    }


    // Only proceed if we have a code and verifier, and the user isn't already established from the new session.
    // The isLoading check helps prevent re-fetching if checkAuthState is already in progress from the previous useEffect.
    if (code && verifier && !isLoading) {
      fetch(
        'https://kiciu82fdd.execute-api.us-east-1.amazonaws.com/prod/calendar/auth',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`, // user?.token might be stale here, backend should rely on code/verifier
          },
          body: JSON.stringify({
            code: code,
            code_verifier: verifier,
          }),
        }
      )
        .then(async res => {
          if (!res.ok) {
            const text = await res.text()
            console.error('OAuth backend error:', `HTTP ${res.status} – ${text}`);
            // router.replace(`/auth?error=backend_oauth_failed&status=${res.status}`); // Redirect to auth with error
            throw new Error(`HTTP ${res.status} – ${text}`)
          }
          return res.json()
        })
        .then(data => {
          console.log('Tokens from backend:', data);
          // After backend successfully processes, re-check Amplify's auth state.
          // This should pick up the new session established by the backend (if it configured Cognito correctly).
          // UserContext's Hub listener or checkAuthState completion will handle redirect to /calendar.
          checkAuthState(); 
          localStorage.removeItem('code_verifier'); // Clean up verifier
          router.replace('/calendar');
        })
        .catch(err => {
          console.error('OAuth callback processing error:', err);
          // router.replace('/auth?error=callback_processing_failed'); // Redirect to auth with error
          // TODO: Display a more user-friendly error message in the UI on this page
        });
    }
  }, [code, verifier, user, isLoading, checkAuthState, router]);

  // Redirect to calendar if user becomes available and there's no error
  // useEffect(() => {
  //   if (user && !isLoading && !error) {
  //     console.log("User is authenticated, redirecting to /calendar from callback");
  //     // router.replace('/calendar');
  //     localStorage.removeItem('code_verifier'); // Clean up verifier after successful redirect
  //   }
  //   // If there's an error during the process, user might want to be redirected to auth or an error page
  //   if (error && !isLoading) {
  //       console.error("Error detected in callback, redirecting to /auth");
  //       // router.replace('/auth?error=auth_error_in_callback');
  //   }

  // }, [user, isLoading, error, router]);

  // Show loading indicator while processing
  return <Loading />;
}

export default function OAuthCallback() {
  return (
    <Suspense fallback={<Loading />}>
      <CallbackContent />
    </Suspense>
  )
}
