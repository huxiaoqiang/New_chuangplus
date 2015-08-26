//front end configuration
'use strict';

// Declare app level module which depends on filters, and services
angular.module('chuangplus', [
    'ngRoute',
    'ui.tinymce',
    'ui.bootstrap',
    'ngCookies',
    'ngFileUpload',
    'ngScrollTo',
    'angular-google-analytics',
    'chuangplus.filters',
    'chuangplus.services',
    'chuangplus.directives',
    'chuangplus.controllers',
    //semantic directives
    'angularify.semantic.accordion',
	'angularify.semantic.checkbox',
	'angularify.semantic.dimmer',
	'angularify.semantic.dropdown',
	'angularify.semantic.modal',
	'angularify.semantic.popup',
	'angularify.semantic.rating',
	'angularify.semantic.sidebar',
	'angularify.semantic.wizard'
]).
    constant('urls', {'part_mobile': '/static/partials/mobile','part_desktop': '/static/partials/desktop','part_admin': '/static/partials/admin', 'api': '/api'}).
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
        //desktop configure
        $routeProvider.when('/', {templateUrl: urls.part_desktop + '/homepage.html', controller: 'DT_HomepageCtrl', title: 'HomePage'});
        $routeProvider.when('/login', {templateUrl: urls.part_desktop + '/login.html', controller: 'DT_LoginCtrl', title: 'LoginPage'});
        $routeProvider.when('/admin/login', {templateUrl: urls.part_admin + '/login.html', controller: 'DT_AdminLoginCtrl', title: 'AdminLoginPage'});

        $routeProvider.when('/register', {templateUrl: urls.part_desktop + '/register.html', controller: 'DT_RegisterCtrl', title: 'RegisterPage'});
        $routeProvider.when('/password/forgetpwd', {templateUrl: urls.part_desktop + '/password/findpwd.html', controller: 'DT_FindPwdCtrl', title: 'FindPwdPage'});
        $routeProvider.when('/password/set', {templateUrl: urls.part_desktop + '/password/set.html', controller: 'DT_SetPwdCtrl', title: 'SetPwdPage'});
        $routeProvider.when('/password/finish', {templateUrl: urls.part_desktop + '/password/finish.html', controller: 'DT_FinishPwdCtrl', title: 'FinishSetPwdPage'});

        //intern user
        $routeProvider.when('/intern/information', {templateUrl: urls.part_desktop + '/intern/information.html', controller: 'DT_InformationCtrl', title: 'InformationPage'});
        //$routeProvider.when('/intern/enter', {templateUrl: urls.part_desktop + '/intern/enter.html', controller: 'DT_InternEnterCtrl', title: 'EnterPage'});
        $routeProvider.when('/intern/info', {templateUrl: urls.part_desktop + '/intern/info.html', controller: 'DT_InternInfoCtrl', title: 'InternInfoPage'});
        $routeProvider.when('/intern/post', {templateUrl: urls.part_desktop + '/intern/post.html', controller: 'DT_InternPostCtrl', title: 'InternPostPage'});
        $routeProvider.when('/intern/favor/company', {templateUrl: urls.part_desktop + '/intern/favor/company.html', controller: 'DT_InternCompanyFavorCtrl', title: 'InternCompanyFavorPage'});
        $routeProvider.when('/intern/favor/position', {templateUrl: urls.part_desktop + '/intern/favor/position.html', controller: 'DT_InternPositionFavorCtrl', title: 'InternPositionFavorPage'});
        $routeProvider.when('/intern/resume', {templateUrl: urls.part_desktop + '/intern/resume.html', controller: 'DT_InternResumeCtrl', title: 'InternResumePage'});

        //company user
        $routeProvider.when('/company/regenter', {templateUrl: urls.part_desktop + '/company/regenter.html', controller: 'DT_RegEnterCtrl', title: 'RegEnterPage'});
        $routeProvider.when('/company/resume', {templateUrl: urls.part_desktop + '/company/resume.html', controller: 'DT_CompanyResumeCtrl', title: 'CompanyResumePage'});
        $routeProvider.when('/company/info', {templateUrl: urls.part_desktop + '/company/info.html', controller: 'DT_CompanyInfoCtrl', title: 'CompanyInfoPage'});
        $routeProvider.when('/company/:company_id/infodetail', {templateUrl: urls.part_desktop + '/company/infodetail.html', controller: 'DT_CompanyInfoDetailCtrl', title: 'CompanyInfoDetailPage'});
        $routeProvider.when('/company/:company_id/position/manage', {templateUrl: urls.part_desktop + '/company/position/manage.html', controller: 'DT_CompanyPositionManageCtrl', title: 'CompanyPositionManagePage'});
        $routeProvider.when('/company/position/:position_id/edit', {templateUrl: urls.part_desktop + '/company/position/edit.html', controller: 'DT_CompanyPositionEditCtrl', title: 'CompanyPositionEditPage'});
        $routeProvider.when('/company/position/:position_id/submit/list', {templateUrl: urls.part_desktop + '/company/position/submit_list.html', controller: 'DT_CompanyPositionSubmitListCtrl', title: '岗位投递情况'});
        $routeProvider.when('/company/list', {templateUrl: urls.part_desktop + '/company/list.html', controller: 'DT_CompanyListCtrl', title: 'CompanyLisPage'});
        $routeProvider.when('/company/detail', {templateUrl: urls.part_desktop + '/company/detail.html', controller: 'DT_CompanyDetailCtrl', title: 'CompanyDetailPage'});

        $routeProvider.when('/position/list', {templateUrl: urls.part_desktop + '/position/list.html', controller: 'DT_PositionListCtrl', title: 'PositionListPage'});
        $routeProvider.when('/position/detail', {templateUrl: urls.part_desktop + '/position/detail.html', controller: 'DT_PositionDetailCtrl', title: 'PositionDetailPage'});

        $routeProvider.when('/feedback', {templateUrl: urls.part_desktop + '/feedback.html', controller: 'DT_FeedbackCtrl', title: 'FeedbackPage'});
        $routeProvider.when('/about', {templateUrl: urls.part_desktop + '/about.html', controller: 'DT_AboutCtrl', title: 'AboutPage'});
        $routeProvider.otherwise({redirectTo: '/'});


       // $routeProvider.when('/user/info', {templateUrl: urls.part_desktop + '/user/info.html', controller: 'DT_UserInfoCtrl', title: 'UserInfoPage'});

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

    }]).
//  the google analytics configure
//    config(function(AnalyticsProvider){
//        AnalyticsProvider.setAccount('UA-60524165-1');
//        AnalyticsProvider.trackPages(true);
//        AnalyticsProvider.trackUrlParams(true);
//        AnalyticsProvider.useDisplayFeatures(true);
//    }).
    run(['$location', '$rootScope', function($location, $rootScope){
        //Configure header title of the page
        $rootScope.$on('$routeChangeSuccess', function(event, current, previous){
            $rootScope.title = current.$$route.title;
        });
    }]);
