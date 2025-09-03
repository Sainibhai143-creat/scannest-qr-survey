import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6e3b3a6eca0a40c58bb6384525448716',
  appName: 'scannest-qr-survey',
  webDir: 'dist',
  server: {
    url: 'https://6e3b3a6e-ca0a-40c5-8bb6-384525448716.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff'
    }
  }
};

export default config;