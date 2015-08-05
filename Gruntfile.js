module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                options: {
                    path: ['./static/less/desktop'],
                    yuicompress: true
                },
                files: {
                    './static/css/desktop/base.css': './static/less/desktop/base.less'
                }
            }
        },        
        mbless: {
            development: {
                options: {
                    path: ['./static/less/mobile'],
                    yuicompress: true
                },
                files: {
                    './static/css/mobile/base.css': './static/less/mobile/base.less'
                }
            }
        },
        watch: {
            files: "./static/less/desktop/*.less",
            tasks: ['less']
        },
        watch: {
            files: "./static/less/mobile/*.less",
            tasks: ['less']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.registerTask('mobile', ['mbless']);

    grunt.registerTask('default', ['less']);

};
