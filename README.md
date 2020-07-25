# reintroducing Script Runner
The reintroducing Script Runner (*rSR* for short) is a tool that extracts the front end build process out of your project so you don't have to worry about managing dependencies and build configuration.

## Prerequisites
* Node and npm installed on your machine.
    * [nvm](https://github.com/nvm-sh/nvm) is highly recommended for managing node/npm versions.
    * Currently supporting node version 12.8.0.

## Setup
Follow the steps below to install and initialize rSR in a new project.

1. Create new project.
    ```bash
    mkdir [project-name]
    cd [project-name]
    npm init
    ```
1. Install rSR.
    ```bash
    npm install @reintroducing/rsr -D
    ```
1. Initialize rSR and follow the prompts to scaffold a new project.
    ```bash
    npx rsr
    ```
1. See the `Additional Setup Configs` section below for additional setup steps not related to rSR.
1. Begin development.
    ```bash
    npm start
    ```

## Additional Setup Configs
As of version `1.0.0` of rSR, different types of configurations have been offloaded from the tool internally and it is required to be maintained by each project manually. This allows for greater flexibility in the management of these configurations and it is a better practice for the tool to not dictate this.

* [Browserslist](https://github.com/spothero/browserslist-config)
* [Prettier](https://github.com/spothero/prettier-config)
* [Babel](https://github.com/spothero/babel-preset)
* [ESLint](https://github.com/spothero/eslint-config)
* [Stylelint](https://github.com/spothero/stylelint-config)

Your project will not function correctly until these are implemented, be it using the above configurations or similar ones that fulfill the requirements for each type of configuration.

## Available Configuration
You can override a handful of configuration options by creating a `rsr.config.js` file at the root of your project. Most options are direct pass throughs of their webpack counterparts as shown below. The module should export a function that returns an object. The following parameters are passed into the function:

* `webpack`: The internal rSR webpack instance.
* `mode`: The environment in which the config will be executed.
* `defaultConfig`: The default configuration for the given mode.
    * While you can use this to override every option in rSR, it is not recommended. This is mostly provided as an escape hatch or if you need to pull existing values from the config and should be used sparingly. **Destructuring this onto the return object and altering it can cause your builds to not function correctly.**

```js
module.exports = ({webpack, mode, defaultConfig}) => {
    const isDev = mode === 'development'; // 'development', 'production'

    return {
        // config options
    };
};
```

You can use the mode passed to set options based on the environment. All options are optional, you can include as little or as many as you'd like.

### analyzer
[Options object](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin) to pass through to the bundle analyzer.

**default:**
```js
{
    analyzerMode: isDev ? 'static' : 'disabled',
    openAnalyzer: false,
}
```

### cssModulesIdentName
Allows changing the [localIdentName](https://github.com/webpack-contrib/css-loader#localidentname) that the selectors in CSS modules receive during output generation.

**default:** `'[name]-[local]'`

### devServerPort
The port to run the dev server on.

**default:** `3000`

### devServerProxy
Adds a [proxy middleware](https://webpack.js.org/configuration/dev-server/#devserverproxy) to the dev server.

### devServerOverrides
Any additional dev server options/overrides that should be passed through.

### optimization
An [optimization](https://webpack.js.org/configuration/optimization/) object to apply. By default, the `minimizer` is already set for production builds (both OptimizeCssAssetsPlugin and TerserPlugin). If you wish to overwrite these you can pass a new one in. Other settings passed here will be applied as is.

### plugins
An array of additional [plugins](https://webpack.js.org/configuration/plugins/#plugins) to apply.

### rules
An array of additional [rules](https://webpack.js.org/configuration/module/#modulerules) to apply.

### sourceMap
The style of [source map](https://webpack.js.org/configuration/devtool/#devtool) to use. Set to false for any mode to disable.

**default:** `isDev ? 'cheap-module-source-map' : 'source-map'`

### useResources
Imports [Sass resources](https://github.com/shakacode/sass-resources-loader) into every Sass module to avoid manual imports in every file where shared variables/mixins/placeholders are used.

**default:** `true`

### resourcesPath
The path or array of paths to the resources file(s) when `useResources` is `true`.

**default:** `'src/common/resources.scss'`

## Custom Production Asset Path
In some cases () you may want to pass a specific path for your static assets to replace the pre-configured `publicPath`. You can do so by setting a special `ASSET_PATH` environment variable before running the build script in your build configuration.

```bash
ASSET_PATH=/ npm run build
```
