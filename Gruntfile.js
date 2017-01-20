/*jslint node: true */
/*global module:false*/

module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

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
                    compress: true
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
                            'styles/{,*/}*.*'
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
        }

    };

    // Project configuration
    grunt.initConfig(cfg);

    grunt.registerTask('compile', [
        'newer:eslint',
        'wiredep',
        'less'
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
        'clean:tmp'
    ]);

    grunt.registerTask('unit', [
        'compile',
        'karma:unit'
    ]);
};
