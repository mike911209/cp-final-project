# AWS Amplify Authentication Integration

This document explains how to set up and use AWS Amplify Authentication with Google Identity Provider in your React + Next.js application.

## Prerequisites

1. AWS Account
2. Google Cloud Console Account
3. Node.js and npm installed

## AWS Cognito Setup

### 1. Create User Pool

1. Go to AWS Cognito Console
2. Click "Create user pool"
3. Configure sign-in options:
   - Email
   - Username
4. Configure security requirements:
   - Password policy (minimum 8 characters recommended)
   - Multi-factor authentication (optional)
5. Configure sign-up experience:
   - Enable self-registration
   - Required attributes: email
6. Configure message delivery:
   - Email (use Cognito default for testing)
7. Review and create

### 2. Create App Client

1. In your User Pool, go to "App integration" tab
2. Click "Create app client"
3. Configure:
   - App type: Public client
   - App client name: `your-app-name`
   - Authentication flows: 
     - ALLOW_USER_SRP_AUTH
     - ALLOW_REFRESH_TOKEN_AUTH
   - OAuth 2.0 settings:
     - Allowed OAuth flows: Authorization code grant
     - Allowed OAuth scopes: openid, email, profile
     - Callback URLs: `http://localhost:3000/auth/callback`
     - Sign out URLs: `http://localhost:3000/`

### 3. Configure Google Identity Provider

1. **Google Cloud Console Setup:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: Web application
   - Authorized redirect URIs: `https://your-domain.auth.region.amazoncognito.com/oauth2/idpresponse`

2. **Cognito Identity Provider Setup:**
   - In your User Pool, go to "Sign-in experience" tab
   - Click "Add identity provider"
   - Select "Google"
   - Enter your Google Client ID and Client Secret
   - Attribute mapping:
     - email → email
     - given_name → given_name
     - family_name → family_name

### 4. Configure Hosted UI Domain

1. In User Pool → "App integration" tab
2. Click "Actions" → "Create Cognito domain"
3. Enter domain prefix (e.g., `your-app-auth`)
4. Note the full domain: `your-app-auth.auth.region.amazoncognito.com`

## Frontend Configuration

### 1. Install Dependencies

```bash
npm install aws-amplify @aws-amplify/ui-react
```

### 2. Configure AWS Settings

Update `src/aws-exports.ts` with your actual values:

```typescript
import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      region: 'ap-northeast-1', // Your AWS region
      userPoolId: 'ap-northeast-1_XXXXXXXXX', // Your User Pool ID
      userPoolClientId: 'YYYYYYYYYYYYYYYYYYYY', // Your App Client ID
      loginWith: {
        oauth: {
          domain: 'your-app-auth.auth.ap-northeast-1.amazoncognito.com', // Your domain
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://localhost:3000/auth/callback'],
          redirectSignOut: ['http://localhost:3000/'],
          responseType: 'code' as const,
        },
        email: true,
        username: true,
      },
    },
  },
};

Amplify.configure(awsConfig);
export default awsConfig;
```

### 3. Update Google OAuth Configuration

In the `UserContext.tsx`, update the Google sign-in method with your actual values:

```typescript
const signInWithGoogle = useCallback(() => {
  try {
    setError(null);
    const domain = 'your-app-auth.auth.ap-northeast-1.amazoncognito.com'; // Your domain
    const clientId = 'YYYYYYYYYYYYYYYYYYYY'; // Your App Client ID
    const redirectUri = encodeURIComponent('http://localhost:3000/auth/callback');
    
    const hostedUIUrl = `https://${domain}/oauth2/authorize?` +
      `identity_provider=Google&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `scope=openid+email+profile`;
    
    window.location.href = hostedUIUrl;
  } catch (err: any) {
    setError(err.message || 'Google sign in failed');
  }
}, []);
```

## Usage Examples

### 1. Email/Password Authentication

```tsx
import { useUser } from '@/contexts/UserContext';

function MyComponent() {
  const { signUpWithEmail, signInWithEmail, confirmSignUpCode } = useUser();

  // Sign up
  const handleSignUp = async () => {
    try {
      await signUpWithEmail('username', 'password', 'email@example.com');
      // User will receive verification email
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  // Confirm sign up
  const handleConfirm = async () => {
    try {
      await confirmSignUpCode('username', '123456');
      // Account confirmed, user can now sign in
    } catch (error) {
      console.error('Confirmation failed:', error);
    }
  };

  // Sign in
  const handleSignIn = async () => {
    try {
      await signInWithEmail('username', 'password');
      // User signed in successfully
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };
}
```

### 2. Google OAuth Authentication

```tsx
import { useUser } from '@/contexts/UserContext';

function MyComponent() {
  const { signInWithGoogle } = useUser();

  const handleGoogleSignIn = () => {
    signInWithGoogle(); // Redirects to Google OAuth
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  );
}
```

### 3. Authentication State Management

```tsx
import { useUser } from '@/contexts/UserContext';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    logout 
  } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

## Available Components

### Authentication Components

- `<SignIn />` - Email/password and Google OAuth sign in
- `<SignUp />` - Email/password registration
- `<ConfirmSignUp />` - Email verification

### Usage

```tsx
import { SignIn, SignUp, ConfirmSignUp } from '@/components/auth';

function AuthPage() {
  return (
    <div>
      <SignIn />
      {/* or */}
      <SignUp />
      {/* or */}
      <ConfirmSignUp />
    </div>
  );
}
```

## Environment Variables

For production, consider using environment variables:

```env
NEXT_PUBLIC_AWS_REGION=ap-northeast-1
NEXT_PUBLIC_USER_POOL_ID=ap-northeast-1_XXXXXXXXX
NEXT_PUBLIC_USER_POOL_CLIENT_ID=YYYYYYYYYYYYYYYYYYYY
NEXT_PUBLIC_OAUTH_DOMAIN=your-app-auth.auth.ap-northeast-1.amazoncognito.com
```

Then update your `aws-exports.ts`:

```typescript
const awsConfig = {
  Auth: {
    Cognito: {
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
      // ... rest of config
    },
  },
};
```

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure callback URLs match exactly in Cognito App Client settings
   - Check for trailing slashes

2. **"User does not exist"**
   - User needs to confirm email verification first
   - Check if user was created successfully

3. **Google OAuth not working**
   - Verify Google Client ID and Secret in Cognito
   - Check Google Cloud Console OAuth settings
   - Ensure redirect URI is correct

4. **CORS errors**
   - Add your domain to Cognito allowed origins
   - Check Next.js configuration

### Debug Mode

Enable debug logging:

```typescript
import { Amplify } from 'aws-amplify';

Amplify.configure({
  // ... your config
}, {
  ssr: true // if using SSR
});

// Enable debug logging
if (process.env.NODE_ENV === 'development') {
  Amplify.Logger.LOG_LEVEL = 'DEBUG';
}
```

## Security Considerations

1. **Never expose sensitive credentials** in client-side code
2. **Use HTTPS** in production
3. **Implement proper error handling** to avoid information leakage
4. **Regularly rotate** Google OAuth credentials
5. **Monitor** Cognito logs for suspicious activity

## Next Steps

1. Set up your AWS Cognito User Pool and App Client
2. Configure Google Identity Provider
3. Update the configuration files with your actual values
4. Test the authentication flow
5. Deploy to production with proper environment variables

For more information, refer to:
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2) 