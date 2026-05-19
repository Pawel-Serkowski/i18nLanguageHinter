import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import { forceReloadInlayHints, dictionaryMap, outputChannel } from "../extension";

let fileWatcher: vscode.FileSystemWatcher | undefined;
let extensionContext: vscode.ExtensionContext | undefined;

function flattenObject(obj: any, prefix = ""): Record<string, string> {
	let result: Record<string, string> = {};
	if (typeof obj !== "object" || obj === null) {
		return result;
	}
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const propName = prefix ? `${prefix}.${key}` : key;
			const value = obj[key];
			if (typeof value === "object" && value !== null) {
				Object.assign(result, flattenObject(value, propName));
			} else if (typeof value === "string") {
				result[propName] = value;
			} else if (value !== null && value !== undefined) {
				result[propName] = String(value);
			}
		}
	}
	return result;
}

export function loadDictionaryFile(filePath: string, isSilent = false) {
	try {
		if (!fs.existsSync(filePath)) {
			throw new Error(`File does not exist: ${filePath}`);
		}
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const parsed = JSON.parse(fileContent);

		const flattened = flattenObject(parsed);
		dictionaryMap.clear();

		for (const [key, value] of Object.entries(flattened)) {
			dictionaryMap.set(key, value);
		}
		forceReloadInlayHints();

		if (fileWatcher) {
			fileWatcher.dispose();
			if (extensionContext) {
				const index = extensionContext.subscriptions.indexOf(fileWatcher);
				if (index > -1) {
					extensionContext.subscriptions.splice(index, 1);
				}
			}
		}

		fileWatcher = vscode.workspace.createFileSystemWatcher(filePath);
		fileWatcher.onDidChange(() => {
			loadDictionaryFile(filePath, true);
		});

		if (extensionContext) {
			extensionContext.subscriptions.push(fileWatcher);
		}

		outputChannel?.appendLine(`[Info] Successfully loaded ${dictionaryMap.size} language keys from ${filePath}`);
		if (!isSilent) {
			vscode.window.showInformationMessage(`Success! Loaded ${dictionaryMap.size} language keys.`);
		}
	} catch (error) {
		outputChannel?.appendLine(`[Error] Failed to load dictionary file: ${error}`);
		if (!isSilent) {
			vscode.window.showErrorMessage("Failed to load dictionary file: " + error);
		}
	}
}

export function pluginSetup(context: vscode.ExtensionContext) {
	extensionContext = context;
	const savedFolder = context.workspaceState.get<string>("i18nhinter.dictionaryFolder");
	if (!savedFolder) {
		return;
	}

	let activeFile = context.workspaceState.get<string>("i18nhinter.activeFile");
	if (!activeFile) {
		activeFile = path.join(savedFolder, "en-US.json");
	}

	if (fs.existsSync(activeFile)) {
		loadDictionaryFile(activeFile, true);
	}
}
