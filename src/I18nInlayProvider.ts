import * as vscode from "vscode";
import { dictionaryMap } from "./extension";

export class I18nInlayHintsProvider implements vscode.InlayHintsProvider {
    private readonly regex = /id_[\w-]+/g;

    provideInlayHints(
        document: vscode.TextDocument,
        range: vscode.Range, //range means visible for user text fragment in IDE.
        token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.InlayHint[]> {
        console.log(`InlayHint: Checking file ${document.fileName} for keys presents...`);
        const hints: vscode.InlayHint[] = [];

        const text = document.getText(range);
        const offset = document.offsetAt(range.start);

        let match;
        while ((match = this.regex.exec(text)) != null) {
            const key = match[0];
            const translation = dictionaryMap.get(key);

            if (translation) {
                const matchEndOffset = offset + match.index + match[0].length;
                const insertPosition = document.positionAt(matchEndOffset + 1); //adding 1 to avoid shwoing hint before quotes

                const displayText = translation.length > 40 ? translation.substring(0, 40) + "..." : translation;
                const hint = new vscode.InlayHint(insertPosition, ` :${displayText}`);

                hints.push(hint);
            }
        }

        return hints;
    }
}
