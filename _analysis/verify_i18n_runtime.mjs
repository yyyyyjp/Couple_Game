import fs from 'fs';
import vm from 'vm';

const i18nCode = fs.readFileSync('assets/js/i18n.js', 'utf8');

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

console.log('--- 1. Testing switcher elements in HTML files ---');
files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const hasSelect = html.includes('data-lang-select');
  const hasNav = html.includes('data-lang-nav');
  const hasLangs = ['en', 'cn', 'tw', 'ja', 'ko'].every(l => html.includes(`data-lang="${l}"`));
  if (!hasSelect || !hasNav || !hasLangs) {
    console.error(`FAIL: ${f} missing switcher elements (select: ${hasSelect}, nav: ${hasNav}, langs: ${hasLangs})`);
    process.exit(1);
  }
  console.log(`OK: ${f} has mobile select and desktop nav with all 5 languages`);
});

console.log('\n--- 2. Testing i18n runtime in all 5 languages ---');
const langs = ['cn', 'en', 'tw', 'ja', 'ko'];

langs.forEach(lang => {
  const sandbox = {
    window: {},
    document: {
      readyState: 'complete',
      documentElement: { lang: '' },
      title: '',
      addEventListener: () => {},
      querySelector: (sel) => null,
      querySelectorAll: (sel) => [],
      getElementById: (id) => null
    },
    location: {
      href: `http://localhost/ludo.html?lang=${lang}`,
      pathname: '/ludo.html',
      search: `?lang=${lang}`
    },
    navigator: { language: 'zh-CN' },
    localStorage: {
      getItem: (k) => (k === 'lovegame_lang' ? lang : null),
      setItem: () => {}
    }
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;
  
  vm.createContext(sandbox);
  vm.runInContext(i18nCode, sandbox);

  const M = sandbox.window.MESSAGES;
  if (!M) {
    console.error(`FAIL: MESSAGES not set for lang=${lang}`);
    process.exit(1);
  }
  
  // Verify key game dictionaries
  const ludoOk = M.games && M.games.ludo && M.games.ludo.title && M.games.ludo.events;
  const todOk = M.games && M.games.truthOrDare && M.games.truthOrDare.title;
  const diceOk = M.games && M.games.dice && M.games.dice.title;
  const darkBeastOk = M.games && M.games.darkBeast && M.games.darkBeast.title;
  const slotsOk = M.games && M.games.slots && M.games.slots.title;
  const statOk = M.statistics && M.statistics.title;

  if (!ludoOk || !todOk || !diceOk || !darkBeastOk || !slotsOk || !statOk) {
    console.error(`FAIL: Incomplete dictionary for lang=${lang}`);
    process.exit(1);
  }
  console.log(`OK: lang=${lang} -> Title="${M.games.ludo.title}", TOD="${M.games.truthOrDare.title}", Stat="${M.statistics.title}"`);
});

console.log('\nAll i18n runtime and DOM tests passed successfully!');
