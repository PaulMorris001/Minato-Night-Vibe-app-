const { withDangerousMod, withAndroidManifest } = require("@expo/config-plugins");
const path = require("path");
const fs = require("fs");

/**
 * iOS: Injects `use_modular_headers!` into the Podfile so GoogleUtilities and
 * FirebaseCoreInternal generate module maps — required by @react-native-firebase.
 *
 * Android: Adds tools:replace to resolve the manifest merger conflict between
 * expo-notifications and @react-native-firebase/messaging on default_notification_color.
 */
function withIosFix(config) {
  return withDangerousMod(config, [
    "ios",
    (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      let podfile = fs.readFileSync(podfilePath, "utf8");

      if (!podfile.includes("use_modular_headers!")) {
        podfile = podfile.replace(
          /^(platform :ios.*)$/m,
          "$1\nuse_modular_headers!"
        );
      }

      fs.writeFileSync(podfilePath, podfile);
      return config;
    },
  ]);
}

function withAndroidFix(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    // Ensure tools namespace is declared on the root manifest element
    manifest.manifest.$ = manifest.manifest.$ || {};
    manifest.manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";

    const application = manifest.manifest.application?.[0];
    if (!application) return config;

    application["meta-data"] = application["meta-data"] || [];

    const colorMeta = application["meta-data"].find(
      (m) =>
        m.$?.["android:name"] ===
        "com.google.firebase.messaging.default_notification_color"
    );

    if (colorMeta) {
      colorMeta.$["tools:replace"] = "android:resource";
    }

    return config;
  });
}

module.exports = function withFirebaseFix(config) {
  config = withIosFix(config);
  config = withAndroidFix(config);
  return config;
};