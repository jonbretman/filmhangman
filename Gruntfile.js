module.exports = function(grunt) {

    grunt.initConfig({

        jshint: {
            files: ['src/js/**/*.js', '!src/js/libs/**/*.js']
        },


        clean: {
            public: ['public']
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'src/js',
                    name: 'main',
                    out: 'public/js/main.js',
                    optimize: 'none'
                }
            }
        },

        sass: {
            options: {
                noCache: true
            },
            compile: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'public/css/main.css': 'src/css/main.scss'
                }
            }
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js/libs',
                        src: ['require.js'],
                        dest: 'public/js/libs'
                    },
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['index.html'],
                        dest: 'public'
                    }
                ]
            }
        },

        watch: {
            scripts: {
                files: 'src/js/**/*.js',
                tasks: ['jshint', 'requirejs:compile', 'copy:main'],
            },
            css: {
                files: 'src/css/*.scss',
                tasks: ['sass:compile']
            },
            html: {
                files: ['src/index.html'],
                tasks: ['copy:main']
            }
        },

        mocha: {
            src: 'target/debug/test/index.html',
            options: {
                run: false,
                reporter: 'Spec',
                log: true
            }
        }

    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['clean', 'jshint', 'sass:compile', 'requirejs:compile', 'copy:main']);
    grunt.registerTask('development', ['default', 'watch']);

};