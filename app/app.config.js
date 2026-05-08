require("dotenv").config();

module.exports = () => {
  return {
    expo: {
      name: "RastroApp",
      slug: "rastroapp-v2",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      scheme: "rastroappv2",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.viniciusfs.rastroappv2",
      },
      android: {
        adaptiveIcon: {
          backgroundColor: "#E6F4FE",
          foregroundImage: "./assets/images/icon.png",
          backgroundImage: "./assets/images/icon.png",
          monochromeImage: "./assets/images/icon.png",
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        package: "com.viniciusfs.rastroappv2",
        config: {
          googleMaps: {
            apiKey: process.env.GOOGLE_MAPS_API_KEY,
          },
        },
      },
      web: {
        output: "static",
        favicon: "./assets/images/icon.png",
      },
      plugins: [
        "expo-router",
        [
          "expo-splash-screen",
          {
            image: "./assets/images/icon.png",
            imageWidth: 200,
            resizeMode: "contain",
            backgroundColor: "#000000",
            dark: {
              backgroundColor: "#000000",
            },
          },
        ],
        [
          "expo-build-properties",
          {
            android: {
              usesCleartextTraffic: true,
            },
          },
        ],
      ],
      experiments: {
        typedRoutes: true,
        reactCompiler: true,
      },
      extra: {
        router: {},
        eas: {
          projectId: process.env.EAS_PROJECT_ID,
        },
      },
    },
  };
};
