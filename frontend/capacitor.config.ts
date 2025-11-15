import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.journalxp.app',
  appName: 'JournalXP',
  webDir: 'dist',

  // Server configuration for development
  server: {
    // LIVE RELOAD SETUP (for iPhone testing from Windows):
    // 1. Get your Windows IP: Run "ipconfig" in terminal
    // 2. Replace YOUR_IP below with your IPv4 address (e.g., 192.168.1.100)
    // 3. Uncomment these lines:
    // url: 'http://YOUR_IP:5173',
    // cleartext: true
    //
    // IMPORTANT:
    // - iPhone must be on SAME WiFi network as Windows PC
    // - Comment out before production builds!
    // - Only needed for live reload during development
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
