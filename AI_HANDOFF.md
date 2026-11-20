# ExamArena BD — AI DEVELOPMENT HANDOFF
Updated: 2026-11-21 (Malaysia time)
Repository: https://github.com/mehedialimayon-del/examarena-bd
Live: https://mehedialimayon-del.github.io/examarena-bd/
Main branch. Primary homepage code: index.html (single large HTML/CSS/JS file).
Last visual polish commit before this handoff: bdb023f7c2e362893baa4c98eb3cae58b15e958f.

## User's mandatory instructions
- Work directly on actual GitHub code, never generate images for code requests.
- Inspect latest repository before each change; inspect Supabase before any DB-affecting change; never guess schema, test results, or implementation.
- Preserve all existing features, routes, content, user data and navigation. Make small, verified commits.
- Mobile visual reference is the user's screenshots in prior ChatGPT conversation: dark navy header/footer, vivid blue ticker/title, pale-blue background, glossy pastel category cards with orange arrows, orange CTA, white/light-blue feature tiles.
- Fixed mobile header, live ticker and five-item bottom navigation; homepage and category/setup screens should fit screen without vertical scroll. Long reading/practice content may scroll.
- Main home has a books + graduation-cap banner with five icons below, 10 category cards in 2 columns, 8 feature buttons in 4x2 grid, 4-stat row, 5-item bottom nav.
- Recent screenshot issues: avoid overlay between banner copy and five icons; ensure book/cap fully visible; avoid clipped Bengali feature labels; preserve card height and gloss.
- At the end of EVERY response provide a working 'Next' button that submits a continuation prompt. User wants to tap and resume exactly where work stopped.
- At chat limit, direct user to paste the new-chat continuation prompt below and point to this handoff file. A new chat must inspect current repo and this file; do not assume old screenshots are automatically visible. The user may need to reattach visual reference if inaccessible.

## Latest verified update (2026-11-21)
- Commit 068ec81694bdf15caf1c4de43ea11c0bbbe2c946: changed homepage Complete Syllabus shortcut from subjects to examTracks; added font-load, orientation and ResizeObserver remeasure hooks for mobile layout.
- Verified by fetching index.html again and checking exact code and ten category/eight feature button markup. Browser/Android click testing still pending.
- Next: test category and feature button navigation in actual browser, check mobile reference screenshot alignment and avoid duplicate CSS overrides.

## Latest implementation state
- Most recent CSS-only visual polish appended to index.html: 'Reference polish 2026-11-21'.
- Earlier commits: 424cd9f compact header/live ticker and fix 8 feature labels; eb845b0 inline SVG graduation cap and books; c044999 proportion changes; d0265fa reverted broken grid; other iterations precede these.
- GitHub commit/readback verifies file persistence, NOT Android/mobile browser rendering or click QA.
- Verify actual phone screenshot and interaction before claiming pixel match.
- Potential tech debt: many CSS overrides with !important; consolidate cautiously after inspecting cascade. CSS selector specificity and actual browser viewport may differ from screenshots.
- Never alter an APK unless explicitly requested.

## Next development step
1. Fetch current index.html, inspect final CSS cascade and DOM of #eaHomeRescue, .ehr-hero, .ehr-grid, .ehr-features, header, .notice-strip, .mobile-nav.
2. Compare with latest user-provided screenshot; adjust only mismatched visual features, preserving content.
3. Test available checks; if no live mobile browser available, state this limitation clearly.
4. Commit verified change and provide live URL with cache-busting ?v=<short_sha>.
5. End response with Next continuation button.

## New-chat continuation prompt (copy/paste)
'ExamArena BD-এর কাজ আগের জায়গা থেকে চালিয়ে যান। GitHub repo mehedialimayon-del/examarena-bd, main branch। প্রথমে repo-এর AI_HANDOFF.md ও বর্তমান index.html পড়ুন। শেষ কমিট, অসম্পূর্ণ কাজ, স্ক্রিনশটের থিম, fixed screen, no scroll, glossy buttons, 10 categories, 8 features, books/cap, header/ticker এবং bottom nav অনুসরণ করুন। কোনো ছবি বানাবেন না; সরাসরি কোড সংশোধন, যাচাই, Commit করুন। পূর্বের ফিচার অক্ষত রাখুন। প্রতিটি উত্তরের শেষে Next বাটন দিন।'
