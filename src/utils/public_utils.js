const http = require('http');
const https = require('https');

/**
 * @description 获取当前时间
 */
function getCurrentTime(format = ":") {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    
    if (format == "_") {
        return year + '' + month + '' + day + '_' + hours + '' + minutes + '' + seconds;
    };
    return year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds;
};

/**
 * @description http get请求
 * @param {string} url
 */
async function httpGet(url, data_type) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                try{
                    if (data_type == "json") {
                        resolve(JSON.parse(data));
                    } else {
                        resolve(data);
                    };
                }catch(e){
                    reject("error");
                };
            });
            res.on("error", (e) => {
                reject("error");
            });
        });
    });
};

module.exports = {
    getCurrentTime,
    httpGet
}