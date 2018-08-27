
let download = require('download-git-repo')
let path = require('path')
let ora = require('ora')

module.exports = function (target, downLoadUrl) {
    target = path.join(target || '.', '.download-temp')
    return new Promise((resolve, reject) => {
        let spinner = ora(`正在下载模板，源地址：${downLoadUrl}`).start()
        download(downLoadUrl, target, {clone: true}, (err) => {
            if(err){
                spinner.fail()
                reject(err)
            } else {
                spinner.succeed()
                resolve(target)
            }
        })
    })
}