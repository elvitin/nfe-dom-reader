const gulp = require("gulp");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");

const uglifycss = require("gulp-uglifycss");
const clean = require("gulp-clean");
const viewMinify = require("gulp-view-minify");

// const { series } = require('gulp');
// ou
// const { series,  parallel} = require('gulp');
// ou
const series = gulp.series;
const parallel = gulp.parallel;

function copyScripts(cb) {
  console.log("copyScripts");
  // /*Mais de um arquivo */ gulp.src(['js/script.js', 'js/script2.js'])
  gulp
    .src("gofis/js/*")
    .pipe(gulp.dest("backup/js"))
    .pipe(gulp.src("gofis/js/*"))
    .pipe(uglify())
    .pipe(gulp.dest("gofis/js"))
    .on("error", function (err) {
      console.error("Error in compress task", err.toString());
    });
  return cb();
}

function copyStyles(cb) {
  console.log("copyStyles");
  gulp
    .src("gofis/css/*")
    .pipe(gulp.dest("backup/css"))
    .pipe(gulp.src("gofis/css/*"))
    .pipe(
      uglifycss({
        uglyComments: true,
      })
    )
    .pipe(gulp.dest("gofis/css"));
  return cb();
}

// function copyIndexes(cb) {
//   console.log('copyIndexes');
//   return cb();
// }

// Outra forma de funcao
const copyIndexes = (cb) => {
  console.log("copyIndexes");
  gulp
    .src("gofis/index.html")
    .pipe(gulp.dest("backup"))
    .pipe(gulp.src("gofis/index.html"))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("gofis"));
  return cb();
};

const copyDataset = (cb) => {
  console.log("copyDataset");
  gulp
    .src("gofis/files/*.xml")
    .pipe(gulp.dest("backup/files"))
    .pipe(gulp.src("gofis/files/*.xml"))
    .pipe(viewMinify())
    .pipe(gulp.dest("gofis/files"));
  return cb();
};

const rmDist = (cb) => {
  console.log("The distribution folder has been deleted");
  gulp.src("./dist", { read: false }).pipe(clean());
  return cb();
};

module.exports.copyScripts = copyScripts;
module.exports.copyStyles = copyStyles;
module.exports.copyIndexes = copyIndexes;
module.exports.copyDataset = copyDataset;
module.exports.rmDist = rmDist;

// module.exports.default = series(parallel(copyScripts, copyStyles), copyIndexes);
module.exports.default = series(
  copyScripts,
  copyStyles,
  copyIndexes,
  copyDataset
);
// module.exports.default = parallel(copyScripts, copyStyles, copyIndexes);
