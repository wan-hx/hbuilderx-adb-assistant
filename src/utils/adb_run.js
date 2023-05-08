const { exec } = require('child_process');

/**
 * @description 公共方法：执行adb命令
 * @param {String} cmd
 * @returns
 */
function adbRun(cmd) {
    return new Promise((resolve, reject) => {
        exec(`${cmd}`, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout.trim());
            }
        });
    });
};

module.exports = adbRun;