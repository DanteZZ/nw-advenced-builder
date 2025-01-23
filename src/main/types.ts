export type NWPlatform = 'osx' | 'win' | 'linux';
export type NWArch = 'ia32' | 'x64' | 'arm64';

export type NWPackageLinux = 'appimage' | 'deb' | 'aur';
export type NWPackageWin = 'nsis';
export type NWPackageOsx = 'dmg';

export type NWFlavor = 'normal' | 'sdk';

export type NWPropertiesWin = {
  Comments?: string;
  CompanyName?: string;
  FileDescription?: string;
  FileVersion?: string;
  InternalName?: string;
  LegalCopyright?: string;
  LegalTrademarks?: string;
  OriginalFilename?: string;
  PrivateBuild?: string;
  ProductName?: string;
  ProductVersion?: string;
  SpecialBuild?: string;
};

export type NWPropertiesLinux = {
  Type?: string;
  Version?: string;
  Name?: string;
  GenericName?: string;
  NoDisplay?: string;
  Comment?: string;
  Icon?: string;
  Hidden?: string;
  OnlyShowIn?: string;
  NotShowIn?: string;
  DBusActivatable?: string;
  TryExec?: string;
  Exec?: string;
  Path?: string;
  Terminal?: string;
  Actions?: string;
  MimeType?: string;
  Categories?: string;
  Implements?: string;
  Keywords?: string;
  StartupNotify?: string;
  StartupWMClass?: string;
  PrefersNonDefaultGPU?: string;
  SingleMainWindow?: string;
};

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
    output: string;
    cache?: string;
    version?: string;
    icon?: string;
    settings?: {
      win?: {
        name?: string;
        version?: string;
        icon?: string;
        properties?: NWPropertiesWin;
      };
      linux?: {
        name?: string;
        version?: string;
        icon?: string;
        properties: NWPropertiesLinux;
      };
      osx?: {
        name?: string;
        version?: string;
        icon?: string;
      };
    };
  };
};
