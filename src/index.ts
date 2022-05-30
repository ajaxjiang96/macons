import { fileIconToBuffer } from 'file-icon';
import fs from 'fs';
import getPixels from 'get-pixels';
import { filter, forEach, map } from 'lodash';
import terminalImage from 'terminal-image';


// const buffers = await fileIconToBuffer(apps);

const printBuffer = async (buffer: Buffer) => {
  console.log(await terminalImage.buffer(buffer, { width: 32 }));
};

const printBuffers = async (buffers: Buffer[]) => {
  await Promise.all(map(buffers, printBuffer));
};

const processIcon = async (icon: Buffer): Promise<number> => {
  return new Promise<number>((resolve, reject) => {
    getPixels(icon, 'image/png', (err, pixels) => {
      if (err) {
        reject(err);
      }
      const [w, h, size] = pixels.shape.slice();

      const totalPixels = w * h;

      if (size !== 4) {
        console.log('Not RGBA');
        return;
      }

      let totalNoneAlphas = 0;

      for (let i = 0; i < w * h * size; i += size) {
        // const r = pixels.data[i];
        // const g = pixels.data[i + 1];
        // const b = pixels.data[i + 2];
        const a = pixels.data[i + 3];
        if (a === 255) {
          totalNoneAlphas += 1;
        }
        // console.log(`${r}, ${g}, ${b}, ${a}`);
      }
      resolve(totalNoneAlphas / totalPixels);
    });
  });
};

const main = async () => {
  const files = fs.readdirSync('/Applications');

  const isApp = (file: string): boolean => /\.app$/g.test(file);

  const apps = map(filter(files, isApp), (n) => `/Applications/${n}`);

  console.log(apps);
  const buffers = await fileIconToBuffer(apps);
  // printBuffers(buffers);
  // console.log(await processIcon(buffers[0]));
  // await printBuffer(buffers[0]);
  const processed = await Promise.all(
    map(buffers, async (buffer, i) => {
      const ratio = await processIcon(buffer);
      return {
        ratio,
        buffer,
        app: apps[i],
      };
    })
  );

  const underSized = filter(processed, (p) => p.ratio < 0.59);
  const overSized = filter(processed, (p) => p.ratio > 0.63);

  console.log('Undersized Icons: \n');
  forEach(underSized, (p) => {
    console.log(`${p.app}: ${p.ratio}`);
  });
  console.log('\n======\n');

  console.log('Oversized Icons: \n');
  forEach(overSized, (p) => {
    console.log(`${p.app}: ${p.ratio}`);
  });
};

main();
