const os = require("os");
const path = require("path");
const adbRun = require('./adb_run.js');

const {
    hxConsoleOutput,
    hxConsoleOutputForLink
} = require("./hx_utils.js");

const {
    getCurrentTime
} = require("./public_utils.js");

/**
 * @description adb截图
 */
async function adb_screenshot(adbPath, serialno_id) {
    hxConsoleOutput(`正在截图......`);

    let current_time = getCurrentTime("_");
    let screenshot_name = `screenshot_${current_time}.png`;
    let phone_screen_path = `/sdcard/${screenshot_name}`;

    // 开始截图
    let cmd = `${adbPath} -s ${serialno_id} shell screencap -p ${phone_screen_path}`;
    let screencap_result = await adbRun(cmd).then(() => {
        hxConsoleOutput(`adb截图成功，已保存到手机${phone_screen_path}`);
    }).catch((err) => {
        hxConsoleOutput(`adb截图失败.`, 'error');
        hxConsoleOutput(`具体错误: ${err}`, 'error');
    });

    // 截图成功后，将截图保存到电脑桌面
    if (screencap_result == "" || screencap_result == undefined) {
        let pc_screenshot_path = path.join(os.homedir(), "Desktop", screenshot_name);
        let cmd_for_pull = `${adbPath} -s ${serialno_id} pull ${phone_screen_path} ${pc_screenshot_path}`;
        adbRun(cmd_for_pull).then( ()=> {
            hxConsoleOutputForLink(`截图从手机发送到电脑，具体路径: ${pc_screenshot_path}`, pc_screenshot_path, "success");
        }).catch((err) => {
            hxConsoleOutput(`将截图从手机向电脑传送时失败.具体错误: ${err}`, 'error');
        });
    };
};

module.exports = adb_screenshot;
