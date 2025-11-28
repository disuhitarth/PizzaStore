const apiBase = 'https://api.github.com';

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

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const { categories } = payload || {};
  if (!Array.isArray(categories) || !categories.every(isValidCategory)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid menu payload' }),
    };
  }

  const {
    GITHUB_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_BRANCH = 'main',
    MENU_FILE_PATH = 'src/data/menu.json',
    GIT_AUTHOR_NAME = 'Menu Admin Bot',
    GIT_AUTHOR_EMAIL = 'menu-admin@example.com',
  } = process.env;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Publish function not configured on server' }),
    };
  }

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    'User-Agent': 'menu-admin-publisher',
    Accept: 'application/vnd.github+json',
  };

  // 1) Get current menu.json to obtain its sha (needed for update)
  const getUrl = `${apiBase}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${MENU_FILE_PATH}?ref=${encodeURIComponent(
    GITHUB_BRANCH,
  )}`;

  let sha = null;
  const getRes = await fetch(getUrl, { headers });
  if (getRes.status === 200) {
    const existing = await getRes.json();
    sha = existing.sha;
  } else if (getRes.status !== 404) {
    const text = await getRes.text();
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to read existing menu file from GitHub', details: text.slice(0, 2000) }),
    };
  }

  // 2) Prepare new content
  const content = JSON.stringify(categories, null, 2) + '\n';
  const encoded = Buffer.from(content, 'utf8').toString('base64');

  const body = {
    message: `chore: update menu.json from admin (${new Date().toISOString()})`,
    content: encoded,
    branch: GITHUB_BRANCH,
    sha: sha || undefined,
    committer: { name: GIT_AUTHOR_NAME, email: GIT_AUTHOR_EMAIL },
    author: { name: GIT_AUTHOR_NAME, email: GIT_AUTHOR_EMAIL },
  };

  const putUrl = `${apiBase}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${MENU_FILE_PATH}`;
  const putRes = await fetch(putUrl, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const text = await putRes.text();
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to update menu.json on GitHub', details: text.slice(0, 2000) }),
    };
  }

  const result = await putRes.json();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Menu published to GitHub. Netlify will redeploy shortly.',
      commit: {
        sha: result.commit?.sha,
        url: result.commit?.html_url,
      },
    }),
  };
}
