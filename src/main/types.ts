export type NWPlatform = 'osx' | 'win' | 'linux';
export type NWArch = 'ia32' | 'x64' | 'arm64';

export type NWPackageLinux = 'appimage' | 'deb' | 'aur';
export type NWPackageWin = 'nsis';
export type NWPackageOsx = 'dmg';

export type NWFlavor = 'normal' | 'sdk';

export type NWABConfig = {
  nwjs?: {
    version?: string;
    platforms?: NWPlatform[];
    arch?: NWArch[];
    packages?: {
      win?: NWPackageWin[];
      linux?: NWPackageLinux[];
      osx?: NWPackageOsx[];
    };
    flavor?: NWFlavor;
    platformSettings?: {
      [key in NWPlatform]?: {
        arch?: NWArch[];

        version?: string;
        flavor?: NWFlavor;
        archSettings?: {
          [key in NWArch]?: {
            version?: string;
            flavor?: NWFlavor;
          };
        };
      };
    };
    buildsRepoUrl?: string;
    manifestRepoUrl?: string;
  };
  app: {
    name: string;
    directory: string;
    output?: string;
    cache?: string;
  };
};
