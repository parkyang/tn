/**
 * Created by yangming on 16/6/20.
 */

var pathConfig = {
    'static': 'static',
    'js'    : 'static/js',
    'css'   : 'static/css',
    'images': 'static/images',
    'fonts' : 'static/fonts',
    'common': 'common',
    'dist'  : 'dist'
}, proPath = new (function () {
    var that = this;
    for (var i in pathConfig) {
        that[i] = (function (name) {
            var basePath = (pathConfig[name] || '');
            if (basePath.length > 0 && !(/\\|\/$/.test(basePath))) {
                basePath += '/';
            }
            return function (path) {
                return basePath + (path || '');
            };
        })(i)
    }
})();

fis.set('project.ignore', [
    'bower_components/**',
    'dist',
    'node_modules/**',
    'psd/**',
    'ue/**',
    '*.js',
    '*.json'
]);
fis.hook('relative');

fis.match('*', {
  //useHash: false
  relative: true
});

//给iconfont加版本号
fis.match('fonts/machine/**', {
    useHash: true
});

fis.match('/js/{components,event.extend}/**.js', {
    // fis-optimizer-uglify-js 进行js压缩,已内置
    optimizer: fis.plugin('uglify-js')
});

fis.match('/css/machine/debug/*.{less,css}', {
    optimizer: fis.plugin('clean-css')
});

fis.match('::packager', {
  postpackager: fis.plugin('loader')
});

fis.media('rs').match('!{template,dist}/**.*', {
    deploy: fis.plugin('local-deliver', {
        to: proPath.dist()
    })
});

// dev 模式文件不压缩且文件名不加md5版本号
fis.media('dev')
    .match('{**/**,*.*}', {
        useHash  : false,
        optimizer: null
    });
