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

    // 卸载apk
    let uninstall_apk = hx.commands.registerCommand('adb_assistant.uninstall_apk', (param) => {
        adb_assistant("uninstall_apk", param);
    });
    context.subscriptions.push(uninstall_apk);

    // 获取app启动时间
    let get_app_startup_time = hx.commands.registerCommand('adb_assistant.get_app_startup_time', (param) => {
        adb_assistant("app_start_time", param);
    });
    context.subscriptions.push(get_app_startup_time);

    // adb截图
    let adb_screenshot = hx.commands.registerCommand('adb_assistant.screenshot', (param) => {
        adb_assistant("screenshot", param);
    });
    context.subscriptions.push(adb_screenshot);

    // adb清除app数据
    let adb_app_clear_data = hx.commands.registerCommand('adb_assistant.app_clear_data', (param) => {
        adb_assistant("app_clear_data", param);
    });
    context.subscriptions.push(adb_app_clear_data);
};


function deactivate() {

};

module.exports = {
    activate,
    deactivate
}
