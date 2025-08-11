import { version } from "./package.json";

interface CEPConfig {
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

const config: CEPConfig = {
  version,
  id: "com.bolt.cep",
  name: "Bolt CEP",
  displayName: "Bolt CEP",
  description: "A Bun-powered CEP Extension",
  
  // CEP Runtime version
  requiredRuntimes: {
    CSXS: "9.0"
  },
  
  // Supported Adobe applications
  host: [
    { app: "PPRO", version: "[0.0,99.9]" }, // Premiere Pro
    { app: "AEFT", version: "[0.0,99.9]" }, // After Effects
    { app: "PHXS", version: "[0.0,99.9]" }, // Photoshop
    { app: "ILST", version: "[0.0,99.9]" }, // Illustrator
    { app: "IDSN", version: "[0.0,99.9]" }, // InDesign
  ],
  
  type: "Panel",
  
  // Icons
  iconNormal: "./src/assets/dark-icon.png",
  iconDarkNormal: "./src/assets/light-icon.png",
  iconRollover: "./src/assets/dark-icon.png",
  iconDarkRollover: "./src/assets/light-icon.png",
  
  // CEP parameters
  parameters: ["--v=0", "--enable-nodejs", "--mixed-context"],
  
  // Panel dimensions
  width: 600,
  height: 650,
  minWidth: 400,
  minHeight: 300,
  
  // Script path for ExtendScript
  scriptPath: "./jsx/index.jsx",
  
  autoVisible: true,
  panelDisplayName: "Bolt CEP Panel",
};

export default config;