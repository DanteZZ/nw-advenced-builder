import { promises } from 'fs';

/**
 * Check if NW binaries are cached
 *
 * @param  {string}           nwDir  Path to cached NW binaries
 * @return {Promise<boolean>}        Boolean value to denote if cache exists or not
 */
export const isCached = async (nwDir: string): Promise<boolean> => {
  let exists = true;
  try {
    await promises.access(nwDir, 0);
  } catch (e) {
    exists = false;
  }
  return exists;
};
