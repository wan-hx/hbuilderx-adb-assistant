const adbRun = require('./adb_run.js');
const getApkPackageInfo = require("../views/apk_package_info.js");
const chooseApkPackageName = require("../views/choose_apk_path.js");

const {
    hxConsoleOutput
} = require("./hx_utils.js");;

/**
 * @description 清除app数据
 */
async function adb_shell_pm_clear(adbPath, serialno_id) {
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

/**
 * @description 输出所有软件包
 */
async function adb_shell_pm_list_packages(adbPath, serialno_id) {
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
    adb_shell_pm_clear,
    adb_shell_pm_list_packages,
};
