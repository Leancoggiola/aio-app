# Playwright MCP

Usá Playwright MCP sin dejar basura en la raíz del repo.

## Regla

Siempre pasá `filename` bajo `.playwright-output/`:

```text
browser_snapshot(filename: ".playwright-output/profile-page.md")
browser_take_screenshot(filename: ".playwright-output/profile-visual.png")
```

Sin ruta → el MCP escribe `.md`/`.png` en la raíz.

## Gitignore

Ya ignorado:

```gitignore
.playwright-output/
.playwright-mcp/
*.playwright-*.md
*.playwright-*.png
*.playwright-*.log
```

## Ejemplo de prompt

```text
Usa Playwright en http://localhost:5173/profile:
1. Snapshot en ".playwright-output/profile-snapshot.md"
2. Screenshot en ".playwright-output/profile-visual.png"
3. Verificá que exista el botón de guardar
```

## Limpieza local

```bash
rm -rf .playwright-output/ .playwright-mcp/
```
