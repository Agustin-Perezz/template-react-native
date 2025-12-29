import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase/config';

WebBrowser.maybeCompleteAuthSession();

const firebaseErrorMessages: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Invalid email or password',
  'auth/too-many-requests': 'Too many attempts. Please try again later',
  'auth/user-disabled': 'This account has been disabled',
  'auth/invalid-email': 'Invalid email address',
};

export async function signInWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    const message =
      firebaseErrorMessages[firebaseError.code ?? ''] ??
      'An error occurred during sign in';
    return { user: null, error: message };
  }
}

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    //iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();

      if (result.type === 'success') {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);
        return { user: userCredential.user, error: null };
      }

      if (result.type === 'cancel') {
        return { user: null, error: null };
      }

      return { user: null, error: 'Google sign in failed' };
    } catch (error) {
      return { user: null, error: 'An error occurred during Google sign in' };
    }
  };

  return {
    request,
    response,
    signInWithGoogle,
    isReady: !!request,
  };
}
