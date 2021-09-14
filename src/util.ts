import fs from 'fs';
import { parseString } from 'xml2js';

export const checkFileExistence = (filePath: string): boolean => {
  return fs.existsSync(filePath);
}

export const xml2json = async(content: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    parseString(content, function (err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}
