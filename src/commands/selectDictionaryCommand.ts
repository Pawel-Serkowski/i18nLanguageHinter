import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import { loadDictionaryFile } from "../utils/loadDictionary";
import { changeDictionaryFolder } from "../utils/changeDictionary";
import { DictionaryTreeProvider } from "../providers/DictionaryTreeProvider";

export const selectDictionaryCommand = (context: vscode.ExtensionContext, treeProvider: DictionaryTreeProvider) =>
    vscode.commands.registerCommand("i18nlanguagehinter.selectDictionaryFile", async () => {
        const savedFolder = context.workspaceState.get<string>("i18nhinter.dictionaryFolder") || "";
        const items: vscode.QuickPickItem[] = [];

        items.push({
            label: "$(folder) Select / Change folder with dictionaries",
            description: savedFolder ? `Selected: ${savedFolder}` : "None selected.",
            alwaysShow: true,
        });

        if (savedFolder && fs.existsSync(savedFolder)) {
            try {
                const files = fs.readdirSync(savedFolder);
                const jsonFiles = files.filter((f) => f.endsWith(".json"));

                items.push({ label: "Language files (JSON)", kind: vscode.QuickPickItemKind.Separator });

                for (const file of jsonFiles) {
                    items.push({
                        label: `$(json) ${file}`,
                        description: file === "en-US.json" ? "Default" : "Load dictionary",
                    });
                }
            } catch (error) {
                vscode.window.showErrorMessage("Cannot read folder: " + savedFolder);
            }
        }

        const selectedItem = await vscode.window.showQuickPick(items, {
            placeHolder: "Manage i18n dictionaries",
        });

        if (!selectedItem) return;

        if (selectedItem.label.includes("$(folder)")) {
            await changeDictionaryFolder(context, treeProvider);
            vscode.window.showInformationMessage("Folder successfully saved, run command once again!");
        } else {
            const fileName = selectedItem.label.replace("$(json) ", "");
            console.log(fileName);
            const fullPath = path.join(savedFolder, fileName);

            loadDictionaryFile(fullPath);

            await context.workspaceState.update("i18nhinter.activeFile", fullPath);
        }
    });
