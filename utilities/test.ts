import { existsSync } from 'jsr:@std/fs/exists';
const PATH = './public/shows.json';
Deno.writeTextFileSync(PATH, '');
console.log(existsSync(PATH));
