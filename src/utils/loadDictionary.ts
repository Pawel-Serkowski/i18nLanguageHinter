import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import { forceReloadInlayHints, dictionaryMap } from "../extension";

let fileWatcher: vscode.FileSystemWatcher;

export function loadDictionaryFile(filePath: string) {
	try {
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const parsed = JSON.parse(fileContent);

		dictionaryMap.clear();

		for (const [key, value] of Object.entries(parsed)) {
			if (typeof value === "string") {
				dictionaryMap.set(key, value);
			}
		}
		forceReloadInlayHints();

		if (fileWatcher) { fileWatcher.dispose(); }

		fileWatcher = vscode.workspace.createFileSystemWatcher(filePath);
		fileWatcher.onDidChange(() => {
			loadDictionaryFile(filePath);
		});

		vscode.window.showInformationMessage(`Success! Loaded ${dictionaryMap.size} language keys.`);
	} catch (error) {
		vscode.window.showErrorMessage("Failed to load dictionary file: " + error);
	}
}

export function pluginSetup(context: vscode.ExtensionContext) {
	const savedFolder = context.workspaceState.get<string>("i18nhinter.dictionaryFolder");
	if (!savedFolder) return;

	let activeFile = context.workspaceState.get<string>("i18nhinter.activeFile");
	if (!activeFile) {
		activeFile = path.join(savedFolder, "en-US.json");
	}

	if (fs.existsSync(activeFile)) {
		loadDictionaryFile(activeFile);
	}
}
