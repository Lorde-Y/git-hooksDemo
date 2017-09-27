module.exports = {
  "env": {
    "browser": true
  },
  "rules": {
    "indent": [
        "error",
        2
    ],
    "linebreak-style": [
        "error",
        "unix"
    ],
    "quotes": [
        "error",
        "single"
    ],
    "semi": [
        "error",
        "always"
    ],
    "no-console": [
      "error", { allow: ["warn", "error", "log"] }
    ],
    "no-extend-native": ["error", { "exceptions": ["Array"] }]
  }
};