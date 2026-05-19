# Playwright Testing con MCP

Guía para usar Playwright MCP sin contaminar el workspace con archivos innecesarios.

## 🚫 Problema original

El MCP de Playwright genera archivos `.md` y `.png` en el directorio raíz cuando usas `browser_snapshot` y `browser_take_screenshot` sin especificar rutas.

**Resultado:** Workspace sucio con archivos como `profile-page.md`, `login-after-attempt.png`, etc.

## ✅ Solución

### 1. Usar rutas relativas con subdirectorio

Siempre especifica un directorio de salida cuando uses Playwright MCP:

```bash
# ✅ CORRECTO - Usa subdirectorio
browser_snapshot(filename: ".playwright-output/profile-page.md")
browser_take_screenshot(filename: ".playwright-output/profile-after-save.png")

# ❌ INCORRECTO - Archivo en raíz
browser_snapshot(filename: "profile-page.md")
browser_take_screenshot(filename: "profile-after-save.png")
```

### 2. .gitignore está configurado

Ya está en el `.gitignore`:

```gitignore
.playwright-output/
*.playwright-*.md
*.playwright-*.png
*.playwright-*.log
```

Si se genera algo en raíz accidentalmente, será ignorado por git.

## 📝 Ejemplo: Workflow correcto

### Caso: Validar página de perfil

**Prompt para Cursor:**

```
Usa Playwright para validar la página de perfil:
1. Navega a http://localhost:5173/profile
2. Toma un snapshot y guárdalo en ".playwright-output/profile-snapshot.md"
3. Verifica que haya un botón "Guardar Cambios"
4. Toma una screenshot en ".playwright-output/profile-visual.png"
```

**Resultado:** Los archivos van a `.playwright-output/` en lugar de la raíz.

## 🔧 Configuración MCP (opcional)

Si quieres que Playwright siempre use un directorio por defecto, puedes configurar en tu `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--output-dir", ".playwright-output"]
    }
  }
}
```

(Nota: Verifica si `@playwright/mcp` soporta este flag en su versión actual)

## 🗑️ Limpiar archivos existentes

```bash
rm -rf .playwright-output/
rm -f *.playwright-*.md
rm -f *.playwright-*.png
```

## 📌 Reglas rápidas

| Acción              | Comando                                                            |
| ------------------- | ------------------------------------------------------------------ |
| Snapshot de página  | `browser_snapshot(filename: ".playwright-output/NAME.md")`         |
| Screenshot visual   | `browser_take_screenshot(filename: ".playwright-output/NAME.png")` |
| Logs de consola     | Úsalo sin archivo, mira en output del MCP                          |
| Archivos temporales | Siempre en `.playwright-output/` o `.playwright-mcp/`              |

## 💡 Tips

- `.playwright-mcp/` se genera automáticamente por el MCP (ya está ignorado)
- `.playwright-output/` es tu directorio para outputs controlados (agrega aquí lo que necesites)
- **No commites archivos de testing** - el `.gitignore` lo protege

---

**Resumen:** Siempre usa `filename: ".playwright-output/something.md"` cuando llames a Playwright MCP.
