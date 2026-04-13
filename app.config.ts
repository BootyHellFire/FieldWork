import type { ExpoConfig } from "expo/config";

export default (): ExpoConfig => ({
  name: "FieldWork",
  slug: "fieldwork",
  scheme: "fieldwork",
  version: "0.1.0",
  platforms: ["ios", "android"],
  orientation: "portrait",
  userInterfaceStyle: "light",
  splash: {
    resizeMode: "contain",
    backgroundColor: "#F4F1EA",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.fieldwork.mobile",
    infoPlist: {
      NSCameraUsageDescription:
        "FieldWork keeps the camera open during walkthroughs so foremen can capture reference snapshots.",
      NSMicrophoneUsageDescription:
        "FieldWork records walkthrough audio to turn spoken notes into assigned electrical tasks.",
      NSPhotoLibraryAddUsageDescription:
        "FieldWork saves completion photos and plan uploads for electrical jobs.",
    },
  },
  android: {
    package: "com.fieldwork.mobile",
    permissions: ["CAMERA", "RECORD_AUDIO"],
  },
  plugins: ["expo-router", "expo-camera", "expo-sqlite", "expo-asset"],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    demoMode: process.env.EXPO_PUBLIC_DEMO_MODE !== "false",
  },
});
