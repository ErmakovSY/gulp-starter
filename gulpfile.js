/* Base */
const gulp = require('gulp');
const data = require('gulp-data');
const watch = require('gulp-watch');
const debug = require('gulp-debug');

/* Plugin for webserver */
const browserSync = require("browser-sync");
const reload = browserSync.reload;

/* Plugin for HTML */
const htmlmin = require('gulp-htmlmin');

/* Plugin for SASS */
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require("gulp-notify");

/* Plugin for JS */
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const minify = require("gulp-babel-minify");

/* Plugin for Images */
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

/* Helpers */
const newer = require('gulp-newer'); /*  Plugin look for new changes in files */
const clean = require('gulp-clean'); /* Plugin delete some folder, content */

/* Task for HTML */
gulp.task('html', () => {
  gulp.src('./src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./build'))
    .pipe(reload({ stream: true }));
});

/* Task for CSS */
gulp.task('css', () => {
  gulp.src('./src/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' })
    .on('error', function (err) {
      return notify().write(err);
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/css'))
    .pipe(reload({ stream: true }));
});

/* Task for JS */
gulp.task('js', () => {
  gulp.src([
    './node_modules/jquery/dist/jquery.js',
    // './node_modules/slick-carousel/slick/slick.js',
    // './node_modules/paroller.js/dist/jquery.paroller.min.js',
    // './src/js/scroll-indicator.js',
    // './src/js/scroll-smooth.js',
    './src/js/main.js'
  ])
    .pipe(babel({ presets: ['env'] }))
    .pipe(concat('main.js'))
    .pipe(minify({ mangle: { keepClassName: true } }))   
    .pipe(gulp.dest('./build/js'))
    .pipe(reload({ stream: true }));
});

/* Task for PHP */
gulp.task('php', () => {
  gulp.src('./src/php/**/*.php')
    .pipe(newer('./build/'))
    .pipe(gulp.dest('./build/php/'))
    .pipe(reload({ stream: true }));
});

/* Task for Images */
gulp.task('image', () => {
  gulp.src('./src/img/**/*.*')
    .pipe(newer('./build/img/'))
    .pipe(gulp.dest('./build/img/'))
    .pipe(reload({ stream: true }));
});

/* Task for Video */
gulp.task('video', () => {
    gulp.src('./src/video/**/*.*')
        .pipe(newer('./build/video/'))
        .pipe(gulp.dest('./build/video/'))
        .pipe(reload({ stream: true }));
});

/* Task for Fonts */
gulp.task('fonts', () => {
  gulp.src('./src/fonts/**/*.*')
    .pipe(newer('./build/fonts/'))
    .pipe(gulp.dest('./build/fonts/'))
    .pipe(reload({ stream: true }));
});

/* Task for file .htaccess */
gulp.task('htaccess', () => {
  gulp.src('./src/.htaccess')
    .pipe(gulp.dest('./build/'))
});

/* Task Build */
gulp.task('build', ['html', 'css', 'js', 'php', 'image', 'fonts', 'video', 'htaccess']);

/* Task for webserver */
const config = {
  server: {
    baseDir: "./build"
  },
  tunnel: false,
  host: 'localhost',
  port: 9000,
  logPrefix: "server"
};

gulp.task('webserver', () => browserSync(config));

/* Task Watch */
gulp.task('watch', function () {
  watch('./src/*.html', () => gulp.run('html'));
  watch('./src/styles/**/*.scss', () => gulp.run('css'));
  watch('./src/js/**/*.js', () => gulp.run('js'));
  watch('./src/img/**/*.*', () => gulp.run('image'));
  watch('./src/fonts/**/*.*', () => gulp.run('fonts'));
});

/* Task Default */
gulp.task('default', ['build', 'webserver', 'watch']);

/* Task Clean (delete folder [build/]) */
gulp.task('clean', () => {
  gulp.src('build', { read: false })
    .pipe(clean());
});