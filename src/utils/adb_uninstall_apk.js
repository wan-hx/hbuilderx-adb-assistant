const adbRun = require('./adb_run.js');
const chooseApkPackageName = require('../views/choose_apk_package_name.js');

const { 
    hxConsoleOutput 
} = require("./hx_utils.js");


/**
 * @description 卸载apk
 */
async function adb_uninstall_apk(adbPath, serialno_id) {
    let info = await chooseApkPackageName();
    if (info == undefined) return;
    let { packageName } = info;

    hxConsoleOutput(`adb uninstall ${packageName} ......`);
    let cmd = `${adbPath} -s ${serialno_id} uninstall ${packageName}`;
    await adbRun(cmd).then(result=> {
        hxConsoleOutput(`adb卸载app成功。`);
    }).catch((err) => {
        hxConsoleOutput(`adb卸载app失败。具体错误: ${err}`, 'error');
    })
};

module.exports = adb_uninstall_apk;