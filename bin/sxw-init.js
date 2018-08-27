#!/usr/bin/env node

let paramsHandler = require('commander')
let path = require('path')
let fs = require('fs')
let glob = require('glob')
let inquirer = require('inquirer')
let lastestVersion = require('latest-version')
let chalk = require('chalk')
let logSymbols = require('log-symbols')


let download = require('../lib/download')
let copyDir = require('../lib/copyDir')
let generator = require('../lib/generator')


paramsHandler
    .usage('<project-name>')
    .parse(process.argv)


let projectName = paramsHandler.args[0]

if(!projectName){
    paramsHandler.help()
    return
}

let mlList = glob.sync('*')
let rootName = path.basename(process.cwd())


let next = undefined
if(mlList.length){
    let siMlList = mlList.filter(name => {
        let filename = path.resolve(process.cwd(), path.join('.', name))
        let isDir = fs.statSync(filename).isDirectory()
        return name === projectName && isDir
    })
    if(siMlList.length > 0 ){
        console.log('项目' + projectName + '已经存在')
        return 
    }
    next = Promise.resolve(projectName)
    //rootName = projectName
} else if(rootName === projectName){
    next = inquirer.prompt([
        {
            name: 'buildInCurrent',
            message: '是否直接在当前目录下创建新项目？',
            type: 'confirm',
            default: true
        }
    ]).then(answers => {
        return Promise.resolve(answers.buildInCurrent ? '.' : projectName)
    })
    //rootName = '.'
} else{
    next = Promise.resolve(projectName)
    //rootName = projectName
}


let templatePath = require('../config/templatePath.json')
if (next) {
    inquirer.prompt([
        {
            name: 'type',
            type: 'list',
            message: '开发类型',
            choices: [
                {
                    name: '组件',
                    value: 'component'
                },
                {
                    name: '产品',
                    value: 'product'
                },
                {
                    name: '项目',
                    value: 'project'
                }
            ]
        }
    ]).then(answers => {
        let downLoadUrl = templatePath[answers.type]
        go(downLoadUrl)
    })
}



function go(downLoadUrl){
    next.then(projectRoot => {
        if(projectRoot !== '.'){
            fs.mkdirSync(projectRoot)
        }
        return download(projectRoot, downLoadUrl).then(target => {
            return {
                name: projectName,
                root: projectRoot,
                downloadTemp: target
            }
        })
    }).then(context => {
        return inquirer.prompt([
            {
                name: 'name',
                message: '项目的名称',
                default: context.name
            },
            {
                name: 'author',
                message: '项目的作者'
            },
            {
                name: 'description',
                message: '项目的简介',
                default: 'A project named ' + context.name
            }
        ]).then(answers => {
            generator(answers, context.downloadTemp, context.root).then(result => {
                console.log(logSymbols.success, chalk.green('创建成功'))
                //console.log('创建成功')
                console.log()
                //console.log(chalk.green('cd ' + context.root + '\n npm install \n npm run dev'))

              }).catch(err => {
                //console.error(`创建失败：${err.message}`)
                console.log(logSymbols.error, chalk.red(`创建失败：${err.message}`))
              }) 
            // lastestVersion('vue').then(version => {
            //     console.log(version)
            // })
        })
    })
}





// download(rootName)
//     .then(target => {
//         console.log(target)
//         let cwd = process.cwd()
//         let copyFrom = path.resolve(cwd, path.join('.', target))
//         let copyTo = path.resolve(cwd, projectName)
//         copyDir(copyFrom, copyTo).then(() => {
//             console.log('复制成功')
//         }).catch(() => {
//             console.log('复制失败')
//         })
//     })
//     .catch(err => {
//         console.log(err)
//     })






