module.exports = function(grunt) {
    grunt.initConfig({
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

    grunt.registerTask('default', ['less']);

};
