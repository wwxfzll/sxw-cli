let metalsmith = require('metalsmith')
let handlebars = require('handlebars')
let rm = require('rimraf').sync

module.exports = function(metadata = {}, src, dest = '.', fillMatchs){
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
                    //主要是为了package.json
                    if(fileName.indexOf('.json') >= 0) {
                        let t = files[fileName].contents.toString()
                        files[fileName].contents = new Buffer(handlebars.compile(t)(meta))
                    }
                    //目前暂时为组件模板添加该配置
                    if(fillMatchs.length > 0){
                        fillMatchs.forEach(fillMatch => {
                            if(fileName.indexOf(fillMatch) >= 0){
                                let t = files[fileName].contents.toString()
                                files[fileName].contents = new Buffer(handlebars.compile(t)(meta))
                            }
                        })
                    }
                })
                done()
            }).build(err => {
                rm(src)
                err ? reject(err) : resolve()
            })
    })
}

