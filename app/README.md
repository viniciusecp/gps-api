# RastroApp v2

This is a React Native application built with Expo, designed for tracking purposes.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1.  **Clone the repository**

    ```sh
    git clone <repository-url>
    ```

2.  **Install dependencies**

    ```sh
    pnpm install
    ```

3.  **Set up environment variables**

    Create a `.env` file in the project root by copying the example file:

    ```sh
    cp .env.example .env
    ```

    Then, fill in the required values in the new `.env` file. These variables are used for local development with `expo start`.

    > **Important:** For these variables to be available in a production build, they must also be added to `eas.json`. See the "Building the Project with EAS" section for more details.

## Available Scripts

- `pnpm start`: Runs the app in development mode using Expo Go.
- `pnpm android`: Runs the app on a connected Android device or emulator.
- `pnpm ios`: Runs the app on the iOS simulator.
- `pnpm web`: Runs the app in a web browser.
- `pnpm lint`: Lints the codebase using ESLint.

## Building the Project with EAS

We use **EAS (Expo Application Services)** to create production builds of the application. EAS is a cloud service that compiles your app, so you don't need to have a local setup with Android Studio or Xcode.

The build process is configured in the `eas.json` file, which contains different "profiles" for different environments (e.g., `preview`, `production`).

### How `eas.json` Works

The `eas.json` file defines how your app should be built. Here is the configuration for the `preview` profile in this project:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

- `"distribution": "internal"`: This tells EAS to create a build for internal testing. It will generate a shareable link to download the app.
- `"android": { "buildType": "apk" }`: This specifies that the Android build should generate an `.apk` file.
- `"env": { ... }`: **This is crucial.** This object contains all the environment variables that will be included in the final build. If you add a new environment variable to your project, **you must also add it here** for it to be accessible in the compiled app.

### Running a Build

The project includes a script to create a build using the `preview` profile.

```sh
pnpm build:android
```

This command executes `eas build -p android --profile preview`, telling EAS to:

1.  Start a new build (`eas build`).
2.  Target the Android platform (`-p android`).
3.  Use the settings from the `preview` profile (`--profile preview`).

EAS will then bundle your project, upload it, build it in the cloud, and provide a link to the finished `.apk` file.
