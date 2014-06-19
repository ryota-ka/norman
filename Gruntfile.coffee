module.exports = (grunt) ->

  grunt.initConfig

    pkg: '<json:package.json>'

    meta:
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'

    concat:
      dist:
        src: ['<banner:meta.banner>', '<file_strip_banner:dist/js/main.js>']
        dest: 'dist/js/main.js'

    min:
      dist:
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>']
        dest: '<%= grunt.config("concat").dist.dest.replace(/js$/, "min.js") %>'

    coffee:
      compile:
        files: [
          src: ['coffee/*.coffee']
          dest: 'app.js'
        ]

    stylus:
      compile:
        files: [
          src: ['stylus/style.stylus']
          dest: 'css/style.css'
        ]

    jade:
      compile:
        files: [
          src: ['jade/index.jade']
          dest: 'index.html'
        ]

    watch:
      coffee:
        files: ['coffee/*.coffee']
        tasks: 'coffee'
      stylus:
        files: ['stylus/style.stylus']
        tasks: 'stylus'
      jade:
        files: ['jade/index.jade']
        tasks: 'jade'

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-jade'

  grunt.registerTask 'default', 'watch'
