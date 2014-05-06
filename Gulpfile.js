var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var minifyHTML = require('gulp-minify-html');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var ngmin = require('gulp-ngmin');
var templates = require('gulp-angular-templatecache');
var paths = {
  scripts: {
    ours: [
      'public_modules/js/templates.js',
      'public_modules/js/**/*.js',
      '!public_modules/js/lib/**'
    ],
    lib:[
      'bower_modules/jquery/dist/jquery.min.js',
      'bower_modules/angular/angular.min.js',
      'bower_modules/angular-route/angular-route.min.js',
      'bower_modules/angular-resource/angular-resource.min.js',
      'public_modules/js/lib/**/*.js'
    ]
  },
  styles: {
    ourswatch:['public_modules/stylus/**/*.stylus'],
    ours:['public_modules/stylus/main.stylus'],
    lib:['public_modules/stylus/lib/**/*.css']
  },
  images: 'public_modules/img/**',
  html:{
    index:['public_modules/html/index.html'],
    templates:['public_modules/html/**/_*.html'],
  },
  fonts:['public_modules/fonts/**'],
  misc:['public_modules/misc/**']
};
gulp.task('lint', function () {
  return gulp.src(['./peel.js','./private_modules/*.js'])
    .pipe(jshint())
});

gulp.task('develop', function () {
  return nodemon({ script: 'peel.js', ext: 'js', ignore: ['public_modules/**','public_build/**'] })
    .on('restart', ['lint'])
});
gulp.task('angular-templates', function () {
  return gulp.src(paths.html.templates)
    .pipe(minifyHTML({empty: true,spare: true,quotes: true}))
    .pipe(templates('templates.js', {standalone:true}))
    .pipe(gulp.dest('public_modules/js'));
});
gulp.task('scripts-ours', function() {
  return gulp.src(paths.scripts.ours)
    .pipe(concat("main.js"))
    .pipe(ngmin())
    .pipe(uglify())
    .pipe(gulp.dest('public_build/js'));
});
gulp.task('scripts-lib', function() {
  return gulp.src(paths.scripts.lib)
    .pipe(concat("lib.js"))
    .pipe(gulp.dest('public_build/js'));
});
gulp.task('styles-ours', function () {
  return gulp.src(paths.styles.ours)
    .pipe(stylus())
    .pipe(gulp.dest('public_build/css'));
});
gulp.task('styles-lib', function () {
  return gulp.src(paths.styles.lib)
    .pipe(concat("lib.css"))
    .pipe(gulp.dest('public_build/css'));
});
// Copy all static assets
gulp.task('copy-img', function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest('public_build/img'));
});
gulp.task('copy-index', function() {
  return gulp.src(paths.html.index)
    .pipe(gulp.dest('public_build'));
});
gulp.task('copy-fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('public_build/fonts'));
});
gulp.task('copy-misc', function() {
  return gulp.src(paths.misc)
    .pipe(gulp.dest('public_build/misc'));
});
gulp.task('watch', function () {
  gulp.watch(paths.scripts.ours, ['scripts-ours']);
  gulp.watch(paths.scripts.lib, ['scripts-lib']);
  gulp.watch(paths.styles.ourswatch, ['styles-ours']);
  gulp.watch(paths.styles.lib, ['styles-lib']);
  gulp.watch(paths.images, ['copy-img']);
  gulp.watch(paths.html.index, ['copy-index']);
  gulp.watch(paths.html.templates, ['angular-templates','scripts-ours']);
  gulp.watch(paths.fonts, ['copy-fonts']);
  gulp.watch(paths.misc, ['copy-misc']);
});
gulp.task('bump.major', function(){
  return gulp.src(['./bower.json', './package.json'])
  .pipe(bump({type:'major'}))
  .pipe(gulp.dest('./'));
});
gulp.task('bump.minor', function(){
  return gulp.src(['./bower.json', './package.json'])
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});
gulp.task('bump.patch', function(){
  return gulp.src(['./bower.json', './package.json'])
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));
});

// The default task (called when you run `gulp`)
gulp.task('default', [
  'scripts-lib', 
  'angular-templates', 
  'scripts-ours', 
  'styles-lib', 
  'styles-ours', 
  'copy-img', 
  'copy-index', 
  'copy-fonts', 
  'copy-misc',
  'develop',
  'watch'
]);