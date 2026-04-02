import * as vscode from "vscode";
import { DictionaryTreeProvider } from "../providers/DictionaryTreeProvider";
import { loadDictionaryFile } from "../utils/loadDictionary";

export const loadLanguageCommand = (context: vscode.ExtensionContext, treeProvider: DictionaryTreeProvider) => {
    return vscode.commands.registerCommand("i18nlanguagehinter.loadLanguageCmd", async (filePath: string) => {
        await context.workspaceState.update("i18nhinter.activeFile", filePath);
        loadDictionaryFile(filePath);
        treeProvider.refresh();
    });
};
