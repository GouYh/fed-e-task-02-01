// Grunt 的入口文件
// 用于定义一些需要Grunt自动执行的任务
// 需要导出一个函数
// 此函数接受一个grunt的形参，内部提供一些创建任务时可以用到的API

module.exports = grunt => {
    grunt.registerTask('foo', () => {
        console.log('hello grunt')
    })

    grunt.registerTask('bar', '任务描述', () => {
        console.log('bar grunt')
    })

    // grunt.registerTask('default', () => {
    //     console.log('default grunt')
    // })

    grunt.registerTask('default', ['foo', 'bar'])

    grunt.registerTask('async-task', function () {
        const done = this.async()
        setTimeout(() => {
            console.log('async task working')
            done()
        }, 1000)
    })
}

// 多目标任务

module.exports = grunt => {
    grunt.initConfig({
        build: {
            options: {
                foo: 'bar'
            }
        },
        css: {
            options: {
                foo: 'baz'
            }
        },
        js: '2'
    })

    grunt.registerMultiTask('build', function () {
        console.log(this.options())
        console.log(`target: ${this.target}, data: ${this.data}`)
    })
}