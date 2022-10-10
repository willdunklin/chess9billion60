const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
    resolve: {
        fallback: {
            "util": require.resolve("util/"),
        }
    },
    plugins: [new ForkTsCheckerWebpackPlugin()],
};
