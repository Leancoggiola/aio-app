#!/usr/bin/env node
/**
 * Scaffold a new web feature. Usage:
 *   pnpm web:new-feature gym --register-route --register-nav
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(webRoot, 'src');
const featuresRoot = path.join(srcRoot, 'features');

const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const positional = args.filter(a => !a.startsWith('--'));

const name = positional[0];
if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error(
    'Usage: pnpm web:new-feature <kebab-name> [--path /x] [--module main] [--register-route] [--register-nav] [--no-nav]'
  );
  process.exit(1);
}

const routePath = getFlagValue('--path') ?? `/${name}`;
const moduleName = getFlagValue('--module') ?? 'main';
const registerRoute = flags.has('--register-route');
const registerNav = flags.has('--register-nav');
const noNav = flags.has('--no-nav');

const featureDir = path.join(featuresRoot, name);
if (fs.existsSync(featureDir)) {
  console.error(`Feature already exists: ${featureDir}`);
  process.exit(1);
}

const pascal = name
  .split('-')
  .map(s => s.charAt(0).toUpperCase() + s.slice(1))
  .join('');
const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);

ensureDir(featureDir);
ensureDir(path.join(featureDir, 'modules', moduleName, 'components', `${pascal}Placeholder`));
ensureDir(path.join(featureDir, 'modules', moduleName, 'hooks'));

write(
  path.join(featureDir, 'modules', moduleName, 'components', `${pascal}Placeholder`, `${pascal}Placeholder.tsx`),
  `import { Text } from '@mantine/core';

import type { FC } from 'react';

export const ${pascal}Placeholder: FC = () => {
  return <Text c="dimmed">${pascal} — en construcción</Text>;
};
`
);
write(
  path.join(featureDir, 'modules', moduleName, 'components', `${pascal}Placeholder`, 'index.ts'),
  `export { ${pascal}Placeholder } from './${pascal}Placeholder';\n`
);
write(
  path.join(featureDir, 'modules', moduleName, 'components', 'index.ts'),
  `export { ${pascal}Placeholder } from './${pascal}Placeholder';\n`
);
write(path.join(featureDir, 'modules', moduleName, 'hooks', 'index.ts'), '');
write(
  path.join(featureDir, 'modules', moduleName, 'index.ts'),
  `export { ${pascal}Placeholder } from './components';\n`
);
write(path.join(featureDir, 'modules', 'index.ts'), `export { ${pascal}Placeholder } from './${moduleName}';\n`);

write(
  path.join(featureDir, `${name}.page.tsx`),
  `import { ${pascal}Placeholder } from './modules/${moduleName}';

import type { FC } from 'react';

export const ${pascal}Page: FC = () => {
  return <${pascal}Placeholder />;
};
`
);

write(
  path.join(featureDir, `${name}.routes.tsx`),
  `import { RouteObject } from 'react-router-dom';

import { ${pascal}Page } from './${name}.page';

export const ${camel}Route: RouteObject = {
  path: '${routePath}',
  element: <${pascal}Page />,
};
`
);

write(
  path.join(featureDir, 'index.ts'),
  `export { ${camel}Route } from './${name}.routes';\n${noNav ? '' : `export { ${camel}NavItem } from './${name}.nav';\n`}`
);

if (!noNav) {
  write(
    path.join(featureDir, `${name}.nav.tsx`),
    `import { HouseIcon } from '@phosphor-icons/react';

import type { NavItemConfig } from '@/layouts/navConfig';

const iconSize = '1.25rem';

export const ${camel}NavItem: NavItemConfig = {
  label: '${pascal}',
  path: '${routePath}',
  disabled: true,
  icon: <HouseIcon size={iconSize} />,
};
`
  );
}

if (registerRoute) {
  appendRoute(name, camel);
}
if (registerNav && !noNav) {
  console.log('\nRemember to add the feature key to MAIN_NAV_ORDER in app/navigation/nav-registry.tsx');
}

console.log(`\nCreated feature: src/features/${name}/`);
console.log('\nNext steps:');
console.log('  1. Add SWR keys in shared/api/keys.ts if needed');
console.log('  2. Update icon/label in', `${name}.nav.tsx`);
if (!registerRoute) console.log('  3. Register route in app/routes.ts');
if (!registerNav && !noNav) console.log('  4. Register nav in app/navigation/nav-registry.tsx');
console.log('  5. pnpm --filter web check-types && pnpm --filter web test');

function getFlagValue(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function appendRoute(name, camel) {
  const routesFile = path.join(srcRoot, 'app', 'routes.ts');
  let content = fs.readFileSync(routesFile, 'utf8');
  const importLine = `import { ${camel}Route } from '@/features/${name}';`;
  if (!content.includes(importLine)) {
    content = content.replace(/(import \{ profileRoute \} from '@\/features\/profile';)/, `$1\n${importLine}`);
  }
  const routeRef = `${camel}Route`;
  if (
    !content.includes(`protectedRoutes = [${routeRef}`) &&
    !content.match(new RegExp(`protectedRoutes = \\[[^\\]]*${routeRef}`))
  ) {
    content = content.replace(/export const protectedRoutes = (\[[^\]]+\])/, (_, arr) => {
      const inner = arr.slice(1, -1).trim();
      return `export const protectedRoutes = [${inner}, ${routeRef}]`;
    });
  }
  fs.writeFileSync(routesFile, content, 'utf8');
  console.log('Updated app/routes.ts');
}
