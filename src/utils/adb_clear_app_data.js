
const adbRun = require('./adb_run.js');

const { 
    hxConsoleOutput 
} = require("./hx_utils.js");

/**
 * @description 清除app数据
 */
async function adb_clear_app_data(adbPath, serialno_id) {
    let info = await chooseApkPackageName();
    if (info == undefined) return;
    let { packageName } = info;

    hxConsoleOutput(`adb shell pm clear ${packageName} ......`);
    let cmd = `${adbPath} -s ${serialno_id} shell pm clear ${packageName}`;
    await adbRun(cmd).then(result=> {
        hxConsoleOutput(`清除app数据成功。`);
    }).catch((err) => {
        hxConsoleOutput(`清除app数据失败。具体错误: ${err}`, 'error');
    })
};

module.exports = adb_clear_app_data;