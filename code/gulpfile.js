const { src, dest, parallel, series, watch } = require('gulp')
// watch 用于监视一个路径通配符

const browserSync = require('browser-sync')

// 自动加载插件
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()

// const sass = require('gulp-sass') // gulp-sass默认以下划线开头的文件为依赖文件，不会转换
// const babel = require('gulp-babel')
// const swig = require('gulp-swig')
// const imagemin = require('gulp-imagemin')

// 创建开发服务器
const bs = browserSync.create()

const del = require('del')

const data = [
    {
        menus: [],
        pkg: require('./package.json'),
        date: new Date()
    }
]

// 文件清除
const clear = () => {
    return del(['dist', 'temp'])
}

// 样式编译
const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' }) // base 指定保留该目录下的目录结构
        .pipe(plugins.sass({ outputStyle: 'expanded' }))
        .pipe(dest('temp'))
        // 。pipe(bs.reload({ stream: true })) // 在bs的files字段之外的监听方式
}

// 脚本编译
const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('temp'))
}

// 页面模板编译
const page = () => {
    // return src('src/**/*.html') // src中任意子目录下的html文件
    return src('src/*.html', { base: 'src' })
        .pipe(plugins.swig({ data })) // 配置网页数据
        .pipe(dest('temp'))
}

// 图片转换
const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(plugins.imagemin()) // 无损压缩
        .pipe(dest('dist'))
}

// 字体文件
const font = () => {
    return src('src/assets/fonts/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

// 其他文件
const extra = () => {
    return src('public/**', { base: 'public' })
        .pipe(dest('dist'))
}

// 配置开发服务器
const serve = () => {
    // 文件修改后，会执行相应的任务，从而触发dist目录下文件的修改，
    // 然后由于bs的files的监听，触发浏览器中内容的改变,
    // 页面模板修改可能会因为swig模块引擎缓存的机制导致页面不会变化，
    // 此时需要额外将swig选项中的cache设置为false
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/scripts/*.scss', script)
    watch('src/*.html', page)

    // 在开发过程中，图片，字体等文件可以不用编译，以减少构建时不必要的开销
    // watch('src/assets/images/**', image)
    // watch('src/assets/fonts/**', font)
    // watch('public/**', extra)

    // 在开发环境监听图片字体等的变化，变化后触发重新加载
    watch([
        'src/assets/images/**',
        'src/assets/fonts/**',
        'public/**'
    ], bs.reload)

    bs.init({
        notify: false, // 去除提示
        port: 2000, // 设置端口号，默认3000
        // open: false, // 默认为true，可以自动打开浏览器
        files: 'dist/**', // 用于启动后监听的路径通配符
        server: {
            // baseDir: 'dist', // 配置网页的根目录，浏览器中运行的是加工过后的dist目录
            baseDir: ['temp', 'src', 'public'], // 支持一个数组，当请求过来后，先从数组中第一个目录中寻找，依次查找
            routes: {
                '/node_modules': 'node_modules' // 配置开发环境的路由映射
            }
        }
    })
}

// 将构建注释中的文件，合并到一个文件中
const useref = () => {
    // 创建了temp临时目录，解决了解决冲突时，构建目录被打破的问题
    return src('temp/*.html', { base: 'dist' })
        .pipe(plugins.useref({ searchPath: ['dist', '.'] }))
        // 此处会有3种文件类型:html, css, js，我们需要对useref生成的文件进行压缩
        // 注意，当文件中构建注释不存在时，useref就不会生成文件
        .pipe(plugins.if(/\.js$/, plugins.uglify()))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        // 可以指定minifyCss删除行内样式的空格，minifyJs的script中的空格
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({
             collapseWhitespace: true,
             minifyCss: true,
             minifyJs: true
        }))) // htmlmin 默认只删除一些空格字符，故可以指定一个选项，collapseWhitespace: true
        // .pipe(dest('dist')) // 此处读写流均在一个目录中，容易冲突
        .pipe('dist') //为了解决冲突，我们更改目录为release，此处打破了构建目录结构
}

const compile = parallel(style, script, page)

const build = parallel(compile, extra)

// 上线前执行的任务
const cleanBuild = series(
    clean,
    parallel(
        series(complie, useref),
        image,
        font,
        extra
    )
)

// 开发环境执行的任务
const develop = series(compile, serve)

module.exports = {
    clean,
    develop,
    cleanBuild
}