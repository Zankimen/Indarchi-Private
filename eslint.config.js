import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/vendor/**",
      "public/**",
      "storage/**",
      "bootstrap/cache/**"
    ],
  },
  js.configs.recommended,
  {
    files: ["resources/js/**/*.{js,jsx}", "Modules/*/resources/Pages/**/*.{js,jsx}"],
    ignores: ["node_modules", "vendor", "public/build"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      // Explicit globals for browser-based React apps
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        location: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/purity": "warn",
      "no-unused-vars": "warn",
      "no-console": ["error", { allow: ["warn", "error"] }],
      "react/jsx-key": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/vite.config.{js,mjs,cjs,ts}", "vite-module-loader.js"],
    rules: {
      "no-undef": "off"
    }
  },
  prettier,
];
