import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { signInSchema, type SignInFormData } from '../lib/validations/auth';
import { signInWithEmail, useGoogleAuth } from '../services/auth';

export default function SignIn() {
  const router = useRouter();
  const [form, setForm] = useState<SignInFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<SignInFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { signInWithGoogle, response, isReady } = useGoogleAuth();

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse();
    }
  }, [response]);

  const handleGoogleResponse = async () => {
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    setIsGoogleLoading(false);

    if (result.error) {
      Alert.alert('Error', result.error);
    } else if (result.user) {
      router.replace('/(tabs)');
    }
  };

  const validateForm = (): boolean => {
    const result = signInSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<SignInFormData> = {};
      result.error.issues.forEach(err => {
        const field = err.path[0] as keyof SignInFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await signInWithEmail(form.email, form.password);
    setIsLoading(false);

    if (result.error) {
      Alert.alert('Error', result.error);
    } else if (result.user) {
      router.replace('/(tabs)');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signInWithGoogle();
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          <View className="mb-10">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
              <View className="h-8 w-8 rounded-lg bg-white" />
            </View>
          </View>

          <View className="gap-4">
            <TextField
              label="Email"
              placeholder="Enter your email"
              value={form.email}
              onChangeText={text => setForm({ ...form, email: text })}
              error={errors.email}
              keyboardType="email-address"
              autoComplete="email"
            />

            <TextField
              label="Password"
              placeholder="Enter your password"
              value={form.password}
              onChangeText={text => setForm({ ...form, password: text })}
              error={errors.password}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <View className="mt-8 gap-3">
            <Button onPress={handleSignIn} loading={isLoading}>
              Sign In
            </Button>

            <View className="flex-row items-center gap-4 py-2">
              <View className="h-px flex-1 bg-gray-300" />
              <View className="h-px flex-1 bg-gray-300" />
            </View>

            <Button
              variant="google"
              onPress={handleGoogleSignIn}
              loading={isGoogleLoading}
              disabled={!isReady}
            >
              Continue with Google
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
