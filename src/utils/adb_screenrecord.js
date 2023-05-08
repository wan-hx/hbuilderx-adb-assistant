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
 * @description adb录制屏幕
 */
async function adb_screenrecord(adbPath, serialno_id) {
    hxConsoleOutput(`正在对手机进行屏幕录制......`);

    let current_time = getCurrentTime("_");
    let screenrecord_name = `screenrecord_${current_time}.mp4`;
    let phone_screenrecord_path = `/sdcard/${screenrecord_name}`;

    // 开始截图
    let cmd = `${adbPath} -s ${serialno_id} shell screenrecord -p ${phone_screenrecord_path}`;
    let screencap_result = await adbRun(cmd).then(() => {
        hxConsoleOutput(`手机屏幕录制成功，已保存到手机${phone_screenrecord_path}`);
    }).catch((err) => {
        hxConsoleOutput(`手机屏幕录制失败.`, 'error');
        hxConsoleOutput(`具体错误: ${err}`, 'error');
    });

    // 截图成功后，将截图保存到电脑桌面
    if (screencap_result == "" || screencap_result == undefined) {
        let pc_screenrecord_path = path.join(os.homedir(), "Desktop", screenrecord_name);
        let cmd_for_pull = `${adbPath} -s ${serialno_id} pull ${phone_screenrecord_path} ${pc_screenrecord_path}`;
        adbRun(cmd_for_pull).then( ()=> {
            hxConsoleOutputForLink(`截图从手机发送到电脑，具体路径: ${pc_screenrecord_path}`, pc_screenrecord_path, "success");
        }).catch((err) => {
            hxConsoleOutput(`将截图从手机向电脑传送时失败.具体错误: ${err}`, 'error');
        });
    };
};

module.exports = adb_screenrecord;
