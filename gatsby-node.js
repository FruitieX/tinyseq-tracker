const devOptions = require('./config.dev.json');

exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.(glsl|txt)$/,
          exclude: /node_modules/,
          use: [
            'raw-loader',
            {
              loader: 'c-preprocessor-loader',
              options: devOptions,
            },
          ],
        },
      ],
    },
  });
};
