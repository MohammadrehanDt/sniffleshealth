# Web App Folder Structure
Use this as a checklist whenever you add a new feature so the work stays modular.

1. **Core**:
   - `main.tsx` / `App.tsx`: Only import providers (`QueryClient`, `Router`, `AuthBootstrap`) and expose `<Routes>`; keep UI details inside `features`.
   - `global.css`: Define tokens/utility classes; avoid feature logic.
2. **Components**:
   - `components/ui/`: Design-system primitives (buttons, inputs, cards, badges, tables, status wrappers).
   - `components/app-shell/`: Shared layout for dashboards (sidebar/header/wrapper).
   - `components/layout/`: Small reusable pieces (Logo, PageHeader) used cautiously within features.
3. **Features**:
   - Each folder under `src/features` should include `pages/`, `components/`, `services/`, `hooks/`, and optionally `constants/`.
   - Keep API adapters in `features/*/services` and avoid scatter by referencing `libs` or `packages`.
4. **State + Utilities**:
   - `stores/` contain Zustand slices; only expose selectors as needed.
   - `lib/` holds shared helpers (`api.ts`, `utils`).
5. **Assets**:
   - `constants/routes.ts` drives React Router; update it whenever you add a route.
   - Use `constants/colors.ts` and `constants/fonts.ts` for tokens referenced in Figma.

Following this structure makes it straightforward to add new patient or physician screens from your Figma designs without reworking folder conventions.
