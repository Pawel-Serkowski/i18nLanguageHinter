import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import { I18nInlayHintsProvider } from "./providers/I18nInlayProvider";
import { selectDictionaryCommand } from "./commands/selectDictionaryCommand";
import { pluginSetup } from "./utils/loadDictionary";

export const i18nProvider = new I18nInlayHintsProvider();
export let dictionaryMap = new Map<string, string>();

let activeProviderDisposable: vscode.Disposable | undefined;
export function forceReloadInlayHints() {
    if (activeProviderDisposable) {
        activeProviderDisposable.dispose();
    }
    activeProviderDisposable = vscode.languages.registerInlayHintsProvider(
        ["javascript", "typescript", "javascriptreact", "typescriptreact"],
        i18nProvider,
    );
}

export function activate(context: vscode.ExtensionContext) {
    pluginSetup(context);

    forceReloadInlayHints();

    context.subscriptions.push(selectDictionaryCommand(context));
}

// This method is called when your extension is deactivated
export function deactivate() {}
