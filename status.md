# Status

_Last updated: 1 Oct 2026_

## Last commit to the website

| | |
|---|---|
| **Commit** | [`11f066ba`](https://github.com/SaIdEeVaN/BIC-REC_Site/commit/11f066ba8640685eda95adeb5c29ced1b5a0dad9) on `main` |
| **Date** | 1 Oct 2026, 21:48 IST (16:18 UTC) |
| **Message** | Stop browsers caching the site's pages |
| **Files changed** | `firebase.json` |
| **Deploy** | ✅ Succeeded — [run #48](https://github.com/SaIdEeVaN/BIC-REC_Site/actions/runs/36891015906) |
| **Live at** | [bicrec.web.app](https://bicrec.web.app) |

Pages now tell browsers to check for a newer version on every visit, so a deploy shows up straight
away instead of up to an hour later. The built files in `/assets/` are still cached for a year,
which is safe because every build gives them new names.

## Deprecated branch

`copilot/explain-repository-structure` is not used and is due to be deleted. It was never merged
into `main` and has no pull request. Its last commit was
[`d1adeca5`](https://github.com/SaIdEeVaN/BIC-REC_Site/commit/d1adeca5608f1e42c00eb1a219986fdfa7f876a8)
("Added README.md file", 22 Aug 2026), noted here so it can be restored if it is ever needed.
