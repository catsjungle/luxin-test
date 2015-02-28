module.exports = (grunt)->
  ->
    src = grunt.file.read 'src/wechat.html'
    mapSrc = grunt.file.read 'src/map.html'
    lib = ['dist/js/almond.js', 'dist/js/view/main.js'].map (file)->
      grunt.file.read file
    .join '\n'

    src = src.replace '//JSLIB', -> lib
    src = src.replace /__TIMESTAMP__/g, Date.now().toString(16).slice(-8)

    grunt.file.write 'dist/wechat.html', src
    grunt.file.write 'dist/map.html', mapSrc