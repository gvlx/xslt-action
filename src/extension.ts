'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as xslt from 'xslt-processor';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "xslt-action" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.applyXslt', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user

        vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: { 'Xml stylesheet files': ['xsl'] }
        }).then(val => {
            if (vscode.window.activeTextEditor) {
                let activeEditorText = vscode.window.activeTextEditor.document.getText();

                if (val) {
                    let xsltFileContent = fs.readFileSync(val[0].fsPath).toString("utf8");

                    try {
                        let xmlNode = xslt.xmlParse(activeEditorText);
                        let xsltNode = xslt.xmlParse(xsltFileContent);
                        
                        let result = xslt.xsltProcess(xmlNode, xsltNode);

                        vscode.workspace.openTextDocument({
                            content: result
                        }).then(doc => vscode.window.showTextDocument(doc));
                    } catch (e) {
                        vscode.window.showErrorMessage(e);
                    }
                }
            }
        }
        );

    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}