// gulp 入口文件
// gulp约定每一个任务都是一个异步任务

// exports.foo = done => {
//     console.log('foo task working~')
//     done() // 标识任务完成
// }

// exports.default = done => {
//     console.log('default task working~')
//     done()
// }

// 注意：在gulp4.0以前，注册gulp的任务需要通过gulp模块的方法去实现
// const gulp = require('gulp')
// gulp.task('bar', done => {
//     console.log('bar task working~')
//     done()
// })

// 创建组合任务
// const { series, parallel } = require('gulp')

// const task1 = done => {
//     setTimeout(() => {
//         console.log('task1 working ~')
//         done()
//     }, 1000)
// }

// const task2 = done => {
//     setTimeout(() => {
//         console.log('task2 working ~')
//         done()
//     }, 1000)
// }

// const task3 = done => {
//     setTimeout(() => {
//         console.log('task3 working ~')
//         done()
//     }, 1000)
// }

// exports.foo = series(task1, task2, task3) // 依次执行，串行任务结构
// exports.bar = parallel(task1, task2, task3) // 并行任务结构

// Gulp 的异步任务

// exports.callback = done => {
//     console.log('callback task~')
//     done()
// }

// exports.callback_error = done => {
//     console.log('callback task~')
//     done(new Error('task failed'))
// }

// exports.promise = () => {
//     console.log('promise task~')
//     return Promise.resolve()
// }

// exports.promise_err = () => {
//     console.log('promise task~')
//     return Promise.reject(new Error('task failed~'))
// }

// const timeout = time => {
//     return new Promise(resolve => {
//         setTimeout(resolve, time)
//     })
// }

// exports.async = async () => {
//     await timeout(1000)
//     console.log('async task~')
// }

// exports.stream = () => {
//     const readStream = fs.createReadStream('package.json')
//     const writeStream = fs.createWriteStream('temp.txt')
//     readStream.pipe(writeStream)
//     return readStream
// }

// exports.stream = done => {
//     const readStream = fs.createReadStream('package.json')
//     const writeStream = fs.createWriteStream('temp.txt')
//     readStream.pipe(writeStream)
//     readStream.on('end', () => {
//         done()
//     })
// }

// 模拟构建过程
const fs = require('fs')
const {Transform} = require('stream')

exports.default = () => {
    // 文件读取
    const read = fs.createReadStream('test.css')
    // 文件写入流
    const write = fs.createWriteStream('test.min.css')
    // 文件转换流
    const transform = new Transform({
        transform: (chunk, encoding, callback) => {
            // 核心转换过程实现
            // chunk => 读取流中读取到的内容（Buffer）
            const input = chunk.toString() // 将字节数组转换为string
            const output = input.replace(/\s+/g, '').replace(/\/\*.+?\*\//g, '')
            callback(null, output)
        }
    })

    // 把读取出来的文件流导入写入文件
    read
        .pipe(transform) // 转换
        .pipe(write) // 写入

    return read
}
