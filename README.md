# Visitor Log System

A mobile-based Visitor & Equipment Management System developed using **React Native, Expo, and Supabase**. The app digitizes visitor registration, equipment tracking, and report generation.

## Features

- Secure Login System
- Role-Based Access (Admin/User)
- Visitor Check-In & Check-Out
- Auto Generated Visitor ID
- Capture Visitor & ID Card Photos
- Equipment Issue & Return Management
- Search & Filter Records
- Export Reports to CSV and PDF
- Dashboard Analytics
- User Management (Admin)

## Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router
- React Native Paper
- Supabase (PostgreSQL + Storage)
- AsyncStorage

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd visitor-log-system
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the App

Start the development server:

```bash
npx expo start
```

Run on Android:

```bash
npx expo run:android
```

Run on Web:

```bash
npx expo start --web
```

Clear cache:

```bash
npx expo start --clear
```

## Build APK

Configure EAS:

```bash
eas build:configure
```

Build APK:

```bash
eas build -p android --profile preview
```

Build Production App:

```bash
eas build -p android --profile production
```

## Useful Commands

Check project health:

```bash
npx expo doctor
```

Generate native folders:

```bash
npx expo prebuild
```

Clean native build:

```bash
npx expo prebuild --clean
```

Check connected devices:

```bash
adb devices
```

## Supabase Setup

Create the following public storage buckets:

- `visitor-photos`
- `equipment-photos`

## Author

**Krishnav Barman**

