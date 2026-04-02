import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export class DictionaryItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly fullPath: string,
        public readonly isActive: boolean,
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);

        this.description = isActive ? "(Active)" : "";
        this.command = {
            command: "i18nlanguagehinter.loadLanguageCmd",
            title: "Load selected language",
            arguments: [this.fullPath],
        };
    }
}

export class DictionaryTreeProvider implements vscode.TreeDataProvider<DictionaryItem> {
    private _onDidChangeDataTree = new vscode.EventEmitter<DictionaryItem | undefined | void>();
    readonly onDidChangeTreeData = this._onDidChangeDataTree.event;

    constructor(private context: vscode.ExtensionContext) {}

    refresh(): void {
        this._onDidChangeDataTree.fire();
    }

    getTreeItem(element: DictionaryItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: DictionaryItem): Thenable<DictionaryItem[]> {
        if (element) return Promise.resolve([]);

        const folder = this.context.workspaceState.get<string>("i18nhinter.dictionaryFolder");
        const activeFile = this.context.workspaceState.get<string>("i18nhinter.activeFile");

        if (folder && fs.existsSync(folder)) {
            const files = fs.readdirSync(folder).filter((f) => f.endsWith(".json"));

            const items = files.map((file) => {
                const fullPath = path.join(folder, file);
                const isActive = fullPath === activeFile;
                return new DictionaryItem(file, fullPath, isActive);
            });

            return Promise.resolve(items);
        }

        return Promise.resolve([]);
    }
}
