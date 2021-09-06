import fs from 'fs';

export const checkFileExistence = (filePath: string): boolean => {
  return fs.existsSync(filePath);
}
