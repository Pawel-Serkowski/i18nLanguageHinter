import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import { I18nInlayHintsProvider } from "./providers/I18nInlayProvider";
import { DictionaryTreeProvider } from "./providers/DictionaryTreeProvider";
import { pluginSetup } from "./utils/loadDictionary";

import { loadLanguageCommand, selectDictionaryCommand, changeFolderCommand } from "./commands";

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

    const treeProvider = new DictionaryTreeProvider(context);
    vscode.window.registerTreeDataProvider("i18n-files-view", treeProvider);

    context.subscriptions.push(selectDictionaryCommand(context, treeProvider));
    context.subscriptions.push(changeFolderCommand(context, treeProvider));
    context.subscriptions.push(loadLanguageCommand(context, treeProvider));
}

// This method is called when your extension is deactivated
export function deactivate() {}
