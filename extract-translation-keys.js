const fs = require('fs');
const path = require('path');

const projectDir = path.join(process.cwd(), 'src');
const regex = /translateMe\(\s*['"`]{1}([^'"`]+)['"`]{1}\s*\)/g;
const exts = ['.js', '.vue'];

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    if (file === 'AppManagerGroupPlan') return; // Exclude this file or directory
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory() && !file.startsWith('.')) {
      results = results.concat(walk(fullPath));
    } else if (exts.includes(path.extname(fullPath))) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk(projectDir);
const keys = new Set();

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
});

console.log(JSON.stringify(Array.from(keys).sort(), null, 2)); 
console.log(`\nTotal unique keys: ${keys.size}`); 