/**
 * CEP-specific utilities for Bun builder
 * Handles manifest generation, debug files, and symlinks
 */

import { writeFile, symlink, unlink, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir, platform } from 'node:os';

export interface CEPConfig {
  id: string;
  version: string;
  name: string;
  displayName: string;
  description?: string;
  iconNormal?: string;
  iconDarkNormal?: string;
  iconRollover?: string;
  iconDarkRollover?: string;
  parameters?: string[];
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  host: {
    app: string;
    version: string;
  }[];
  requiredRuntimes: {
    CSXS: string;
  };
  type?: 'Panel' | 'ModalDialog' | 'Modeless' | 'Custom';
  scriptPath?: string;
  autoVisible?: boolean;
  panelDisplayName?: string | Record<string, string>;
  lifecycle?: {
    autoVisible?: boolean;
    startOnEvents?: string[];
  };
}

/**
 * Generate manifest.xml for CEP extension
 */
export async function generateManifest(config: CEPConfig, outputPath: string) {
  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<ExtensionManifest Version="${config.requiredRuntimes.CSXS}" ExtensionBundleId="${config.id}" ExtensionBundleVersion="${config.version}" ExtensionBundleName="${config.displayName}"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <ExtensionList>
    <Extension Id="${config.id}" Version="${config.version}" />
  </ExtensionList>
  <ExecutionEnvironment>
    <HostList>
      ${config.host.map(h => `<Host Name="${h.app}" Version="${h.version}" />`).join('\n      ')}
    </HostList>
    <LocaleList>
      <Locale Code="All" />
    </LocaleList>
    <RequiredRuntimeList>
      <RequiredRuntime Name="CSXS" Version="${config.requiredRuntimes.CSXS}" />
    </RequiredRuntimeList>
  </ExecutionEnvironment>
  <DispatchInfoList>
    <Extension Id="${config.id}">
      <DispatchInfo>
        <Resources>
          <MainPath>./index.html</MainPath>
          ${config.scriptPath ? `<ScriptPath>${config.scriptPath}</ScriptPath>` : ''}
          <CEFCommandLine>
            ${(config.parameters || []).map(p => `<Parameter>${p}</Parameter>`).join('\n            ')}
          </CEFCommandLine>
        </Resources>
        <Lifecycle>
          <AutoVisible>${config.autoVisible !== false}</AutoVisible>
          ${config.lifecycle?.startOnEvents ? 
            `<StartOn>
              ${config.lifecycle.startOnEvents.map(e => `<Event>${e}</Event>`).join('\n              ')}
            </StartOn>` : ''}
        </Lifecycle>
        <UI>
          <Type>${config.type || 'Panel'}</Type>
          <Menu>${config.panelDisplayName || config.displayName}</Menu>
          <Geometry>
            ${config.width ? `<Size><Width>${config.width}</Width><Height>${config.height || 600}</Height></Size>` : ''}
            ${config.minWidth ? `<MinSize><Width>${config.minWidth}</Width><Height>${config.minHeight || 400}</Height></MinSize>` : ''}
            ${config.maxWidth ? `<MaxSize><Width>${config.maxWidth}</Width><Height>${config.maxHeight || 9999}</Height></MaxSize>` : ''}
          </Geometry>
          ${config.iconNormal ? `
          <Icons>
            <Icon Type="Normal">${config.iconNormal}</Icon>
            ${config.iconDarkNormal ? `<Icon Type="DarkNormal">${config.iconDarkNormal}</Icon>` : ''}
            ${config.iconRollover ? `<Icon Type="RollOver">${config.iconRollover}</Icon>` : ''}
            ${config.iconDarkRollover ? `<Icon Type="DarkRollOver">${config.iconDarkRollover}</Icon>` : ''}
          </Icons>` : ''}
        </UI>
      </DispatchInfo>
    </Extension>
  </DispatchInfoList>
</ExtensionManifest>`;

  await writeFile(outputPath, manifest, 'utf-8');
  console.log(`  ✓ manifest.xml generated`);
}

/**
 * Generate .debug file for development
 */
export async function generateDebugFile(config: CEPConfig, outputPath: string) {
  const debugContent = `<?xml version="1.0" encoding="UTF-8"?>
<ExtensionList>
  <Extension Id="${config.id}">
    <HostList>
      ${config.host.map(h => `<Host Name="${h.app}" Port="9000" />`).join('\n      ')}
    </HostList>
  </Extension>
</ExtensionList>`;

  await writeFile(outputPath, debugContent, 'utf-8');
  console.log(`  ✓ .debug file generated`);
}

/**
 * Create symlink in CEP extensions folder for development
 */
export async function createSymlink(sourceDir: string, extensionId: string) {
  // macOS only
  const extensionsPath = join(homedir(), 'Library', 'Application Support', 'Adobe', 'CEP', 'extensions');
  
  const linkPath = join(extensionsPath, extensionId);
  
  try {
    // Create extensions directory if it doesn't exist
    await mkdir(extensionsPath, { recursive: true });
    
    // Remove existing symlink if it exists
    try {
      await unlink(linkPath);
    } catch (e) {
      // Ignore if doesn't exist
    }
    
    // Create new symlink
    await symlink(sourceDir, linkPath, 'dir');
    console.log(`  ✓ Symlink created: ${linkPath}`);
  } catch (error) {
    console.error(`  ✗ Failed to create symlink: ${error}`);
  }
}

/**
 * Parse host string (e.g., "PPRO@25.0") into app and version
 */
export function parseHost(hostString: string): { app: string; version: string } {
  const [app, version] = hostString.split('@');
  return { app, version: version || '[0.0]' };
}

/**
 * Get display name for locale
 */
export function getLocalizedString(
  value: string | Record<string, string>,
  locale: string = 'en_US'
): string {
  if (typeof value === 'string') {
    return value;
  }
  return value[locale] || value['en_US'] || Object.values(value)[0] || '';
}