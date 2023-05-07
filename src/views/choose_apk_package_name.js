const hx = require('hbuilderx');

/**
 * @description 选择要操作的apk包名信息
 */
async function chooseApkPackageName() {

    const cssStyle = `style="font-size: 11px;color: gray;"`;
    const subtitle = ``;

    const packageInfo = `<p ${cssStyle}>Android App 包名，比如io.dcloud.HBuilder。</p>`;

    let result = await hx.window.showFormDialog({
        title: "Android Apk包名信息",
        subtitle: subtitle,
        formItems: [
            {type: "input",name: "packageName",label: "App包名",placeholder: '请输入要操作的android app包名',value: ""},
            {type: "label",name: "packageInfo",text: packageInfo}
        ],
        width: 480,
        height: 150,
        submitButtonText: "确定(&S)",
        cancelButtonText: "关闭(&C)",
        validate: function(formData) {
            if (formData.packageName.trim() == "") {
                this.showError("包名不能为空，请重新填写");
                return false;
            };
            return true;
        }
    }).then((res) => {
        console.log(res);
        return res;
    }).catch((err) => {
        return undefined;
    });
    
    if (result == undefined) return;

    let { packageName } = result;
    if (packageName.trim() == "") {
        result.packageName = "io.dcloud.HBuilder";
    };
    return result;
};

module.exports = chooseApkPackageName;
