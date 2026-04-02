# i18n Language Hinter 🌍

> A highly performant, native IDE extension for Antigravity & VS Code that provides on-the-fly, inline translations for your `i18n` keys using VS Code's rich **Inlay Hints API**.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-stable-success.svg)
![Environment](https://img.shields.io/badge/environment-Antigravity%20%7C%20VS%20Code-orange.svg)

Are you tired of constantly switching tabs or looking at split screens just to find out what text hides behind `t("homepage.header.title")`? **i18n Language Hinter** solves this by injecting your `.json` dictionary translations directly into your code editor seamlessly.

---

## ✨ Features

- **Blazing Fast Inlay Hints**: Does not parse Abstract Syntax Trees. Instead, it relies on hyper-optimized Regular Expressions to find your localization keys (e.g., `id_000000`) and paints the resolved translation right next to the code.
- **Dedicated Sidebar (Tree View)**: Includes a brand new side-panel view dedicated solely to managing your translation keys!
- **1-Click Language Switch**: Change your currently previewed language directly from the sidebar. The UI refreshes instantly.
- **Fail-Safe Startup**: Safely persists your selected folder in the Workspace State. Next time you open the project, it automatically points to your `en-US.json` (or the nearest existing dictionary file) so everything just works out of the box.
- **Memory Efficient**: Uses an O(1) in-memory Map resolver for massive dictionary files.

---

## 🚀 Requirements (Mandatory)

For the plugin to draw hints in the code, **you must have them enabled**.

- Open editor settings (`Cmd/Ctrl + ,`).
- Type `Inlay Hints` in the search box.
- Change the `Editor › Inlay Hints: Enabled` value to `on` (Always visible) or `onUnlessPressed` (Visible when holding Ctrl/Cmd).

## 🗂️ Sidebar Layout

Your main interaction with the plugin happens through the built-in editor sidebar panel.

1. **Open the tab:** Find the new "virtual library" icon (📚) on the far-left Activity Bar of VS Code.
2. **Select the root folder:** In the top bar, click the `Select different dictionary folder` folder icon and point the system to the directory where you store your language files (e.g., `src/locales/`).
3. **Auto-load:** The application will save this folder in your secure workspace storage. To prevent startup errors, it will automatically load the `en-US.json` language by default to save you time.
4. **Clickable list:** Once loaded, the tree will populate with all `.json` files. Click on any file in the list (e.g., `es-ES.json`), and it will instantly become _"(Active)"_, changing the translations in your open code files.

## ⌨️ Command Palette

All the most important options can be handled quickly without using a mouse! Press `Cmd/Ctrl + Shift + P` in the editor and search for:

| Command                                    | Action upon execution                                                                                                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `i18n: Select dictionary file`             | Perfect for keyboard enthusiasts! Opens a central `QuickPick` Menu with a search bar, allowing you to select files or change the folder using the keyboard arrows. |
| `i18n: Select different dictionary folder` | A quick global shortcut to instantly open the system dialog window to set a new base directory for your files.                                                     |
| `View: Focus i18n Language Hinter`         | Native IDE command. Opens and focuses the dedicated sidebar panel directly from your keyboard.                                                                     |

---

## ⚙️ Extension Architecture Highlights

This plugin has been built with an enterprise-grade philosophy:

- Focus-stealing bugs with native API QuickPicks are mitigated via bullet-proof VS Code `InlayHintsProvider` disposition & re-registration patterns.
- Absolute Path resolvers are applied everywhere, removing cwd-dependent read crashes.
- Extricated modules and cleanly separated commands inside the `src/commands/` and `src/utils` architectures.

---

**Developed with precision by Paweł Serkowski.**
