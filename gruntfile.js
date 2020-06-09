// 实现这个项目的构建任务

const loadGruntTasks = require('load-grunt-tasks')
const sass = require('node-sass')
const optipng = require('imagemin-optipng')

module.exports = grunt => {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: 'dist'
        },
        sass: {
            options: {
                implementation: sass,
                // sourceMap: true
            },
            dist: {
                files: {
                    'dist/assets/styles/main.css': 'src/assets/styles/main.scss'
                }
            }
        },
        babel: {
            options: {
                presets: ['@babel/preset-env']
            },
            main: {
                files: {
                    'dist/assets/scripts/main.js': 'src/assets/scripts/main.js'
                }
            }
        },
        watch: {
            js: {
                files: ['src/assets/scripts/*.js'],
                tasks: ['babel']
            },
            css: {
                files: ['src/assets/styles/*.scss'],
                tasks: ['sass']
            }
        },
        cssmin: {
            target: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/assets/styles',
                        src: ['*.css', '!*.min.css'],
                        dest: 'dist/assets/styles',
                        ext: '.min.css'
                    }
                ]
            }
        },
        uglify: {
            target: {
                files: {
                    'dist/assets/scripts/main.min.js': ['dist/assets/scripts/main.js']
                }
            }
        },
        imagemin: {
            // static: {
            //     options: {
            //         optimizationLevel: 3,
            //         use: [optipng()]
            //     },
            //     files: {
            //         'dist/assets/images/logo.png': 'src/assets/images/logo.svg'
            //     }
            // },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/images/',
                    src: ['**/*.{png, jpg}'],
                    dest: 'dist/assets/images/'
                }]
            }
        },
        svgmin: {
            options: {
                plugins: [
                    {removeViewBox: false}
                ]
            },
            dist: {
                files: {
                    'dist/assets/images/brands.svg': 'src/assets/images/brands.svg',
                    'dist/assets/fonts/pages.svg': 'src/assets/fonts/pages.svg'
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/layouts/basic.html': 'src/layouts/basic.html',
                    'dist/partials/footer.html': 'src/partials/footer.html',
                    'dist/partials/header.html': 'src/partials/header.html',
                    'dist/about.html': 'src/about.html',
                    'dist/index.html': 'src/index.html'
                }
            }
        }
    })

    loadGruntTasks(grunt) // 自动加载所有的grunt插件任务

    grunt.registerTask('develop', ['clean', 'sass', 'babel', 'watch'])
    grunt.registerTask('build', ['clean', 'sass', 'babel', 'cssmin', 'htmlmin', 'uglify', 'imagemin', 'svgmin'])
}
