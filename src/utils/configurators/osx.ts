import { platform } from 'process';
import fse from 'fs-extra';
import { promises as fsa } from 'fs';

import path from 'path';

import plist from 'plist';
import { log } from '../../main/log.js';

const setOsxConfig = async (c: {
  name: string;
  version: string;
  icon?: string;
  outDir: string;
}): Promise<void> => {
  if (platform === 'win32') {
    log.warn(
      'MacOS apps built on Windows platform do not preserve all file permissions. See #716'
    );
  }
  try {
    const outApp = path.resolve(c.outDir, `${c.name}.app`);
    await fse.move(path.resolve(c.outDir, 'nwjs.app'), outApp);

    const iconPath = path.resolve(outApp, 'Contents/Resources/app.icns');
    const iconDocumentPath = path.resolve(
      outApp,
      'Contents/Resources/document.icns'
    );

    if (c.icon) {
      await fse.remove(iconPath);
      await fse.remove(iconDocumentPath);
      await fse.copy(c.icon, iconPath);
      await fse.copy(c.icon, iconDocumentPath);
    }

    // Rename CFBundleDisplayName in Contents/Info.plist
    const contentsInfoPlistPath = path.resolve(outApp, 'Contents/Info.plist');
    const contentsInfoPlistJson = plist.parse(
      await fsa.readFile(contentsInfoPlistPath, 'utf-8')
    );

    //@ts-ignore Old architecture in plist types
    contentsInfoPlistJson.CFBundleDisplayName = c.name;
    const contentsInfoPlist = plist.build(contentsInfoPlistJson);
    await fsa.writeFile(contentsInfoPlistPath, contentsInfoPlist);

    // Rename CFBundleDisplayName in Contents/Resources/en.lproj/InfoPlist.strings
    const contentsInfoPlistStringsPath = path.resolve(
      outApp,
      'Contents/Resources/en.lproj/InfoPlist.strings'
    );
    const contentsInfoPlistStrings = await fsa.readFile(
      contentsInfoPlistStringsPath,
      'utf-8'
    );
    const newPlistStrings = contentsInfoPlistStrings.replace(
      /CFBundleGetInfoString = "nwjs /,
      `CFBundleGetInfoString = "${c.name} `
    );
    await fsa.writeFile(contentsInfoPlistStringsPath, newPlistStrings);

    // Add product_string property to package.json
    // const packageJsonPath = path.resolve(outApp, "Contents/Resources/app.nw/package.json");
    // pkg.product_string = pkg.name;
    // await fs.writeFile(packageJsonPath, JSON.stringify(pkg, null, 4));
  } catch (error) {
    log.error(error);
  }
};

export { setOsxConfig };
