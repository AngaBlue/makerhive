const path = require("path");
const CracoAntDesignPlugin = require("craco-antd");
const CracoLessPlugin = require("craco-less");
const CracoWorkboxPlugin = require('craco-workbox');


module.exports = {
    plugins: [
        {
            plugin: CracoWorkboxPlugin
          },
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeThemeLessPath: path.join(__dirname, "./src/variables.less")
            }
        },
        {
            plugin: CracoLessPlugin,
            options: {
                cssLoaderOptions: {
                    modules: { localIdentName: "[local]_[hash:base64:5]" }
                },
                modifyLessRule: function (lessRule, _context) {
                    lessRule.test = /\.(module)\.(less)$/;
                    lessRule.exclude = path.join(__dirname, "node_modules");
                    return lessRule;
                }
            }
        }
    ]
};
