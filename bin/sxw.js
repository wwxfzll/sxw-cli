#!/usr/bin/env node

let paramsHandler = require('commander')

paramsHandler
    .version('1.0.0')
    .usage('<cmd> [项目名称]')
    .command('init','测试初始化')
    .parse(process.argv)

