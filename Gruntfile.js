/*jslint node: true */
/*global module:false*/

module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    var serveStatic = require('serve-static');
    var modRewrite = require('connect-modrewrite');

    var cfg = {
        pkg: grunt.file.readJSON('package.json'),

        defaults: {
            source: {
                dir: 'app'
            },
            dist: {
                dir: 'dist'
            },
            tmp: {
                dir: '.tmp'
            },
            test: {
                dir: 'test'
            }
        },

        eslint: {
            grunt: ['Gruntfile.js'],
            js: ['<%= defaults.source.dir %>/**/*.js'],
            test: ['<%= defaults.test.dir %>/unit/**/*.js', '<%= karma.unit.configFile %>']
        },

        wiredep: {
            app: {
                src: ['<%= defaults.source.dir %>/index.html'],
                ignorePath: /\.\.\//
            },

            test: {
                devDependencies: true,
                src: '<%= karma.unit.configFile %>',
                ignorePath: /\.\.\//,
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },

        concat: {
            options: {
                separator: '\n',
                sourceMap: true
            },
            appJsDist: {
                src: ['<%= defaults.source.dir %>/js/**/*.js'],
                dest: '<%= defaults.tmp.dir %>/build/app.js'
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: {
                    '<%= defaults.tmp.dir%>/build/app.annotated.js': ['<%= concat.appJsDist.dest %>']
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    '<%= defaults.tmp.dir%>/build/app.min.js': ['<%= defaults.tmp.dir%>/build/app.annotated.js'],
                    '<%= defaults.tmp.dir%>/build/vendor.min.js': ['<%= defaults.tmp.dir%>/concat/js/vendor.min.js']
                }
            }
        },

        less: {
            development: {
                options: {
                    paths: ['<%= defaults.source.dir %>/less', 'bower_components/**/less'],
                    optimization: 2,
                    compress: true,
                    plugins: [
                        new (require('less-plugin-autoprefix'))({
                            browsers: [
                                'Chrome >= 31'
                            ]
                        }),
                        new (require('less-plugin-clean-css'))({advanced: true})
                    ]
                },
                files: {
                    '<%= defaults.source.dir %>/styles/styles.min.css': '<%= defaults.source.dir %>/less/main.less'
                }
            }
        },

        useminPrepare: {
            html: '<%= defaults.source.dir %>/index.html',
            options: {
                dest: '<%= defaults.tmp.dir%>/concat',
                flow: {
                    html: {
                        steps: {
                            js: ['concat'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        usemin: {
            html: ['<%= defaults.dist.dir %>/index.html'],
            options: {
                assetsDirs: ['<%= defaults.dist.dir %>'],
                blockReplacements: {
                    base: function (block) {
                        return '<base href="' + block.dest + '">';
                    }
                }
            }
        },

        filerev: {
            dist: {
                src: [
                    '<%= defaults.dist.dir %>/js/**/*.js',
                    '<%= defaults.dist.dir %>/styles/**/*.css'
                ]
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= defaults.source.dir %>',
                        dest: '<%= defaults.dist.dir %>',
                        src: [
                            '*.{ico,png,jpg}',
                            '*.html',
                            'views/{,*/}*.html',
                            'images/{,*/}*',
                            'styles/{,*/}*.*',
                            'CA/*.crt'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '<%= defaults.tmp.dir%>/build',
                        dest: '<%= defaults.dist.dir %>/js',
                        src: ['app.min.js', 'vendor.min.js']
                    },
                    {
                        expand: true,
                        cwd: '<%= defaults.tmp.dir%>/concat/styles',
                        dest: '<%= defaults.dist.dir %>/styles',
                        src: ['vendor.min.css']
                    }
                ]
            }
        },

        htmlmin: {
            options: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                collapseBooleanAttributes: true,
                removeCommentsFromCDATA: true,
                removeOptionalTags: true
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= defaults.dist.dir %>',
                        src: ['*.html', 'views/*.html'],
                        dest: '<%= defaults.dist.dir %>'
                    }
                ]
            }
        },

        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },

        clean: {
            tmp: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= defaults.tmp.dir %>/*'
                        ]
                    }
                ]
            },
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= defaults.dist.dir %>'
                        ]
                    }
                ]
            }
        },

        portChecker: {
            connect: {
                target: 'connect.options.port',
                affectPaths: []
            },
            livereload: {
                target: 'connect.options.livereload',
                affectPaths: []
            }
        },

        watch: {
            dev: {

                files: [
                    '<%= eslint.js %>',
                    '<%= defaults.source.dir %>/views/**/*.html'
                ],

                tasks: ['newer:eslint:js'],
                options: {
                    livereload: {
                        port: '<%= connect.options.livereload %>'
                    }
                }
            },
            less: {
                files: ['<%= defaults.source.dir %>/less/**/*.less'],
                tasks: ['less'],
                options: {
                    livereload: {
                        port: '<%= connect.options.livereload %>'
                    }
                }
            },
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            unit: {
                files: ['<%= eslint.test %>'],
                tasks: ['wiredep:test', 'newer:eslint:test', 'karma']
            }
        },

        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729
            },
            proxies: [],
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect().use(
                                '/bower_components',
                                serveStatic('./bower_components')
                            ),
                            require('grunt-connect-proxy/lib/utils').proxyRequest,
                            modRewrite(['^[^\\.]*$ /index.html [L]']),
                            serveStatic(cfg.defaults.source.dir)
                        ];
                    }
                }
            }
        }
    };

    // Project configuration
    grunt.initConfig(cfg);

    grunt.registerTask('compile', [
        'newer:eslint',
        'wiredep',
        'less'
    ]);

    grunt.registerTask('serveLive', [
        'compile',
        'portChecker',
        'configureProxies',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', [
        'eslint',
        'clean:dist',
        'wiredep',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'less',
        'concat:appJsDist',
        'ngAnnotate:dist',
        'uglify:dist',
        'copy:dist',
        'filerev',
        'usemin:html',
        'htmlmin:dist',
        'clean:tmp'
    ]);

    grunt.registerTask('unit', [
        'compile',
        'portChecker',
        'karma:unit'
    ]);
};
