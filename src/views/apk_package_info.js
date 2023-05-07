const hx = require('hbuilderx');

/**
 * @description 获取apk包名信息
 */
async function getApkPackageInfo() {

    const cssStyle = `style="font-size: 11px;color: gray;"`;
    const subtitle = ``;

    const packageInfo = `<p ${cssStyle}>HBuilder标准基座默认包名为: io.dcloud.HBuilder , 启动activity为: io.dcloud.PandoraEntry。<br/>如果上面的输入框不填写，将默认使用这些信息。</p>`;

    let result = await hx.window.showFormDialog({
        title: "Android Apk包信息",
        subtitle: subtitle,
        formItems: [
            {type: "input",name: "packageName",label: "packageName",placeholder: 'android app包名',value: ""},
            {type: "input",name: "activityName",label: "activityName",placeholder: 'android app activityName',value: ""},
            {type: "label",name: "packageInfo",text: packageInfo}
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

    let { packageName, activityName } = result;
    if (packageName.trim() == "") {
        result.packageName = "io.dcloud.HBuilder";
    };
    if (activityName.trim() == "") {
        result.activityName = "io.dcloud.PandoraEntry";
    };

    return result;
};

module.exports = getApkPackageInfo;
