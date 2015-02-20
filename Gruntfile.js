// Generated on 2014-09-21 using
// generator-webapp 0.5.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Configurable paths
    var config = {
        app: 'app',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        },
        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: [
                    '<%= config.app %>/scripts/{,*/}*.js',
                    '<%= config.app %>/scripts/tests/{,*/}*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            jstest: {
                files: ['<%= config.app %>/scripts/tests/{,*/}*.js'],
                tasks: ['test:watch']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            styles: {
                files: ['<%= config.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            bootstrap: {
                files: ['<%= config.app %>/styles/{,*/}*.less'],
                tasks: ['bootstrap']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/{,*/}*.html',
                    '<%= config.app %>/styles/*.less',
                    '.tmp/styles/{,*/}*.css',
                    '<%= config.app %>/images/{,*/}*'
                ]
            },
            mustache: {
                files: ['<%= config.app %>/templates/{,*/}*'],
                tasks: ['mustache']
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                open: 'http://localhost:9000',
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    open: false,
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    base: '<%= config.dist %>',
                    livereload: false
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= config.dist %>/*',
                            '!<%= config.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: [ '.tmp', 'test_results' ]
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/scripts/tests/{,*/}*.js',
                '<%= config.app %>/scripts/{,*/}*.js',
                '!<%= config.app %>/scripts/vendor/*',
                '!<%= config.app %>/scripts/sinon-1.10.3.js',
                '!<%= config.app %>/scripts/templates.js' ]
        },

        // Jasmine testing framework configuration options
        jasmine: {
            all: {
                src: [
                    '<%= config.app %>/scripts/templates.js',
                    '<%= config.app %>/scripts/views/{,*/}*.js'
                ],
                options: {
                    specs: '<%= config.app %>/scripts/tests/{,*/}*.js',
                    vendor: [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/bootstrap/docs/assets/js/bootstrap.js',
                        '<%= config.app %>/scripts/sinon-1.10.3.js'
                    ],
                    junit: {
                        path: 'test_results',
                        consolidate: true
                    }
                }
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '{,*/}*.css',
                        dest: '.tmp/styles/'
                    }
                ]
            }
        },

        // Automatically inject Bower components into the HTML file
        wiredep: {
            app: {
                ignorePath: /^\/|\.\.\//,
                src: ['<%= config.app %>/*.html']
            }
        },

        // Renames files for browser caching purposes1
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= config.dist %>/scripts/{,*/}*.js',
                        '<%= config.dist %>/styles/{,*/}*.css',
                        '<%= config.dist %>/images/{,*/}*.*',
                        '<%= config.dist %>/styles/fonts/{,*/}*.*',
                        '<%= config.dist %>/*.{ico,png}'
                    ]
                }
            }
        },

        recess: {
            bootstrap: {
                options: {
                    compile: true
                },
                files: {
                    'bower_components/bootstrap/dist/css/bootstrap.css': 'bower_components/bootstrap/less/bootstrap.less'
                }
            }
        },

        mustache: {
            files: {
                src: '<%= config.app %>/templates',
                dest: '<%= config.app %>/scripts/templates.js',
                options: {
                    prefix: 'var Templates = ',
                    postfix: ';'
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: '<%= config.app %>/*.html'
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
            },
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/styles/{,*/}*.css']
        },

// The following *-min tasks produce minified files in the dist folder
// TODO: Disabled because of bug on build server
//        imagemin: {
//            dist: {
//                files: [
//                    {
//                        expand: true,
//                        cwd: '<%= config.app %>/images',
//                        src: '{,*/}*.{gif,jpeg,jpg,png}',
//                        dest: '<%= config.dist %>/images'
//                    }
//                ]
//            }
//        },

        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>/images',
                        src: '{,*/}*.svg',
                        dest: '<%= config.dist %>/images'
                    }
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.dist %>',
                        src: '{,*/}*.html',
                        dest: '<%= config.dist %>'
                    }
                ]
            }
        },
        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.app %>',
                        dest: '<%= config.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            'images/{,*/}*.webp',
                            '{,*/}*.html',
                            'styles/fonts/{,*/}*.*'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: 'bower_components/bootstrap/dist',
                        src: 'img/*',
                        dest: '<%= config.dist %>'
                    }
                ]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
            bootstrap: {
                files: [
                    {
                        src: '<%= config.app %>/styles/bootstrap.less',
                        dest: 'bower_components/bootstrap/less/variables.less'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: 'bower_components/bootstrap/img/*',
                        dest: 'bower_components/bootstrap/dist/img/'
                    }
                ]
            }
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                //'imagemin',
                'svgmin'
            ]
        }
    });


    grunt.registerTask('bootstrap', function () {
        grunt.task.run([
            'copy:bootstrap',
            'recess'
        ]);
    });


    grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
        if (grunt.option('allow-remote')) {
            grunt.config.set('connect.options.hostname', '0.0.0.0');
        }
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'bower',
            'jshint',
            'bootstrap',
            'wiredep',
            'useminPrepare',
            'concurrent:server',
            'autoprefixer',
            'mustache',
            'concat',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', function (target) {
        if (target !== 'watch') {
            grunt.task.run([
                'clean:server',
                'bower',
                'jshint',
                'concurrent:test',
                'autoprefixer',
                'mustache'
            ]);
        }

        grunt.task.run([
            'connect:test',
            'jasmine'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'bower',
        'jshint',
        'bootstrap',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'mustache',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'test',
        'build:dist'
    ]);
};
