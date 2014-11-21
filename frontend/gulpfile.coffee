gulp = require 'gulp'

gutil = require 'gulp-util'
stylus = require 'gulp-stylus'
concat = require 'gulp-concat'
coffee = require 'gulp-coffee'
addsrc = require 'gulp-add-src'
connect = require 'gulp-connect'

path = require 'path'
source = require 'vinyl-source-stream'
browserify = require 'browserify'


BUILD = './static'
TEMPLATES_BUILD = './templates'

bower = (p) -> path.join(__dirname, './bower_components', p)

gulp.task 'coffee', () ->
  browserify extensions: ['.coffee'], basedir: path.join(__dirname, 'app/coffee/'), debug: false
    .require bower('hammerjs/hammer.min.js'), expose: 'hammer'
    .require bower('angular/angular.min.js'), expose: 'angular'
    .require bower('angular-aria/angular-aria.min.js'), expose: 'angular.aria'
    .require bower('angular-route/angular-route.min.js'), expose: 'angular.route'
    .require bower('angular-animate/angular-animate.min.js'), expose: 'angular.animate'
    .require bower('angular-resource/angular-resource.min.js'), expose: 'angular.resource'
    .require bower('angular-material/angular-material.min.js'), expose: 'angular.material'
    .require bower('angular-loading-bar/build/loading-bar.min.js'), expose: 'angular.loadingbar'
    .require bower('danialfarid-angular-file-upload/dist/angular-file-upload.min.js'), expose: 'angular.fileupload'
    .require bower('danialfarid-angular-file-upload/dist/angular-file-upload-shim.min.js'), expose: 'angular.fileuploadshim'
    .add './main.coffee'
    .transform 'coffeeify'
    .bundle()
    .pipe source('app.js')
    .pipe gulp.dest("#{BUILD}/js")
  
gulp.task 'stylus',  () ->
  gulp.src('./app/stylus/main.styl')
    .pipe stylus()
    .pipe addsrc([
      bower('angular-material/angular-material.css')
      bower('angular-loading-bar/build/loading-bar.css')
    ])
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

