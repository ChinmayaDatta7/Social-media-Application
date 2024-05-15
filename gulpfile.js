async function importGulpRev() {
  const { default: rev } = await import("gulp-rev");
  return rev;
}
async function importGulpDel() {
  const { default: del } = await import("del");
  return del;
}

async function importGulpImagemin() {
  const { default: imagemin } = await import("gulp-imagemin");
  return imagemin;
}

const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
// const { default: rev } = await import('gulp-rev');
// const sass = require('gulp-sass','sass');
// const sass = require('gulp-sass')(require('sass'));
const cssnano = require("gulp-cssnano");
// const rev = require('gulp-rev');
const uglify = require("gulp-uglify-es").default;
// const imagemin = require("gulp-imagemin");
// const del = require('del');

// gulp.task('css', async function(done){
//     const rev = await importGulpRev();
//     console.log('minifying css...');
//     gulp.src('./assets/css/**/*.sass')
//     .pipe(sass().on('error',sass.logError))
//     .pipe(cssnano())
//     .pipe(gulp.dest('./assets.css'));

//      gulp.src('./assets/**/*.sass')
//     .pipe(rev())
//     .pipe(gulp.dest('./public/assets'))
//     .pipe(rev.manifest({
//         cwd: 'public',
//         merge: true
//     }))
//     .pipe(gulp.dest('./public/assets'));
//     done();
// });

gulp.task("css", async function (done) {
  const rev = await importGulpRev();
  console.log("minifying CSS...");

  gulp
    .src("./assets/css/**/*.css")
    .pipe(cleanCSS())
    .pipe(cssnano())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets/css"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
  done();
});

gulp.task("js", async function (done) {
  const rev = await importGulpRev();
  console.log("minifying js...");
  gulp
    .src("./assets/**/*.js")
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
  done();
});

gulp.task("images", async function (done) {
  const rev = await importGulpRev();
  const imagemin = await importGulpImagemin();
  console.log("compressing images...");
  gulp
    .src("./assets/**/*.+(png|jpg|gif|svg|jpeg)")
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
  done();
});

gulp.task("clean:assets", async function (done) {
  const del = await importGulpDel();
  console.log("cleaning assets...");
  // del.async("./public/assets");
  done();
});

gulp.task(
  "build",
  gulp.series("clean:assets", "css", "js", "images"),
  function (done) {
    console.log("Building assets");
    done();
  }
);
