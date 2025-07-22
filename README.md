# GraphQL Project

This is a structured GraphQL project with multiple branches for development workflow.

## Branches

- `master` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature branches for development
- `hotfix` - Critical bug fixes

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the GraphQL Playground at `http://localhost:4000`

## Project Structure

```
src/
├── client/         # Frontend code (if applicable)
├── models/         # Database models
├── resolvers/      # GraphQL resolvers
├── schema/         # GraphQL type definitions
├── server/         # Server configuration
└── utils/          # Utility functions
```

## Development Workflow

1. Create a feature branch from `develop`:
   ```bash
   git checkout -b feature/your-feature-name develop
   ```

2. Make your changes and commit them

3. Push your branch and create a pull request to `develop`

4. After review, merge into `develop`

5. When ready for production, merge `develop` into `master`
