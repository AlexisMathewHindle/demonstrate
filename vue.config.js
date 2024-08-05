const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,

  chainWebpack: (config) => {
    // Adding Markdown file handling
    config.module
      .rule("markdown")
      .test(/\.md$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();
  },
});
