# Paid units: design

Date: 2026-10-25. Branch: `feat/paid-units`.

## Goal

Classes can contain **paid units**. A unit is a first-level folder inside a
class. The admin sets a price per unit, students pay outside the site
(cash/transfer, via WhatsApp) and the admin unlocks the unit for that student
from the admin users page. Access never expires; the admin removes it manually.

## Rules

- **Unit** = a folder whose parent is the class root folder. Sub-folders belong
  to their first-level ancestor's unit.
- A unit is **paid** when `Folder.price` is set (> 0). Unpriced folders behave
  exactly as today.
- Inside a paid unit:
  - **YouTube videos**: free for everyone (teasers). A YouTube video cannot be
    protected anyway.
  - **Bunny Stream videos**: locked unless the student owns the unit.
  - **Files**: locked (link not sent) unless the student owns the unit. Files
    stay in R2 where they are; owners may download them.
- Admins always see and play everything.
- A video is Bunny when its URL host is `mediadelivery.net` (no new field).

## Data (production DB: additive, optional fields only)

| Model | New field | Meaning |
|---|---|---|
| `Folder` | `price Int?` | Unit price in ILS. Only accepted on first-level folders. |
| `User` | `unlockedUnitIds String[] @db.ObjectId` | Units this student owns. |

No new collections, no changes or deletions to existing fields or documents.
Existing documents without the new fields must read as "no price" / "no units"
(verify Prisma's MongoDB behaviour for a missing scalar list before relying on it).

## Server

All access decisions are server-side and read the DB on every request, so
revoking a unit takes effect immediately (never trust the JWT or the browser for
access).

- `src/libs/access.ts`
  - `getUnit(folderId)`: the unit (id, name, price) of any folder, from
    `getBreadcrumbs` (`breadcrumb[1]`, since `breadcrumb[0]` is the class root).
  - `canOpenUnit(user, unit)`: true when the unit has no price, the user is an
    admin, or the unit id is in `user.unlockedUnitIds`.
  - `isBunnyUrl(url)`.
- `GET /api/resources/[folderId]` (existing, per-user): adds `locked` to Bunny
  videos and files the user cannot open, omits locked file URLs, and returns the
  unit (name, price) for the paywall.
- The cached folder page (ISR) stays user-agnostic: no file URLs, no signed URLs.
- `GET /api/video/[id]/playback`: 401 signed out, 404 unknown or not Bunny,
  403 no access, otherwise `{ url, expires }` signed with `signBunnyEmbedUrl`
  (`src/libs/bunny.ts`), `Cache-Control: no-store`. The browser sends only the
  video id.
- `PUT /api/user/[id]/units` (admin): replaces the user's unit list; rejects ids
  that are not priced first-level folders.
- Folder create/update API (admin): accepts `price` only for first-level folders.

## Admin UI

- **Users page** (`UsersPanel`): per user, chips with owned units
  ("الحادي عشر: وحدة 1"), a "الوحدات" button opening a dialog that lists each
  class with its paid units (name + price) as checkboxes, and a "المشتركين فقط"
  filter.
- **Folder form**: optional "السعر (₪)" field for first-level folders.
- **Video form**: accepts a Bunny embed/play link besides YouTube.

## Student UI

- Locked items show a lock and the unit price, with "اشترك عبر واتساب" using
  `LandingPage.whatsAppNumber`.
- Bunny videos open in the existing video dialog (same look as YouTube) with the
  moving email watermark, tamper guard and box fullscreen from the test page.
- Progress: YouTube keeps automatic progress; Bunny videos only get the manual
  "done" toggle for now.

## Bunny settings (done, verified 2026-10-25)

Embed view token auth on, CDN token auth on, DRM off, MP4 fallback off,
Early-Play off, Volume delivery tier. Allowed domains must include the
production domain before release.

## Cleanup

Remove the `/bunny-test` page, its API route and test, and the `BUNNY_TEST_*`
env vars. Keep `src/libs/bunny.ts`.

## Out of scope

Online payment, access expiry, uploading to Bunny from the site, Enterprise DRM,
automatic progress for Bunny videos, a separate private bucket for paid files.

## Testing

- Unit tests for `access.ts` (unit resolution, price/admin/owner cases) and for
  the playback, resources and admin units routes (401/403/404/200, no key or
  locked file URL in responses).
- Manual: student without the unit sees locks and gets 403; after the admin
  ticks the unit the video plays; unticking locks it again immediately.
- `tsc`, eslint, prettier, full vitest run.
