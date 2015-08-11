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
        $routeProvider.when('/intern/favor/company', {templateUrl: urls.part_desktop + '/intern/companyfavor.html', controller: 'DT_InternCompanyFavorCtrl', title: 'InternCompanyFavorPage'});
        $routeProvider.when('/intern/favor/position', {templateUrl: urls.part_desktop + '/intern/positionfavor.html', controller: 'DT_InternPositionFavorCtrl', title: 'InternPositionFavorPage'});
        $routeProvider.when('/intern/resume', {templateUrl: urls.part_desktop + '/intern/resume.html', controller: 'DT_InternResumeCtrl', title: 'InternResumePage'});

        //company user
        $routeProvider.when('/company/regenter', {templateUrl: urls.part_desktop + '/company/regenter.html', controller: 'DT_RegEnterCtrl', title: 'RegEnterPage'});
        $routeProvider.when('/company/resume', {templateUrl: urls.part_desktop + '/company/resume.html', controller: 'DT_CompanyResumeCtrl', title: 'CompanyResumePage'});
        $routeProvider.when('/company/info', {templateUrl: urls.part_desktop + '/company/info.html', controller: 'DT_CompanyInfoCtrl', title: 'CompanyInfoPage'});
        $routeProvider.when('/company/position/manage', {templateUrl: urls.part_desktop + '/company/position/manage.html', controller: 'DT_CompanyPositionManageCtrl', title: 'CompanyPositionManagePage'});
        $routeProvider.when('/company/position/edit', {templateUrl: urls.part_desktop + '/company/position/edit.html', controller: 'DT_CompanyPositionEditCtrl', title: 'CompanyPositionEditPage'});
        $routeProvider.when('/company/list', {templateUrl: urls.part_desktop + '/company/list.html', controller: 'DT_CompanyListCtrl', title: 'CompanyLisPage'});
        $routeProvider.when('/company/detail', {templateUrl: urls.part_desktop + '/company/detail.html', controller: 'DT_CompanyDetailCtrl', title: 'CompanyDetailPage'});

        $routeProvider.when('/position/list', {templateUrl: urls.part_desktop + '/position/list.html', controller: 'DT_PositionListCtrl', title: 'PositionListPage'});
        $routeProvider.when('/position/detail', {templateUrl: urls.part_desktop + '/position/detail.html', controller: 'DT_PositionDetailCtrl', title: 'PositionDetailPage'});

        $routeProvider.when('/feedback', {templateUrl: urls.part_desktop + '/feedback.html', controller: 'DT_FeedbackCtrl', title: 'FeedbackPage'});
        $routeProvider.when('/about', {templateUrl: urls.part_desktop + '/about.html', controller: 'DT_AboutCtrl', title: 'AboutPage'});
        $routeProvider.otherwise({redirectTo: '/'});


       // $routeProvider.when('/user/info', {templateUrl: urls.part_desktop + '/user/info.html', controller: 'DT_UserInfoCtrl', title: 'UserInfoPage'});

        //mobile configure
        $routeProvider.when('/mobile/', {templateUrl: urls.part_mobile + '/company/list.html',title:'HomePage'});

        $routeProvider.when('/mobile/register', {templateUrl: urls.part_mobile + '/register.html',controller:'MB_RegisterCtrl', title:'Register'});
        $routeProvider.when('/mobile/login', {templateUrl: urls.part_mobile + '/login.html',controller:'MB_LoginCtrl', title:'Login'});
        $routeProvider.when('/mobile/info', {templateUrl: urls.part_mobile + '/info.html',controller:'MB_InfoCtrl',title:'Info'});

        $routeProvider.when('/mobile/position/filter', {templateUrl: urls.part_mobile + '/position/filter.html',title:'Posifilter'});
        $routeProvider.when('/mobile/position/list', {templateUrl: urls.part_mobile + '/position/list.html',title:'Posilist'});
        $routeProvider.when('/mobile/position/import', {templateUrl: urls.part_mobile + '/position/import.html',title:'Posiimport'});
        $routeProvider.when('/mobile/position/detail', {templateUrl: urls.part_mobile + '/position/detail.html',title:'Position Detail'});
        $routeProvider.when('/mobile/position/collect', {templateUrl: urls.part_mobile + '/position/collect.html',title:'Position Collection'});

        $routeProvider.when('/mobile/company/filter', {templateUrl: urls.part_mobile + '/company/filter.html',title:'Companyfilter'});
        $routeProvider.when('/mobile/company/detail', {templateUrl: urls.part_mobile + '/company/detail.html',title:'Company Detail'});
        $routeProvider.when('/mobile/company/posi', {templateUrl: urls.part_mobile + '/company/posi.html',title:'Company Positions'});
        $routeProvider.when('/mobile/company/list', {templateUrl: urls.part_mobile + '/company/list.html',controller:'MB_CompanyListCtrl', title:'Companylist'});
        $routeProvider.when('/mobile/company/collect', {templateUrl: urls.part_mobile + '/company/collect.html',title:'Company Collection'});

        $routeProvider.when('/mobile/home/infoupdate', {templateUrl: urls.part_mobile + '/home/infoupdate.html',title:'Update Info'});
        $routeProvider.when('/mobile/home/editresume', {templateUrl: urls.part_mobile + '/home/editresume.html',title:'Edit Resume'});
        $routeProvider.when('/mobile/home/uploadresume', {templateUrl: urls.part_mobile + '/home/uploadresume.html',title:'Upload Resume'});
        $routeProvider.when('/mobile/home', {templateUrl: urls.part_mobile + '/home/pcenter.html',title:'Individual Center'});
        $routeProvider.when('/mobile/home/mypost', {templateUrl: urls.part_mobile + '/home/mypost.html',title:'My Posts'});

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