# Paid units: access expiry

Date: 2026-11-22. Branch: `feat/unit-access-expiry`.
Builds on `2026-10-25-paid-units-design.md`, which said "access never expires".

## Goal

Access to a paid unit lasts one Tawjihi school year. Each unit a student owns
has its own end date, after which it locks again and the student can renew it.

## Rules

- **Cutoff:** a unit opened on any date closes on **31 August of (the opening
  year + 1), 23:59 Asia/Jerusalem**. The opening year is the year in Jerusalem
  at the moment the admin saves. Example: opened 22/11/2026 → closes
  31/08/2027 23:59.
  - The rule lives in one constant, `UNIT_ACCESS_CUTOFF` in `src/libs/access.ts`.
  - Note: a unit opened between January and August also closes on 31/8 of the
    *next* year (opened 03/2027 → 31/08/2028). This is what was asked; change
    the constant's rule if that is not wanted.
- Per student, per unit. Units are still bought and opened separately.
- **Admin override:** the admin can set any student's end date for any unit by
  hand. A picked date means 23:59 Jerusalem on that day.
- Re-saving the dialog keeps the end date of units still open. Ticking an
  expired unit renews it with a fresh cutoff. Unticking an open unit revokes it.
- An expired unit behaves exactly like one never bought (videos and files
  locked, paywall shown), and the paywall says when it ended and offers renewal.
- Admins still open everything.

## Data

| Model  | Change                                                                 |
| ------ | ---------------------------------------------------------------------- |
| `User` | `unitGrants UnitGrant[]` (composite type `{ unitId, expiresAt }`)       |
| `User` | `unlockedUnitIds` removed from the Prisma schema (left in the DB, unused) |

Expired grants stay in the list as history (admin and student see when it
ended). There is at most one grant per unit.

## Migration

`scripts/backfill-unit-grants.ts`: every user with `unlockedUnitIds` and no
`unitGrants` gets one grant per unit, ending **31/08/2027 23:59 Jerusalem**
(from the constant). It does not remove `unlockedUnitIds`, so the old
deployment keeps working until the new one is live, and it is safe to rerun.

Order: run the backfill on production, **then** deploy. Deploying first locks
every current subscriber until the backfill runs.

## Server

- `getViewer()` reads `unitGrants`; `viewer.unlockedUnitIds` becomes the units
  whose grant has not ended. `canOpenUnit`, the playback/thumbnail routes and
  `getResources` keep working through it unchanged.
- `getResources` adds `access.accessEndsAt` (ISO, the viewer's grant on this
  unit, open or ended, else null).
- `PUT /api/user/[id]/units` body: `{ unitIds: string[], expiresAt?: { [unitId]: "YYYY-MM-DD" } }`.
  `expiresAt` keys must be in `unitIds`; dates must be valid. Returns the user
  with `unitGrants`.
- Admin users list: the "subscribers" filter counts only grants still open.

## UI

- Units dialog (admin): each ticked unit shows a date field with its end date;
  new or renewed units default to the cutoff (field empty = default). Unticked
  units that expired show "انتهت في …".
- Users list: unit chips show "حتى …" (green) or "انتهت …" (grey).
- Paywall: an expired unit says "انتهى اشتراكك … بتاريخ …" and the WhatsApp
  button says "جدّد"; the prefilled message asks to renew.

## Out of scope

Reminders before expiry, "days left" banner for students, self-service payment.
