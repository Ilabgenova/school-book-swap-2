## Goal

Make every user-facing page of DISbook fully bilingual (IT / EN) so switching language actually changes every visible label. Currently ~89 hardcoded English strings remain across the app, which is why the same fix keeps coming back.

## Scope

I'll do a single sweep that:

1. **Adds all missing keys** to `src/i18n/translations.ts` under both `it` and `en` — organised into clear sections (`myBooks`, `sell`, `wanted`, `messages`, `login`, `register`, `admin`, `moderation`, `helpFeedback`, plus a few `common` additions).
2. **Replaces every hardcoded literal** in the user-facing pages with `t.<section>.<key>`.
3. Ensures every page that needs it imports `useLanguage`.

## Files touched

**Central:**
- `src/i18n/translations.ts` — add ~150 new keys × 2 languages.

**User-facing pages (highest priority, always visible):**
- `src/pages/MyBooks.tsx` — headings, tabs, "Listed / Wanted / Bought", dialog copy, admin note, correction dialog, condition options.
- `src/pages/Sell.tsx` — "Create your listing", listing type / condition selects, photo guidelines list, upload helpers.
- `src/pages/Wanted.tsx` — headings and empty states.
- `src/pages/Login.tsx` — "Welcome back to DISbook", "Continue with Google", labels, password reset link.
- `src/pages/Register.tsx` — step labels, form labels, disclaimers, "Continue with Google".
- `src/pages/Messages.tsx` — headings, empty states, "Mark as sold" quick action, dialog copy.
- `src/pages/HelpFeedback.tsx` — check for any missed strings.

**Shared UI components (visible to all users):**
- `src/components/moderation/ReportButton.tsx` — dialog copy.
- `src/components/browse/*` — any remaining hardcoded copy in `TransactionConfirmation`, `BooksToSellSuggestion`, `SummerReadingSection`.

**Admin section (admin-only, but still fix so IT admins see IT):**
- `src/pages/Admin.tsx` — tab labels, filter select options, dialog buttons.
- `src/components/admin/ModerationPanel.tsx`, `FeedbackPanel.tsx`, `BookImportPanel.tsx`, `UsersPanel.tsx`, `ReuseReviewPanel.tsx`, `ImpactPanel.tsx` — table headers, buttons, status selects.

## Approach

- Add new translation sections in one big edit to `translations.ts`.
- For each page, replace hardcoded strings via targeted `line_replace` edits.
- Keep program names (PYP, MYP, DP) and school name in English per project memory.
- Keep semantic tokens; no styling changes.
- Verify with `tsgo` typecheck at the end.

## Out of scope

- Server-side / DB-stored strings (admin notes typed by admins, listing titles, feedback messages).
- Toast messages returned from Supabase errors (backend English).
- shadcn `ui/*` components (rarely user-visible copy like "Previous slide" in carousel and "Toggle Sidebar" in sidebar).

If you'd like those toast messages also localised I can add a `supabaseError → friendly IT/EN` mapping in a follow-up pass.

Approve and I'll implement it in one go.
