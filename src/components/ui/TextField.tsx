import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from 'react-native';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  secureTextEntry?: boolean;
}

export function TextField({
  label,
  error,
  secureTextEntry,
  className,
  ...props
}: TextFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry !== undefined;

  return (
    <View className="w-full">
      <Text className="mb-2 text-sm font-medium text-gray-700">{label}</Text>
      <View className="relative">
        <TextInput
          className={`w-full rounded-xl border bg-white px-4 py-3.5 text-base text-gray-900 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${isPassword ? 'pr-12' : ''} ${className ?? ''}`}
          secureTextEntry={isPassword && !isPasswordVisible}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={22}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="mt-1.5 text-sm text-red-500">{error}</Text>}
    </View>
  );
}
