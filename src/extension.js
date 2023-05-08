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
    let get_app_startup_time = hx.commands.registerCommand('adb_assistant.shell_am_start_time', (param) => {
        adb_assistant("shell_am_start_time", param);
    });
    context.subscriptions.push(get_app_startup_time);

    // adb截图
    let adb_screenshot = hx.commands.registerCommand('adb_assistant.screenshot', (param) => {
        adb_assistant("screenshot", param);
    });
    context.subscriptions.push(adb_screenshot);

    // shell screenrecord
    let adb_screenrecord = hx.commands.registerCommand('adb_assistant.screenrecord', (param) => {
        adb_assistant("screenrecord", param);
    });
    context.subscriptions.push(adb_screenrecord);

    // adb清除app数据
    let adb_app_clear_data = hx.commands.registerCommand('adb_assistant.shell_pm_clear', (param) => {
        adb_assistant("shell_pm_clear", param);
    });
    context.subscriptions.push(adb_app_clear_data);

    // 获取app内存占用
    let adb_app_memory = hx.commands.registerCommand('adb_assistant.shell_dumpsys_meminfo', (param) => {
        adb_assistant("shell_dumpsys_meminfo", param);
    });
    context.subscriptions.push(adb_app_memory);

    // 获取adb logcat日志
    let adb_logcat = hx.commands.registerCommand('adb_assistant.logcat', (param) => {
        adb_assistant("logcat", param);
    });
    context.subscriptions.push(adb_logcat);

    // 列表显示手机上的所有app
    let adb_shell_pm_list_packages = hx.commands.registerCommand('adb_assistant.shell_pm_list_packages', (param) => {
        adb_assistant("shell_pm_list_packages", param);
    });
    context.subscriptions.push(adb_shell_pm_list_packages);
};


function deactivate() {

};

module.exports = {
    activate,
    deactivate
}
