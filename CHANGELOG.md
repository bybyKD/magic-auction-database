# Changelog

## [0.1.0] — 2026-07-31

### Added
- Initial public release
- Grid painting with 6 color tiers (red/gold/purple/blue/green/gray)
- Appraisal engine: EV computation per cell and board-wide
- Suggestion engine: optimal next-move recommendations
- TensorFlow.js AI model with training dashboard
- QuickEntry: coordinate-notation board loading
- Strategy guide modal
- Commander assistant panel
- Match logger
- Save/Load board state (localStorage)
- Undo/Redo (Ctrl+Z / Ctrl+Shift+Z)
- Keyboard shortcuts (1-4 for colors, E for empty, R for erase)
- Treasure database: 306 items
- Bilingual documentation (English + Bahasa Indonesia)
- Custom favicon and 404 page
- GitHub community standards: issue templates, PR template, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CODEOWNERS
- CI/CD: GitHub Actions (build + lint + Pages deploy)
- Documentation: ARCHITECTURE, DATABASE, FAQ, ROADMAP
- MIT License

### Fixed
- Color label display in Controls (was showing wrong names)
- `useBoardStats` re-render loop (useMemo dependencies)
- Group ID counter starting from 0 (now starts from 1)
- Column letters in QuickEntry (now derives from `COLS`)
- Training progress shown as percentage instead of raw count
