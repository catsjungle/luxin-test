module.exports = (grunt)->
  yaml = require 'js-yaml'
  _ = grunt.util._

  src = ["tpl/**/*"]
  dest = "src/js/"
  option = {
    cwd: 'src'
    ext: '.js'
  }

  ->
    _.each (grunt.file.expandMapping src, dest, option), (target)->
      docs = []
#      _.each ((grunt.file.read target.src[0]) .split /\n/), (line)->
#        docs.push '    ' + line
#      docs.unshift '--- |'
#      grunt.file.write target.src[0], docs.join '\n'
      try
        yaml.safeLoadAll (grunt.file.read target.src[0]), _.bind docs.push, docs
        tplSrc = (_.template _.last docs).source
        deps = _.first docs
        deps = if _.isArray(deps) then JSON.stringify deps else '[]'
        grunt.file.write target.dest, """

define(#{deps}, function() {
  return #{tplSrc};
});
"""
      catch e
        grunt.log.error()
        grunt.log.error target.src
        console.error e
