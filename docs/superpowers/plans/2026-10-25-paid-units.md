# Paid Units Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Per-unit paid access: Bunny videos and files inside a priced first-level folder open only for students the admin unlocked.

**Architecture:** Two optional fields (`Folder.price`, `User.unlockedUnitIds`). One server module (`src/libs/access.ts`) decides access; the per-user resources API, the playback API and the admin APIs all go through it. The cached folder page stays user-agnostic; per-user lock state arrives via the existing SWR fetch of `/api/resources/[folderId]`.

**Tech Stack:** Next.js 16 App Router, NextAuth 4 (JWT), Prisma 5 + MongoDB, MUI 5, SWR, Vitest.

Spec: `docs/superpowers/specs/2026-10-25-paid-units-design.md`.

## Global Constraints

- Production DB: additive optional fields only. Never run `prisma db push`, `migrate` or any write script. `prisma generate` only.
- Bunny secrets stay server-only (no `NEXT_PUBLIC_`). Never log signed URLs.
- Access is read from the DB on each request, never from the JWT or the request body.
- Admins (`role === "ADMIN"`) can open everything.
- UI copy in Arabic, matching existing components (`Surface`, `AppDialog`, `ActionsMenu`, `States`).
- Do not change YouTube playback or progress tracking.
- No pushing; local commits only.

## File map

| File                                                                                           | Responsibility                                                    |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `prisma/schema.prisma`                                                                         | `Folder.price Int?`, `User.unlockedUnitIds String[] @db.ObjectId` |
| `src/libs/bunny.ts`                                                                            | signing (exists) + `parseBunnyUrl`, `isBunnyUrl`                  |
| `src/libs/access.ts` (new)                                                                     | `getViewer`, `getUnit`, `canOpenUnit`                             |
| `src/libs/class.ts`                                                                            | `getResources(folderId, viewer)` adds `access`, locks paid files  |
| `src/libs/constant.ts`                                                                         | `PAID_FILE_URL` marker                                            |
| `src/app/api/resources/[folderId]/route.tsx`                                                   | pass viewer                                                       |
| `src/app/api/video/[id]/playback/route.ts` (new)                                               | signed embed URL + watermark                                      |
| `src/app/api/video/route.ts`                                                                   | accept Bunny links                                                |
| `src/app/api/folder/route.ts`                                                                  | `PATCH` price (first-level only)                                  |
| `src/app/api/units/route.ts` (new)                                                             | admin: classes with priced units                                  |
| `src/app/api/user/[id]/units/route.ts` (new)                                                   | admin: set a user's units                                         |
| `src/libs/users.ts`                                                                            | `unlockedUnitIds` in `publicUserSelect`                           |
| `src/components/BunnyPlayer/` (new)                                                            | dialog player with watermark guard                                |
| `src/scenes/ResourcesPage/**`                                                                  | lock UI, paywall, Bunny routing, price action                     |
| `src/components/VideoForm/VideoForm.tsx`                                                       | accept Bunny links                                                |
| `src/scenes/ProfilerPage/components/UsersPanel.tsx`, `UnitsDialog.tsx` (new), `usersFilter.ts` | unit chips, dialog, "subscribers" filter                          |
| remove `src/app/(site)/bunny-test`, `src/app/api/bunny-test`, `tests/unit/bunny-test.test.ts`  | cleanup                                                           |

---

### Task 1: Schema, Bunny URL parsing, access module

**Files:** Modify `prisma/schema.prisma`, `src/libs/bunny.ts`. Create `src/libs/access.ts`, `tests/unit/access.test.ts`.

**Produces:**

- `parseBunnyUrl(url: string): { libraryId: string; videoId: string } | null` (accepts `https://{iframe|player}.mediadelivery.net/{embed|play}/<lib>/<guid>`)
- `isBunnyUrl(url: string): boolean`
- `type Viewer = { id: string; role: string | null; unlockedUnitIds: string[] } | null`
- `getViewer(): Promise<Viewer>`: session id → DB `role`, `unlockedUnitIds` (missing list → `[]`)
- `type Unit = { id: string; name: string; price: number | null }`
- `getUnit(folderId): Promise<Unit | null>`: `getBreadcrumbs(folderId)[1]` with its price; null for the class root
- `canOpenUnit(viewer, unit): boolean`: `!unit?.price || admin || unlockedUnitIds.includes(unit.id)`

- [ ] Add the two fields; `npx prisma generate`. Read-only check that an existing user reads `unlockedUnitIds` as `[]` (no writes).
- [ ] Write tests: `parseBunnyUrl` (embed, play, iframe/player hosts, YouTube → null, junk → null); `canOpenUnit` (null unit, no price, admin, owner, stranger, guest); `getUnit` with mocked prisma (root → null, first-level, deeper folder resolves to first-level).
- [ ] Run, see failures; implement; run green; commit `feat(paid-units): schema fields and access rules`.

### Task 2: Per-user resources

**Files:** Modify `src/libs/class.ts`, `src/libs/constant.ts`, `src/app/api/resources/[folderId]/route.tsx`, `src/app/(site)/class/[classId]/folder/[folderId]/page.tsx`. Test `tests/unit/paid-resources.test.ts`.

**Produces:** `getResources(folderId, viewer: Viewer | undefined)` returning `{ folders, files, videos, access }` with
`access = { unit: Unit | null; canOpen: boolean; ownedUnitIds: string[]; whatsAppNumber: string | null }`.
Files: guest → `SIGNIN_FILE_URL` (unchanged); signed-in without access → `{ ...file, url: PAID_FILE_URL }`. `whatsAppNumber` only when `unit?.price`. The cached page calls with `undefined` (guest view).

- [ ] Tests: guest/owner/stranger/admin × priced/unpriced unit; locked file never carries the R2 URL; `ownedUnitIds` only for the viewer.
- [ ] Implement, green, commit `feat(paid-units): lock paid files per viewer`.

### Task 3: Playback API

**Files:** Create `src/app/api/video/[id]/playback/route.ts`. Test `tests/unit/playback.test.ts`.

`GET`: invalid id 400 → no session 401 → video missing or not Bunny 404 → `!canOpenUnit` 403 → `{ url, expires, watermark: email ?? id }`, `Cache-Control: no-store`, TTL `BUNNY_TOKEN_TTL_SECONDS`. Library id from env `BUNNY_LIBRARY_ID`; the stored link's GUID via `parseBunnyUrl`.

- [ ] Tests for each status and that the key never appears in the body. Implement, green, commit.

### Task 4: Admin APIs

**Files:** Modify `src/app/api/folder/route.ts` (`PATCH { folderId, price: number | null }`: admin, first-level folder only, integer 1..10000 or null), `src/libs/users.ts`. Create `src/app/api/units/route.ts` (`GET` admin: `[{ classId, className, units: [{ id, name, price }] }]` for priced first-level folders), `src/app/api/user/[id]/units/route.ts` (`PUT { unitIds: string[] }` admin: dedupe, every id must be a priced first-level folder, else 400). Test `tests/unit/units-admin.test.ts`.

- [ ] Tests: non-admin 401/403, root/deep folder price → 400, bad unit id → 400, success writes exactly the given list. Implement, green, commit.

### Task 5: Adding Bunny videos

**Files:** Modify `src/app/api/video/route.ts`, `src/components/VideoForm/VideoForm.tsx`, `src/scenes/ResourcesPage/ResourcesPage.tsx` (menu label "إضافة فيديو").

POST: YouTube as today; Bunny link → `videoId` = GUID, `url` = `https://iframe.mediadelivery.net/embed/<lib>/<guid>`, `thumbnailUrl` = `""` (Bunny thumbnails are token-protected). Reject a Bunny link from another library (400). Form validation accepts either; preview only for YouTube.

- [ ] Tests on the route for both kinds and the wrong library. Implement, green, commit.

### Task 6: Student UI

**Files:** Create `src/components/BunnyPlayer/BunnyPlayer.tsx` + `index.ts` (dialog; fetches `/api/video/<id>/playback` on open; loading/error/403 states; watermark + tamper guard + box fullscreen moved from the test page), `src/scenes/ResourcesPage/components/PaywallDialog.tsx` (unit name, price, WhatsApp link `https://wa.me/<number>?text=…`). Modify `VideoCard.tsx` (placeholder when no thumbnail, `locked` prop shows lock + price), `VideosSection.tsx` (pass `locked`), `FilesSection.tsx` (`PAID_FILE_URL` → locked box with price and WhatsApp button), `FolderCard.tsx`/`FolderSection.tsx` (price chip; "مشترك" when owned), `ResourcesPage.tsx` (Bunny → `BunnyPlayer`, locked → paywall, no watch tracker for Bunny, refetch per-user data when signed in and the page has a priced unit or priced folders), `src/hooks/useResourceApi.ts` + `src/scenes/ResourcesPage/resourceDnd.ts` types (`access`).

- [ ] `tsc`, eslint; existing resources tests still green; commit.

### Task 7: Admin UI

**Files:** `src/components/ui/ActionsMenu.tsx` (optional `onPrice`), `FolderCard.tsx`/`FolderSection.tsx`/`ResourcesPage.tsx` (price action on the class root page only, number dialog via `AppDialog`), `src/scenes/ProfilerPage/components/UnitsDialog.tsx` (new: loads `/api/units`, checkboxes, PUT on save), `UsersPanel.tsx` (unit chips, "الوحدات" button), `usersFilter.ts` (`subscription: "ALL" | "PAID"` filter) + its test.

- [ ] Filter test first, then UI; `tsc`, eslint, vitest; commit.

### Task 8: Cleanup and verification

- [ ] Delete the test page, its API, its test, `BUNNY_TEST_*` from `.env` and `.env.example`.
- [ ] `npx tsc --noEmit`, eslint, prettier, `npx vitest run`.
- [ ] Manual: guest/stranger see locks, playback 403; admin ticks unit → plays; unticks → 403 immediately.
- [ ] Commit `chore(paid-units): remove Bunny test page`.
