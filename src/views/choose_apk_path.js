const hx = require('hbuilderx');

/**
 * @description 选择apk路径
 */
async function chooseApkPath() {

    const cssStyle = `style="font-size: 11px;color: gray;"`;
    const subtitle = ``;

    let result = await hx.window.showFormDialog({
        title: "Android Apk包信息",
        subtitle: subtitle,
        formItems: [
            {type: "fileSelectInput",name: "apkPath",label: "Apk路径", mode: "file", filters: ["*.apk", "*.APK"], placeholder: '请从本地选择要安装的Apk路径',value: ""}
        ],
        width: 480,
        height: 150,
        submitButtonText: "确定(&S)",
        cancelButtonText: "关闭(&C)",
        validate: function(formData) {
            if (formData.apkPath.trim() == "") {
                this.showError("apkPath不能为空，请重新填写");
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
    return result;
};

module.exports = chooseApkPath;
