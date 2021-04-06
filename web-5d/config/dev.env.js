/*
 * @Author: your name
 * @Date: 2021-01-06 10:16:06
 * @LastEditTime: 2021-01-06 15:25:25
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \web-5d\config\dev.env.js
 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"http://192.168.0.111:10002/"'
})
