declare module 'file-icon' {
  type IconPathsToBuffer = (paths: string[]) => Promise<Buffer[]>;
  type IconPathsToBuffer = (path: string) => Promise<Buffer>;

  const fileIconToBuffer: IconPathsToBuffer;
  async function fileIconToFile(file: string | string[]): Promise<void>;

  export { fileIconToBuffer, fileIconToFile };
}

declare module 'get-pixels' {
  type Pixels = {
    shape: [number, number, number];
    data: Uint8Array;
  };
  type Callback = (err: Error, pixels: Pixels) => void;

  type GetPixels = (
    path: string | Buffer,
    format?: string,
    callback?: Callback
  ) => void;

  const getPixels: GetPixels;
  export default getPixels;
}
