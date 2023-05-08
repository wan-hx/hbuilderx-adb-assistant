const adbRun = require('./adb_run.js');
const getApkPackageInfo = require("../views/apk_package_info.js");

const { 
    hxConsoleOutput 
} = require("./hx_utils.js");;


/**
 * @description 获取app启动时间
 */
async function adb_shell_am_start_time(adbPath, serialno_id) {
    let packageInfo = await getApkPackageInfo();
    if (packageInfo == undefined) return;

    let { packageName, activityName } = packageInfo;
    let cmd = `${adbPath} -s ${serialno_id} shell am start -W ${packageName}/${activityName}`;
    
    hxConsoleOutput(`正在获取应用启动时间......`);
    
    let result = await adbRun(cmd).catch((err) => {
        hxConsoleOutput(`adb获取app启动时间失败.`, 'error');
        hxConsoleOutput(`具体错误: ${err}`, 'error');
    });
    if (result) {
        hxConsoleOutput("获取应用启动时间，结果如下:`");
        hxConsoleOutput(result);
    };
};

module.exports = {
    adb_shell_am_start_time
};