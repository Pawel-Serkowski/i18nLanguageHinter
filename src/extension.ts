import * as vscode from "vscode";
import * as fs from "fs";

import { I18nInlayHintsProvider } from "./I18nInlayProvider";

export let dictionaryMap = new Map<string, string>();
export function activate(context: vscode.ExtensionContext) {
    const selectDictionaryCommand = vscode.commands.registerCommand(
        "i18nlanguagehinter.selectDictionaryFile",
        async () => {
            const fileUris = await vscode.window.showOpenDialog({
                canSelectMany: false,
                openLabel: "Select json dictionary preview",
                filters: {
                    "JSON Dictionaries": ["json"],
                },
            });

            if (fileUris && fileUris[0]) {
                const filePath = fileUris[0].fsPath;

                try {
                    const fileContent = fs.readFileSync(filePath, "utf-8");
                    const parsed = JSON.parse(fileContent);

                    dictionaryMap.clear();

                    for (const [key, value] of Object.entries(parsed)) {
                        if (typeof value === "string") {
                            dictionaryMap.set(key, value);
                        }
                    }

                    vscode.window.showInformationMessage(`Success! Loaded ${dictionaryMap.size} language keys.`);
                } catch (error) {
                    vscode.window.showErrorMessage("Failed to load dictionary file: " + error);
                }
            }
        },
    );

    const inlayHintProvider = vscode.languages.registerInlayHintsProvider(
        ["javascript", "typescript", "javascriptreact", "typescriptreact"],
        new I18nInlayHintsProvider(),
    );

    context.subscriptions.push(selectDictionaryCommand);
    context.subscriptions.push(inlayHintProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
