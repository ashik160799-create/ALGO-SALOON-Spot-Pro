import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.algosaloon.spotpro',
  appName: 'ALGO SALOON Spot Pro',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
