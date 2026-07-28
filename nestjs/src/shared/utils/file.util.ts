import type { Readable } from 'node:stream';

export function validateFileFormat(
  filename: string,
  allowedFormats: string[],
): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();

  if (!extension) {
    return false;
  }

  return allowedFormats
    .map((format) => format.toLowerCase())
    .includes(extension);
}

export async function validateFileSize(
  fileStream: Readable,
  maxSize: number,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let totalSize = 0;

    fileStream
      .on('data', (chunk: Buffer | string) => {
        totalSize += Buffer.byteLength(chunk);
      })
      .on('end', () => {
        resolve(totalSize <= maxSize);
      })
      .on('error', (error: Error) => {
        reject(error);
      });
  });
}
