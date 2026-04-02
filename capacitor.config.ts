import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tatertreasures.whiskeyshop',
  appName: 'Tater Treasures',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
