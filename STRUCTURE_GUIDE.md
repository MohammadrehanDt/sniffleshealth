# Structure Guide
Provides the default folder/layout conventions so both frontend and backend stay aligned as new features emerge.

## Monorepo layout
- `apps/web` is the Vite React SPA; treat `src/features/<domain>` as the primary feature layer with **`pages`**, **`components`**, **`hooks`**, and **`services`** subfolders. Keep design-system primitives in `components/ui` and shared layouts in `components/app-shell`.
- `apps/api` is the NestJS backend. Each bounded context lives under `modules/<domain>` and uses a predictable shape: `dto/`, `controllers`, `services`, `guards`, decorators, and Prisma access through `PrismaModule`.
- `packages/types`, `packages/ui`, `packages/utils`, and `packages/config` hold shared contracts, primitives, helpers, and toolchains so both apps can stay in sync via workspace imports.

## Frontend conventions (`apps/web`)
1. **Entry layer**: `main.tsx`, `App.tsx`, and `lib` (“api.ts”, utilities) remain small and only bootstrap providers or global providers.
2. **Features**: Create a folder for each domain (e.g., `auth`, `consultation`, `appointments`). Within each:
   - `pages/` holds route components wired from `App.tsx`.
   - `components/` holds reusable view pieces scoped to that domain.
   - `services/` contains API adapters (using `apiRequest`) and shared fixtures.
   - `hooks/` (or referencable from `hooks/` at the top level) contain reusable UI or data logic.
3. **Layout**: `components/app-shell` now owns the sidebar/header/page wrapper used across dashboards; page-specific wrappers live inside `features`.
4. **State**: Keep persisted stores in `stores/` (e.g. auth, consultation progress) and only expose read/write hooks through `features`.
5. **Assets/constants**: Use `constants/` for routes/colors/fonts/config so story-driven UI can rely on stable tokens.

## Backend conventions (`apps/api`)
1. **Module shape**: Each module registers controllers, services, DTOs, guards, and Prisma access. Place shared DTOs inside `modules/<domain>/dto/` and keep interfaces in `packages/types`.
2. **Shared config**: `shared/env.schema.ts` defines required envvars consumed by `ConfigModule`.
3. **Prisma**: Keep schema, migrations, and service wrappers inside `prisma/`. Import `PrismaModule` into feature modules and avoid crossing modules horizontally; surface new DB queries via service methods.
4. **Guards & decorators**: Extend `auth/guards` and `auth/decorators` for RBAC, reuse them with `@Roles()` or `@UseGuards()` as needed.

## Growth tips
- When adding a new domain, create matching folders in both `apps/web/src/features` and `apps/api/src/modules`, keep DTOs mirrored through `@sniffles/types`, and reuse the shell/layout.
- Prefer `packages/*` for reusable tooling rather than duplicating across apps (UI primitives, shared types, environment helpers).
- Document new contracts in `STRUCTURE_GUIDE.md` and keep `constants/routes.ts` updated so React Router mapping stays consistent.
