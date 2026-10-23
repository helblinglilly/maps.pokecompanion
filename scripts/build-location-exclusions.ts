import { readFile, writeFile } from 'node:fs/promises';
import { parse, printParseErrorCode, type ParseError } from 'jsonc-parser';

const source = new URL('../config/location-exclusions.jsonc', import.meta.url);
const errors: ParseError[] = [];
const config = parse(await readFile(source, 'utf8'), errors, { allowTrailingComma: true });
if (errors.length) {
  throw new Error(`Invalid location exclusions: ${errors.map(error => `${printParseErrorCode(error.error)} at offset ${error.offset}`).join(', ')}`);
}
if (!Array.isArray(config)) throw new Error('Location exclusions must be an array');
await writeFile(new URL('../app/lib/location-exclusions.json', import.meta.url), `${JSON.stringify(config, null, 2)}\n`);
