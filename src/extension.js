const hx = require("hbuilderx");
const adb_assistant = require("./adb_assistant.js");

function activate(context) {
    let disposable = hx.commands.registerCommand('adb_assistant.main', (param) => {
        adb_assistant();
    });
    context.subscriptions.push(disposable);

    // 获取设备列表
    let get_android_devices = hx.commands.registerCommand('adb_assistant.get_android_devices', (param) => {
        adb_assistant("devices", param);
    });
    context.subscriptions.push(get_android_devices);

    // 安装apk到手机设备
    let install_apk = hx.commands.registerCommand('adb_assistant.install_apk', (param) => {
        adb_assistant("install_apk", param);
    });
    context.subscriptions.push(install_apk);

    // 获取app启动时间
    let get_app_startup_time = hx.commands.registerCommand('adb_assistant.get_app_startup_time', (param) => {
        adb_assistant("app_start_time", param);
    });
    context.subscriptions.push(get_app_startup_time);
};


function deactivate() {

};

module.exports = {
    activate,
    deactivate
}
