import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const menuPath = resolve(process.cwd(), 'src/data/menu.json');

function isValidMenuItem(item) {
  if (!item || typeof item !== 'object') return false;
  if (typeof item.itemId !== 'string' || typeof item.itemName !== 'string') return false;
  if ('price' in item && typeof item.price !== 'number') return false;
  if ('startingPrice' in item && typeof item.startingPrice !== 'number') return false;
  if ('sizes' in item) {
    if (!Array.isArray(item.sizes)) return false;
    for (const size of item.sizes) {
      if (!size || typeof size !== 'object') return false;
      if (typeof size.sizeDescription !== 'string' || typeof size.price !== 'number') return false;
    }
  }
  return true;
}

function isValidCategory(cat) {
  if (!cat || typeof cat !== 'object') return false;
  if (typeof cat.categoryId !== 'string' || typeof cat.categoryName !== 'string') return false;
  if (!Array.isArray(cat.items)) return false;
  return cat.items.every(isValidMenuItem);
}

async function main() {
  try {
    const raw = await readFile(menuPath, 'utf8');
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      console.error('Menu JSON must be an array of categories.');
      process.exit(1);
    }

    if (!data.every(isValidCategory)) {
      console.error('Menu JSON has invalid category or item structure.');
      process.exit(1);
    }

    console.log(`Menu JSON at ${menuPath} is valid (categories: ${data.length}).`);
  } catch (err) {
    console.error('Failed to validate menu JSON:', err.message ?? err);
    process.exit(1);
  }
}

main();
