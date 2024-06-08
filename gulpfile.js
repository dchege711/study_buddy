const gulp = require('gulp');
const ts = require('gulp-typescript');

const serverTsProject = ts.createProject('tsconfig.json');

const clientTsProject = ts.createProject('src/public/tsconfig.json');
console.log('clientTsProject:', clientTsProject);

// TODO: This task errors out because it expects server-side code to use ESM.
// Fix this, and simplify the `npm run build` command to just run `gulp`.
const kTranspileServerTSTaskName = 'Transpile Server TS';
gulp.task(kTranspileServerTSTaskName, function () {
    return serverTsProject.src().pipe(serverTsProject()).js.pipe(gulp.dest('dist'));
});

const kCopyEJSTemplatesTaskName = 'Copy EJS templates to dist/';
gulp.task(kCopyEJSTemplatesTaskName, function () {
    return gulp.src('./src/views/**/*.ejs').pipe(gulp.dest('./dist/views'));
});

// TODO: This task errors out because it errors on the AVLTree code, which
// src/public/tsconfig.json excludes from compilation.
// Fix this, and simplify the `npm run build` command to just run `gulp`.
const kTranspileClientTSTaskName = 'Transpile client TS to JS';
gulp.task(kTranspileClientTSTaskName, function () {
    return clientTsProject.src().pipe(clientTsProject()).js.pipe(gulp.dest('dist/public'));
});

gulp.task(
    'default',
    gulp.series(
        kTranspileServerTSTaskName, kCopyEJSTemplatesTaskName,
        kTranspileClientTSTaskName));
