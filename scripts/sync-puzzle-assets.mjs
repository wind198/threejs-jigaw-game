import { cpSync, mkdirSync, rmSync } from 'node:fs';
// Source artwork is canonical; public output is generated before dev/build.
const destination = 'public/assets/puzzle-images';
rmSync(destination, { recursive: true, force: true });
mkdirSync('public/assets', { recursive: true });
cpSync('src/assets/puzzle-images', destination, { recursive: true });
