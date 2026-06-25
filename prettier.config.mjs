/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */

const config = {
  plugins: [
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-autocorrect",
  ],

  tabWidth: 2,
  useTabs: false,
  singleQuote: false,
  semi: true,
  trailingComma: "all",
  printWidth: 80,

  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};

export default config;
