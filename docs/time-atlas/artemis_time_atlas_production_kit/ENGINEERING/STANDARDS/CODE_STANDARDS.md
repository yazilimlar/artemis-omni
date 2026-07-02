# Code Standards

## TypeScript

- Use strict types.
- Avoid `any`.
- Define shared types in `types/time-atlas/index.ts`.
- UI components should receive typed props.
- Do not embed historical data inside components.

## React

- Keep the 3D scene isolated from page shell.
- Use dynamic imports where needed for client-only 3D.
- Use memoization for repeated geometry/data transforms.
- Avoid storing large objects in React state.

## File Naming

- React components: PascalCase.
- Hooks: `useSomething.ts`.
- Data files: camelCase.
- Types: exported interfaces and literal union types.

## Build Checks

Run before completion:

```bash
npm run lint
npm run build
```
