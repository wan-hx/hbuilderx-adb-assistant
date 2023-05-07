const hx = require("hbuilderx");
const adb_assistant = require("./adb_assistant.js");

function activate(context) {
    let disposable = hx.commands.registerCommand('adb_assistant.main', (param) => {
        adb_assistant();
    });
    context.subscriptions.push(disposable);

    let install_apk = hx.commands.registerCommand('adb_assistant.install_apk', (param) => {
        adb_assistant("install_apk", param);
    });
    context.subscriptions.push(install_apk);
};


function deactivate() {

};

module.exports = {
    activate,
    deactivate
}
