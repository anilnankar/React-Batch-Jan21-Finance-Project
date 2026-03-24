# Frontend Architecture (Finance Domain)

This frontend follows a **Next.js modular monolith** with **Atomic Design** and **feature-based folders**.

## Approach

- **Framework:** Next.js (App Router)
- **Architecture:** Modular monolith (single deployable frontend)
- **UI Structure:** Atomic Design (`atoms`, `molecules`, `organisms`, `templates`)
- **Business Structure:** Feature-first modules (`accounts`, `transactions`, `budgets`, `reports`, etc.)

## Why this approach

- Works well for finance products where consistency, auditability, and reliability are priorities.
- Keeps one codebase easy to govern while allowing domain ownership by feature.
- Avoids early micro-frontend complexity (routing federation, version drift, cross-app auth/state).
- Leaves a clean migration path to micro frontends later if team and release scale requires it.

## Folder template

```text
source-code/frontend
  public/
  src/
    app/
      (auth)/
        login/
        register/
      (dashboard)/
        overview/
        accounts/
        transactions/
        budgets/
        reports/
        settings/
      api/
      layout.tsx
      page.tsx
      globals.css

    components/
      atoms/
      molecules/
      organisms/
      templates/

    features/
      auth/
      accounts/
      transactions/
      budgets/
      reports/
      goals/
      notifications/
      compliance/

    lib/
      api-client/
      formatters/
      validators/
      constants/

    hooks/
    store/
    styles/
    types/
    config/
    tests/
      unit/
      integration/
      e2e/
```

## Standards for this project

- Keep domain logic inside `src/features/<domain>`.
- Keep reusable UI primitives inside `src/components/*` atomic layers.
- Use `src/lib` only for shared cross-feature utilities.
- Keep app routing in `src/app` and avoid business logic in route files.
- Prefer typed API contracts and centralized API client wrappers.
- Never store sensitive finance data in browser local storage.
- Keep client branding and theme values centralized in `src/config/client-config.ts`.

## Domain notes

- `accounts`: chart of accounts, balances, account metadata
- `transactions`: entry flows, transaction tables, filters, drill-down
- `budgets`: planning, limits, utilization indicators
- `reports`: P&L, cash-flow, trend visualizations
- `compliance`: audit-oriented UI concerns, traceable actions, policy views

## Next steps

- Bootstrap is in place: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `.gitignore`, `next-env.d.ts`. Run `npm install` then `npm run dev` from `source-code/frontend`.
- Add shared design tokens and theme strategy in `src/styles`.
- Add validation schemas and API boundaries per feature.
- Add unit/integration/e2e pipelines and coverage thresholds.

## Theme configuration

`src/config/client-config.ts` contains a strongly typed `clientUiConfig` object where each client can configure:

- color palette
- border radius and spacing tokens
- home page labels and support contact data

Use this config as the first source of UI customization before hardcoding style values in components.
