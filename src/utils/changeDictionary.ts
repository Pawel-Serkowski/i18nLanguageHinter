import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { DictionaryTreeProvider } from "../providers/DictionaryTreeProvider";
import { loadDictionaryFile } from "./loadDictionary";

export async function selectDefaultDictionaryFile(context: vscode.ExtensionContext, folderPath: string) {
    try {
        const files = fs.readdirSync(folderPath);
        const jsonFiles = files.filter((f) => f.endsWith(".json"));

        if (jsonFiles.length === 0) {
            return;
        }

        const fileName = jsonFiles.find((file) => file === "en-US.json") ? "en-US.json" : jsonFiles[0];
        const fullPath = path.join(folderPath, fileName);
        loadDictionaryFile(fullPath);
        await context.workspaceState.update("i18nhinter.activeFile", fullPath);
    } catch (error) {
        vscode.window.showErrorMessage("Cannot read folder: " + folderPath);
    }
}

export async function changeDictionaryFolder(
    context: vscode.ExtensionContext,
    treeProvider: DictionaryTreeProvider,
): Promise<boolean> {
    const folderUris = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: "Save as dictionaries folder",
    });

    if (folderUris && folderUris[0]) {
        const newFolderPath = folderUris[0].fsPath;

        await context.workspaceState.update("i18nhinter.dictionaryFolder", newFolderPath);
        await selectDefaultDictionaryFile(context, newFolderPath);
        treeProvider.refresh();
        return true;
    }
    return false;
}
