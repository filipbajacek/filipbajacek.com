# 2027 wall calendar viewer: UI refinements, Slovak version and deployment

Prepared on 12 October 2026. Implementation and testing were local only. Nothing was pushed to GitHub, and no production server was contacted or modified.

## Implementation

The existing 3D viewer is retained and now used by both `templates/EN/calendar27.html` and `templates/SK/calendar27.html`. The Slovak template was inspected separately: its descriptions, heading images, header/navigation, language URL references, price, purchase link, specifications, tax text, year links and existing footer include remain intact. The same is true of the English page. Existing English text outside the Slovak viewer was intentionally preserved.

The UI refinement changes are:

- Replace below-scene Previous/Next text buttons with HTML overlay **❮ / ❯** arrows, using the old slider's circular 44px, translucent dark, gold-border/gold-arrow style. On desktop they sit on the wall at the sides, vertically centered. They stay fixed when the camera moves.
- Place only the viewer outside the centered `content-wrapper`. Above 750px, its width is 100% of the body content viewport, with square full-bleed edges. This avoids the horizontal scrollbar risk of `100vw`. The existing 1200px product wrapper and unrelated layout styles are unchanged.
- Desktop height is now `clamp(480px, 80vh, 860px)`, with extra camera framing above the calendar so the hanging pin remains in view during pointer tilt. Mobile sizing is retained.
- On mobile, add 72px of wall space below the original-size scene for the arrows, centered with a 30px gap. The 3D scene keeps its original height and camera fitting formula; the calendar is not shrunk to make room for buttons. ResizeObserver tracks the inner scene viewport so the renderer/camera respond correctly across the breakpoint.
- Remove the visible instruction text and full-size link, plus their unused selectors and link-updating code. Keyboard arrows and touch swipes remain. Full-resolution access is still available with Enter on the focused scene or a desktop double-click on the calendar area; this adds no visible instructional UI. Screen-reader labels explain the keyboard shortcuts.
- Add `data-language="en"` / `data-language="sk"` and localized page names, image descriptions, button labels, loading/turning/error messages and screen-reader labels. Both templates reference the **same JavaScript, CSS, 13 textures and Three.js modules**.
- Add 13 clickable page dots below the calendar. The current page is gold and marked with `aria-current="page"`; each dot has a localized accessible name and selects its page with one forward/reverse turn. Dot controls use 24px touch targets and wrap neatly on narrow screens.
- Arrow/keyboard/swipe navigation loops: next from December turns to the cover; previous from the cover returns to December. Animation direction follows the chosen arrow even across the boundary. Arrows and dots lock only during loading/turning, and neighbor preloading now includes wraparound pages.
- Limit mouse perspective to ray hits on the actual printed calendar sheet. The surrounding wall, arrows and dots do not drive tilt. Leaving the sheet returns toward the frontal view; starting navigation centers it immediately. Existing +/-6 and +/-3 degree limits and damping are retained.
- Exclude overlay buttons from touch gesture capture, so tapping an arrow is not intercepted as a swipe.

The original scene construction, neutral wall, soft lighting, paper materials, **white metallic binding**, hanging wire, camera damping/angle limits, deformation curve and 1,050ms forward/reverse animation are unchanged. The reusable sheet meshes, navigation locking, reduced motion, bounded texture cache, demand rendering and 2D fallback are retained. Navigation now cycles at the ends as requested. No textures or vendor files were modified. No backend/model/settings/URL changes were needed; both calendar routes already existed.

## Refinement scope

This update modifies exactly **five existing project source/documentation files**, adds **no source or production files**, and deletes **no files**. Screenshots and audit artifacts are outside the Django project. Files added by the original viewer implementation remain required; their complete inventory is retained below for first-time deployment.

## Exact file inventory

All paths below are relative to the Django project root, locally:
`/Users/filipbajacek/Documents/ChatGPT/Kalendar/filipbajacek.com-main-2`.

### Modified existing files in this refinement

| Path | Exact change and reason | Functionality affected |
| --- | --- | --- |
| `templates/EN/calendar27.html` | Move only the viewer before the capped product wrapper; add inner scene and circular overlay arrows; remove visible instruction/link elements; set English language configuration and add the page-dot container. | English 2027 calendar preview only. |
| `templates/SK/calendar27.html` | Replace only the old slider HTML/CSS/JS with the same viewer layout and static references, using Slovak labels and the page-dot container. Keep all existing localized page sections/links unchanged. | Slovak 2027 calendar preview only. |
| `static/calendar2027/css/viewer.css` | Restore circular slider arrow styling; desktop viewport-wide viewer; mobile arrow row inside the wall; accessible dot sizing/active state and compact label spacing; remove unused helper/control styles. All selectors remain scoped. | Shared EN/SK viewer layout only. |
| `static/calendar2027/js/viewer.js` | Localized UI strings, scene hosting/sizing, dot selection, cyclic navigation and neighbor preloading, calendar-only hover detection, navigation centering, safe overlay touch behavior and hidden full-size interaction. Paper deformation/scene construction remain intact; turn direction is supplied explicitly for wrapping. | Shared EN/SK UI integration only. |
| `CALENDAR_3D_DEPLOYMENT.md` | Update file inventory, language/UI behavior, checks, Git commands, server rollout and rollback requirements. | Documentation only. |

### New files

**None in this refinement.** The table below inventories the files created for the original viewer, rather than newly added by this update. The CSS, JavaScript and this report are now modified as listed above; the other original files remain unchanged. If the initial viewer is already committed/deployed, do not re-upload or regenerate textures or vendor libraries. For a first-time deployment, commit the original files as well. No build output generation is needed during deployment.

| Path | Purpose | Needed in production? |
| --- | --- | --- |
| `static/calendar2027/css/viewer.css` | Scoped viewer styling, controls and responsive sizing. | Yes |
| `static/calendar2027/js/viewer.js` | 3D scene, animation, texture management, interaction, accessibility and 2D fallback. | Yes |
| `static/calendar2027/vendor/three.module.min.js` | Pinned Three.js 0.180.0 WebGL module. | Yes |
| `static/calendar2027/vendor/three.core.min.js` | Relative module dependency of Three.js. | Yes; keep beside the module file |
| `static/calendar2027/vendor/LICENSE.txt` | Upstream MIT license. | Distribute with vendor files |
| `static/calendar2027/textures/calendar2027_cover.webp` | PDF page 1: cover. | Yes |
| `static/calendar2027/textures/calendar2027_01.webp` | PDF page 2: January. | Yes |
| `static/calendar2027/textures/calendar2027_02.webp` | PDF page 3: February. | Yes |
| `static/calendar2027/textures/calendar2027_03.webp` | PDF page 4: March. | Yes |
| `static/calendar2027/textures/calendar2027_04.webp` | PDF page 5: April. | Yes |
| `static/calendar2027/textures/calendar2027_05.webp` | PDF page 6: May. | Yes |
| `static/calendar2027/textures/calendar2027_06.webp` | PDF page 7: June. | Yes |
| `static/calendar2027/textures/calendar2027_07.webp` | PDF page 8: July. | Yes |
| `static/calendar2027/textures/calendar2027_08.webp` | PDF page 9: August. | Yes |
| `static/calendar2027/textures/calendar2027_09.webp` | PDF page 10: September. | Yes |
| `static/calendar2027/textures/calendar2027_10.webp` | PDF page 11: October. | Yes |
| `static/calendar2027/textures/calendar2027_11.webp` | PDF page 12: November. | Yes |
| `static/calendar2027/textures/calendar2027_12.webp` | PDF page 13: December. | Yes |
| `tools/calendar2027/render_textures.py` | Optional reproducible PDF-to-WebP conversion utility. | No; useful development source |
| `CALENDAR_3D_DEPLOYMENT.md` | This change report, deployment guide and rollback instructions. | No runtime role; commit for reference |

### Removed files

None. Old slider code was removed from the Slovak template; obsolete visible instruction/link markup and styling were removed from the viewer. No file was deleted. The PDF and all 13 derived textures were untouched.

### Local verification artifacts

Screenshots are outside the Django project in
`/Users/filipbajacek/Documents/ChatGPT/Kalendar/output/calendar2027-verification/` for the original implementation, and `output/calendar2027-refinements/` relative to its parent workspace for this update. The captures are `en-desktop.jpg`, `en-mobile.jpg`, `sk-desktop.jpg`, `sk-mobile.jpg`, and the later desktop-headroom check `desktop-pin.jpg`; `file-audit.json` records the source-preservation audit. Later dot/loop/hover captures and their audit are under `output/calendar2027-navigation/` in the parent workspace. None belongs in the production commit.
These are review artifacts, not production static files; do not include them in the deployment commit. Temporary test settings, test routes, SQLite configuration, test scripts, decoded PNGs and dependency installations are under `/tmp/calendar2027-work`, not in the project.

A local `venv/` directory appeared during the work independently of this implementation. It was left untouched and is excluded from the feature inventory. Do not commit it.

## Dependencies and texture provenance

| Category | Name / version | Purpose | Production installation |
| --- | --- | --- | --- |
| New Python runtime packages | **None** | No backend change. | None |
| npm packages / frontend build | **None** | Plain JavaScript and CSS. | No Node.js, npm, npm install or npm build |
| Browser library | Three.js **0.180.0** | WebGL2 scene/rendering. Vendored npm distribution, MIT license retained. | Already included in static files; no server install and no CDN fetch |
| Optional development tool | Poppler **26.05.0** used here | `pdftoppm` rasterization of the original PDF. | Not required on Clouding.io |
| Optional development Python package | Pillow **12.3.0** used here | WebP encoding at quality 94, method 6. | Not required on Clouding.io |

Existing `requirements.txt` is untouched. The local machine initially lacked the website's Django dependencies. Testing installed existing Django-related packages into `/tmp/calendar2027-work/python`; this does not introduce website dependencies or change its requirements.

The unchanged 13 textures are **1800 x 2532**, preserving the full PDF page ratio (the supplied PDF page is approximately 320 x 450 mm, slightly different from nominal A3). Textures total **6,355,692 bytes**, approximately 6.1 MiB. All viewer static assets total approximately **6.8 MiB**. This resolution preserves small text without shipping the 68 MB PDF. Full-size viewing remains available through Enter on the focused scene, or desktop double-click, for text naturally tiny at phone preview size. The visible full-size link was removed as requested.

Source: `../KALENDAR2027_new_version.pdf` relative to the Django project.
SHA-256: `9803d04594678a06397211406f890bfe4818c4e54bf5e86c8fde6499ce1a4660`.

Optional regeneration on a development computer, from the Django project root:

```bash
brew install poppler
python3 -m venv /tmp/calendar2027-texture-env
source /tmp/calendar2027-texture-env/bin/activate
python -m pip install Pillow==12.3.0
python tools/calendar2027/render_textures.py ../KALENDAR2027_new_version.pdf
```

Homebrew supplies its current Poppler version; use 26.05.0 if byte-level reproduction matters. On a development Ubuntu computer, `sudo apt-get install poppler-utils` supplies the rasterizer. **Neither tool is needed to deploy the committed WebP files.** Keep the PDF privately as source; it is not used by the website.

## Verified configuration and values requiring confirmation

Inspected `fbwildlife/settings.py`, `fbwildlife/urls.py`, `gallery/views.py`, `requirements.txt`, `deploy.sh`, the full template, and static directories.

| Item | Evidence / value |
| --- | --- |
| Calendar routes | `/EN/calendar27.html` and `/SK/calendar27.html`; existing views render their respective localized templates. |
| Django version | `Django==5.2.6` in requirements. |
| Static source | `STATICFILES_DIRS = [BASE_DIR / 'static']`. |
| Static destination | `STATIC_ROOT = BASE_DIR / 'staticfiles'`. |
| URL prefix | `STATIC_URL = '/static/'`. |
| Server project directory | `/srv/fbwildlife`, recorded in `deploy.sh`; verify it on the server. |
| Server virtual environment | `/srv/fbwildlife/.venv`, recorded in `deploy.sh`; verify it exists. |
| Gunicorn systemd service | `fbwildlife`, recorded in `deploy.sh`; verify `fbwildlife.service`. |
| Deployment branch | `origin/main`, recorded in `deploy.sh`. |
| GitHub repository | Footer links to `https://github.com/filipbajacek/filipbajacek.com.git`; verify the actual remote in your real checkout. |
| Nginx configuration | Not supplied; its static alias, service unit and cache policy were not verified. |
| Production settings/environment | Not accessed. `deploy.sh` explicitly backs up/restores server settings, so retain them. |

The supplied workspace is **not a usable clone of the deployed repository**: its parent `.git` has no commits, no tracked project files and no remote. Normal `git diff` is empty because the input project was already untracked. Verification therefore also used an initial file-hash inventory and `git diff --no-index` against a saved original template. Do not make an initial commit containing only this feature in that empty repository and assume it is the complete website.

The supplied settings have `DEBUG=True`. Production must continue using its own verified `DEBUG=False` configuration; do not overwrite it with this local settings file. The supplied settings also contain legacy `STATICFILES_STORAGE` assignments and duplicate conditional WhiteNoise middleware entries. Django 5.2 uses **`STORAGES`** for selecting manifest storage; those legacy assignments alone do not select it. No settings were changed as part of this feature. [Django storage settings](https://docs.djangoproject.com/en/5.2/ref/settings/#storages).

## Local preparation and GitHub commands

Use your **existing complete website clone**, which must have a verified `origin` and clean `main` branch. The commands below ask you for that path instead of inventing a local clone path. If you need a fresh clone, the footer's repository URL is listed above; verify it first and clone it into a location you choose.

```bash
CALENDAR_SOURCE='/Users/filipbajacek/Documents/ChatGPT/Kalendar/filipbajacek.com-main-2'
printf 'Absolute path to your existing website Git clone: '
read -r CALENDAR_REPO
git -C "$CALENDAR_REPO" rev-parse --show-toplevel
git -C "$CALENDAR_REPO" remote -v
git -C "$CALENDAR_REPO" status --short
```

Stop if this is the supplied empty workspace repository, the remote is wrong, the project root differs from the Git root, or there are unrelated changes you have not preserved. From a clean, verified clone, update `main` before copying the completed files:

```bash
cd "$CALENDAR_REPO"
git switch main
git pull --ff-only origin main
mkdir -p static/calendar2027/css static/calendar2027/js
cp "$CALENDAR_SOURCE/templates/EN/calendar27.html" templates/EN/calendar27.html
cp "$CALENDAR_SOURCE/templates/SK/calendar27.html" templates/SK/calendar27.html
cp "$CALENDAR_SOURCE/static/calendar2027/css/viewer.css" static/calendar2027/css/viewer.css
cp "$CALENDAR_SOURCE/static/calendar2027/js/viewer.js" static/calendar2027/js/viewer.js
cp "$CALENDAR_SOURCE/CALENDAR_3D_DEPLOYMENT.md" .
git status --short
git diff -- templates/EN/calendar27.html templates/SK/calendar27.html static/calendar2027/css/viewer.css static/calendar2027/js/viewer.js
git add -- templates/EN/calendar27.html templates/SK/calendar27.html static/calendar2027/css/viewer.css static/calendar2027/js/viewer.js CALENDAR_3D_DEPLOYMENT.md
git diff --cached --check
git diff --cached --name-status
git diff --cached --stat
```

If the initial viewer assets are **not already in your real clone**, also copy and stage them before committing. These commands deliberately exclude macOS metadata:

```bash
mkdir -p static/calendar2027/vendor static/calendar2027/textures tools/calendar2027
cp "$CALENDAR_SOURCE"/static/calendar2027/vendor/*.js static/calendar2027/vendor/
cp "$CALENDAR_SOURCE/static/calendar2027/vendor/LICENSE.txt" static/calendar2027/vendor/
cp "$CALENDAR_SOURCE"/static/calendar2027/textures/*.webp static/calendar2027/textures/
cp "$CALENDAR_SOURCE/tools/calendar2027/render_textures.py" tools/calendar2027/
git add -- static/calendar2027/vendor/three.module.min.js static/calendar2027/vendor/three.core.min.js static/calendar2027/vendor/LICENSE.txt static/calendar2027/textures/*.webp tools/calendar2027/render_textures.py
```

These original assets are not new dependencies or changed textures in this refinement. Stage them before the commit commands below.

Review both template diffs against your actual current website: the supplied export may differ from the latest GitHub version. Confirm the staged changes are the five refinement files (plus original assets only if not already committed) before committing:

```bash
git commit -m "Add calendar page dots, looping navigation and calendar-only hover"
git push origin main
```

If your repository protects `main`, commit on `codex/calendar2027-viewer`, push that branch with `git push -u origin codex/calendar2027-viewer`, and use the normal PR/merge process. Production's deployment script targets `main`, so merge before deploying.

Do not run `git add .`. Do not stage settings, `.env`, virtual environments, credentials, databases, `.DS_Store`, `__pycache__`, `/tmp` tests, screenshots, the source PDF, or `staticfiles/`. Commit the source `static/calendar2027/` assets, including all WebP files and both vendor modules.

## Clouding.io deployment

Run these yourself on the server after the GitHub changes are available on `main`. No SSH hostname, username or key was supplied; use your existing server login. Paths/service names below come from `deploy.sh` and need confirmation before changes.

### Step classification

| Step | Status for this feature | Reason |
| --- | --- | --- |
| Fetch/update repository | **REQUIRED** | Obtain template and committed assets. |
| Python package installation / pip upgrade | **NOT REQUIRED** | Requirements did not change. |
| Node.js / npm install / npm build | **NOT REQUIRED** | Vendored browser ES modules, no build. |
| PDF conversion / Pillow / Poppler installation | **NOT REQUIRED** | Textures are already committed. |
| `collectstatic --noinput` | **REQUIRED** | Copy source assets into the existing static serving directory. |
| Gunicorn `fbwildlife` restart | **REQUIRED for reliable rollout** | Refresh cached templates and any WhiteNoise asset inventory. |
| `systemctl daemon-reload` | **NOT REQUIRED** | Service unit did not change. |
| Nginx restart/reload | **NOT REQUIRED** | Static routing/server configuration did not change. |
| Database migrations | **NOT REQUIRED** | No model, schema, or backend changes. |
| Browser/CDN cache refresh | **OPTIONAL / if needed** | Existing cache policy is unknown; verify current files after deploying. |

Initial checks only:

```bash
cd /srv/fbwildlife
test -f manage.py
test -x .venv/bin/python
git remote -v
git branch --show-current
git status --short
systemctl status fbwildlife --no-pager
source .venv/bin/activate
python manage.py shell -c 'from django.conf import settings; from django.contrib.staticfiles.storage import staticfiles_storage; print("DEBUG:", settings.DEBUG); print("STATIC_ROOT:", settings.STATIC_ROOT); print("STATIC_URL:", settings.STATIC_URL); print("static backend:", staticfiles_storage.__class__)'
```

Confirm branch `main`, the intended remote/service, `DEBUG=False`, and that the real static serving location agrees with the printed `STATIC_ROOT`. With the supplied layout it is `/srv/fbwildlife/staticfiles`. If a custom Nginx alias, environment loader, working directory, venv or settings module is used, retain it and adjust the commands to the verified values. Do not print or copy credentials into tickets or commits.

### Clean checkout update

If `git status --short` is empty, use:

```bash
cd /srv/fbwildlife
git rev-parse HEAD > /tmp/calendar2027-previous-commit.txt
git pull --ff-only origin main
source .venv/bin/activate
python manage.py check
python manage.py collectstatic --noinput
sudo systemctl restart fbwildlife
sudo systemctl status fbwildlife --no-pager
```

Execute sequentially and **stop if any step fails**; do not restart after a failed static collection. Do not use the existing `deploy.sh` for this focused update: it hard-resets the checkout, upgrades/installs dependencies and runs migrations/daemon-reload, which this feature does not need.

### If production settings are intentionally modified locally

The supplied deploy script restores server settings after updates. If the **only** tracked modification is `fbwildlife/settings.py`, preserve it using this Bash block. If any other tracked files differ, stop and reconcile them before deploying; do not discard them. Check the remote changes first to confirm they contain only the calendar files and report.

```bash
cd /srv/fbwildlife
git fetch origin main
git diff --name-status HEAD..origin/main
git status --short
git ls-files --error-unmatch fbwildlife/settings.py
```

Then, only under the conditions above:

```bash
bash <<'BASH'
set -e
cd /srv/fbwildlife
umask 077
CALENDAR_SETTINGS_BACKUP=$(mktemp /tmp/fbwildlife-calendar-settings.XXXXXX)
cp fbwildlife/settings.py "$CALENDAR_SETTINGS_BACKUP"
trap 'cp "$CALENDAR_SETTINGS_BACKUP" /srv/fbwildlife/fbwildlife/settings.py' EXIT
git rev-parse HEAD > /tmp/calendar2027-previous-commit.txt
git restore -- fbwildlife/settings.py
git pull --ff-only origin main
cp "$CALENDAR_SETTINGS_BACKUP" fbwildlife/settings.py
source .venv/bin/activate
python manage.py check
python manage.py collectstatic --noinput
sudo systemctl restart fbwildlife
sudo systemctl status fbwildlife --no-pager
printf 'Retained private settings backup: %s\n' "$CALENDAR_SETTINGS_BACKUP"
BASH
```

The trap restores the settings even if the pull or collection fails; the temporary private backup is retained. No hard reset or migrations are needed. Keep the existing server environment loading process; activation alone may not supply variables held by systemd or a separate environment file.

## Static-file checks and manifest caveat

`collectstatic` includes all **18** files under `static/calendar2027/`. The template uses Django static tags for every texture, CSS/JS entry point and vendor module. Three.js imports `./three.core.min.js` relatively, so keep both module files beside one another. Django's standard manifest collection retains the original core file alongside hashed copies; both layouts were checked locally. If your custom pipeline removes unhashed files or blocks ES modules with CSP, verify these settings separately.

[Django's static deployment workflow](https://docs.djangoproject.com/en/5.2/howto/static-files/deployment/) requires collecting source assets and serving the resulting `STATIC_ROOT`. Nginx needs no configuration change when it already serves `/static/` from that directory. Alternatively, existing WhiteNoise middleware can serve the collected files after the Gunicorn restart. No CDN is used by the viewer.

Local `DEBUG=False` collection and HTTP checks passed with the supplied project's effective default storage. A separate isolated collection of the calendar subtree with modern `whitenoise.storage.CompressedManifestStaticFilesStorage` also passed, including all hashed asset URLs.

**Full-project collection under modern manifest storage failed on a pre-existing unrelated asset reference:** `static/CSS+JS/lightbox.css` refers to missing `images/loading.gif`. This stylesheet was not changed. If your server already uses modern manifest storage and reports this error, stop deployment and resolve the existing lightbox asset issue as a separate change. Do not silently disable manifest validation or modify unrelated styles as part of this viewer update.

After collection, check the actual deployment URLs (Django may return hashed filenames):

```bash
python manage.py findstatic calendar2027/js/viewer.js calendar2027/css/viewer.css calendar2027/vendor/three.module.min.js calendar2027/vendor/three.core.min.js calendar2027/textures/calendar2027_cover.webp --verbosity 1
python manage.py shell -c 'from django.contrib.staticfiles.storage import staticfiles_storage; print(staticfiles_storage.url("calendar2027/js/viewer.js")); print(staticfiles_storage.url("calendar2027/css/viewer.css")); print(staticfiles_storage.url("calendar2027/vendor/three.module.min.js"))'
curl -I https://filipbajacek.com/EN/calendar27.html
curl -I https://filipbajacek.com/SK/calendar27.html
curl -I https://filipbajacek.com/static/calendar2027/vendor/three.core.min.js
curl -I https://filipbajacek.com/static/calendar2027/textures/calendar2027_cover.webp
```

Verify HTTP 200 and correct image/JavaScript/CSS MIME types for the actual URLs rendered in the page. Hard-refresh once if needed; purge an existing CDN cache only if it is configured and serving stale files. This guide does not assume a CDN exists.

## Verification results and checklist

Local browser tests use the Codex in-app Chromium browser with the real Django templates. Responsive viewport and synthetic pointer tests are not a substitute for physical phone/Safari tests. Temporary test code/settings remain outside the project.

- EN: cover and all 12 months loaded through the overlay arrows, in the original order. All 13 dots were also tested in non-sequential order, each with exactly one matching active dot; next/previous now wrap between December and the cover.
- SK: cover (`Titulná strana`) and all 12 localized month labels passed forward navigation; all 12 reverse transitions returned to the cover. Both wrap directions and localized dot selection were tested. The same static module, textures and viewer scripts are used.
- Both direction language-switcher links and the original localized page content were checked; existing navbar/product/footer source blocks match their respective originals.
- Layout: checked widths 320, 390, 750, 751, 1024 and 1920px. Document width equals viewport width at every size; above 750px stage width equals viewport width and left edge is zero. Arrow buttons are 44 x 44px, inside the stage at every size. Dots have 24 x 24px targets and were checked at 320/390px without overflow. On mobile both are centered below the scene, without reducing the original scene height.
- Resize: canvas height matched the inner scene viewport at every tested size, including the 750/751px breakpoint.
- Later desktop headroom adjustment: the 1440 x 1000 viewport now uses an 800px stage (previously 720px). The hanging pin was visually verified at rest and near maximum upward pointer tilt. The 390px mobile layout retains its 491px scene and 563px stage.
- Rendering preservation: source comparison confirms original scene construction, materials, lighting, white binding, deformation, render loop and paper deformation are retained; the turn function now accepts the navigation direction so wrap turns behave correctly, desktop fitting includes pin headroom, and hover detection is restricted to the printed sheet.
- Instruction/link removal: visible English viewer text contains the arrow glyphs, month/year and page count, with unlabeled visual dots beneath the calendar. No visible instruction text or full-size link remains.
- Keyboard: ArrowRight on the body left the cover unchanged; ArrowRight on the focused scene advanced to January.
- Shared touch handler: synthetic left/right swipes advanced and returned; a vertical gesture left the current page unchanged. Phone-sized overlay arrow activation worked on both localized templates.
- Rapid input: 20 synchronous arrow-key events produced one turn and one canvas.
- Perspective: the camera moved smoothly under the pointer test; the right arrow's bounding rectangle was identical before and after movement. The reset handler was also exercised. The new hover gate was checked on both the wall and the actual calendar: the paper still tilted, while selecting the next arrow returned the page to a frontal view.
- Reduced motion and WebGL fallback: dot selection produced immediate replacement with the preference overridden; forced no-WebGL produced zero canvases, a visible HTML preview, working December dot selection and next-arrow wrapping to the cover.
- Django `DEBUG=False`: both EN/SK templates rendered and all 18 existing calendar static files were found, collected and served with HTTP 200. Dotfiles such as `.DS_Store` are intentionally excluded by static collection.
- Modern manifest storage: the calendar subtree passes; the pre-existing full-project lightbox reference issue remains documented above.
- Final normal EN/SK browser runs produced no console warnings or errors.
- No new Python/JavaScript dependencies, backend endpoints, database changes, texture changes or vendor changes.

Before considering production deployed, verify:

- [ ] Server path, branch, virtual environment, settings and service name match the recorded configuration.
- [ ] New files are committed and available on GitHub `main`.
- [ ] `collectstatic` succeeds with the real server settings.
- [ ] Gunicorn restart succeeds; Nginx continues serving `/static/`.
- [ ] Browser network panel shows all viewer assets load, including the relative Three.js core module.
- [ ] Both EN/SK pages show all 13 dots, one active dot, correct localized labels, direct selection, December/cover looping, reverse turns and safe rapid clicks.
- [ ] Perspective responds only over the calendar and resets over the wall/arrows; mobile arrows stay below the calendar; dots fit and swiping preserves vertical scrolling.
- [ ] Reduced motion and a no-WebGL browser remain usable.
- [ ] Price, Buy Here URL, navigation, language switcher, year links and footer match the existing site.
- [ ] Check real iOS Safari, Android Chrome and desktop Firefox/Safari; these were not available in the local browser run.
- [ ] Browser console contains no viewer error; removed texts stay absent; Enter on the focused scene opens the current full-size page.

## Known limitations

No production verification was performed. Full-size gesture handlers are retained in the shared script, but new-tab behavior was not verified by the in-app browser. Nginx configuration, server environment, remote Git history and real device performance remain unverified. Texture compression is high-quality lossy WebP; it is not mathematically lossless. Rendering respects browser color management, rather than guaranteeing identical color appearance on every display. Original printed labels remain Slovak; viewer UI labels follow the EN/SK page language. Existing English labels/text elsewhere in the Slovak template were left unchanged. The paper curve/binding are simplified geometry rather than cloth simulation or an exact mechanical scan. During a turn the raised sheet can extend above the visible wall stage; every resting page is fully framed. Without WebGL2, the preview is functional 2D. Without JavaScript, use the individual page links.

## Rollback

Preferred rollback is a normal revert in your verified local clone, followed by the same server pull, collection and Gunicorn restart. Determine the exact feature commit from history; no SHA is invented here:

```bash
cd "$CALENDAR_REPO"
git log --oneline -10
printf 'Commit SHA for the calendar viewer change: '
read -r CALENDAR_VIEWER_COMMIT
git revert "$CALENDAR_VIEWER_COMMIT"
git push origin main
```

Then use the applicable deployment block above to pull the revert while preserving production settings. Run `collectstatic --noinput` and restart `fbwildlife`. Nginx reload and database rollback remain unnecessary. Stale collected viewer files are harmless after the old template is restored; do not use `collectstatic --clear` to delete unrelated assets.

For an urgent server rollback of this refinement, restore **both templates and both shared UI files together**. Restoring only a template can mismatch it with the new JavaScript scene host. Verify the recorded previous commit first. The block stages all four originals before replacing any working file and retains a local backup:

```bash
bash <<'BASH'
set -e
cd /srv/fbwildlife
CALENDAR_PREVIOUS_COMMIT=$(cat /tmp/calendar2027-previous-commit.txt)
CALENDAR_ROLLBACK_DIR=$(mktemp -d /tmp/calendar2027-rollback.XXXXXX)
for CALENDAR_FILE in templates/EN/calendar27.html templates/SK/calendar27.html static/calendar2027/css/viewer.css static/calendar2027/js/viewer.js; do
  mkdir -p "$CALENDAR_ROLLBACK_DIR/restore/$(dirname "$CALENDAR_FILE")" "$CALENDAR_ROLLBACK_DIR/backup/$(dirname "$CALENDAR_FILE")"
  git show "$CALENDAR_PREVIOUS_COMMIT:$CALENDAR_FILE" > "$CALENDAR_ROLLBACK_DIR/restore/$CALENDAR_FILE"
  cp "$CALENDAR_FILE" "$CALENDAR_ROLLBACK_DIR/backup/$CALENDAR_FILE"
done
for CALENDAR_FILE in templates/EN/calendar27.html templates/SK/calendar27.html static/calendar2027/css/viewer.css static/calendar2027/js/viewer.js; do
  cp "$CALENDAR_ROLLBACK_DIR/restore/$CALENDAR_FILE" "$CALENDAR_FILE"
done
source .venv/bin/activate
python manage.py collectstatic --noinput
sudo systemctl restart fbwildlife
printf 'Rollback files and backups retained at: %s\n' "$CALENDAR_ROLLBACK_DIR"
BASH
```

This leaves deliberate working-tree changes until the GitHub revert is applied. If the previous commit predates the entire original viewer, use the normal GitHub revert/deployment workflow instead, since its CSS/JS files may not exist. Do not use a repository-wide hard reset. Textures, vendor libraries, production settings, the PDF and database are unaffected by a refinement rollback.
