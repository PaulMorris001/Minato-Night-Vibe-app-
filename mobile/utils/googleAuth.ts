import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';

// Required for web browser authentication
WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';

// Google OAuth discovery endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

// Configure Google Sign-In - no-op for Expo AuthSession
export const configureGoogleSignIn = () => {
  // Configuration is handled automatically by Expo AuthSession
};

// Sign in with Google using Expo AuthSession with proxy
export const signInWithGoogle = async () => {
  try {
    // Manually construct the Expo proxy redirect URI
    // Format: https://auth.expo.io/@owner/slug
    const redirectUri = 'https://auth.expo.io/@setemiloye1/nightvibe';

    console.log('Redirect URI:', redirectUri); // Log for debugging

    // Generate a nonce for security (required by Google for id_token flow)
    const nonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString()
    );

    // Create the authorization request
    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
      usePKCE: false, // ID token flow doesn't use PKCE
      extraParams: {
        nonce, // Required for id_token response type
      },
    });

    // Prompt the user to authenticate
    const result = await request.promptAsync(discovery);

    if (result.type === 'success') {
      const { params } = result;
      const idToken = params.id_token;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      return {
        type: 'success',
        data: {
          idToken,
        },
      };
    } else if (result.type === 'cancel') {
      throw new Error('User cancelled Google sign-in');
    } else {
      throw new Error('Google sign-in failed');
    }
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

// Get current user - not applicable for web-based auth
export const getCurrentGoogleUser = async () => {
  return null;
};

// Sign out from Google - handled by app logout
export const signOutFromGoogle = async () => {
  // No-op for web-based auth
};
