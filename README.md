# Attendance Tracker App

A React Native application for tracking attendance, built with React Native CLI.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (LTS)
- npm package manager
- Android Studio (for Android development)

## Local Setup Instructions

### Step 1: Setup React Native CLI Environment

Follow the official React Native environment setup guide for your operating system:

**[React Native - Environment Setup](https://reactnative.dev/docs/environment-setup)**

- Select **"React Native CLI Quickstart"** (not Expo Go)
- Choose your **Development OS** (Windows/macOS/Linux)
- Choose your **Target OS** (Android/iOS)
- Complete all installation steps including Java, Android Studio, and SDK setup

### Step 2: Verify Your Development Environment

Before proceeding, verify that your environment is configured correctly:

#### For Android Development:

1. **Check ADB Connection:**
   ```bash
   adb devices
   ```
   This should list your connected Android device or emulator.

2. **Verify Android SDK Installation:**
   - Open Android Studio
   - Go to **Settings/Preferences** → **Appearance & Behavior** → **System Settings** → **Android SDK**
   - Ensure you have Android SDK Platform 33 (or newer) installed
   - Verify **Android SDK Build-Tools** and **Android Emulator** are installed

3. **Check NDK Version:**
   - In Android Studio, navigate to **SDK Manager** → **SDK Tools** tab
   - Ensure **NDK (Side by side)** is installed
   - Verify NDK version matches: **27.1.12297006**
   - You can also check in your project's `android/app/build.gradle` file

4. **Configure Environment Variables:**
   - Ensure `ANDROID_HOME` is set correctly
   - Verify `PATH` includes Android SDK platform-tools and tools

#### For iOS Development (macOS only):

1. **Check Xcode Installation:**
   ```bash
   xcode-select --print-path
   ```

2. **Install CocoaPods:**
   ```bash
   sudo gem install cocoapods
   ```

### Step 3: Clone and Navigate to Project

```bash
git clone <your-repository-url>
cd attendance-tracker-app
```

### Step 4: Install Dependencies

Install all required npm packages using the legacy peer dependencies flag to avoid conflicts:

```bash
npm install --legacy-peer-deps
```

> **Note:** The `--legacy-peer-deps` flag is used to handle peer dependency conflicts that may arise with certain packages.

### Step 5: Install iOS Dependencies (macOS only)

If you're developing for iOS, install the CocoaPods dependencies:

```bash
cd ios
pod install
cd ..
```

### Step 6: Start Metro Bundler

Metro is the JavaScript bundler for React Native. Start it in a dedicated terminal:

```bash
npm start
```

Keep this terminal window open and running.

### Step 7: Run the Application

Open a **new terminal** window in the project root directory and run:

#### For Android:

```bash
npm run android
```

Or using Yarn:
```bash
yarn android
```

#### For iOS (macOS only):

```bash
npm run ios
```

Or using Yarn:
```bash
yarn ios
```

The app should now launch on your Android emulator/device or iOS simulator.

## Common Troubleshooting

### Android Issues:

- **"SDK location not found"**: Ensure `ANDROID_HOME` environment variable is set correctly
- **"Unable to connect to ADB"**: Restart ADB with `adb kill-server` then `adb start-server`
- **Build failures**: Try cleaning the build with `cd android && ./gradlew clean && cd ..`

### Metro Bundler Issues:

- **Port already in use**: Kill the process using port 8081 or run `npm start -- --port=8082`
- **Cache issues**: Clear Metro cache with `npm start -- --reset-cache`

### General Issues:

- **Dependency conflicts**: Delete `node_modules` and `package-lock.json`, then run `npm install --legacy-peer-deps` again
- **iOS build issues**: Delete `ios/Pods` and `ios/Podfile.lock`, then run `pod install` again

## Development Workflow

1. Make changes to your code in your preferred editor
2. **For Android**: Press `R` twice or `Cmd/Ctrl + M` → "Reload" to see changes
3. **For iOS**: Press `Cmd + R` in the simulator to reload
4. Enable **Fast Refresh** for automatic reloading (usually enabled by default)

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting)
- [Android Developer Documentation](https://developer.android.com/)
- [iOS Developer Documentation](https://developer.apple.com/documentation/)

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

[Your License Here]

---

**Happy Coding! 🚀**
