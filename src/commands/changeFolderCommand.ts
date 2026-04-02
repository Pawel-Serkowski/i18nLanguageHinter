import * as vscode from "vscode";
import { changeDictionaryFolder } from "../utils/changeDictionary";
import { DictionaryTreeProvider } from "../providers/DictionaryTreeProvider";

export const changeFolderCommand = (context: vscode.ExtensionContext, treeProvider: DictionaryTreeProvider) => {
    return vscode.commands.registerCommand("i18nlanguagehinter.changeFolderCmd", async () => {
        changeDictionaryFolder(context, treeProvider);
    });
};
