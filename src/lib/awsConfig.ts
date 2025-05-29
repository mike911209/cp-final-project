import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_yOpnB2Mwi', // Replace with your User Pool ID
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '', // Replace with your App Client ID
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI || ''],
          redirectSignOut: [process.env.NEXT_PUBLIC_COGNITO_SIGNOUT_URI || ''],
          responseType: 'code' as const,
        },
        email: true,
        username: true,
      },
    },
  },
};
// console.log('awsConfig', awsConfig);

Amplify.configure(awsConfig);

export default awsConfig; 