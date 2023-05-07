const { exec } = require('child_process');

const os = require('os');
const fs = require('fs');
const path = require('path');
const osName = os.platform();

const {
    hxMessageInfo,
    hxConsoleOutput
} = require("./utils/hx_utils.js");

const getApkPackageInfo = require("./views/apk_package_info.js");

// 定义adb路径
var adbPath = "";

// 当前手机设备ID
var current_serialno_id = undefined;

// 内置工具目录和adb路径
var built_in_tool_dir = path.join(__dirname, 'tools', osName);
var built_in_adb_path = path.join(built_in_tool_dir, 'adb');

/**
 * @description 公共方法：执行adb命令
 * @param {*} cmd
 * @returns
 */
function adbRun(cmd) {
    return new Promise((resolve, reject) => {
        exec(`${cmd}`, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout.trim());
            }
        });
    });
};

/**
 * @description 获取android设备列表
 * @returns {Array} 手机设备列表
 */
async function get_android_devices(isPrint = false) {
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

/**
 * @description 安装apk
 */
async function adb_install(apkPath) {
    hxConsoleOutput(`adb install ${apkPath} ......`);
    let cmd = `${adbPath} -s ${current_serialno_id} install -r ${apkPath}`;
    let result = await adbRun(cmd).catch((err) => {
        hxConsoleOutput(`adb安装apk失败.`, 'error');
        hxConsoleOutput(`具体错误: ${err}`, 'error');
    });
    if (result) {
        hxConsoleOutput(`adb install apk.apk 执行结果: ${result}`);
    };
};

/**
 * @description 获取app启动时间
 */
async function get_app_start_time() {
    let packageInfo = await getApkPackageInfo();
    if (packageInfo == undefined) return;

    let { packageName, activityName } = packageInfo;

    hxConsoleOutput(`正在获取应用启动时间......`);
    let cmd = `${adbPath} -s ${current_serialno_id} shell am start -W ${packageName}/${activityName}`;
    let result = await adbRun(cmd).catch((err) => {
        hxConsoleOutput(`adb获取app启动时间失败.`, 'error');
        hxConsoleOutput(`具体错误: ${err}`, 'error');
    });
    if (result) {
        hxConsoleOutput("获取应用启动时间，结果如下:`");
        hxConsoleOutput(result);
    };
};


/**
 * @description adb助手
 * @param {*} action
 * @param {*} param
 * @returns
 */
async function adb_assistant(action, param) {

    // 设置adb路径
    adbPath = built_in_adb_path;

    // 判断adb是否存在
    if (!fs.existsSync(adbPath)) {
        return hxMessageInfo("Adb命令不存在, 请检查插件是否完整安装，或重装插件。")
    };

    let deviceList = await get_android_devices();
    if (deviceList == undefined) return;
    current_serialno_id = deviceList[0];

    switch (action) {
        case 'devices':
            get_android_devices(true);
            break;
        case 'install_apk':
            adb_install("/Applications/HBuilderX.app/Contents/HBuilderX/plugins/launcher/base/android_base.apk");
        case 'app_start_time':
            get_app_start_time();
        default:
            break;
    }

};

module.exports = adb_assistant;
