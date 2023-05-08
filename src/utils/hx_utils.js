const hx = require('hbuilderx');
const http = require('http');
const https = require('https');
const os = require('os');
const path = require('path');
const fs = require('fs');

const osName = os.platform();

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
 * @description 创建输出控制台, 支持文件链接跳转
 * @param {String} msg
 * @param {String} msgLevel (warning | success | error | info), 控制文本颜色
 * @param {String} linkText 链接文本
 */
function hxConsoleOutputForLink(msg, linkText, msgLevel='info') {
    let outputView = hx.window.createOutputView({"id":"adbAssistant","title":"adb助手"});
    outputView.show();

    if (linkText == undefined || linkText == '') {
        outputView.appendLine({
            line: msg,
            level: msgLevel,
        });
        return;
    };

    let start;
    if (msg.includes(linkText) && linkText != undefined) {
        start = msg.indexOf(linkText);
    };

    outputView.appendLine({
        line: msg,
        level: msgLevel,
        hyperlinks:[
            {
                linkPosition: {
                    start: start,
                    end: start + linkText.length
                },
                onOpen: function() {
                    if (fs.existsSync(linkText)) {
                        return hx.workspace.openTextDocument(linkText);
                    };
                }
            }
        ]
    });
};


/**
 * @description 右下角弹窗
 * @param {String} msg
 */
function hxMessageInfo(msg) {
    hx.window.showInformationMessage(msg, ["我知道了"]);
};


/**
 * @description 解析HBuilderX编辑器中选中的文件
 */
async function hxParseSelectedFile(param, verfiyFileExtName="") {
    let selectedFile = "";
    try{
        try {
            selectedFile = param.fsPath;
        } catch (e) {
            selectedFile = param.document.uri.fsPath;
        };
    } catch(e){};
    
    if (selectedFile != "" && verfiyFileExtName != "") {
        return path.extname(selectedFile) == verfiyFileExtName ? selectedFile : "";
    };
    return selectedFile;
};


module.exports = {
    hxMessageInfo,
    hxShowMessageBox,
    hxConfigGet,
    hxConfigUpdate,
    hxConsoleOutput,
    hxConsoleOutputForLink,
    hxParseSelectedFile
}
