# API Folder Structure

This outlines the NestJS layout so new features slot in predictably.

1. `modules/<domain>/` contains:
   - `controllers/` (optional) that expose REST routes.
   - `services/` that orchestrate Prisma and business rules.
   - `dto/` for input validation using `class-validator`.
   - `guards/`, `decorators/`, and `interfaces/` as needed.
2. Shared dependencies such as `PrismaModule` and `ConfigModule` stay in `modules/prisma` and `shared/`.
3. Each module registers explicitly inside `AppModule` to map routes.
4. DTOs/interfaces should be mirrored in `packages/types` and consumed by the frontend `auth/services` adapters.

Add new modules by creating the folder, wiring it in `app.module.ts`, and publishing shared contracts through `@sniffles/types`.
