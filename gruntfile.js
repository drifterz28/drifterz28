/* global module: false */
/**
 * Grunt Module
 */
module.exports = function(grunt) {
	'use strict';

	require('time-grunt')(grunt);
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		project: {
			app: 'assets',
			src: 'src',
			css: '<%= project.app %>/css',
			img: '<%= project.app %>/images',
			js: '<%= project.app %>/js',
			less: '<%= project.src %>/less',
			srcImg: '<%= project.src %>/images',
			srcJs: '<%= project.src %>/js'
		},
		browserify: {
			dist: {
				files: {
					'<%= project.js %>/main.js': ['<%= project.srcJs %>/main.js']
				},
				options: {
					browserifyOptions: {
						debug: true
					},
					plugin: [
						['minifyify',
							{
								map: 'bundle.map',
								output: '<%= project.js %>/bundle.map',
								minify: false,
							}
						],
						'tsify'
					]
				}
			},
			prod: {
				files: {
					'<%= project.js %>/main.js': ['<%= project.srcJs %>/main.js']
				},
				options: {
					browserifyOptions: {
						debug: true
					},
					plugin: [
					['minifyify',
						{
							minify: true,
						}
					],
					'tsify'
					]
				}
			}
		},
		svg2png: {
			all: {
				files: [
					// rasterize all SVG files in "img" and its subdirectories to "img/png"
					{ cwd: 'src/images/', src: ['**/*.svg']}
				]
			}
		},
		copy: {
			images: {
				expand: true,
				src: ['<%= project.srcImg %>/*'],
				dest: '<%= project.img %>/',
				flatten: true,
				filter: 'isFile'
			}
		},
		jshint: {
			all: '<%= project.srcJs %>/{,*/}*.js',
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish'),
			},
		},
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: '<%= project.srcImg %>',
					src: ['**/*.{png,jpg,gif}'],
					dest: '<%= project.img %>'
				}],
			},
		},
		less: {
			options: {
				// cleancss: true, // unfortunately cleancss strips out the sourcemap comment!
				ieCompat: true,
				compress: true,
				sourceMap: true,
				sourceMapFilename: '<%= project.css %>/main.css.map',
				sourceMapRootpath: '/',
				sourceMapURL: 'style.css.map',
				sourceMapBasepath: '/',
				outputSourceFiles: true
			},
			all: {
				files: { '<%= project.css %>/main.css': '<%= project.less %>/main.less' }
			}
		},
		watch: {
			scripts: {
				files: ['<%= project.srcJs %>/**/*.{js,jsx}'],
				tasks: ['browserify:dist']
			},
			less: {
				files: '<%= project.less %>/**/*.less',
				tasks: ['less']
			},
			img: {
				files: '<%= project.srcImg %>/**/*.{png,jpg,gif,svg}',
				tasks: ['copy:images']
			},
			livereload: {
				// get live reload at
				// https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
				// will not work on SSL pages :(
				options: {
					livereload: true
				},
				files: [
					'<%= project.css %>/*.css',
					'<%= project.img %>/*',
					'<%= project.js %>/*.js',
					'<%= project.app %>/*.html',
				],
			},
			grunt: {
				files: ['Gruntfile.js', 'package.json'],
			},
		},
	});

	require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('js', ['jshint', 'browserify:prod']);
	grunt.registerTask('css', ['less']);
	grunt.registerTask('img', ['copy:images']);
	grunt.registerTask('build', ['js', 'css', 'img']);
};
