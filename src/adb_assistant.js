const { exec } = require('child_process');

const os = require('os');
const fs = require('fs');
const path = require('path');
const osName = os.platform();

const {
    hxMessageInfo,
    hxConsoleOutput
} = require("./utils/hx_utils.js");

const {
    getCurrentTime
} = require("./utils/public_utils.js");

const getApkPackageInfo = require("./views/apk_package_info.js");
const chooseApkPath = require('./views/choose_apk_path.js');
const chooseApkPackageName = require('./views/choose_apk_package_name.js');

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
async function adb_install_apk(param) {
    let apkPath = await chooseApkPath();
    if (apkPath == undefined) return;

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
 * @description 卸载apk
 */
async function adb_uninstall_apk() {
    let info = await chooseApkPackageName();
    if (info == undefined) return;
    let { packageName } = info;

    hxConsoleOutput(`adb uninstall ${packageName} ......`);
    let cmd = `${adbPath} -s ${current_serialno_id} uninstall ${packageName}`;
    await adbRun(cmd).then(result=> {
        hxConsoleOutput(`adb卸载app成功。`);
    }).catch((err) => {
        hxConsoleOutput(`adb卸载app失败。具体错误: ${err}`, 'error');
    })
};

/**
 * @description 清除app数据
 */
async function adb_clear_app_data() {
    let info = await chooseApkPackageName();
    if (info == undefined) return;
    let { packageName } = info;

    hxConsoleOutput(`adb shell pm clear ${packageName} ......`);
    let cmd = `${adbPath} -s ${current_serialno_id} shell pm clear ${packageName}`;
    await adbRun(cmd).then(result=> {
        hxConsoleOutput(`清除app数据成功。`);
    }).catch((err) => {
        hxConsoleOutput(`清除app数据失败。具体错误: ${err}`, 'error');
    })
};


/**
 * @description adb截图
 */
async function adb_screenshot() {
    hxConsoleOutput(`正在截图......`);

    let current_time = getCurrentTime("_");
    let screenshot_name = `/sdcard/screenshot_${current_time}.png`;

    // 开始截图
    let cmd = `${adbPath} -s ${current_serialno_id} shell screencap -p ${screenshot_name}`;
    let screencap_result = await adbRun(cmd).catch((err) => {
        hxConsoleOutput(`adb截图失败.`, 'error');
        hxConsoleOutput(`具体错误: ${err}`, 'error');
    });

    // 截图成功后，将截图保存到电脑桌面
    if (screencap_result) {
        hxConsoleOutput(`adb截图成功，已保存到手机sdcard/screenshot.png`);
        let pc_screenshot_path = path.join(os.homedir(), "Desktop", screenshot_name);
        let cmd2 = `${adbPath} -s ${current_serialno_id} pull ${screenshot_name} ${pc_screenshot_path}`;
        adbRun(cmd2).then(result=> {
            hxConsoleOutput(`截图从手机发送到电脑，具体路径: ${pc_screenshot_path}`, 'success');
        }).catch((err) => {
            hxConsoleOutput(`将截图从手机向电脑传送时失败.具体错误: ${err}`, 'error');
        });
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

    // let deviceList = await get_android_devices();
    // if (deviceList == undefined) return;
    // current_serialno_id = deviceList[0];

    switch (action) {
        case 'devices':
            get_android_devices(true);
            break;
        case 'install_apk':
            adb_install_apk(param);
            break;
        case 'uninstall_apk':
            adb_uninstall_apk(param);
            break;
        case 'screenshot':
            adb_screenshot();
            break;
        case 'app_clear_data':
            adb_clear_app_data();
            break;
        case 'app_start_time':
            get_app_start_time();
            break;
        default:
            break;
    }

};

module.exports = adb_assistant;
