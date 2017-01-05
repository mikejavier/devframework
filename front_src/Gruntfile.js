'use strict'

module.exports = function( grunt ) {

	// Definição dos arquivos js
	var filesJS = ['src/tmp/js/main.js']

	// Definição dos arquivos css
	var postcssconcat = ['node_modules/normalize.css/normalize.css', 'src/tmp/css/main_postcss.css']

	// Load all tasks
	require('time-grunt')(grunt)
	require('jit-grunt')(grunt,{
		cmq: 'grunt-combine-media-queries',
	})


	grunt.initConfig({
		// Watch
		watch: {
			postcss: {
				files: [ 'src/css/**/*.css' ],
				tasks: [ 'postcss', 'concat:postcss' ]
			},

			js: {
				files: 'src/tmp/js/main.js',
				tasks: ['concat:js']
			},

			pug: {
				files: 'views/**/*',
				tasks: [ 'pug' ]
			}
		},

		postcss: {
			options: {
				map: true,
				parser: require('postcss-scss'),
				processors: [
					require('precss'),
					require('postcss-responsive-type')(),
					require('autoprefixer')({browsers: ['last 2 versions']}),
					require('pixrem')({rootValue:10, html:false}),
					require('lost'),
					require('mdcss')({
						examples: {
							css: ['../../dist/css/styles.combined.min.css']
						}
					})
				]
			},
			dist: {
				src: 'src/css/main.css',
				dest: 'src/tmp/css/main_postcss.css'
			}
		},

		pug: {
			compile: {
				options: {
					client: false,
					pretty: true
				},
				// Create a singles pages
				files: [ {
					cwd: 'views/',
					src: '**/*.pug',
					dest: '../',
					expand: true,
					ext: '.html'
				} ]
				/*
				= Create a templates =
				files: {
				  'path/to/dest.html': 'path/to/templates/*.jade'
				}
				*/
			}
		},

		// Concateção dos arquivos CSS e JS
		concat: {

			postcss: {
				src: postcssconcat,

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

		// Otimização das imagens
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'src/images',
					src: ['**/*.{png,jpg,gif}'],
					dest: '../dist/images'
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

				// Integrando com a tarefa 'watch'
				watchTask: true,
				proxy: 'localhost:8888/devframework',


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
					'src/tmp/js/main.js': 'src/js/main.js'
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
	})

	// registrando tarefa default
	grunt.registerTask( 'default', [ 'browserSync', 'browserify', 'watch' ] )
	grunt.registerTask( 'dist', [ 'uglify:dist', 'cmq', 'cssmin', 'imagemin' ] )
	grunt.registerTask( 'img', [ 'imagemin' ] )
	grunt.registerTask( 'update', [ 'devUpdate' ] )
}
