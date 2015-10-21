module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat:{
            options:{
                separator: ";",
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dt_apps:{
                src: [
                    'static/js/app.js',
                    'static/js/services.js',
                    'static/js/filters.js',
                    'static/js/directives.js',
                    'static/js/controllers_desktop.js'
                ],
                dest:"static/dest/dt_chuangplus_angular_s1.js"
            },
            dt_libs:{
                src:[
                    "static/lib/json2.js",
                    "static/lib/angular-1.2.6/angular.min.js",
                    "static/lib/angular-1.2.6/angular-route.min.js",
                    "static/lib/angular-1.2.6/angular-resource.min.js",
                    "static/lib/angular-1.2.6/angular-cookies.min.js",
                    "static/lib/angular-1.2.6/angular-sanitize.min.js",
                    "static/lib/angular-1.2.6/tinymce.js",
                    "static/lib/imgcorp/ng-img-crop.js",
                    "static/lib/semantic/angular-semantic-ui.min.js",
                    "static/lib/jquery-1.11.0.min.js",
                    "static/lib/bootstrap/bootstrap.min.js",
                    "static/lib/bootstrap/ui-bootstrap-tpls-0.10.0.min.js",
                    "static/lib/PCASClass.js",
                    "static/lib/fileupload/angular-file-upload-shim.min.js",
                    "static/lib/fileupload/angular-file-upload.min.js",
                    "static/lib/ng-scrollto.js"
                ],
                dest:"static/dest/dt_libs.js"
            },
            mb_apps:{
                src: [
                    'static/js/mobile/app_mobile.js',
                    'static/js/mobile/services_mobile.js',
                    'static/js/mobile/filters_mobile.js',
                    'static/js/mobile/directives_mobile.js',
                    'static/js/mobile/controllers_mobile.js'
                ],
                dest:"static/dest/mb_chuangplus_angular_s1.js"
            },
            mb_libs:{
                src:[
                    "static/lib/angular-1.2.6/angular.min.js"
                ],
                dest:"static/dest/mb_libs.js"
            }
        },
        ngmin:{
            dt_all: {
                src: ['static/dest/dt_chuangplus_angular_s1.js'],
                dest: 'static/dest/dt_chuangplus_angular.js'
            },
            mb_all:{
                src: ['static/dest/mb_chuangplus_angular_s1.js'],
                dest: 'static/dest/mb_chuangplus_angular.js'
            }
        },
        uglify: {
            options: {
                banner: '/* <%= pkg.name %><%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dt_main_script: {
                src: [
                    "static/dest/dt_libs.js",
                    "static/dest/dt_chuangplus_angular.js"
                ],
                dest: "static/dest/dt_chuangplus.min.js"
            },
            mb_main_script:{
                src: [
                    "static/dest/mb_chuangplus_angular.js"
                ],
                dest: "static/dest/mb_chuangplus.min.js"
            }
        },
        less: {
            development: {
                options: {
                    path: ['./static/less/desktop'],
                    yuicompress: true
                },
                files: {
                    './static/css/desktop/base.css': './static/less/desktop/base.less',
                    './static/css/mobile/style.css': './static/less/mobile/base.less'
                }
            }
        },
        watch: {
            files: ["./static/less/desktop/*.less","./static/less/mobile/*.less"],
            tasks: ['less']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ngmin');

    grunt.registerTask('default', ['less']);
    grunt.registerTask("production", ["concat", "ngmin", "uglify"]);
};
