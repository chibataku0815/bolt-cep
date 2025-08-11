#!/usr/bin/env node

import { main } from "meta-bolt";
import type { BoltInitData, ArgOpt } from "meta-bolt";
import { ResArgs } from "meta-bolt/dist/types";

export const frameworkOptions: ArgOpt[] = [
  {
    value: "react",
    label: "React",
    files: [
      "src/js/main/index-react.tsx",
      "src/js/main/main.tsx",
      "package.json",
      "tsconfig.json",
    ],
  },
];

export const appOptions: ArgOpt[] = [
  { value: "aeft", label: "After Effects", files: ["src/jsx/aeft"] },
  { value: "ppro", label: "Premiere Pro", files: ["src/jsx/ppro"] },
  { value: "phxs", label: "Photoshop", files: ["src/jsx/phxs"] },
  { value: "ilst", label: "Illustrator", files: ["src/jsx/ilst"] },
  { value: "idsn", label: "InDesign", files: ["src/jsx/idsn"] },
  { value: "anim", label: "Animate", files: ["src/jsx/anim"] },
  { value: "ame", label: "Media Encoder", files: ["src/jsx/ame"] },
  { value: "kbrg", label: "Bridge", files: ["src/jsx/kbrg"] },
  { value: "audt", label: "Audition", files: ["src/jsx/audt"] },
];

const initData: BoltInitData = {
  intro: {
    name: "create-bolt-cep",
    prettyName: "Bolt CEP",
  },
  base: {
    module: "bolt-cep",
    createDirName: __dirname,
    globalIncludes: [
      "*",
      "src/**/*",
      ".github/**/*",
      ".gitignore",
      ".npmrc",
      ".prettierrc",
      ".env.example",
    ],
    globalExcludes: [".env", "bun.lockb", "package.json", "tsconfig.json"],
    fileRenames: [
      [".npmignore", ".gitignore"],
    ],
  },
  argsTemplate: [
    {
      name: "folder",
      type: "folder",
      message: "Where do you want to create your project?",
      initialValue: "./",
      required: true,
      validator: (input: string) => {
        if (input.length < 3) return `Value is required!`;
      },
      describe: "Name of the folder for the new Adobe extension ",
    },
    {
      name: "displayName",
      type: "string",
      message: "Choose a unique Display Name for your extension:",
      initialValue: "Bolt CEP",
      required: true,
      validator: (input: string) => {
        if (input.length < 1) return `Value is required!`;
      },
      describe: "Panel's display name",
      alias: "n",
    },
    {
      name: "id",
      type: "string",
      message: "Choose a unique ID for your extension:",
      initialValue: "com.bolt.cep",
      required: true,
      validator: (input: string) => {
        if (input.length < 1) return `Value is required!`;
      },
      describe: "Unique ID for your extension (e.g. com.bolt.cep)",
      alias: "i",
    },
    {
      name: "framework",
      type: "select",
      message: "Select framework:",
      alias: "f",
      describe: "Select a Framework for your extension:",
      options: frameworkOptions,
      required: true,
    },
    {
      name: "apps",
      type: "multiselect",
      message: "Select app:",
      alias: "a",
      describe: "Select app(s) for your extension:",
      options: appOptions,
      validator: (input: string[]) => {
        if (input.length < 1) return `At Least One value Required!`;
      },
      required: true,
    },
    {
      name: "installDeps",
      type: "boolean",
      message: "Install dependencies?",
      initialValue: true,
      required: true,
      alias: "d",
      describe: "Install dependencies (default: false)",
    },
    {
      name: "sampleCode",
      type: "boolean",
      message: "Keep Sample Code Snippets?",
      initialValue: true,
      required: true,
      alias: "s",
      describe: "Keep Sample Code (default: true)",
    },
  ],
};

export const createBoltCEP = async (overrideArgs: ResArgs = {}) => {
  return await main(initData, overrideArgs);
};

//* if not using as a module, run immediately
console.log("BOLT_MODULEONLY", process.env.BOLT_MODULEONLY);
if (!process.env.BOLT_MODULEONLY) createBoltCEP();
