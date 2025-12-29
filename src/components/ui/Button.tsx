import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  type TouchableOpacityProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'outline' | 'google';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<
  ButtonVariant,
  { container: string; text: string; loaderColor: string }
> = {
  primary: {
    container: 'bg-blue-600',
    text: 'text-white font-semibold',
    loaderColor: '#FFFFFF',
  },
  outline: {
    container: 'border-2 border-gray-300 bg-transparent',
    text: 'text-gray-700 font-semibold',
    loaderColor: '#374151',
  },
  google: {
    container: 'border border-gray-300 bg-white',
    text: 'text-gray-700 font-medium',
    loaderColor: '#374151',
  },
};

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`w-full flex-row items-center justify-center rounded-xl px-6 py-4 ${styles.container} ${
        isDisabled ? 'opacity-60' : ''
      } ${className ?? ''}`}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={styles.loaderColor} />
      ) : (
        <View className="flex-row items-center gap-3">
          {variant === 'google' && (
            <Ionicons name="logo-google" size={20} color="#4285F4" />
          )}
          <Text className={`text-base ${styles.text}`}>{children}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
