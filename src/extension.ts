import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import { I18nInlayHintsProvider } from "./providers/I18nInlayProvider";
import { DictionaryTreeProvider } from "./providers/DictionaryTreeProvider";
import { pluginSetup } from "./utils/loadDictionary";

import { loadLanguageCommand, selectDictionaryCommand, changeFolderCommand } from "./commands";

export const i18nProvider = new I18nInlayHintsProvider();
export let dictionaryMap = new Map<string, string>();
export let outputChannel: vscode.OutputChannel;

export function forceReloadInlayHints() {
    i18nProvider.refreshHints();
}

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel("i18n Language Hinter");
    context.subscriptions.push(outputChannel);

    pluginSetup(context);

    const providerDisposable = vscode.languages.registerInlayHintsProvider(
        ["javascript", "typescript", "javascriptreact", "typescriptreact"],
        i18nProvider,
    );
    context.subscriptions.push(providerDisposable);

    const treeProvider = new DictionaryTreeProvider(context);
    vscode.window.registerTreeDataProvider("i18n-files-view", treeProvider);

    context.subscriptions.push(selectDictionaryCommand(context, treeProvider));
    context.subscriptions.push(changeFolderCommand(context, treeProvider));
    context.subscriptions.push(loadLanguageCommand(context, treeProvider));

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration("i18nLanguageHinter")) {
                i18nProvider.refreshHints();
            }
        })
    );
}

// This method is called when your extension is deactivated
export function deactivate() {}
