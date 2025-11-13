import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.journalxp.app',
  appName: 'JournalXP',
  webDir: 'dist',

  // Server configuration for development
  server: {
    // Uncomment for local development with live reload
    // url: 'http://localhost:5173',
    // cleartext: true
  },

  // iOS specific configuration
  ios: {
    contentInset: 'automatic',
    // Limit scrolling to prevent bounce effects on certain pages
    scrollEnabled: true,
  },

  // Android specific configuration
  android: {
    // Enable AndroidX support
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
    // Allow HTTP traffic for local development
    allowMixedContent: false,
  },

  // Keyboard configuration
  plugins: {
    Keyboard: {
      resize: 'native',
      style: 'dark',
      resizeOnFullScreen: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000',
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false,
    },
  },
};

export default config;
