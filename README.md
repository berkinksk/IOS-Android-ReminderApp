# IOS-Android-ReminderApp

A cross-platform Reminder application built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/). This repository contains code for both iOS and Android platforms, enabling users to create and manage reminders with flexible scheduling options.

---

## Table of Contents

1. [Features](#features)
2. [Screenshots](#screenshots)
3. [Requirements](#requirements)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Project Structure](#project-structure)
7. [Contributing](#contributing)
8. [License](#license)

---

## Features

- **Cross-Platform Compatibility**: Supports iOS and Android using Expo.
- **Flexible Scheduling**: Allows one-time reminders or recurring schedules (daily, weekly, or custom day/time).
- **Local Notifications**: Schedules and delivers notifications at specified times.
- **Simple Home Screen**: Provides a brief overview of the application and user guidance.
- **TypeScript Support**: Utilizes TypeScript for improved maintainability and type safety.

---

## Screenshots

Below are the screenshots demonstrating the main features and pages of the application.

1. **Home Screen**  
   The Home Screen provides a short description of the application and guidance on how to use it.
   
   <img src="screenshots/home_screen.jpeg" alt="Home Screen" style="width:645px; height:1245px;">  
   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Figure 1: The Home Screen showing an overview and user guide.*

2. **Reminders List Screen**
   This screen displays the current list of reminders and a “+” button to add new ones.
   
   <img src="screenshots/reminders_list.jpeg" alt="Reminders List Screen" style="width:645px; height:1244px;">  
   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Figure 2: The Reminders List, where users can view and manage existing reminders.*

3. **New Reminder Screen**
   This screen allows users to create a new reminder with a title, description, date/time, 
   frequency, and an optional image.
   
   <img src="screenshots/new_reminder.jpeg" alt="New Reminder Screen" style="width:645px; height:1231px;">  
   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Figure 3: The screen for creating a new reminder.*

4. **Edit Reminder Screen**
   This screen enables users to modify an existing reminder.
   <img src="screenshots/edit_reminder.jpeg" alt="Edit Reminder Screen" style="width:645px; height:1208px;">
   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Figure 4: Editing an existing reminder.*

---

## Requirements

- **Node.js** (version 14 or higher recommended)
- **npm** or **yarn** (latest version)
- **Expo CLI** (optional but recommended for local development)
- A device or emulator running iOS or Android

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YourUsername/IOS-Android-ReminderApp.git
   cd IOS-Android-ReminderApp
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
   
3. **Start the Application**:
   ```bash
   npx expo start
   ```
   This command will open the Expo Dev Tools in your browser.
   
4. **Run on Device or Simulator**:
* Use the Expo Go app on iOS/Android to scan the QR code (ensure devices are on the same network).
* Press "**a**" in the terminal to run on Android emulator, or i for iOS simulator (macOS only).

---

## Usage

1. **Home Screen**:
* Provides a brief application overview and user guide boxes.

2. **Reminders Tab**:
* Displays current reminders list.
* Tap the "+" icon to create new reminders with title, description, date/time, and frequency settings (one-time, daily, weekly, or custom).

3. **Editing Reminders**:
* Tap any existing reminder to modify or delete it.

4. **Local Notifications**:
* Notifications will trigger at scheduled times.
* Ensure notification permissions are enabled in device settings.

---

## Project Structure

   ```bash
   IOS-Android-ReminderApp/
   ├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Defines tab layout
│   │   ├── index.tsx       # Home tab
│   │   ├── reminders/
│   │   │   ├── index.tsx       # Reminders list screen
│   │   │   ├── new.tsx         # Create new reminder
│   │   │   ├── edit.tsx        # Edit existing reminder
│   │   │   ├── _layout.tsx     # Defines reminders layout
├── +not-found.tsx      # 404-like screen
├── src/
│   ├── components/         # Shared UI components
│   ├── services/           # NotificationService, etc.
│   └── ...
├── package.json
├── .gitignore
├── README.md
├── ...
  ```
   

- **app/**: Organized using Expo Router for routing (Home tab, Reminders tab, etc.)
  - `(tabs)/`: Contains tab navigation layout
  - `reminders/`: Handles reminder-related screens and their layout
  - `+not-found.tsx`: 404-style error page
- **src/**: Contains reusable components and services.

---

## Contributing

1. **Fork** this repository and **clone** the fork to your local environment.
2. Create a new branch for your feature/bug fix.
3. Make changes, commit, and push to your branch.
4. Submit a pull request to the main repository, detailing your changes.

---

## License

This project is licensed under the **MIT** License. You may use, modify, and distribute this software as long as the license terms are observed.