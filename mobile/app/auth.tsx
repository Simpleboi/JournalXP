import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement Firebase auth
      Alert.alert('Success', `${isSignUp ? 'Sign up' : 'Sign in'} functionality coming soon!`);
      // After successful auth:
      // router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Text>
        </Pressable>

        <Pressable
          style={styles.toggleButton}
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={styles.toggleText}>
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    padding: 24,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleText: {
    color: '#6366f1',
    fontSize: 14,
  },
});
