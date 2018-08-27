let fs = require('fs-extra')

module.exports = function(copyFrom, copyTo){
    return new Promise((resolve, reject) => {
        fs.copy(copyFrom, copyTo, {
            overwrite: false,
            errorOnExist: false,
        }).then(() => {
            return resolve({
                copyFrom: copyFrom,
                copyTo: copyTo
            })
        }).catch(err => {
            return reject(err)
        })
    })
}