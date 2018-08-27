let metalsmith = require('metalsmith')
let handlebars = require('handlebars')
let rm = require('rimraf').sync

module.exports = function(metadata = {}, src, dest = '.'){
    if(!src){
        return Promise.reject(new Error('无效的source'))
    }

    return new Promise((resolve, reject) => {
        metalsmith(process.cwd())
            .metadata(metadata)
            .clean(false)
            .source(src)
            .destination(dest)
            .use((files, that, done) => {
                let meta = that.metadata()
                Object.keys(files).forEach(fileName => {
                    if(fileName.indexOf('.json') >= 0) {
                        let t = files[fileName].contents.toString()
                        files[fileName].contents = new Buffer(handlebars.compile(t)(meta))
                    }
                })
                done()
            }).build(err => {
                rm(src)
                err ? reject(err) : resolve()
            })
    })
}

