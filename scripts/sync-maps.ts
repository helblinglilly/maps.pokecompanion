import { mkdir, readdir, copyFile, unlink } from 'node:fs/promises';
const source = new URL('../assets/', import.meta.url);
const target = new URL('../public/maps/', import.meta.url);
await mkdir(target, { recursive: true });
const sourceFiles = await readdir(source);
for (const file of await readdir(target)) {
  if (file.endsWith('.svg') && !sourceFiles.includes(file)) {
    await unlink(new URL(file, target));
  }
}
for (const file of sourceFiles) {
  if (file.endsWith('.svg')) await copyFile(new URL(file, source), new URL(file, target));
}
