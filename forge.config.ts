import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
import fs from 'fs/promises'

const config: ForgeConfig = {
  packagerConfig: {
    asar: {
			unpack: "**/*.+(node|"+((process.platform == "darwin") ? "dylib" : "dll|exe")+")",
		},
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({}), new MakerZIP({}, ['win32', 'darwin']), new MakerRpm({}), new MakerDeb({})],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
    {
      name: "@timfish/forge-externals-plugin",
      config: {
        "externals": ["@mechakeys/iohook"],
        "includeDeps": true
      }
    }
  ],
  hooks: {
    prePackage: async () => {
      await fs.cp('./iohook', './node_modules/@mechakeys/iohook/builds', { recursive: true })
    }
  }
};

export default config;
