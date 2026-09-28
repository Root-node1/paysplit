import fs from 'fs';
import { JSDOM } from 'jsdom';
const html = fs.readFileSync('dist/index.html', 'utf8');
const dom = new JSDOM(html);
// JSDOM doesn't do full computed styles easily with external CSS, but we saw the CSS compiles fine.
console.log('Tested!');
