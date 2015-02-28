task_tpl = require './task_tpl'
task_wechat = require './task_wechat'

module.exports = (grunt)->
    grunt.loadNpmTasks 'grunt-contrib-requirejs'
    grunt.loadNpmTasks 'grunt-growl'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-copy'

    tasks = {};

    (grunt.file.expand({cwd: 'src/js'}, ['view/page/**/*.js'])).forEach (it)->
      tasks[it] = {
        options:
          baseUrl: "src/js",
          mainConfigFile: "src/js/config.js"
          exclude: ['view/main']
          out: "dist/js/" + it
          name: it.slice(0, -3)
          optimize: "uglify2"
      }
    tasks['view/main.js'] = {
      options:
        baseUrl: "src/js",
        mainConfigFile: "src/js/config.js"
        out: "dist/js/view/main.js"
        name: 'view/main'
        include: ['view/page/movie_list']
        optimize: "uglify2"
    }

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'
        growl:
            dist:
                message: "WXPiao dist success"
            build:
                message: "WXPiao build success"
            release:
                message: "WXPiao dist-release success"
            test:
                message: "WXPiao dist-test success"                                
        watch:
            files: ["src/tpl/**/*"]
            tasks: ['build', 'growl:build']
        copy:
            dist:
                files: [{
                    expand: true
                    cwd: 'src'
                    src: ['js/almond.js', 'js/banner.json']
                    dest: 'dist'
                }, {
                    expand: true
                    cwd: 'src'
                    src: ['help*', 'movie_player.html', 'css/**/*']
                    dest: 'dist'
                }]
        requirejs: tasks

    grunt.registerTask 'tpl', task_tpl grunt
    grunt.registerTask 'wechat.html', task_wechat grunt
    grunt.registerTask 'build', '**build', ['tpl']
    grunt.registerTask 'dist', '**publish to dist/', ['build', 'copy:dist', 'requirejs', 'wechat.html']
    grunt.registerTask 'default', 'Display this help text', -> grunt.option('help', true);grunt.cli();
