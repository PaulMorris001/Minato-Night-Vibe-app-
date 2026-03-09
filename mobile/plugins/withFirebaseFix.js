const { withDangerousMod } = require("@expo/config-plugins");
const path = require("path");
const fs = require("fs");

/**
 * Injects `use_modular_headers!` into the Podfile so that GoogleUtilities and
 * FirebaseCoreInternal generate module maps — required by @react-native-firebase.
 */
module.exports = function withFirebaseFix(config) {
  return withDangerousMod(config, [
    "ios",
    (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      let podfile = fs.readFileSync(podfilePath, "utf8");

      // Add use_modular_headers! right after the platform declaration
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
};