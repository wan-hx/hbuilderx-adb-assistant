const hx = require('hbuilderx');
let http = require('http');
let https = require('https');
let os = require('os');
let path = require('path');
let fs = require('fs');

let osName = os.platform();

/**
 * @description 获取HBuilderX配置
 * @param {Object} options
 */
async function hxConfigGet(optionsName) {
    let config = await hx.workspace.getConfiguration();
    return config.get(optionsName);
};

/**
 * @description 更新HBuilderX设置
 * @param {Object} pluginName
 * @param {Object} key
 * @param {Object} value
 */
async function hxConfigUpdate(pluginName, key, value) {
    try{
        let config = hx.workspace.getConfiguration(pluginName);
        config.update(key, value).then((data) => {
            let msg = "Ask_ChatGPT: 更新配置项成功";
            hx.window.setStatusBarMessage(msg, 2000, 'info');
        }).catch((err) => {
            hx.window.showInformationMessage("Ask_ChatGPT: 更新配置项失败");
        });
    }catch(e){
        console.log(e)
    }
};

/**
 * @description 对话框
 *     - 插件API: hx.window.showMessageBox
 *     - 已屏蔽esc事件，不支持esc关闭弹窗；因此弹窗上的x按钮，也无法点击。
 *     - 按钮组中必须提供`关闭`操作。且关闭按钮需要位于数组最后。
 * @param {String} title
 * @param {String} text
 * @param {String} buttons 按钮，必须大于1个
 * @return {String}
 */
async function hxShowMessageBox(title, text, buttons = ['关闭']) {
    return new Promise((resolve, reject) => {
        if ( buttons.length > 1 && (buttons.includes('关闭') || buttons.includes('取消')) ) {
            if (osName == 'darwin') {
                buttons = buttons.reverse();
            };
        };
        hx.window.showMessageBox({
            type: 'info',
            title: title,
            text: text,
            buttons: buttons,
            defaultButton: 0,
            escapeButton: -100
        }).then(button => {
            resolve(button);
        }).catch(error => {
            reject(error);
        });
    });
};

/**
 * @description 创建独立输出控制台
 * @param {String} msg
 * @param {msgLevel} msgLevel (warning | success | error | info), 控制文本颜色
 */
function hxConsoleOutput(msg, msgLevel="info") {
    let outputView = hx.window.createOutputView({"id":"adbAssistant","title":"adb助手"});
    outputView.show();

    outputView.appendLine({
        line: msg,
        level: msgLevel,
    });
};


/**
 * @description 右下角弹窗
 * @param {String} msg
 */
function hxMessageInfo(msg) {
    hx.window.showInformationMessage(msg, ["我知道了"]);
};


module.exports = {
    hxMessageInfo,
    hxShowMessageBox,
    hxConfigGet,
    hxConfigUpdate,
    hxConsoleOutput,
}
