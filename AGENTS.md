# OpenSpec Project Rules

This project uses OpenSpec for spec-driven development.

Before writing code:
- Read openspec/specs.
- Read active changes in openspec/changes.
- Follow proposal.md, design.md and tasks.md.

Development flow:

1. Understand the specification.
2. Review design decisions.
3. Implement tasks.
4. Update documentation if behavior changes.

## Tech Stack

This project uses:

### Frontend
- React 18.3.1
- React DOM 18.3.1
- TypeScript
- Webpack
- CSS Modules / CSS Loader
- style-loader
- css-loader

### State Management
- Redux Toolkit
- React Redux
- Redux Persist

### Routing
- React Router DOM 6.26.1

### Forms
- React Hook Form

### UI / Animation
- Framer Motion
- React Spinners
- Emotion is-prop-valid

### Utilities
- date-fns
- uuid
- country-state-city

### Backend Services
- Firebase

## Development Rules

- Do not introduce new frameworks without approval.
- Do not migrate to Vite, Next.js, or another build system.
- Keep Webpack as the project bundler.
- Prefer existing libraries before adding new dependencies.
- Follow existing React component patterns.
- Use TypeScript strictly.
- Use Redux Toolkit for global state.
- Use React Hook Form for complex forms.
- Use React Router DOM for navigation.
- Keep styling consistent with the existing CSS approach.

Before implementing features:
1. Check related OpenSpec specifications.
2. Review active changes in openspec/changes.
3. Follow proposal.md, design.md, and tasks.md.

## Architecture Guidelines

- Components should be reusable and isolated.
- Business logic should not be placed directly inside UI components.
- Use hooks for reusable logic.
- Keep Redux slices separated by domain.
- Keep Firebase interaction isolated from presentation components.
- Do not create unnecessary global state.
- Prefer existing project patterns over personal preferences.