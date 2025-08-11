# Bolt CEP (Bun Edition) ⚡

A blazing-fast boilerplate for building Adobe CEP Extensions using **Bun** instead of traditional Node.js tooling.

> **Fork of [hyperbrew/bolt-cep](https://github.com/hyperbrew/bolt-cep)** - Modified to use Bun for maximum performance and simplicity.

## 🚀 Features

- **100% Bun-powered** - No Vite, no Webpack, no complex build tools
- **Lightning-fast builds** - Leverages Bun's native bundler
- **React-only** - Simplified to focus on React (removed Vue/Svelte)
- **Hot reload** - Built-in watch mode for development
- **TypeScript** - Full TypeScript support out of the box
- **ExtendScript** - Support for Adobe's ExtendScript (.jsx)
- **CEP Manifest generation** - Automatic manifest.xml creation
- **Symlink management** - Auto-symlink for development

## 📦 Prerequisites

- [Bun](https://bun.sh/) (latest version)
- Adobe Creative Cloud application (Premiere Pro, After Effects, Photoshop, etc.)
- [ZXP/UXP Installer](https://zxpinstaller.com/) for enabling PlayerDebugMode

## 🎯 Quick Start

```bash
# Clone the repository
git clone https://github.com/chibataku0815/bolt-cep.git
cd bolt-cep

# Install dependencies
bun install

# Development mode (with watch)
bun dev

# Production build
bun build

# Create ZXP package
bun zxp
```

## 📁 Project Structure

```
bolt-cep-bun/
├── src/
│   ├── js/           # Panel source (React/TypeScript)
│   │   ├── main/     # Main panel entry
│   │   └── lib/      # CEP libraries
│   ├── jsx/          # ExtendScript files
│   └── index.html    # Panel HTML
├── scripts/
│   ├── build.ts      # Bun build script
│   └── cep-utils.ts  # CEP utilities
├── cep.config.ts     # CEP configuration
├── bunfig.toml       # Bun configuration
└── package.json      # Dependencies
```

## 🛠️ Configuration

Edit `cep.config.ts` to customize your extension:

```typescript
const config = {
  id: "com.yourcompany.extension",
  name: "Your Extension",
  displayName: "Your Extension Name",
  version: "1.0.0",
  host: [
    { app: "PPRO", version: "[0.0,99.9]" }, // Premiere Pro
    { app: "AEFT", version: "[0.0,99.9]" }, // After Effects
    // Add more hosts as needed
  ],
  // ... more options
};
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development with watch mode |
| `bun build` | Create production build |
| `bun zxp` | Build and package as ZXP |
| `bun clean` | Clean dist directory |
| `bun typecheck` | Run TypeScript type checking |

## 🔧 Development Workflow (macOS)

1. **Enable PlayerDebugMode** using ZXP/UXP Installer
2. Run `bun dev` to start development
3. The extension will be auto-symlinked to:
   - `~/Library/Application Support/Adobe/CEP/extensions/`
4. Open your Adobe application
5. Go to Window → Extensions → Your Extension Name

## 🏗️ Build Process

The Bun build script (`scripts/build.ts`) handles:

1. **TypeScript/React compilation** - Using Bun's native bundler
2. **ExtendScript processing** - Copies .jsx files to dist
3. **Asset management** - Handles images, CSS, and other assets
4. **CEP manifest generation** - Creates required manifest.xml
5. **Debug file creation** - Generates .debug for development
6. **Symlink management** - Auto-creates development symlinks

## ⚡ Why Bun?

- **Speed**: 10-100x faster than traditional Node.js tooling
- **Simplicity**: Built-in bundler, no need for Webpack/Vite
- **All-in-one**: Package manager, bundler, and runtime in one tool
- **Modern**: Native TypeScript and JSX support
- **Lightweight**: Smaller dependency footprint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Credits

- Original [bolt-cep](https://github.com/hyperbrew/bolt-cep) by Hyperbrew
- Modified for Bun by [chibataku0815](https://github.com/chibataku0815)

## 🔗 Resources

- [Bun Documentation](https://bun.sh/docs)
- [Adobe CEP Resources](https://github.com/Adobe-CEP/CEP-Resources)
- [Premiere Pro Scripting Guide](https://ppro-scripting.docsforadobe.dev/)

---

**Note**: This is a Bun-specific fork. For the original Vite-based version, please visit [hyperbrew/bolt-cep](https://github.com/hyperbrew/bolt-cep).