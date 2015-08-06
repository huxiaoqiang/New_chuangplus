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
    constant('urls', {'part_mobile': '/static/partials/mobile','part_desktop': '/static/partials/desktop', 'api': '/api'}).
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
        $routeProvider.when('/register', {templateUrl: urls.part_desktop + '/register.html', controller: 'DT_RegisterCtrl', title: 'RegisterPage'});
        $routeProvider.when('/password/forgetpwd', {templateUrl: urls.part_desktop + '/password/findpwd.html', controller: 'DT_FindPwdCtrl', title: 'FindPwdPage'});
        $routeProvider.when('/password/set', {templateUrl: urls.part_desktop + '/password/set.html', controller: 'DT_SetPwdCtrl', title: 'SetPwdPage'});
        $routeProvider.when('/password/finish', {templateUrl: urls.part_desktop + '/password/finish.html', controller: 'DT_FinishPwdCtrl', title: 'FinishSetPwdPage'});
        $routeProvider.when('/information', {templateUrl: urls.part_desktop + '/information.html', controller: 'DT_InformationCtrl', title: 'InformationPage'});
        $routeProvider.when('/enter',{templateURL: urls.part_desktop + '/enter.html',controller:'DT_EnterCtrl',title:'EnterPage'});

        $routeProvider.when('/user/info', {templateUrl: urls.part_desktop + '/user/info.html', controller: 'DT_UserInfoCtrl', title: 'UserInfoPage'});
       // $routeProvider.when('/user/info', {templateUrl: urls.part_desktop + '/user/info.html', controller: 'DT_UserInfoCtrl', title: 'UserInfoPage'});

        //mobile configure
        $routeProvider.when('/mobile/login', {templateUrl: urls.part_mobile + '/login.html',controller:'MB_LoginCtrl', title:'Login'});
        $routeProvider.when('/mobile/complist', {templateUrl: urls.part_mobile + '/complist.html',controller:'MB_CompanyListCtrl', title:'Companylist'});
        $routeProvider.when('/mobile/info', {templateUrl: urls.part_mobile + '/info.html',controller:'MB_InfoCtrl',title:'Info'});
        $routeProvider.when('/mobile/posilist', {templateUrl: urls.part_mobile + '/posilist.html',title:'Posilist'});
        $routeProvider.when('/mobile/posiimport', {templateUrl: urls.part_mobile + '/posiimport.html',title:'Posiimport'});
        $routeProvider.when('/mobile/compfilter', {templateUrl: urls.part_mobile + '/compfilter.html',title:'Companyfilter'});
        $routeProvider.when('/mobile/posifilter', {templateUrl: urls.part_mobile + '/posifilter.html',title:'Posifilter'});
        $routeProvider.when('/mobile/', {templateUrl: urls.part_mobile + '/mobile_index.html',title:'HomePage'});
        
        $routeProvider.otherwise({redirectTo: '/'});
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