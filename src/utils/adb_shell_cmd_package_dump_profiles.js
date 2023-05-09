const adbRun = require('./adb_run.js');
const chooseApkPackageName = require('../views/choose_apk_package_name.js');

const { 
    hxConsoleOutput,
    hxConsoleOutputForLink
} = require("./hx_utils.js");

/**
 * @description 读取应用的 ART 配置文件. 从 Android 7.0（API 级别 24）开始，Android 运行时 (ART) 会收集已安装应用的执行配置文件，这些配置文件用于优化应用性能。您可以检查收集的配置文件，了解在应用启动期间，系统频繁执行了哪些方法和使用了哪些类。
 */
async function adb_shell_cmd_package_dump_profiles(adbPath, serialno_id) {
    let info = await chooseApkPackageName();
    if (info == undefined) return;
    let { packageName } = info;

    // 读取应用的 ART 配置文件
    hxConsoleOutput(`正在获取应用的 ART 配置文件......`);
    hxConsoleOutput(`从 Android 7.0（API 级别 24）开始，Android 运行时 (ART) 会收集已安装应用的执行配置文件，这些配置文件用于优化应用性能。您可以检查收集的配置文件，了解在应用启动期间，系统频繁执行了哪些方法和使用了哪些类。`);
    hxConsoleOutput(`adb shell cmd package dump-profiles ${packageName} ......`);

    let cmd = `${adbPath} -s ${serialno_id} shell cmd package dump-profiles ${packageName}`;
    let result = await adbRun(cmd).catch((err) => {
        hxConsoleOutput(`获取内存占用信息失败。具体错误: ${err}`, 'error');
    });

    // 截图成功后，将截图保存到电脑桌面
    if (result == "" || result == undefined) {

        let pc_path = path.join(os.homedir(), "Desktop", `${packageName}.prof.txt`);
        let phone_path = `/data/misc/profman/${packageName}.prof.txt`;

        let cmd_for_pull = `${adbPath} -s ${serialno_id} pull ${phone_path} ${pc_path}`;
        adbRun(cmd_for_pull).then( ()=> {
            hxConsoleOutputForLink(`配置文件已从手机发送到电脑，具体路径: ${pc_path}`, pc_path, "success");
        }).catch((err) => {
            hxConsoleOutput(`将配置文件从手机向电脑传送时失败.具体错误: ${err}`, 'error');
        });
    };
};

module.exports = adb_shell_cmd_package_dump_profiles;