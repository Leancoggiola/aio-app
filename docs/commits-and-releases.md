# Commits y Releases

Este proyecto usa **Conventional Commits** + **semantic-release** para automatizar el versionado y el CHANGELOG.

---

## Formato de commits

```
<type>(<scope>): <descripción>
```

### Types

| Type       | Versión que genera  | Cuándo usarlo                         |
| ---------- | ------------------- | ------------------------------------- |
| `feat`     | **minor** (`1.x.0`) | Nueva funcionalidad                   |
| `fix`      | **patch** (`1.0.x`) | Corrección de bug                     |
| `perf`     | **patch**           | Mejora de performance                 |
| `refactor` | —                   | Refactor sin cambio de comportamiento |
| `chore`    | —                   | Tareas de mantenimiento, deps, config |
| `docs`     | —                   | Solo documentación                    |
| `test`     | —                   | Solo tests                            |
| `build`    | —                   | Cambios en el sistema de build        |
| `ci`       | —                   | Cambios en CI/CD                      |
| `style`    | —                   | Formato, espacios (sin lógica)        |
| `revert`   | patch               | Revierte un commit anterior           |

> `BREAKING CHANGE:` en el footer (o `!` después del type) genera una versión **major** (`x.0.0`).

---

### Scopes válidos

Definidos en `commitlint.config.ts`:

| Scope           | Dónde aplica                   |
| --------------- | ------------------------------ |
| `api`           | `apps/api`                     |
| `web`           | `apps/web`                     |
| `shared`        | `packages/shared`              |
| `eslint-config` | `packages/eslint-config`       |
| `ts-config`     | `packages/typescript-config`   |
| `deps`          | Actualización de dependencias  |
| `release`       | Commits del proceso de release |
| `ci`            | Workflows de GitHub Actions    |

El scope es **opcional** pero recomendado en un monorepo.

---

### Ejemplos

```bash
feat(api): add refresh token rotation
fix(web): correct avatar upload validation
chore(deps): update prisma to 7.8.0
docs: add prisma command reference
feat(api)!: remove legacy /v1 endpoints   # BREAKING CHANGE → major
```

---

## Hooks locales (Husky)

| Hook         | Cuándo corre           | Qué hace                                               |
| ------------ | ---------------------- | ------------------------------------------------------ |
| `pre-commit` | Antes de cada commit   | `lint-staged`: eslint + prettier sobre archivos staged |
| `commit-msg` | Al escribir el mensaje | `commitlint` valida el formato del mensaje             |
| `pre-push`   | Antes de hacer push    | `prettier --check` + `tsc --noEmit` en todo el repo    |

Si un hook falla, el commit/push se cancela.

---

## Proceso de release

Los releases son **100% automáticos** al hacer push a `main`.

1. GitHub Actions corre el workflow `release.yml`
2. `semantic-release` analiza los commits desde el último tag
3. Determina la próxima versión según los types:
   - `fix`/`perf` → patch
   - `feat` → minor
   - `BREAKING CHANGE` → major
4. Actualiza `CHANGELOG.md` y `package.json`
5. Crea un tag y un GitHub Release
6. Si se creó un nuevo tag, dispara el deploy a Render automáticamente

> Commits con `chore`, `docs`, `test`, `ci` etc. **no generan release**.

---

## Flujo de trabajo recomendado

```bash
# Trabajar en develop o en una branch de feature
git checkout -b feat/my-feature

# Commitear con el formato correcto
git commit -m "feat(api): add user avatar endpoint"

# PR hacia main → CI corre tests, lint, type-check
# Al mergear a main → semantic-release crea el release automáticamente
```

---

## Configuración

| Archivo                         | Propósito                                |
| ------------------------------- | ---------------------------------------- |
| `.releaserc.json`               | Plugins y config de semantic-release     |
| `commitlint.config.ts`          | Reglas de formato de commits             |
| `lint-staged.config.mjs`        | Qué corre lint-staged sobre qué archivos |
| `.husky/`                       | Hooks de git                             |
| `.github/workflows/release.yml` | Workflow de CI para releases             |
