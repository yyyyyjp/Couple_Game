import fs from 'fs';

const files = [
  'index.html',
  'ludo.html',
  'truth-or-dare.html',
  'dice.html',
  'dark-beast.html',
  'slots.html',
  'statistics.html',
  'monopoly.html'
];

let errors = [];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    errors.push('Missing file: ' + f);
    return;
  }
  const content = fs.readFileSync(f, 'utf8');
  
  const srcRegex = /(?:src|href)="([^"]+)"/g;
  let match;
  while ((match = srcRegex.exec(content)) !== null) {
    const ref = match[1];
    if (ref.startsWith('http') || ref.startsWith('#') || ref.startsWith('javascript:') || ref.startsWith('mailto:')) continue;
    const cleanRef = ref.split('?')[0].split('#')[0];
    if (!cleanRef) continue;
    if (!fs.existsSync(cleanRef)) {
      errors.push(`${f} references missing resource: ${ref} (resolved: ${cleanRef})`);
    }
  }
});

if (errors.length > 0) {
  console.error('Validation errors found:\n' + errors.join('\n'));
  process.exit(1);
} else {
  console.log('All 8 root HTML files validated successfully! All referenced local resources and links exist on disk.');
}
