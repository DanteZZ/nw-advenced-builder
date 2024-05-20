export type NWPlatform = 'osx' | 'win' | 'linux';
export type NWArch = 'ia32' | 'x64' | 'arm64';

export type NWPackageLinux = 'appimage' | 'deb' | 'aur';
export type NWPackageWin = 'nsis';
export type NWPackageOsx = 'dmg';

export type NWFlavour = 'normal' | 'sdk';

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
    flavour?: NWFlavour;
    platformSettings?: {
      [key in NWPlatform]?: {
        arch?: NWArch[];

        version?: string;
        flavour?: NWFlavour;
        archSettings?: {
          [key in NWArch]?: {
            version?: string;
            flavour?: NWFlavour;
          };
        };
      };
    };
  };
  app: {
    name: string;
    directory: string;
    output?: string;
    cache?: string;
  };
};
