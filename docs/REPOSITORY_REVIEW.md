# Repository Review: bybyKD/magic-chess-gogo-auction

**Phase**: 1 of 9  
**Auditor**: Staff Engineer / Open Source Maintainer  
**Date**: July 31, 2026  

---

## Summary

This is a technically solid project in an uncontested niche. The code is well-organized, the architecture follows good separation of concerns (logic / hooks / components / ml), and the predictor app works. However, the repository has several critical gaps in documentation, contributor infrastructure, data consistency, and discoverability.

**Overall score: C+** (code: B+, infrastructure: D)

---

## Issues by Severity

---

### Critical

#### C1. Duplicate treasure database — three copies, potentially divergent

**Location**: `treasure_database.json` (root), `auction_predictor/src/data/treasure_database.json`, `treasure_database_backup.json`

**Why it matters**: Three copies of the same data means they will inevitably diverge. Comparing root (2562 lines, 306 items) with backup (2441 lines, different shapes for same items like Chaos Orb: "2x2" vs "1x1") reveals they are already inconsistent. The app reads from `src/data/` while the root copy is the "public" one. A user who updates one and forgets the other will break the app.

**Fix**: Keep one canonical copy in `data/treasure_database.json`. Have the predictor import it via a symlink, a Vite alias, or a build copy step. Remove the backup (that's what git history is for). Verify and reconcile the data differences first.

**Impact**: Prevents data corruption. Critical before any external consumers depend on the data.

---

#### C2. No GitHub Pages deployment

**Location**: Missing

**Why it matters**: Without a live demo, every visitor must clone the repo and run `npm install` to see if the app works. This filters out 90%+ of potential users. No live URL means no sharing on social media, no embedding in blog posts, no search engine indexing of the app itself.

**Fix**: Add `base: '/magic-chess-gogo-auction/'` to `vite.config.js`. Create a GitHub Actions deploy workflow. Enable Pages in repo settings.

**Impact**: Single highest-impact change. Unlocks every downstream channel.

---

#### C3. No issue templates, no CONTRIBUTING.md, no CODE_OF_CONDUCT.md

**Location**: Missing `.github/` directory entirely

**Why it matters**: The first thing a potential contributor does is check the Issues tab. Blank issue templates produce low-quality reports. No CONTRIBUTING.md means contributors don't know how to set up, what conventions to follow, or how to submit changes. No CODE_OF_CONDUCT is a red flag for many developers.

**Fix**: Create `.github/ISSUE_TEMPLATE/bug_report.md`, `feature_request.md`, `config.yml`. Create `CONTRIBUTING.md`. Create `CODE_OF_CONDUCT.md`.

**Impact**: High — necessary for community growth.

---

#### C4. No CHANGELOG.md, no GitHub Releases, no versioning

**Location**: Missing

**Why it matters**: Without releases, there's no way for users to track what changed. The `package.json` version is `0.0.0` (default Vite scaffold). No release tag exists. This makes the project look unmaintained.

**Fix**: Create `CHANGELOG.md`. Create a v0.1.0 release. Set a meaningful version in `package.json`.

**Impact**: High — foundational for professional presentation.

---

### High

#### H1. Root README has no screenshots, no demo GIF, no hero section

**Location**: `README.md`

**Why it matters**: Text-only READMEs get 50-70% less engagement than those with visual content. The first thing a visitor sees is a tree diagram and a quick start — neither explains *why* the project is valuable.

**Fix**: Add a hero section with a demo GIF showing: paint block → enter clue → see EV. Add feature list with emoji icons. Move the tree diagram below the fold.

**Impact**: High — converts passive browsers into active users.

---

#### H2. No screenshots directory in assets

**Location**: Missing `assets/` directory at repo root

**Why it matters**: There's no place for screenshots, the favicon is the Vite default, and there's no social preview image.

**Fix**: Create `assets/` for screenshots, branding assets, and the social preview image.

**Impact**: Medium — improves visual presentation.

---

#### H3. `data/archive/` and `data/raw/recovered_items.json` contain unmerged data

**Location**: `data/archive/new_items.json` (2418 lines), `data/archive/new_items_clean.json` (1242 lines), `data/raw/recovered_items.json` (1368 lines)

**Why it matters**: These files contain item data that may overlap with the main database. It's unclear whether they're merged, pending, or deprecated. A future maintainer won't know what to do with them. They inflate the repo size with redundant data.

**Fix**: Deduplicate against the main database. Merge unique items. Delete remaining duplicates. Add a README in `data/` explaining the data pipeline.

**Impact**: Medium — prevents data confusion.

---

#### H4. `data/extract.py` has a hardcoded absolute path

**Location**: `data/extract.py` line 319: `'/Users/Derio/Documents/MAGIC AUCTION DATABASE/new_items.json'`

**Why it matters**: The script writes to an absolute path that only exists on one developer's machine. Running it will fail with a file-not-found error for anyone else. This makes the data pipeline non-reproducible.

**Fix**: Change to a relative path (`../data/archive/new_items.json` or similar). Add command-line argument support.

**Impact**: Medium — makes the build reproducible.

---

#### H5. `package.json` has `"private": true` and `"version": "0.0.0"`

**Location**: `auction_predictor/package.json`

**Why it matters**: Cannot publish to npm. Version is meaningless. Missing `repository`, `homepage`, `bugs`, `keywords` fields that GitHub uses for SEO.

**Fix**: Update version to `0.1.0`. Add `repository`, `homepage`, `bugs`, `keywords` fields. Keep `private: true` until ready to publish.

**Impact**: Medium — metadata for GitHub SEO.

---

#### H6. `index.html` missing meta description and Open Graph tags

**Location**: `auction_predictor/index.html`

**Why it matters**: The HTML `<title>` is "Magic Auction Predictor" with no meta description. Social media shares will show a blank preview card. Search engines auto-generate snippets.

**Fix**: Add `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">`.

**Impact**: Medium — improves search and social sharing.

---

#### H7. No GitHub Actions CI

**Location**: Missing

**Why it matters**: No automated verification that the project builds or passes lint. Every merge is a manual risk. Contributors have no feedback loop.

**Fix**: Add `.github/workflows/ci.yml` with `npm ci` → `npm run build` → `npm run lint`.

**Impact**: Medium — quality gate for contributions.

---

### Medium

#### M1. No tests

**Location**: Missing entirely

**Why it matters**: The appraisal engine, board stats, and suggestion engine have zero tests. A change to the matching algorithm could silently break.

**Fix**: Add Vitest tests for `logic/appraisal.js`, `logic/boardStats.js`, `logic/suggestionEngine.js`.

**Impact**: Medium — prevents regressions.

---

#### M2. No JSON Schema for the database

**Location**: Missing

**Why it matters**: External consumers of `treasure_database.json` have no way to validate the data format or get IDE autocompletion.

**Fix**: Add `data/treasure_database.schema.json`. Include TypeScript types.

**Impact**: Medium — developer experience.

---

#### M3. `vite.config.js` has no `base` path

**Location**: `auction_predictor/vite.config.js`

**Why it matters**: Required for GitHub Pages deployment. Without it, assets will 404.

**Fix**: Add `base: '/magic-chess-gogo-auction/'`.

**Impact**: Medium — required for Pages deployment.

---

#### M4. Root-level files create visual noise

**Location**: Root directory has 12 entries including `FORENSIC_REPORT.md`, `REPO_AUDIT.md`, `treasure_database_backup.json`, `get_files.py`

**Why it matters**: A cluttered root directory looks unprofessional and makes it harder to find important files.

**Fix**: Move `FORENSIC_REPORT.md` and `REPO_AUDIT.md` to `docs/`. Move `get_files.py` to `data/raw/`. Remove or merge `treasure_database_backup.json`.

**Impact**: Low — cosmetic but contributes to first impressions.

---

#### M5. No error boundaries in the React app

**Location**: `auction_predictor/src/App.jsx`

**Why it matters**: Any unhandled error crashes the entire app with a white screen.

**Fix**: Add an `<ErrorBoundary>` component and wrap the main app.

**Impact**: Medium — prevents poor UX.

---

#### M6. No pull request template

**Location**: Missing

**Why it matters**: First-time contributors don't know your conventions. PRs will have inconsistent formatting.

**Fix**: Add `.github/PULL_REQUEST_TEMPLATE.md`.

**Impact**: Medium — reduces maintainer overhead.

---

#### M7. No SECURITY.md

**Location**: Missing

**Why it matters**: Security researchers need a way to report vulnerabilities privately.

**Fix**: Add `SECURITY.md` with a disclosure policy.

**Impact**: Medium — security best practice.

---

#### M8. No CODEOWNERS

**Location**: Missing

**Why it matters**: Without CODEOWNERS, all PRs require manual assignment. As the sole maintainer, this is a minor issue now but becomes important with growth.

**Fix**: Add `.github/CODEOWNERS` with `* @bybyKD`.

**Impact**: Low — nice-to-have.

---

### Low

#### L1. Favicon is the default Vite logo

**Location**: `auction_predictor/public/favicon.svg`

**Why it matters**: The browser tab shows an irrelevant logo.

**Fix**: Replace with a custom favicon (treasure chest, gavel, or coin icon).

**Impact**: Low — attention to detail.

---

#### L2. No custom 404 page

**Location**: Missing

**Why it matters**: GitHub Pages allows custom 404 pages, but none exists.

**Fix**: Add `public/404.html` (or `docs/404.md` for Pages).

**Impact**: Very low — nice-to-have.

---

#### L3. The backup database has `"description"` fields filled in, the main one does not

**Location**: `treasure_database_backup.json` vs `treasure_database.json`

**Why it matters**: The backup has item descriptions that the main DB lacks. These should be merged into the canonical DB if they're accurate.

**Fix**: Audit the descriptions in the backup. Merge them into the main database if they're game-correct.

**Impact**: Low — content completeness.

---

#### L4. `data/raw/recovered_items.json` uses `null` for description instead of `""`

**Location**: `data/raw/recovered_items.json`

**Why it matters**: Inconsistent with the main database which uses `""`. JSON consumers may need to handle both.

**Fix**: Normalize to `""`.

**Impact**: Very low — data consistency.

---

#### L5. `Constants.js` has hardcoded column letters in QuickEntry (now fixed)

**Location**: Already fixed in a prior session. Confirmed: `COL_LETTERS` now derives from `COLS`.

**Impact**: None — already resolved.

---

## Priority Matrix

| Priority | Items | Effort | Impact |
|----------|-------|--------|--------|
| **Do this week** | C1, C2, C3, C4, H1, H4, H5, H7 | ~6 hours | **Critical** |
| **Do next week** | H2, H3, H6, M1, M2, M3, M5, M6, M7 | ~8 hours | **High** |
| **Do when time** | M8, L1, L2, L3, L4 | ~2 hours | **Low** |

---

## Files That Should Exist After Cleanup

```
.github/
  ISSUE_TEMPLATE/
    bug_report.md
    feature_request.md
    config.yml
  PULL_REQUEST_TEMPLATE.md
  CODEOWNERS
  workflows/
    ci.yml
assets/
  screenshots/
    predictor-demo.gif
    results-panel.png
    ai-dashboard.png
  social-preview.png
  favicon.svg
  icons.svg
data/
  treasure_database.json          # CANONICAL — single source of truth
  treasure_database.schema.json
  extract.py                      # Fixed relative path
  raw/
    export.js
    extract.py
    list_files.py
  archive/
    README.md                     # Explains what's in here and why
docs/
  ARCHITECTURE.md
  DATABASE.md
  FAQ.md
  CONTRIBUTING.md
  CODE_OF_CONDUCT.md
  SECURITY.md
  CHANGELOG.md
  ROADMAP.md
```

---

End of Phase 1. Ready for Phase 2 (README rewrite).
