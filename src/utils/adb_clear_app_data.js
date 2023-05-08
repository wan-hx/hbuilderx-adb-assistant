
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

    let cmd = `${adbPath} -s ${serialno_id} shell pm clear ${packageName}`;

    hxConsoleOutput(`开始清除App应用数据 ${packageName} ......`);
    hxConsoleOutput(`清除命令: ${cmd}`);

    await adbRun(cmd).then( ()=> {
        hxConsoleOutput(`清除app数据成功。`);
    }).catch((err) => {
        hxConsoleOutput(`清除app数据失败。具体错误: ${err}`, 'error');
    })
};

module.exports = adb_clear_app_data;