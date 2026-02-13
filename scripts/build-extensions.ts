import * as fs from 'fs';
import * as path from 'path';

const EXTENSIONS_DIR = 'extensions';
const OUTPUT_MANIFEST = 'extensions.json';
const APP_DIR = 'src/app/(routegroups)';
const COMPONENTS_DIR = 'src/components/extensions';
const LIB_DIR = 'src/lib/extensions';

type ExtensionManifest = {
  meta: { name: string; version: string; description?: string };
  navigation?: { items?: unknown[]; sections?: unknown[] };
  pages?: { route: string; requiredRoles?: string[] }[];
  slots?: unknown[];
  features?: Record<string, boolean>;
};

function findExtensions(): string[] {
  if (!fs.existsSync(EXTENSIONS_DIR)) {
    console.log(`No ${EXTENSIONS_DIR}/ directory found`);
    return [];
  }
  return fs.readdirSync(EXTENSIONS_DIR).filter(name => {
    const extPath = path.join(EXTENSIONS_DIR, name);
    const manifestPath = path.join(extPath, 'extension.json');
    return fs.statSync(extPath).isDirectory() && fs.existsSync(manifestPath);
  });
}

function loadManifest(extName: string): ExtensionManifest | null {
  try {
    const content = fs.readFileSync(path.join(EXTENSIONS_DIR, extName, 'extension.json'), 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Failed to load manifest for ${extName}:`, err);
    return null;
  }
}

function copyRecursive(src: string, dest: string): void {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
    console.log(`    ${dest}`);
  }
}

function copyPages(extName: string): void {
  const pagesDir = path.join(EXTENSIONS_DIR, extName, 'pages');
  if (!fs.existsSync(pagesDir)) return;
  console.log(`  Copying pages...`);
  copyRecursive(pagesDir, APP_DIR);
}

function copyComponents(extName: string): void {
  const componentsDir = path.join(EXTENSIONS_DIR, extName, 'components');
  if (!fs.existsSync(componentsDir)) return;
  const destDir = path.join(COMPONENTS_DIR, extName);
  console.log(`  Copying components...`);
  copyRecursive(componentsDir, destDir);
}

function copyLib(extName: string): void {
  const libDir = path.join(EXTENSIONS_DIR, extName, 'lib');
  if (!fs.existsSync(libDir)) return;
  const destDir = path.join(LIB_DIR, extName);
  console.log(`  Copying lib...`);
  copyRecursive(libDir, destDir);
}

function main(): void {
  console.log('Building extensions...\n');
  const extensions = findExtensions();
  console.log(`Found ${extensions.length} extension(s): ${extensions.join(', ') || '(none)'}\n`);

  const manifests: ExtensionManifest[] = [];
  for (const extName of extensions) {
    console.log(`Processing: ${extName}`);
    const manifest = loadManifest(extName);
    if (!manifest) continue;
    copyPages(extName);
    copyComponents(extName);
    copyLib(extName);
    manifests.push(manifest);
    console.log(`  ✓ ${manifest.meta.name} v${manifest.meta.version}\n`);
  }

  fs.writeFileSync(OUTPUT_MANIFEST, JSON.stringify({ extensions: manifests }, null, 2));
  console.log(`\nWrote ${OUTPUT_MANIFEST} with ${manifests.length} extension(s)`);
}

main();
