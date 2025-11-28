const apiBase = 'https://api.github.com';

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

  const { media } = payload || {};
  if (!media || typeof media !== 'object') {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid media payload' }),
    };
  }

  const {
    GITHUB_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_BRANCH = 'main',
    MEDIA_FILE_PATH = 'src/data/siteMedia.json',
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
    'User-Agent': 'site-media-publisher',
    Accept: 'application/vnd.github+json',
  };

  // 1) Get current siteMedia.json to obtain its sha (needed for update)
  const getUrl = `${apiBase}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${MEDIA_FILE_PATH}?ref=${encodeURIComponent(
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
      body: JSON.stringify({ error: 'Failed to read existing site media file from GitHub', details: text.slice(0, 2000) }),
    };
  }

  // 2) Prepare new content
  const content = JSON.stringify(media, null, 2) + '\n';
  const encoded = Buffer.from(content, 'utf8').toString('base64');

  const body = {
    message: `chore: update siteMedia.json from admin (${new Date().toISOString()})`,
    content: encoded,
    branch: GITHUB_BRANCH,
    sha: sha || undefined,
    committer: { name: GIT_AUTHOR_NAME, email: GIT_AUTHOR_EMAIL },
    author: { name: GIT_AUTHOR_NAME, email: GIT_AUTHOR_EMAIL },
  };

  const putUrl = `${apiBase}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${MEDIA_FILE_PATH}`;
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
      body: JSON.stringify({ error: 'Failed to update siteMedia.json on GitHub', details: text.slice(0, 2000) }),
    };
  }

  const result = await putRes.json();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Site visuals published to GitHub. Netlify will redeploy shortly.',
      commit: {
        sha: result.commit?.sha,
        url: result.commit?.html_url,
      },
    }),
  };
}
