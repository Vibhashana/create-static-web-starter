// Initialize modules
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const browsersync = require("browser-sync").create();

// Setting paths
const paths = {
  css: {
    src: "app/src/scss/**/*.scss",
    dest: "app/dist/css",
  },
  js: {
    src: "app/src/js/*.js",
    dest: "app/dist/js",
  },
  html: {
    src: "app/src/*.html",
    dest: "app/dist",
  },
  img: {
    src: "app/src/img/*.*",
    dest: "app/dist/img",
  },
};

// Building CSS
function buildCSS() {
  return src("app/src/scss/main.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(["last 3 versions"]), cssnano()]))
    .pipe(dest(paths.css.dest, { sourcemaps: "." }));
}

// Building JavaScript
function buildScripts() {
  return src(paths.js.src, { sourcemaps: true })
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(terser())
    .pipe(dest(paths.js.dest, { sourcemaps: "." }));
}

// Building HTML
function buildHtml() {
  return src(paths.html.src).pipe(dest(paths.html.dest));
}

// Copying favicon
function copyFavicon() {
  return src("app/src/favicon.ico", { allowEmpty: true }).pipe(
    dest("app/dist/")
  );
}

// Minimizing images
function buildImages() {
  return src(paths.img.src)
    .pipe(
      imagemin([
        imagemin.mozjpeg({
          quality: 80,
          progressive: true,
        }),
        imagemin.optipng({
          optimizationLevel: 2,
        }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(paths.img.dest));
}

// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: "./app/dist",
    },
    notify: {
      styles: {
        top: "auto",
        bottom: "0",
      },
    },
  });
  cb();
}

function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch(
    [paths.css.src, paths.js.src, paths.html.src, paths.img.src, "app/src/"],
    series(
      buildCSS,
      buildScripts,
      buildHtml,
      buildImages,
      copyFavicon,
      browserSyncReload
    )
  );
}

// Default Gulp Task
exports.default = series(
  buildCSS,
  buildScripts,
  buildHtml,
  buildImages,
  copyFavicon,
  browserSyncServe,
  watchTask
);

// Build Gulp Task
exports.build = series(
  buildCSS,
  buildScripts,
  buildHtml,
  buildImages,
  copyFavicon
);
