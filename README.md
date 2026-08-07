# Corrigo — evidence site

A simple site for posting the sources/evidence behind each Corrigo video or post.
Built with Eleventy (static site generator) + Decap CMS (free, git-based login panel).

## What you get

- `/` — list of all posts, filterable by verdict (True, Mostly True, Misleading, False, Unverified)
- `/posts/your-post/` — individual evidence page (claim, verdict, evidence, sources), with fact-check markup (schema.org ClaimReview) so search engines can show it as a fact check
- `/admin` — login-protected panel to add/edit posts, no coding needed
- `/feed.xml` and `/sitemap.xml` — so people and search engines can follow new posts

## 1. Push this to your GitHub

From inside this folder:

```
git init
git add .
git commit -m "Initial Corrigo site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/corrigo-site.git
git push -u origin main
```

(Create the empty `corrigo-site` repo on GitHub first, at github.com/new — don't
initialize it with a README, or the push above will conflict.)

## 2. Deploy to Netlify (free)

1. Go to https://app.netlify.com and sign up/log in with your GitHub account.
2. Click **"Add new site" → "Import an existing project"**.
3. Pick your `corrigo-site` repo. Netlify will auto-detect the build settings
   from `netlify.toml` (build command `npm run build`, publish folder `_site`).
4. Click **Deploy**. In a minute or two your site will be live at a
   `random-name.netlify.app` URL (you can rename this or add your own domain
   later, for free, under Site settings → Domain management).

## 3. Turn on your login (Netlify Identity + Git Gateway)

This is what lets you log into `/admin` and post evidence — no separate
server or password system needed.

1. In your Netlify site dashboard: **Site configuration → Identity → Enable Identity**.
2. Under Identity settings, set **Registration** to "Invite only" (so random
   people can't sign up).
3. Still under Identity: **Services → Git Gateway → Enable Git Gateway**.
4. Go to the **Identity** tab (top nav of your site dashboard) → **Invite users**
   → enter your own email. You'll get an email invite — click it, set a
   password.
5. Now visit `https://your-site.netlify.app/admin` and log in with that
   email/password. You're in.

From then on, every post you publish through `/admin` gets committed straight
to your GitHub repo, and Netlify automatically rebuilds the live site within
about a minute.

## 4. Add a post

Either:
- Log into `/admin` and click **New Post**, or
- Add a markdown file directly to `src/posts/` following the format in
  `src/posts/example-post.md`, then push to GitHub.

## Local preview (optional)

```
npm install
npm start
```

Opens the site at `http://localhost:8080`.
