import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn() {
  return (
    <SafeAreaView edges={['top']} className="flex-1">
      <Text>Sign In test</Text>
    </SafeAreaView>
  );
}
