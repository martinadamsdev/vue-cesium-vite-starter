/*
 * @Author: your name
 * @Date: 2021-01-13 19:02:04
 * @LastEditTime: 2021-03-02 11:11:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web-5d\config\index.js
 */
'use strict'

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'http://192.168.0.133:10002',
        changeOrigin: true
      },
      '/tag': {
        target: 'http://192.168.0.133:10002',
        changeOrigin: true,
        pathRewrite: {
          '^/tag': ''
        }
      },
      '/car': {
        target: 'http://192.168.0.133:80',
        changeOrigin: true
      },
      '/user': {
        target: 'http://192.168.0.133:10002',
        changeOrigin: true,
        pathRewrite: {
          '^/user': ''
        }
      },
      '/modelTree': {
        target: 'http://192.168.0.92:8082',
        changeOrigin: true,
        pathRewrite: {
          '^/modelTree': ''
        }
      },
      '/annotationView': {
        target: 'http://192.168.0.83:8091',
        changeOrigin: true
      },
      '/doc': {
        target: 'http://192.168.0.159:8082',
        changeOrigin: true,
        pathRewrite: {
          '^/doc': ''
        }
      },
      '/delivery': { // 里程碑
        target: 'http://192.168.0.83:8090',
        changeOrigin: true,
        pathRewrite: {
          '^/delivery': ''
        }
      },
      '/myTask': { // 我的任务 及审核
        target: 'http://192.168.0.159:8081',
        changeOrigin: true
      },
      '/pDeliveryContentDoc': { // 文档交付
        target: 'http://192.168.0.159:8081',
        changeOrigin: true,
         pathRewrite: {
          '^/pDeliveryContentDoc': ''
        }
      },
      '/folderDoc': {
        target: 'http://192.168.0.83:8090/',
        changeOrigin: true,
        pathRewrite: {
          '^/folderDoc': ''
        }
      },
      '/modelProperty': {
        target: 'http://192.168.0.111:10002/',
        changeOrigin: true,
        pathRewrite: {
          '^/modelProperty': ''
        }
      }
    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    useEslint: true,
    showEslintErrorsInOverlay: false,
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
