import * as vscode from "vscode";
import { dictionaryMap, outputChannel } from "../extension";

export class I18nInlayHintsProvider implements vscode.InlayHintsProvider {
    private regex!: RegExp;
    private hintPrefix = " :";
    private maxHintLength = 40;

    private _onDidChangeInlayHints = new vscode.EventEmitter<void>();
    public readonly onDidChangeInlayHints = this._onDidChangeInlayHints.event;

    constructor() {
        this.updateConfig();
    }

    public updateConfig() {
        const config = vscode.workspace.getConfiguration("i18nLanguageHinter");
        const keyPattern = config.get<string>("keyPattern") || "id_[\\w-]+";
        this.hintPrefix = config.get<string>("hintPrefix") ?? " :";
        this.maxHintLength = config.get<number>("maxHintLength") ?? 40;

        try {
            this.regex = new RegExp(keyPattern, "g");
        } catch (e) {
            outputChannel?.appendLine(`[Error] Invalid keyPattern regex: "${keyPattern}". Falling back to default: "id_[\\w-]+"`);
            this.regex = /id_[\w-]+/g;
        }
    }

    public refreshHints() {
        this.updateConfig();
        this._onDidChangeInlayHints.fire();
    }

    provideInlayHints(
        document: vscode.TextDocument,
        range: vscode.Range, //range means visible for user text fragment in IDE.
    ): vscode.ProviderResult<vscode.InlayHint[]> {
        const hints: vscode.InlayHint[] = [];

        const text = document.getText(range);
        const offset = document.offsetAt(range.start);

        // Reset regex state
        this.regex.lastIndex = 0;

        let match;
        while ((match = this.regex.exec(text)) !== null) {
            const key = match[0];
            const translation = dictionaryMap.get(key);

            if (translation) {
                const matchEndOffset = offset + match.index + match[0].length;
                
                // Smart offset placement: place hint outside quotes if present
                let insertOffset = matchEndOffset;
                const nextChar = document.getText(new vscode.Range(
                    document.positionAt(insertOffset),
                    document.positionAt(insertOffset + 1)
                ));
                if (nextChar === '"' || nextChar === "'" || nextChar === "`") {
                    insertOffset += 1;
                }
                
                const insertPosition = document.positionAt(insertOffset);
                const displayText = translation.length > this.maxHintLength 
                    ? translation.substring(0, this.maxHintLength) + "..." 
                    : translation;
                
                const hint = new vscode.InlayHint(insertPosition, `${this.hintPrefix}${displayText}`);
                hint.paddingLeft = true;

                hints.push(hint);
            }
        }

        return hints;
    }
}
