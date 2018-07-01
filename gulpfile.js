const gulp = require('gulp');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var deploy  = require('gulp-gh-pages');

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './',
        },
    });
});

gulp.task('js', () => {
    browserify('./src/js/index.js')
        .transform(babelify, { presets: ['es2015'] })
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('idb', () => {
    browserify('./src/js/utils/index.js')
        .transform(babelify, { presets: ['es2015'] })
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./public/js/utils/'));
});


gulp.task('build', ['js', 'idb'], () => {
    console.log('Building Project.');
});

gulp.task('deploy', function () {
  return gulp.src("./public/**/*")
    .pipe(deploy())
});

var connect = require('gulp-connect');

gulp.task('connect', function() {
    connect.server({
        port: 7200,
    });
});


gulp.task('default', ['connect', 'deploy', 'js'],() => {
    console.log('Starting watch task');
    gulp.watch('index.html').on('change', browserSync.reload);

    gulp.watch('src/js/index.js', ['js']).on('change', browserSync.reload);
    gulp.watch('src/js/utils/index.js',['idb']).on('change', browserSync.reload);
});
