
const os = require('os');
const fs = require('fs');
const path = require('path');
const osName = os.platform();

const {
    hxMessageInfo,
} = require("./utils/hx_utils.js");

const get_android_devices = require("./utils/adb_devices.js");
const adb_screenshot = require("./utils/adb_screenshot.js");
const adb_install_apk = require("./utils/adb_install_apk.js");
const adb_uninstall_apk = require("./utils/adb_uninstall_apk.js");
const adb_clear_app_data = require("./utils/adb_clear_app_data.js");
const get_app_start_time = require('./utils/adb_get_app_start_time.js');
const get_app_memory = require('./utils/adb_memory.js');
const adb_logcat = require('./utils/adb_logcat.js');

// 全局：定义adb路径
var adbPath = "";

// 全局：当前手机设备ID
var serialno_id = undefined;

// 全局：内置工具目录和adb路径
var built_in_tool_dir = path.join(__dirname, 'tools', osName);
var built_in_adb_path = path.join(built_in_tool_dir, 'adb');


/**
 * @description adb助手
 * @param {String} action
 * @param {Object} param
 */
async function adb_assistant(action, param) {

    // 设置adb路径
    adbPath = built_in_adb_path;

    // 判断adb是否存在
    if (!fs.existsSync(adbPath)) {
        return hxMessageInfo("Adb命令不存在, 请检查插件是否完整安装，或重装插件。")
    };

    let deviceList = await get_android_devices(adbPath);
    if (deviceList == undefined) return;
    serialno_id = deviceList[0];

    switch (action) {
        case 'devices':
            get_android_devices(adbPath, true);
            break;
        case 'install_apk':
            adb_install_apk(adbPath, serialno_id, param);
            break;
        case 'uninstall_apk':
            adb_uninstall_apk(adbPath, serialno_id);
            break;
        case 'screenshot':
            adb_screenshot(adbPath, serialno_id);
            break;
        case 'app_clear_data':
            adb_clear_app_data(adbPath, serialno_id);
            break;
        case 'app_start_time':
            get_app_start_time(adbPath, serialno_id);
            break;
        case 'app_memory':
            get_app_memory(adbPath, serialno_id);
            break;
        case 'logcat':
            adb_logcat(adbPath, serialno_id);
            break;
        default:
            break;
    }

};

module.exports = adb_assistant;
