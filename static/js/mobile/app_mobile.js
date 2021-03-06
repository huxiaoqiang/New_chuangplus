// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 

var app = angular.module('chuangplus_mobile', [
    "ngRoute",
    "ngTouch",
    'ngCookies',
    "mobile-angular-ui",
    'mobile-angular-ui.gestures',
    'chuangplus_mobile.filters',
    'chuangplus_mobile.services',
    'chuangplus_mobile.directives',
    "chuangplus_mobile.controllers"
    ]).
    constant('urls', {'part_mobile': '/static/partials/mobile','part_desktop': '/static/partials/desktop','part_admin': '/static/partials/admin', 'api': '/api','mobile_index':'/mobile/index'}).
    config(['$interpolateProvider', function($interpolateProvider){
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    }]).
    config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }]).
    config(['$routeProvider', '$locationProvider', 'urls', function($routeProvider, $locationProvider, urls) {
        //Route configure
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix = '';
       // $routeProvider.when('/user/info', {templateUrl: urls.part_desktop + '/user/info.html', controller: 'DT_UserInfoCtrl', title: 'UserInfoPage'});

        //mobile configure
        $routeProvider.when('/mobile/index', {templateUrl: urls.part_mobile + '/company/list.html',title:'公司列表'});
        //$routeProvider.when('/mobile/index/', {templateUrl: urls.part_mobile + '/company/list.html',title:'公司列表'});
        $routeProvider.when('/mobile/test', {templateUrl: urls.part_mobile + '/test.html',title:'公司列表'});
        $routeProvider.when('/mobile/notlogin', {templateUrl: urls.part_mobile + '/notlogin.html',title:'未登录'});

        $routeProvider.when('/mobile/register', {templateUrl: urls.part_mobile + '/register.html', title:'注册'});
        $routeProvider.when('/mobile/login', {templateUrl: urls.part_mobile + '/login.html', title:'登录'});
        $routeProvider.when('/mobile/info', {templateUrl: urls.part_mobile + '/info.html',title:'基本信息填写'});

        //$routeProvider.when('/mobile/position/filter', {templateUrl: urls.part_mobile + '/position/filter.html',title:'筛选'});
        $routeProvider.when('/mobile/position/list', {templateUrl: urls.part_mobile + '/position/list.html',title:'职位列表'});
        $routeProvider.when('/mobile/position/import', {templateUrl: urls.part_mobile + '/position/import.html',title:'职位导入'});
        $routeProvider.when('/mobile/position/detail', {templateUrl: urls.part_mobile + '/position/detail.html',title:'职位详情'});
        $routeProvider.when('/mobile/position/collect', {templateUrl: urls.part_mobile + '/position/collect.html',title:'职位收藏列表'});

        //$routeProvider.when('/mobile/company/filter', {templateUrl: urls.part_mobile + '/company/filter.html',title:'公司筛选'});
        $routeProvider.when('/mobile/company/detail', {templateUrl: urls.part_mobile + '/company/detail.html',title:'公司详情'});
        $routeProvider.when('/mobile/company/posi/:company_id', {templateUrl: urls.part_mobile + '/company/posi.html',title:'公司所有职位'});
        //$routeProvider.when('/mobile/company/list', {templateUrl: urls.part_mobile + '/company/list.html',controller:'MB_CompanyListCtrl', title:'公司列表'});
        $routeProvider.when('/mobile/company/collect', {templateUrl: urls.part_mobile + '/company/collect.html',title:'公司收藏列表'});

        $routeProvider.when('/mobile/home/infoupdate', {templateUrl: urls.part_mobile + '/home/infoupdate.html',title:'更新用户信息'});
        $routeProvider.when('/mobile/home/editresume/:position_id', {templateUrl: urls.part_mobile + '/home/editresume.html',title:'编辑简历'});
        $routeProvider.when('/mobile/home/editresume/', {templateUrl: urls.part_mobile + '/home/editresume.html',title:'编辑简历'});
        $routeProvider.when('/mobile/home/uploadresume', {templateUrl: urls.part_mobile + '/home/uploadresume.html',title:'上传简历'});
        $routeProvider.when('/mobile/home', {templateUrl: urls.part_mobile + '/home/pcenter.html',title:'个人中心'});
        $routeProvider.when('/mobile/home/mypost', {templateUrl: urls.part_mobile + '/home/mypost.html',title:'我的投递'});
        $routeProvider.otherwise({redirectTo: '/'});
        
}]);


  app.run(['$rootScope', '$location', 'UserService', function($rootScope, $location, $user){
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous){
            $rootScope.title = current.$$route.title;
        });
    $rootScope.$on('$routeChangeStart', function(){
        $rootScope.is_login = $user.is_login();

        var login_exception = [
            '/mobile/login',
            '/mobile/index',
            '/mobile/register',
            '/mobile/info',
            '/mobile/company/detail',
            '/mobile/position/detail',
            '/mobile/home',
            '/mobile/position/list'
        ];

        if($user.username() == undefined)
        {
            var pass = false;
            for (var i = login_exception.length - 1; i >= 0; i--) {
                if($location.path() == login_exception[i])
                    pass = true;
            };
            if(!pass){
                //$rootScope.loading = true;
                $rootScope.login_url = $location.path();
                $location.path('/mobile/login');
//                window.location.href='/mobile/login';
                return;
            }
        }
        if($location.path() != '/mobile/info' && $location.path() != '/mobile/login' && $location.path() != '/mobile/register')
            $user.check_info();
        $rootScope.loading = true;
        //console.log('route begin change');
    });
}]);

