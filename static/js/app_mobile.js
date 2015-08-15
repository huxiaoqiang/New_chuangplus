// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 

var app = angular.module('chuangplus_mobile', [
    "ngRoute",
    "ngTouch",
    "mobile-angular-ui",
    'mobile-angular-ui.gestures'
]).
    constant('urls', {'part_mobile': '/static/partials/mobile','part_desktop': '/static/partials/desktop','part_admin': '/static/partials/admin', 'api': '/api'}).
    config(['$interpolateProvider', function($interpolateProvider){
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    }]).
    config(['$routeProvider', '$locationProvider', 'urls', function($routeProvider, $locationProvider, urls) {
        //Route configure
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix = '';
       // $routeProvider.when('/user/info', {templateUrl: urls.part_desktop + '/user/info.html', controller: 'DT_UserInfoCtrl', title: 'UserInfoPage'});

        //mobile configure
        $routeProvider.when('/mobile/test', {templateUrl: urls.part_mobile + '/test.html',title:'公司列表'});
        //mobile configure
        $routeProvider.when('/mobile/', {templateUrl: urls.part_mobile + '/company/list.html',title:'公司列表'});
        $routeProvider.when('/mobile/test', {templateUrl: urls.part_mobile + '/test.html',title:'公司列表'});

        $routeProvider.when('/mobile/register', {templateUrl: urls.part_mobile + '/register.html',controller:'MB_RegisterCtrl', title:'注册'});
        $routeProvider.when('/mobile/login', {templateUrl: urls.part_mobile + '/login.html',controller:'MB_LoginCtrl', title:'登录'});
        $routeProvider.when('/mobile/info', {templateUrl: urls.part_mobile + '/info.html',controller:'MB_InfoCtrl',title:'基本信息'});

        $routeProvider.when('/mobile/position/filter', {templateUrl: urls.part_mobile + '/position/filter.html',title:'筛选'});
        $routeProvider.when('/mobile/position/list', {templateUrl: urls.part_mobile + '/position/list.html',title:'职位列表'});
        $routeProvider.when('/mobile/position/import', {templateUrl: urls.part_mobile + '/position/import.html',title:'职位导入'});
        $routeProvider.when('/mobile/position/detail', {templateUrl: urls.part_mobile + '/position/detail.html',title:'职位详情'});
        $routeProvider.when('/mobile/position/collect', {templateUrl: urls.part_mobile + '/position/collect.html',title:'职位收藏列表'});

        $routeProvider.when('/mobile/company/filter', {templateUrl: urls.part_mobile + '/company/filter.html',title:'公司筛选'});
        $routeProvider.when('/mobile/company/detail', {templateUrl: urls.part_mobile + '/company/detail.html',title:'公司详情'});
        $routeProvider.when('/mobile/company/posi', {templateUrl: urls.part_mobile + '/company/posi.html',title:'公司所有职位'});
        //$routeProvider.when('/mobile/company/list', {templateUrl: urls.part_mobile + '/company/list.html',controller:'MB_CompanyListCtrl', title:'公司列表'});
        $routeProvider.when('/mobile/company/collect', {templateUrl: urls.part_mobile + '/company/collect.html',title:'公司收藏列表'});

        $routeProvider.when('/mobile/home/infoupdate', {templateUrl: urls.part_mobile + '/home/infoupdate.html',title:'更新用户信息'});
        $routeProvider.when('/mobile/home/editresume', {templateUrl: urls.part_mobile + '/home/editresume.html',title:'编辑简历'});
        $routeProvider.when('/mobile/home/uploadresume', {templateUrl: urls.part_mobile + '/home/uploadresume.html',title:'上传简历'});
        $routeProvider.when('/mobile/home', {templateUrl: urls.part_mobile + '/home/pcenter.html',title:'个人中心'});
        $routeProvider.when('/mobile/home/mypost', {templateUrl: urls.part_mobile + '/home/mypost.html',title:'我的投递'});

}]);
    app.run(['$location', '$rootScope', function($location, $rootScope){
        //Configure header title of the page
        $rootScope.$on('$routeChangeSuccess', function(event, current, previous){
            $rootScope.title = current.$$route.title;
        });
    }]);

app.controller('MainController', ['$scope',
    function($scope) {

        // Initialized the user object
        $scope.user = {
            username: "",
            password: ""
        };

        // Sign In auth function
        $scope.signin = function() {
            var email = $scope.user.username;
            var password = $scope.user.password;
            if (email && password) {
                // Sign In Logic
            }
        }

    }
]);