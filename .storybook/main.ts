module.exports = {
  stories: ['../src/**/*.stories.(tsx|mdx)'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links', '@storybook/addon-docs'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
          },
        },
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    });

    config.resolve.extensions.push('.ts', '.tsx');

    return config;
  },
};

// TODO: add to jest config when we integrate storyshots
// "transform": {
//   "^.+\\.[tj]sx?$": "babel-jest",
//   "^.+\\.mdx$": "@storybook/addon-docs/jest-transform-mdx"
// }
