
const adbRun = require('./adb_run.js');
const chooseApkPath = require('../views/choose_apk_path.js');

const { 
    hxConsoleOutput 
} = require("./hx_utils.js");


/**
 * @description 安装apk
 */
async function adb_install_apk(adbPath, serialno_id, param) {
    let apkPath = await chooseApkPath();
    if (apkPath == undefined) return;

    hxConsoleOutput(`adb install ${apkPath} ......`);
    let cmd = `${adbPath} -s ${serialno_id} install -r ${apkPath}`;
    let result = await adbRun(cmd).catch((err) => {
        hxConsoleOutput(`adb安装apk失败.`, 'error');
        hxConsoleOutput(`具体错误: ${err}`, 'error');
    });
    if (result) {
        hxConsoleOutput(`adb install apk.apk 执行结果: ${result}`);
    };
};

module.exports = adb_install_apk;