module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                options: {
                    path: ['./static/less'],
                    yuicompress: true
                },
                files: {
                    './static/css/base.css': './static/less/base.less'
                }
            }
        },
        watch: {
            files: "./static/less/*.less",
            tasks: ['less']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['less']);
};
