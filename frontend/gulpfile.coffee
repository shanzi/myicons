gulp = require 'gulp'

gutil = require 'gulp-util'
stylus = require 'gulp-stylus'
concat = require 'gulp-concat'
coffee = require 'gulp-coffee'
connect = require 'gulp-connect'
addsrc = require 'gulp-add-src'

stream = require 'stream'
path = require 'path'
mold = require 'mold-source-map'
source = require 'vinyl-source-stream'
browserify = require 'browserify'


BUILD = './static'
TEMPLATES_BUILD = './templates'

bower = (p) -> path.join(__dirname, './bower_components', p)

gulp.task 'coffee', () ->
  browserify extensions: ['.coffee'], basedir: path.join(__dirname, 'app/coffee/'), debug: true
    .require bower('hammerjs/hammer.js'), expose: 'hammer'
    .require bower('angular/angular.js'), expose: 'angular'
    .require bower('angular-aria/angular-aria.js'), expose: 'angular.aria'
    .require bower('angular-route/angular-route.js'), expose: 'angular.route'
    .require bower('angular-animate/angular-animate.js'), expose: 'angular.animate'
    .require bower('angular-material/angular-material.js'), expose: 'angular.material'
    .add './main.coffee'
    .transform 'coffeeify'
    .bundle()
    .pipe(
      mold.transform(
        (sourcemap, callback) ->
          sourcemap.sourceRoot 'file://'
          callback sourcemap.toComment()
    ))
    .pipe source('app.js')
    .pipe gulp.dest("#{BUILD}/js")
  
gulp.task 'stylus',  () ->
  gulp.src('./app/stylus/main.styl')
    .pipe stylus()
    .pipe addsrc(bower('angular-material/angular-material.css'))
    .pipe concat('styles.css')
    .pipe gulp.dest("#{BUILD}/css")

gulp.task 'server', () ->
  connect.server
    root: BUILD
    port: '8000'

gulp.task 'watch', () ->
  gulp.watch ['./app/stylus/**/*.styl'], ['stylus']
  gulp.watch ['./app/coffee/**/*.coffee', './app/coffee/**/*.js'], ['coffee']
  return

gulp.task 'build', ['coffee', 'stylus']
gulp.task 'default', ['build', 'watch']

