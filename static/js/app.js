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
        $routeProvider.when('/', {templateUrl: urls.part_desktop + '/homepage.html', controller: 'DT_HomepageCtrl', title: '首页'});
        $routeProvider.when('/login', {templateUrl: urls.part_desktop + '/login.html', controller: 'DT_LoginCtrl', title: '登录'});
        $routeProvider.when('/admin/login', {templateUrl: urls.part_admin + '/login.html', controller: 'DT_AdminLoginCtrl', title: '管理员登录'});

        $routeProvider.when('/register', {templateUrl: urls.part_desktop + '/register.html', controller: 'DT_RegisterCtrl', title: '注册'});
        $routeProvider.when('/password/forgetpwd', {templateUrl: urls.part_desktop + '/password/findpwd.html', controller: 'DT_FindPwdCtrl', title: '找回密码'});
        $routeProvider.when('/password/set', {templateUrl: urls.part_desktop + '/password/set.html', controller: 'DT_SetPwdCtrl', title: '设置密码'});
        $routeProvider.when('/password/finish', {templateUrl: urls.part_desktop + '/password/finish.html', controller: 'DT_FinishPwdCtrl', title: '完成密码找回'});

        $routeProvider.when('/admin/manager',{templateUrl: urls.part_admin + '/manager.html', controller: 'DT_ManagerCtrl', title: '管理员页面'});
        //intern user
        $routeProvider.when('/intern/information', {templateUrl: urls.part_desktop + '/intern/information.html', controller: 'DT_InformationCtrl', title: 'InformationPage'});
        //$routeProvider.when('/intern/enter', {templateUrl: urls.part_desktop + '/intern/enter.html', controller: 'DT_InternEnterCtrl', title: 'EnterPage'});
        $routeProvider.when('/intern/info', {templateUrl: urls.part_desktop + '/intern/info.html', controller: 'DT_InternInfoCtrl', title: 'InternInfoPage'});
        $routeProvider.when('/intern/post', {templateUrl: urls.part_desktop + '/intern/post.html', controller: 'DT_InternPostCtrl', title: '投递列表'});
        $routeProvider.when('/intern/favor/company', {templateUrl: urls.part_desktop + '/intern/favor/company.html', controller: 'DT_InternCompanyFavorCtrl', title: '收藏的公司'});
        $routeProvider.when('/intern/favor/position', {templateUrl: urls.part_desktop + '/intern/favor/position.html', controller: 'DT_InternPositionFavorCtrl', title: '收藏的职位'});
        $routeProvider.when('/intern/resume/view', {templateUrl: urls.part_desktop + '/intern/resume_view.html', controller: 'DT_InternResumeViewCtrl', title: '查看简历'});
        $routeProvider.when('/intern/resume/edit', {templateUrl: urls.part_desktop + '/intern/resume_edit.html', controller: 'DT_InternResumeEditCtrl', title: '编辑简历'});

        //company user
        $routeProvider.when('/company/regenter', {templateUrl: urls.part_desktop + '/company/regenter.html', controller: 'DT_RegEnterCtrl', title: 'RegEnterPage'});
        $routeProvider.when('/company/:company_id/resume', {templateUrl: urls.part_desktop + '/company/resume.html', controller: 'DT_CompanyResumeCtrl', title: '处理简历'});
        //$routeProvider.when('/company/info', {templateUrl: urls.part_desktop + '/company/info.html', controller: 'DT_CompanyInfoCtrl', title: 'CompanyInfoPage'});
        //$routeProvider.when('/company/:company_id/infodetail', {templateUrl: urls.part_desktop + '/company/infodetail.html', controller: 'DT_CompanyInfoDetailCtrl', title: 'CompanyInfoDetailPage'});
        $routeProvider.when('/company/:company_id/position/manage', {templateUrl: urls.part_desktop + '/company/position/manage.html', controller: 'DT_CompanyPositionManageCtrl', title: '管理职位'});
        $routeProvider.when('/company/:company_id/position/:position_id/edit', {templateUrl: urls.part_desktop + '/company/position/edit.html', controller: 'DT_CompanyPositionEditCtrl', title: '编辑职位'});
        $routeProvider.when('/company/position/:position_id/submit/list', {templateUrl: urls.part_desktop + '/company/position/submit_list.html', controller: 'DT_CompanyPositionSubmitListCtrl', title: '岗位投递情况'});
        $routeProvider.when('/company/list', {templateUrl: urls.part_desktop + '/company/list.html', controller: 'DT_CompanyListCtrl', title: '公司列表'});
        $routeProvider.when('/company/:company_id/detail', {templateUrl: urls.part_desktop + '/company/detail.html', controller: 'DT_CompanyDetailCtrl', title: '公司详情'});
        $routeProvider.when('/company/account', {templateUrl: urls.part_desktop + '/company/account.html', controller: 'DT_CompanyAccountCtrl', title: '账户设置'});

        $routeProvider.when('/company/:company_id/no', {templateUrl: urls.part_desktop + '/company/create/no.html', controller: 'DT_CompanyNoCtrl', title: '尚无公司信息'});
        $routeProvider.when('/company/:company_id/create/first', {templateUrl: urls.part_desktop + '/company/create/first.html', controller: 'DT_CompanyFirstCtrl', title: '创建公司·步骤一'});
        $routeProvider.when('/company/:company_id/create/test', {templateUrl: urls.part_desktop + '/company/create/1.html', controller: 'DT_CompanyTestCtrl', title: '创建公司·步骤一'});
        $routeProvider.when('/company/:company_id/create/second', {templateUrl: urls.part_desktop + '/company/create/second.html', controller: 'DT_CompanySecondCtrl', title: '创建公司·步骤二'});
        $routeProvider.when('/company/:company_id/create/third', {templateUrl: urls.part_desktop + '/company/create/third.html', controller: 'DT_CompanyThirdCtrl', title: '创建公司·步骤三'});
        $routeProvider.when('/company/:company_id/create/forth', {templateUrl: urls.part_desktop + '/company/create/forth.html', controller: 'DT_CompanyForthCtrl', title: '创建公司·步骤四'});


        $routeProvider.when('/position/list', {templateUrl: urls.part_desktop + '/position/list.html', controller: 'DT_PositionListCtrl', title: '职位列表'});
        $routeProvider.when('/position/:position_id/detail', {templateUrl: urls.part_desktop + '/position/detail.html', controller: 'DT_PositionDetailCtrl', title: '职位详情'});

        $routeProvider.when('/feedback', {templateUrl: urls.part_desktop + '/feedback.html', controller: 'DT_FeedbackCtrl', title: '反馈页'});
        $routeProvider.when('/about', {templateUrl: urls.part_desktop + '/about.html', controller: 'DT_AboutCtrl', title: '关于我们'});
        $routeProvider.otherwise({redirectTo: '/'});


       // $routeProvider.when('/user/info', {templateUrl: urls.part_desktop + '/user/info.html', controller: 'DT_UserInfoCtrl', title: 'UserInfoPage'});
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
