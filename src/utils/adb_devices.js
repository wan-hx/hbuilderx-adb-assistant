const adbRun = require('./adb_run.js');

const { 
    hxConsoleOutput 
} = require("./hx_utils.js");

/**
 * @description 获取android设备列表
 * @returns {Array} 手机设备列表
 */
async function get_android_devices(adbPath, isPrint = false) {
    let cmd = `${adbPath} devices -l`;
    let result = await adbRun(cmd);

    if (isPrint) {
        hxConsoleOutput(`adb devices命令输出：${result}`);
        return;
    };

    if (result.trim() == 'List of devices attached') {
        hxConsoleOutput(`adb devices命令输出：${result}`);
        hxConsoleOutput("没有查找到Android设备，请检查设备是否连接。", "error");
        hxConsoleOutput("注意：Adb连接手机，需要手机开启开发者模式和USB调试。\n");
    } else {
        // hxConsoleOutput(`adb devices命令输出：${result}`);
        const output = result.toString().trim();
        const lines = output.split(/\r?\n/).slice(1);
        const deviceIds = lines.map(line => line.split(/\s+/)[0]);
        return deviceIds;
    };
};

module.exports = get_android_devices;