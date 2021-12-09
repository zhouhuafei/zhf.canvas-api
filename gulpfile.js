const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

gulp.task('watch', function () {
    return gulp.watch(['src/**/*.**'], gulp.series('es5', 'jsmin'));
});

gulp.task('es5', function () {
    return gulp.src('src/**/*.js').pipe(babel()).pipe(gulp.dest('dist'));
});

gulp.task('jsmin', function () {
    return gulp.src('src/**/*.js').pipe(babel()).pipe(uglify()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('es5', 'jsmin', 'watch'));
