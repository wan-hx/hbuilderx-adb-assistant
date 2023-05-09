const hx = require('hbuilderx');

/**
 * @description 获取apk包名信息
 */
async function devicesPackageListFilter() {

    const cssStyle = `style="font-size: 11px;color: gray;"`;
    const subtitle = `对应的命令: adb shell pm list packages`;

    let result = await hx.window.showFormDialog({
        title: "Android 设备查看手机系统软件包列表",
        subtitle: subtitle,
        formItems: [
            {type: "input",name: "filterPackageName",label: "包名过滤",placeholder: 'app包名关键字，可不填，不填写默认显示所有',value: ""},
            {
                "type": "checkBox",
                "name": "ViewAssociatedFiles",
                "label": "查看关联文件, 即 -f 参数",
                "value": false
            },
            {
                "type": "radioGroup",
                "name": "options",
                "label": "要查看的软件包: ",
                "items": [
                  {"label": "显示所有","id": "-a"},
                  {"label": "仅显示系统软件包","id": "-s"},
                  {"label": "仅显示第三方软件包","id": "-3"},
                  {"label": "仅显示已启用的","id": "-e"},
                  {"label": "仅显示已停用的","id": "-d"},
                  
                ],
                "value": "-a"
            }  
        ],
        width: 480,
        height: 280,
        submitButtonText: "确定(&S)",
        cancelButtonText: "关闭(&C)",
        validate: function(formData) {
            return true;
        }
    }).then((res) => {
        console.log(res);
        return res;
    }).catch((err) => {
        return undefined;
    });
    if (result == undefined) return;
    return result;
};

module.exports = devicesPackageListFilter;
