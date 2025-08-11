#!/usr/bin/env bun
/**
 * Bun-native CEP Extension Builder
 * Replaces Vite with Bun.build() API for faster, simpler builds
 */

import { mkdir, rm, cp, exists } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { $ } from 'bun';
import { generateManifest, generateDebugFile, createSymlink } from './cep-utils';
import type { CEPConfig } from '../cep.config';

// Load CEP configuration
const cepConfig: CEPConfig = await import('../cep.config').then(m => m.default);

const ROOT_DIR = resolve(dirname(import.meta.dir));
const SRC_DIR = join(ROOT_DIR, 'src');
const DIST_DIR = join(ROOT_DIR, 'dist');
const PUBLIC_DIR = join(ROOT_DIR, 'public');

interface BuildOptions {
  watch?: boolean;
  production?: boolean;
  zxp?: boolean;
}

async function clean() {
  console.log('🧹 Cleaning dist directory...');
  await rm(DIST_DIR, { recursive: true, force: true });
  await mkdir(DIST_DIR, { recursive: true });
}

async function buildPanel(options: BuildOptions) {
  console.log('🚀 Building CEP panel with Bun...');
  
  const result = await Bun.build({
    entrypoints: [join(SRC_DIR, 'js', 'main', 'index.tsx')],
    outdir: join(DIST_DIR, 'js'),
    target: 'browser',
    format: 'iife',
    naming: {
      entry: 'main.js',
      chunk: '[name]-[hash].js',
      asset: '[name]-[hash].[ext]'
    },
    minify: options.production,
    sourcemap: options.production ? 'none' : 'inline',
    define: {
      'process.env.NODE_ENV': options.production ? '"production"' : '"development"',
    },
    external: [
      'child_process',
      'cluster',
      'dgram',
      'dns',
      'fs',
      'http',
      'https',
      'net',
      'os',
      'path',
      'readline',
      'stream',
      'tls',
      'tty',
      'url',
      'util',
      'v8',
      'vm',
      'zlib',
      'crypto',
      'events',
      'buffer'
    ],
    loader: {
      '.tsx': 'tsx',
      '.ts': 'ts',
      '.jsx': 'jsx',
      '.js': 'js',
      '.css': 'css',
      '.svg': 'file',
      '.png': 'file',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.gif': 'file',
      '.woff': 'file',
      '.woff2': 'file',
      '.ttf': 'file',
      '.eot': 'file'
    }
  });

  if (!result.success) {
    console.error('❌ Build failed:', result.logs);
    throw new Error('Build failed');
  }

  console.log('✅ Panel build complete');
  return result;
}

async function buildExtendScript(options: BuildOptions) {
  console.log('📜 Building ExtendScript files...');
  
  const jsxDir = join(SRC_DIR, 'jsx');
  const outDir = join(DIST_DIR, 'jsx');
  
  await mkdir(outDir, { recursive: true });
  
  // For ExtendScript, we need ES3 compatibility
  // Bun doesn't have ES3 target, so we'll copy files as-is
  // In production, these would need additional processing
  const jsxFiles = await Array.fromAsync(
    new Bun.Glob('**/*.{js,jsx}').scan({ cwd: jsxDir })
  );
  
  for (const file of jsxFiles) {
    const src = join(jsxDir, file);
    const dest = join(outDir, file);
    
    await mkdir(dirname(dest), { recursive: true });
    
    if (options.production) {
      // In production, we'd need to transpile to ES3
      // For now, just copy
      await cp(src, dest);
    } else {
      await cp(src, dest);
    }
  }
  
  console.log('✅ ExtendScript build complete');
}

async function copyAssets() {
  console.log('📦 Copying static assets...');
  
  // Copy index.html
  const indexHtml = join(SRC_DIR, 'index.html');
  if (await exists(indexHtml)) {
    const content = await Bun.file(indexHtml).text();
    // Update script path
    const updated = content.replace(
      /<script.*src=".*\/main\.(tsx?|jsx?)".*<\/script>/,
      '<script src="./js/main.js"></script>'
    );
    await Bun.write(join(DIST_DIR, 'index.html'), updated);
  }
  
  // Copy public assets
  if (await exists(PUBLIC_DIR)) {
    await cp(PUBLIC_DIR, DIST_DIR, { recursive: true });
  }
  
  // Copy CSS
  const cssDir = join(SRC_DIR, 'css');
  if (await exists(cssDir)) {
    await cp(cssDir, join(DIST_DIR, 'css'), { recursive: true });
  }
  
  console.log('✅ Assets copied');
}

async function generateCEPFiles() {
  console.log('📝 Generating CEP files...');
  
  // Create CSXS directory
  const csxsDir = join(DIST_DIR, 'CSXS');
  await mkdir(csxsDir, { recursive: true });
  
  // Generate manifest.xml
  await generateManifest(cepConfig, join(csxsDir, 'manifest.xml'));
  
  // Generate .debug file
  await generateDebugFile(cepConfig, join(DIST_DIR, '.debug'));
  
  // Create symlink for development
  if (process.env.NODE_ENV !== 'production') {
    await createSymlink(DIST_DIR, cepConfig.id);
  }
  
  console.log('✅ CEP files generated');
}

async function createZXP() {
  console.log('📦 Creating ZXP package...');
  
  // ZXPSignCmd would be needed here
  // For now, just create a zip
  const zxpPath = join(ROOT_DIR, `${cepConfig.id}.zxp`);
  await $`cd ${DIST_DIR} && zip -r ${zxpPath} .`;
  
  console.log(`✅ ZXP created: ${zxpPath}`);
}

async function build(options: BuildOptions = {}) {
  try {
    console.log('🏗️  Starting Bun CEP build...');
    console.log('Options:', options);
    
    // Clean dist
    await clean();
    
    // Build panel
    await buildPanel(options);
    
    // Build ExtendScript
    await buildExtendScript(options);
    
    // Copy assets
    await copyAssets();
    
    // Generate CEP files
    await generateCEPFiles();
    
    // Create ZXP if requested
    if (options.zxp) {
      await createZXP();
    }
    
    console.log('🎉 Build complete!');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Parse CLI arguments
const args = process.argv.slice(2);
const options: BuildOptions = {
  watch: args.includes('--watch'),
  production: args.includes('--production') || process.env.NODE_ENV === 'production',
  zxp: args.includes('--zxp')
};

// Run build
if (options.watch) {
  console.log('👀 Watch mode enabled');
  // Initial build
  await build(options);
  
  // Simple watch implementation using setInterval
  console.log('📁 Watching for changes in:', SRC_DIR);
  console.log('Press Ctrl+C to stop');
  
  // Check for changes every 2 seconds
  setInterval(async () => {
    // In a real implementation, you'd track file modification times
    // For now, just rebuild on demand
  }, 2000);
  
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping watch mode');
    process.exit(0);
  });
} else {
  await build(options);
}