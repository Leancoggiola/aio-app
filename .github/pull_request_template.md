## Ticket

Closes #

## Resumen

<!-- Qué cambia y por qué (1–3 frases). -->

## Área

- [ ] api
- [ ] web
- [ ] mobile
- [ ] shared
- [ ] infra / docs

## Checklist

- [ ] Issue en Omni Roadmap en **En revisión**
- [ ] Branch sigue `feat/#N-slug`, `fix/#N-slug` o `chore/#N-slug`
- [ ] Si toca contrato: orden `shared` → `api` → clientes
- [ ] Verificación local según área (ver `AGENTS.md`):

```bash
# web
pnpm --filter web check-types && pnpm --filter web lint && pnpm --filter web check-api-paths && pnpm --filter web test

# mobile
pnpm --filter mobile check-types && pnpm --filter mobile lint

# api (si aplica)
pnpm --filter api test
```

## Notas / capturas

<!-- Opcional -->
