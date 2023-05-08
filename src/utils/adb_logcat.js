
const adbRun = require('./adb_run.js');

const { 
    hxConsoleOutput 
} = require("./hx_utils.js");

/**
 * @description 清除app数据
 */
async function adb_logcat(adbPath, serialno_id) {
    let info = await chooseApkPackageName();
    if (info == undefined) return;
    let { packageName } = info;

    let cmd = `${adbPath} -s ${serialno_id} logcat ${packageName}`;

    hxConsoleOutput(`获取应用日志 ${packageName} ......`);

    await adbRun(cmd).then( ()=> {
        hxConsoleOutput(`获取应用日志成功。`);
    }).catch((err) => {
        hxConsoleOutput(`获取应用日志失败。具体错误: ${err}`, 'error');
    })
};

module.exports = adb_logcat;