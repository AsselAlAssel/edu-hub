# Unit Access Expiry Implementation Plan

**Goal:** Paid-unit access ends on 31/8 of (opening year + 1), 23:59 Jerusalem; the admin can override per student and unit.

**Architecture:** Replace `User.unlockedUnitIds` with a `unitGrants` composite list. The cutoff rule is one constant in `src/libs/access.ts`; `getViewer` derives the open units, so every existing access check keeps working. Client-safe grant helpers live in `src/libs/unitGrants.ts` (no Prisma import).

Spec: `docs/superpowers/specs/2026-11-22-unit-access-expiry-design.md`.

## Constraints

- Never run `prisma db push`, `migrate` or the backfill from here. The user runs the backfill on production before deploying.
- `prisma generate` must be run locally (the agent VM cannot download Prisma engines).
- No pushing; no commits unless asked.

## Tasks

### Task 1: Time zone + cutoff
- [x] `src/libs/zonedTime.ts`: `zonedDate(y, m, d, h, min, tz)` and `yearIn(date, tz)` via `Intl`.
- [x] `src/libs/access.ts`: `UNIT_ACCESS_CUTOFF`, `unitAccessEnd(openedAt)`, `unitAccessEndInYear(year)`, `unitAccessEndOn("YYYY-MM-DD")`.
- [x] Tests: Nov 2026 → `2027-08-31T20:59Z`; admin date → 23:59 Jerusalem (winter and summer offsets).

### Task 2: Grants
- [x] `prisma/schema.prisma`: `type UnitGrant`, `User.unitGrants`; drop `unlockedUnitIds`.
- [x] `src/libs/unitGrants.ts`: `isGrantActive`, `activeUnitIds`, `findGrant`, `nextUnitGrants(current, unitIds, { freshEnd, overrides, now })`.
- [x] Tests: new unit → cutoff; open unit keeps date; expired renews; override wins; dropped open unit revoked; expired history kept.

### Task 3: Server
- [x] `getViewer` reads `unitGrants`, derives `unlockedUnitIds`.
- [x] `getResources` → `access.accessEndsAt`.
- [x] `PUT /api/user/[id]/units` accepts `expiresAt` overrides, validates, writes `unitGrants`.
- [x] `publicUserSelect`, `usersWhere` (open grants only), `unitCount`.
- [x] Tests: playback 403 after expiry, resources locked after expiry, PUT overrides/validation.

### Task 4: UI
- [x] `UnitsDialog`: date field per ticked unit, notes for expired units, sends changed dates only.
- [x] `UsersPanel`: chips with end date / ended.
- [x] `PaywallDialog` + `ResourcesPage`: renewal wording when expired.

### Task 5: Migration + seed
- [x] `scripts/backfill-unit-grants.ts` (31/08/2027 from the constant).
- [x] `scripts/seed-qa.mts`, `tests/qa/1-api.spec.ts`.

### Task 6: Verify (locally, on Windows)
- [ ] `npx prisma generate && npx tsc --noEmit && npm run check-style && npm test`
- [ ] Run the backfill against production, then deploy.
