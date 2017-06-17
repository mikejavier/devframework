"use strict";

module.exports = function( grunt ) {

    // Definição dos arquivos js
    var filesJS = ['tmp/js/main.js']

    // Definição dos arquivos css
    var filesCSS = ['tmp/css/main.css'];

    // Load all tasks
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt,{
        cmq: 'grunt-combine-media-queries',
    });

    grunt.initConfig({
        // Watch
        watch: {
            precss: {
                files: [ 'scss/**/*' ],
                tasks: [ 'sass', 'postcss', 'concat:sass']
            },

            js: {
                files: 'tmp/js/main.js',
                tasks: ['concat:js']
            }
        },

        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'tmp/css/main.css': 'scss/main.scss'
                }
            }
        },

        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({browsers: ['last 2 versions']}),
                    require('lost')
                ]
            },
            dist: {
                src: 'tmp/css/main.css',
                dest: 'tmp/css/main.css'
            }
        },

        // Concateção dos arquivos CSS e JS
        concat: {
            sass: {
                src: filesCSS,

                dest: '../dist/css/styles.combined.min.css'
            },

            js: {
                src: filesJS,

                dest: '../dist/js/scripts.combined.min.js'
            }
        },

        // Concateção e minificação dos arquivos e JS
        uglify: {
            options: {
                mangle: false
            },

            dist: {
                files: {
                    '../dist/js/scripts.combined.min.js': '../dist/js/scripts.combined.min.js'
                }
            }
        },

        cssmin: {
          target: {
            files: [{
              expand: true,
              cwd: '../dist/css',
              src: ['*.css'],
              dest: '../dist/css',
              ext: '.combined.min.css'
            }]
          }
        },

        cmq: {
            target:{
              files: {
                '../dist/css': ['../dist/css/*.css']
              }
            }
        },

        browserSync: {
            files: {

                // Aplicando o recurso de Live Reload nos seguintes arquivos
                src : [
                    '../dist/css/styles.combined.min.css',
                    '../**/*.html',
                    '../**/*.php',
                ]

            },

            options: {

                // Integrando com a tarefa "watch"
                watchTask: true,
                proxy: "localhost:8888/credimoveis",


                // Sincronizando os eventos entre os dispositívos
                ghostMode: {
                    clicks: true,
                    scroll: true,
                    links: true,
                    forms: true
                }
            }
        },

        devUpdate: {
            main: {
                options: {
                    updateType: 'force', //just report outdated packages
                    reportUpdated: false, //don't report up-to-date packages
                    semver: false, //stay within semver when updating
                    packages: {
                        devDependencies: true, //only check for devDependencies
                        dependencies: false
                    },
                    packageJson: null, //use matchdep default findup to locate package.json
                    reportOnlyPkgs: [] //use updateType action on all packages
                }
            }
        },
        browserify: {
            dist: {
                files: {
                  'tmp/js/main.js': 'js/main.js'
                },
                options: {
                    transform: [ ['babelify', { 'presets': ['es2015'] }] ],
                    watch : true, // use watchify for incremental builds!
                    //keepAlive : true, // watchify will exit unless task is kept alive
                    browserifyOptions : {
                        debug : true // source mapping
                    }
                }
            }
        }
    });

    // registrando tarefa default
    grunt.registerTask( 'default', [ 'browserSync', 'browserify', 'watch' ] );
    grunt.registerTask( 'dist', [ 'uglify:dist', 'cmq', 'cssmin' ] );
    grunt.registerTask( 'update', [ 'devUpdate' ] );
};
