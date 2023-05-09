const adbRun = require('./adb_run.js');
const getApkPackageInfo = require("../views/apk_package_info.js");
const chooseApkPackageName = require("../views/choose_apk_path.js");
const devicesPackageListFilter = require("../views/app_package_list_filter.js");

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
    // 选择过滤条件
    let result = await devicesPackageListFilter();
    if (result == undefined) return;

    let { ViewAssociatedFiles, options, filterPackageName } = result;

    let cmd = `${adbPath} -s ${serialno_id} shell pm list packages ${options}`;
    if (ViewAssociatedFiles) {
        cmd = cmd + " -f";
    };
    if (filterPackageName.trim() != "") {
        cmd = cmd  + " " + filterPackageName;
    };

    let optionsText = "所有";
    if (options == "-3") {
        optionsText = "第三方";
    } else if (options == "-s") {
        optionsText = "系统";
    } else if (options == "-e") {
        optionsText = "已启用的";
    } else if (options == "-d") {
        optionsText = "已停用的";
    };

    hxConsoleOutput(`正在获取手机设备 ${optionsText}软件包......`);

    await adbRun(cmd).then(result => {
        hxConsoleOutput(`获取手机设备 ${optionsText}软件包，结果如下:`, "success");
        hxConsoleOutput(`\n${result}`);
    }).catch((err) => {
        hxConsoleOutput(`获取手机设备 ${optionsText}软件包失败.`, 'error');
        hxConsoleOutput(`具体错误: ${err}`, 'error');
    });
};

module.exports = {
    adb_shell_pm_clear,
    adb_shell_pm_list_packages,
};
