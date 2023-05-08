const adbRun = require('./adb_run.js');
const chooseApkPackageName = require('../views/choose_apk_package_name.js');

const { 
    hxConsoleOutput 
} = require("./hx_utils.js");

/**
 * @description 获取app内存
 */
async function get_app_memory(adbPath, serialno_id) {
    let info = await chooseApkPackageName();
    if (info == undefined) return;
    let { packageName } = info;

    hxConsoleOutput(`adb shell dumpsys meminfo ${packageName} ......`);
    let cmd = `${adbPath} -s ${serialno_id} shell dumpsys meminfo ${packageName}`;
    await adbRun(cmd).then(result=> {
        hxConsoleOutput(`获取内存占用信息如下：${result}`);
    }).catch((err) => {
        hxConsoleOutput(`获取内存占用信息失败。具体错误: ${err}`, 'error');
    })
};

module.exports = get_app_memory;