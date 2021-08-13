const GulpUglify = require("gulp-uglify");
let { src, dest } = require("gulp"),
    gulp = require("gulp"),
    browserSync = require("browser-sync").create(),
    fileInclude = require("gulp-file-include"),
    del = require("del"),
    scss = require("gulp-sass"),
    uglify = require("gulp-uglify");
    sourcemaps = require("gulp-sourcemaps"),
    autoprefixer = require("gulp-autoprefixer"),
    groupMedia = require("gulp-group-css-media-queries");
    cleanCss = require('gulp-clean-css');
    rename = require('gulp-rename');
    babel = require('gulp-babel');
    cache = require('gulp-cache'),
    imageMin = require('gulp-imagemin');
    gulpWebpack = require('gulp-webpack')
    webpack = require('webpack')
    webpackStream = require('webpack-stream')
    
let project_folder = "dist";
let source_folder = "src";

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        php: project_folder + "/php/",
        pluginsJs: project_folder + "/js/plugins/",
        pluginsPhp: project_folder + "/php/plugins/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
        animations: project_folder + "/animations/",
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html",],
        css: source_folder + "/scss/main.scss",
        js: source_folder + "/js/script.js",
        php: source_folder + "/php/*.php",
        pluginsJs: source_folder + "/js/plugins/*.js",
        pluginsPhp: source_folder + "/php/plugins/**/*.*",
        // img: source_folder + "/img/**/*.{jpg, png, svg, gif, ico, webp}",
        img: source_folder + "/img/**/*.*",
        fonts: source_folder + "/fonts/*.*",
        scssLib: source_folder + "/scss/",
        animations: source_folder + "/animations/*.*",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        php: source_folder + "/php/*.php",
        pluginsJs: source_folder + "/js/plugins/*.js",
        pluginsPhp: source_folder + "/php/plugins/**/*.*",
        img: source_folder + "/img/**/*.*",
        fonts: source_folder + "/fonts/*.*",
        animations: source_folder + "/animations/*.*",
    },
    clean : "./" + project_folder + "/"
}

// function browse-sync init
function browserSyncFunction() {
    browserSync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

// function html compile
function html() {
    return src(path.src.html)
        .pipe(fileInclude())
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())
}

// function css compile
function css() {
    return src(path.src.css)
      .pipe(sourcemaps.init())
      .pipe(scss().on("error", scss.logError))
      .pipe(scss({ outputStyle: "expanded" }))
      .pipe(groupMedia())
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 5 versions"],
          cascade: true,
        })
      )
      .pipe(dest(path.build.css))
      .pipe(cleanCss())
      .pipe(
        rename({
          extname: ".min.css",
        })
      )
      .pipe(sourcemaps.write("./"))
      .pipe(dest(path.build.css))
      .pipe(browserSync.stream());
}

// function js compile
function js() {
    return src(path.src.js)
        .pipe(webpackStream({
            mode: 'production',
            optimization: {
                minimize: true
            },
            output: {
                filename: 'main.min.js'
            },
            module: {
                rules: [
                    {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                            options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
                ]
            }
        }))
        .pipe(dest(path.build.js)) 
        .pipe(browserSync.stream())
}

// function js compile
function php() {
    return src(path.src.php)
        .pipe(dest(path.build.php)) 
        .pipe(browserSync.stream())
}

// function js plugins compile
function pluginsJS() {
    return src(path.src.pluginsJs)
        .pipe(dest(path.build.pluginsJs))
        .pipe(uglify())
        .pipe(
            rename({
                extname: ".min.js",
            })
        )
        .pipe(dest(path.build.pluginsJs))
        .pipe(browserSync.stream())
}

// function php plugins compile
function pluginsPHP() {
    return src(path.src.pluginsPhp)
        .pipe(dest(path.build.pluginsPhp))
        .pipe(browserSync.stream())
}

// function images transform
function images() {
    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(imageMin({
            nterlaced: true,
            progressive: true,
            optimizationLevel: 3, // 0 to 7
            svgoPlugins: [{ removeViewBox: false }],
        }))
        .pipe(browserSync.stream())
}

// function fonts transform
function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.stream())
}

// function lottieJson transform
function animations() {
    return src(path.src.animations)
        .pipe(dest(path.build.animations))
        .pipe(browserSync.stream())
}

// function watch for files
function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.php], php);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.fonts], fonts);
}

// function for clean dist path
function clean() {
    return del(path.clean)
}

// default and build start
let build = gulp.series(clean, gulp.parallel(html, css, pluginsJS, js, pluginsPHP, php, animations, images, fonts));
let watch = gulp.parallel(build, watchFiles, browserSyncFunction);

// exports
exports.html = html;
exports.css = css;
exports.js = js;
exports.php = php;
exports.pluginsPHP = pluginsPHP;
exports.pluginsJS = pluginsJS;
exports.animations = animations;
exports.images = images;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;
exports.default = watch;