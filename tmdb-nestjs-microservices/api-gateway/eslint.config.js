module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
    ecmaVersion: "latest",
  },
  plugins: ["@typescript-eslint", "prettier", "import"],
  extends: [
    "standard",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "import/no-unused-modules": "warn",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/switch-exhaustiveness-check": "warn",
    "no-dupe-else-if": "warn",
    "no-unsafe-finally": "off",
    "@typescript-eslint/no-explicit-any": "off", // "warn"
    "max-params": "off", // ["warn", 4] This rule has been disabled because it's too strict for NestJS injections
    "no-useless-constructor": "off", // "warn" This rule has been disabled because it's too strict for NestJS injections
    "symbol-description": "off", // "warn" This rule has been disabled because it's too strict for NestJS injections
    "valid-typeof": "off", // "warn" This rule has been disabled because it's too strict for NestJS injections
  },
  settings: {
    "import/resolver": {
      typescript: true,
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
  },
};
