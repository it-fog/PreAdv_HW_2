const gulp = require ('gulp');
const { src, dest, series, parallel } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const del = require('del');

const html = () => {
    return gulp.src('src/pug/*.pug')
        .pipe (pug({ pretty: true }))
        .pipe (gulp.dest('build'))
}

const styles = () => {
    return gulp.src('src/scss/*.scss')
        .pipe (sass().on('Error', sass.logError))
        .pipe(autoprefixer())
        // .pipe(cssnano())
        // .pipe(rename( { suffix: '.min' } ))
        .pipe(gulp.dest('build/css'))
}

const images = () => {
    return gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/img'))
}

const fonts = () => {
    return gulp.src('src/fonts/*.*')
    .pipe(gulp.dest('build/fonts'))
}

const server = () => {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        notify: false
    });
    browserSync.watch('build', browserSync.reload)
}

const deleteBuild = (cb) => {
    return del('build/**/*.*').then(()=> {(cb)})
}

const watch = () => {
    gulp.watch('src/pug/**/*.pug', html);
    gulp.watch('src/scss/**/*.scss', styles);
    gulp.watch('src/img/**/*.*', images);
    gulp.watch('src/fonts/**/*.*', fonts);
}

exports.default = series (
    deleteBuild,
    parallel(html, styles, images, fonts),
    parallel(watch, server)
) 