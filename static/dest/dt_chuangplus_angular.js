/*! chuangplus 2015-10-21 */
//front end configuration
'use strict';
// Declare app level module which depends on filters, and services
angular.module('chuangplus', [
  'ngImgCrop',
  'ngRoute',
  'ui.tinymce',
  'ui.bootstrap',
  'ngCookies',
  'ngFileUpload',
  'ngScrollTo',
  'chuangplus.filters',
  'chuangplus.services',
  'chuangplus.directives',
  'chuangplus.controllers',
  'angularify.semantic.accordion',
  'angularify.semantic.checkbox',
  'angularify.semantic.dimmer',
  'angularify.semantic.dropdown',
  'angularify.semantic.modal',
  'angularify.semantic.popup',
  'angularify.semantic.rating',
  'angularify.semantic.sidebar',
  'angularify.semantic.wizard'
]).constant('urls', {
  'part_mobile': '/static/partials/mobile',
  'part_desktop': '/static/partials/desktop',
  'part_admin': '/static/partials/admin',
  'api': '/api'
}).config([
  '$interpolateProvider',
  function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  }
]).config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  }
]).config([
  '$routeProvider',
  '$locationProvider',
  'urls',
  function ($routeProvider, $locationProvider, urls) {
    //Route configure
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix = '';
    //desktop configure
    $routeProvider.when('/', {
      templateUrl: urls.part_desktop + '/homepage.html',
      controller: 'DT_HomepageCtrl',
      title: '\u9996\u9875'
    });
    $routeProvider.when('/login', {
      templateUrl: urls.part_desktop + '/login.html',
      controller: 'DT_LoginCtrl',
      title: '\u767b\u5f55'
    });
    $routeProvider.when('/admin/login', {
      templateUrl: urls.part_admin + '/login.html',
      controller: 'DT_AdminLoginCtrl',
      title: '\u7ba1\u7406\u5458\u767b\u5f55'
    });
    $routeProvider.when('/search', {
      templateUrl: urls.part_desktop + '/search.html',
      controller: 'DT_SearchCtrl',
      title: '\u641c\u7d22\u9875'
    });
    $routeProvider.when('/register', {
      templateUrl: urls.part_desktop + '/register.html',
      controller: 'DT_RegisterCtrl',
      title: '\u6ce8\u518c'
    });
    $routeProvider.when('/password/forgetpwd', {
      templateUrl: urls.part_desktop + '/password/findpwd.html',
      controller: 'DT_FindPwdCtrl',
      title: '\u627e\u56de\u5bc6\u7801'
    });
    $routeProvider.when('/password/set', {
      templateUrl: urls.part_desktop + '/password/set.html',
      controller: 'DT_SetPwdCtrl',
      title: '\u8bbe\u7f6e\u5bc6\u7801'
    });
    $routeProvider.when('/password/finish', {
      templateUrl: urls.part_desktop + '/password/finish.html',
      controller: 'DT_FinishPwdCtrl',
      title: '\u5b8c\u6210\u5bc6\u7801\u627e\u56de'
    });
    $routeProvider.when('/admin/manager', {
      templateUrl: urls.part_admin + '/manager.html',
      controller: 'DT_ManagerCtrl',
      title: '\u7ba1\u7406\u5458\u9875\u9762'
    });
    //intern user
    $routeProvider.when('/intern/information', {
      templateUrl: urls.part_desktop + '/intern/information.html',
      controller: 'DT_InformationCtrl',
      title: 'InformationPage'
    });
    //$routeProvider.when('/intern/enter', {templateUrl: urls.part_desktop + '/intern/enter.html', controller: 'DT_InternEnterCtrl', title: 'EnterPage'});
    $routeProvider.when('/intern/info', {
      templateUrl: urls.part_desktop + '/intern/info.html',
      controller: 'DT_InternInfoCtrl',
      title: 'InternInfoPage'
    });
    $routeProvider.when('/intern/post', {
      templateUrl: urls.part_desktop + '/intern/post.html',
      controller: 'DT_InternPostCtrl',
      title: '\u6295\u9012\u5217\u8868'
    });
    $routeProvider.when('/intern/favor/company', {
      templateUrl: urls.part_desktop + '/intern/favor/company.html',
      controller: 'DT_InternCompanyFavorCtrl',
      title: '\u6536\u85cf\u7684\u516c\u53f8'
    });
    $routeProvider.when('/intern/favor/position', {
      templateUrl: urls.part_desktop + '/intern/favor/position.html',
      controller: 'DT_InternPositionFavorCtrl',
      title: '\u6536\u85cf\u7684\u804c\u4f4d'
    });
    $routeProvider.when('/intern/resume/view', {
      templateUrl: urls.part_desktop + '/intern/resume_view.html',
      controller: 'DT_InternResumeViewCtrl',
      title: '\u67e5\u770b\u7b80\u5386'
    });
    $routeProvider.when('/intern/resume/edit', {
      templateUrl: urls.part_desktop + '/intern/resume_edit.html',
      controller: 'DT_InternResumeEditCtrl',
      title: '\u7f16\u8f91\u7b80\u5386'
    });
    //company user
    $routeProvider.when('/company/regenter', {
      templateUrl: urls.part_desktop + '/company/regenter.html',
      controller: 'DT_RegEnterCtrl',
      title: 'RegEnterPage'
    });
    $routeProvider.when('/company/:company_id/resume', {
      templateUrl: urls.part_desktop + '/company/resume.html',
      controller: 'DT_CompanyResumeCtrl',
      title: '\u5904\u7406\u7b80\u5386'
    });
    //$routeProvider.when('/company/info', {templateUrl: urls.part_desktop + '/company/info.html', controller: 'DT_CompanyInfoCtrl', title: 'CompanyInfoPage'});
    //$routeProvider.when('/company/:company_id/infodetail', {templateUrl: urls.part_desktop + '/company/infodetail.html', controller: 'DT_CompanyInfoDetailCtrl', title: 'CompanyInfoDetailPage'});
    $routeProvider.when('/company/:company_id/position/manage', {
      templateUrl: urls.part_desktop + '/company/position/manage.html',
      controller: 'DT_CompanyPositionManageCtrl',
      title: '\u7ba1\u7406\u804c\u4f4d'
    });
    $routeProvider.when('/company/:company_id/position/:position_id/edit', {
      templateUrl: urls.part_desktop + '/company/position/edit.html',
      controller: 'DT_CompanyPositionEditCtrl',
      title: '\u7f16\u8f91\u804c\u4f4d'
    });
    $routeProvider.when('/company/position/:position_id/submit/list', {
      templateUrl: urls.part_desktop + '/company/position/submit_list.html',
      controller: 'DT_CompanyPositionSubmitListCtrl',
      title: '\u5c97\u4f4d\u6295\u9012\u60c5\u51b5'
    });
    $routeProvider.when('/company/list', {
      templateUrl: urls.part_desktop + '/company/list.html',
      controller: 'DT_CompanyListCtrl',
      title: '\u516c\u53f8\u5217\u8868'
    });
    $routeProvider.when('/company/:company_id/detail', {
      templateUrl: urls.part_desktop + '/company/detail.html',
      controller: 'DT_CompanyDetailCtrl',
      title: '\u516c\u53f8\u8be6\u60c5'
    });
    $routeProvider.when('/company/account', {
      templateUrl: urls.part_desktop + '/company/account.html',
      controller: 'DT_CompanyAccountCtrl',
      title: '\u8d26\u6237\u8bbe\u7f6e'
    });
    $routeProvider.when('/company/:company_id/no', {
      templateUrl: urls.part_desktop + '/company/create/no.html',
      controller: 'DT_CompanyNoCtrl',
      title: '\u5c1a\u65e0\u516c\u53f8\u4fe1\u606f'
    });
    $routeProvider.when('/company/:company_id/create/first', {
      templateUrl: urls.part_desktop + '/company/create/first.html',
      controller: 'DT_CompanyFirstCtrl',
      title: '\u521b\u5efa\u516c\u53f8\xb7\u6b65\u9aa4\u4e00'
    });
    $routeProvider.when('/company/:company_id/create/test', {
      templateUrl: urls.part_desktop + '/company/create/1.html',
      controller: 'DT_CompanyTestCtrl',
      title: '\u521b\u5efa\u516c\u53f8\xb7\u6b65\u9aa4\u4e00'
    });
    $routeProvider.when('/company/:company_id/create/second', {
      templateUrl: urls.part_desktop + '/company/create/second.html',
      controller: 'DT_CompanySecondCtrl',
      title: '\u521b\u5efa\u516c\u53f8\xb7\u6b65\u9aa4\u4e8c'
    });
    $routeProvider.when('/company/:company_id/create/third', {
      templateUrl: urls.part_desktop + '/company/create/third.html',
      controller: 'DT_CompanyThirdCtrl',
      title: '\u521b\u5efa\u516c\u53f8\xb7\u6b65\u9aa4\u4e09'
    });
    $routeProvider.when('/company/:company_id/create/forth', {
      templateUrl: urls.part_desktop + '/company/create/forth.html',
      controller: 'DT_CompanyForthCtrl',
      title: '\u521b\u5efa\u516c\u53f8\xb7\u6b65\u9aa4\u56db'
    });
    $routeProvider.when('/position/list', {
      templateUrl: urls.part_desktop + '/position/list.html',
      controller: 'DT_PositionListCtrl',
      title: '\u804c\u4f4d\u5217\u8868'
    });
    $routeProvider.when('/position/:position_id/detail', {
      templateUrl: urls.part_desktop + '/position/detail.html',
      controller: 'DT_PositionDetailCtrl',
      title: '\u804c\u4f4d\u8be6\u60c5'
    });
    $routeProvider.when('/feedback', {
      templateUrl: urls.part_desktop + '/feedback.html',
      controller: 'DT_FeedbackCtrl',
      title: '\u53cd\u9988\u9875'
    });
    $routeProvider.when('/about', {
      templateUrl: urls.part_desktop + '/about.html',
      controller: 'DT_AboutCtrl',
      title: '\u5173\u4e8e\u6211\u4eec'
    });
    $routeProvider.otherwise({ redirectTo: '/' });  // $routeProvider.when('/user/info', {templateUrl: urls.part_desktop + '/user/info.html', controller: 'DT_UserInfoCtrl', title: 'UserInfoPage'});
  }
]).run([
  '$location',
  '$rootScope',
  'UserService',
  function ($location, $rootScope, $user) {
    //Configure header title of the page
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
      $rootScope.title = current.$$route.title;
    });
    $rootScope.$on('$routeChangeStart', function () {
      if ($user.username() == undefined && $location.path() != '/login' && $location.path() != '/register' && $location.path() != '/intern/information' && $location.path() != '/company/list' && $location.path() != '/position/list' && $location.path() != '/' && $location.path() != '/search') {
        window.location.href = '/login';
        return;
      }
      if ($location.path() != '/intern/information' && $location.path() != '/login' && $location.path() != '/register')
        $user.check_info();
      $rootScope.loading = true;  //console.log('route begin change');
    });
  }
]);
;
'use strict';
/* Services */
// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('chuangplus.services', []).value('version', '0.1').service('CsrfService', [
  '$cookies',
  function ($cookies) {
    return {
      'val': function () {
        return $cookies.csrftoken;
      },
      'set_csrf': function (data) {
        data['csrfmiddlewaretoken'] = $cookies.csrftoken;
      },
      'set_csrf_array': function (data) {
        data.push({ 'csrfmiddlewaretoken': $cookies.csrftoken });
      }
    };
  }
]).service('ErrorService', [
  '$cookies',
  function ($cookies) {
    var error_message = {
        'code15': '\u6587\u4ef6\u5927\u5c0f\u8d85\u8fc710M',
        'code18': '\u6ca1\u6709\u4e0a\u4f20\u6587\u4ef6\u6743\u9650',
        'code19': '\u4e0a\u4f20\u6587\u4ef6\u4e3a\u7a7a',
        'code20': '\u8981\u4e0b\u8f7d\u7684\u6587\u4ef6\u4e0d\u5b58\u5728',
        'code30': '\u6ca1\u6709\u5220\u9664\u6587\u4ef6\u7684\u6743\u9650',
        'code31': '\u6587\u4ef6\u4e0d\u5b58\u5728\uff0c\u5220\u9664\u5931\u8d25',
        'code98': '\u9a8c\u8bc1\u7801\u5df2\u7ecf\u5931\u6548\uff0c\u8bf7\u5237\u65b0\u9a8c\u8bc1\u7801\u91cd\u8bd5',
        'code99': '\u9700\u8981\u9a8c\u8bc1\u7801',
        'code100': '\u6ca1\u6709\u6743\u9650 ',
        'code101': '\u9a8c\u8bc1\u7801\u9519\u8bef',
        'code103': '\u7528\u6237\u4e0d\u5b58\u5728',
        'code104': '\u7528\u6237\u4fe1\u606f\u4e0d\u5b58\u5728',
        'code105': '\u516c\u53f8\u4fe1\u606f\u4e0d\u5b58\u5728',
        'code106': '\u6ce8\u518c\u5931\u8d25',
        'code107': '\u7528\u6237\u540d\u5df2\u5b58\u5728\u6216\u7528\u6237\u540d\u5305\u542b\u7279\u6b8a\u5b57\u7b26',
        'code108': '\u7528\u6237\u540d\u6216\u5bc6\u7801\u9519\u8bef',
        'code109': '\u65b0\u65e7\u5bc6\u7801\u4e00\u6837',
        'code110': '\u6ca1\u6709\u4fee\u6539\u6743\u9650',
        'code111': '\u7528\u6237\u540d\u3001\u5bc6\u7801\u6216\u8005\u90ae\u7bb1\u4e0d\u80fd\u4e3a\u7a7a',
        'code112': '\u516c\u53f8\u6210\u5458\u4e0d\u5b58\u5728',
        'code113': '\u60a8\u662fhr\uff0c\u8bf7\u5230hr\u9875\u9762\u767b\u5f55',
        'code114': '\u60a8\u662f\u5b9e\u4e60\u751f\uff0c\u8bf7\u5230\u5b9e\u4e60\u751f\u9875\u9762\u767b\u5f55',
        'code115': '\u90ae\u7bb1\u5df2\u7ecf\u88ab\u6ce8\u518c',
        'code116': '\u90ae\u7bb1\u683c\u5f0f\u4e0d\u6b63\u786e',
        'code117': '\u5bc6\u7801\u9519\u8bef',
        'code120': '\u7b80\u5386\u4e0d\u5b58\u5728',
        'code121': '\u878d\u8d44\u4fe1\u606f\u4e0d\u5b58\u5728',
        'code210': '\u804c\u4f4d\u540d\u592a\u957f\u6216\u8005\u592a\u77ed',
        'code211': '\u804c\u4f4d\u540d\u4e2d\u5305\u542b\u975e\u6cd5\u5b57\u7b26',
        'code212': '\u975e\u6cd5\u7684\u804c\u4f4d\u7c7b\u522b',
        'code213': '\u5de5\u4f5c\u57ce\u5e02\u5b57\u6570\u957f\u5ea6\u8fc7\u957f\u6216\u8fc7\u77ed',
        'code214': '\u5de5\u4f5c\u57ce\u5e02\u4e2d\u5305\u542b\u975e\u6cd5\u5b57\u7b26',
        'code215': '\u5de5\u4f5c\u5730\u5740\u5b57\u6570\u957f\u5ea6\u8fc7\u957f\u6216\u8fc7\u77ed',
        'code216': '\u5de5\u4f5c\u5730\u5740\u4e2d\u5305\u542b\u975e\u6cd5\u5b57\u7b26',
        'code217': '\u975e\u6cd5\u7684\u65f6\u95f4\u5f62\u5f0f',
        'code218': '\u622a\u6b62\u65f6\u95f4\u4e0d\u80fd\u65e9\u4e8e\u53d1\u5e03\u65f6\u95f4',
        'code219': '\u804c\u4f4d\u63cf\u8ff0\u957f\u5ea6\u8d85\u51fa\u9650\u5ea6',
        'code220': '\u804c\u4f4d\u63cf\u8ff0\u5305\u542b\u975e\u6cd5\u5b57\u7b26',
        'code221': '\u804c\u4f4d\u8981\u6c42\u957f\u5ea6\u8d85\u51fa\u9650\u5ea6 ',
        'code222': '\u804c\u4f4d\u63cf\u8ff0\u4e2d\u5305\u542b\u975e\u6cd5\u5b57\u7b26 ',
        'code223': '\u6bcf\u5468\u5de5\u4f5c\u65f6\u95f4\u9009\u62e9\u9519\u8bef\uff0c\u57281\u52307\u4e4b\u95f4 ',
        'code224': '\u5b9e\u4e60\u65f6\u95f4\u9519\u8bef\uff0c\u5e94\u8be5\u662f\u4e00\u4e2a\u975e\u8d1f\u6574\u6570 ',
        'code225': '\u85aa\u8d44\u6700\u4f4e\u503c\u586b\u5199\u9519\u8bef',
        'code226': '\u85aa\u8d44\u6700\u9ad8\u503c\u586b\u5199\u9519\u8bef',
        'code227': '\u85aa\u8d44\u4e0a\u9650\u5e94\u8be5\u5927\u4e8e\u85aa\u916c\u4e0b\u9650',
        'code228': '\u804c\u4f4d\u72b6\u6001\u9519\u8bef',
        'code231': '\u9519\u8bef\u7684\u641c\u7d22\u503c\uff1aid',
        'code232': '\u9519\u8bef\u7684\u641c\u7d22\u503c\uff1a\u57ce\u5e02',
        'code233': '\u9519\u8bef\u7684\u641c\u7d22\u503c\uff1a\u6bcf\u5468\u81f3\u5c11\u5de5\u4f5c\u7684\u5929\u6570',
        'code234': '\u9519\u8bef\u7684\u641c\u7d22\u503c\uff1a\u6bcf\u5468\u6700\u591a\u5de5\u4f5c\u7684\u5929\u6570',
        'code235': '\u9519\u8bef\u7684\u641c\u7d22\u503c\uff1a\u6700\u4f4e\u85aa\u8d44',
        'code236': '\u9519\u8bef\u7684\u641c\u7d22\u503c\uff1a\u6700\u9ad8\u85aa\u8d44',
        'code237': '\u9519\u8bef\u7684\u641c\u7d22\u503c\uff1a\u804c\u4f4d\u72b6\u6001',
        'code249': '\u5bf9\u8c61\u4e0d\u5b58\u5728',
        'code250': '\u5b58\u50a8\u5931\u8d25',
        'code251': '\u641c\u7d22\u5931\u8d25',
        'code252': '\u5220\u9664\u5931\u8d25',
        'code260': '\u804c\u4f4d\u4e0d\u5b58\u5728',
        'code261': '\u5173\u6ce8\u5173\u7cfb\u4e0d\u5b58\u5728\uff0c\u4e0d\u80fd\u53d6\u6d88\u5173\u6ce8',
        'code262': '\u804c\u4f4d\u53ea\u80fd\u662f\u517c\u804c\u6216\u5168\u804c',
        'code263': '\u5173\u6ce8\u516c\u53f8\u5173\u7cfb\u4e0d\u5b58\u5728',
        'code264': '\u7528\u6237\u672a\u6295\u9012\u8be5\u804c\u4f4d',
        'code265': '\u7528\u6237\u672a\u6295\u9012\u4efb\u4f55\u804c\u4f4d',
        'code266': '\u5df2\u7ecf\u6295\u9012\u4e86\u8be5\u804c\u4f4d',
        'code267': '\u6ca1\u6709\u5b9e\u4e60\u751f\u6295\u9012\u8be5\u804c\u4f4d',
        'code268': '\u6ca1\u6709\u5c97\u4f4d\u6d88\u606f\u8981\u5904\u7406',
        'code269': '\u9080\u8bf7\u7801\u9519\u8bef\uff0c\u8bf7\u8054\u7cfb\u521b\u52a0\u83b7\u53d6\u9080\u8bf7\u7801',
        'code270': '\u90ae\u7bb1\u9a8c\u8bc1\u7801\u9519\u8bef',
        'code271': '\u90ae\u7bb1\u9a8c\u8bc1\u7801\u5931\u6548\uff0c\u8bf7\u91cd\u65b0\u53d1\u9001\u90ae\u7bb1\u9a8c\u8bc1\u7801',
        'code272': '\u767b\u5f55\u9519\u8bef',
        'code273': '\u60a8\u7684info\u7528\u6237\u540d\u5df2\u7ecf\u88ab\u6ce8\u518c\uff0c\u8bf7\u53bb\u666e\u901a\u767b\u5f55\u9875\u767b\u5f55',
        'code275': '\u53c2\u6570\u9519\u8bef',
        'code274': '\u9700\u8981post position_id,username\u548cinterested',
        'code299': '\u672a\u77e5\u9519\u8bef'
      };
    return {
      'format_error': function (msg, error) {
        if (msg != '' && error.code == 1) {
          error.message = msg;
          error.class = 'alert alert-success';
        } else {
          error.class = 'alert alert-danger';
          error.message = msg;
          if (error.code != -1) {
            error.code_key = 'code' + error.code;
            error.message = error_message[error.code_key];
          }
        }
        error.show = true;
        return error;
      },
      'remove_error': function (error) {
        error.show = false;
      }
    };
  }
]).service('HeaderService', [function () {
    var headerCtr = {
        'homepage': false,
        'company': false,
        'position': false,
        'resume': false,
        'none': false,
        'user': false
      };
    return {
      'homepage': function () {
        headerCtr = {
          'homepage': true,
          'company': false,
          'position': false,
          'resume': false,
          'none': false,
          'user': false
        };
        return headerCtr;
      },
      'company': function () {
        headerCtr = {
          'homepage': false,
          'company': true,
          'position': false,
          'resume': false,
          'none': false,
          'user': false
        };
        return headerCtr;
      },
      'position': function () {
        var headerCtr = {
            'homepage': false,
            'company': false,
            'position': true,
            'resume': false,
            'none': false,
            'user': false
          };
        return headerCtr;
      },
      'resume': function () {
        var headerCtr = {
            'homepage': false,
            'company': false,
            'position': false,
            'resume': true,
            'none': false,
            'user': false
          };
        return headerCtr;
      },
      'none': function () {
        var headerCtr = {
            'homepage': false,
            'company': false,
            'position': false,
            'resume': false,
            'none': true,
            'user': false
          };
        return headerCtr;
      },
      'user': function () {
        var headerCtr = {
            'homepage': false,
            'company': false,
            'position': false,
            'resume': false,
            'none': false,
            'user': true
          };
        return headerCtr;
      }
    };
  }]).service('ImgResizeService', [function () {
    return {
      'cancel': function (scope, src) {
        $('.img-upload-preview').attr('src', src);
        scope.resize_area = false;  //$('.resize-image').attr('src',src);
      },
      'startUpload': function (file, file_t, category, scope) {
        var resize = function (file, file_t, category) {
          var resizeableImage = function (image_target) {
            // Some variable and settings
            var $container, orig_src = new Image(), image_target = $(image_target).get(0), event_state = {}, is_sized = false, constrain = false, min_width = 60,
              // Change as required
              min_height = 60, max_width = 11500,
              // Change as required
              max_height = 11400, resize_canvas = document.createElement('canvas');
            var init = function () {
              // When resizing, we will always use this copy of the original as the base
              orig_src.src = image_target.src;
              //orig_src.width = 360;
              image_target.width = 360;
              //                        image_target.naturalHeight = 360 / orig_src.width * orig_src.height;
              //                        image_target.naturalWidth = 360;
              // Without this Firefox will not re-calculate the the image dimensions until drag end
              //resize_canvas.width = 360;
              //resize_canvas.height = 360 / orig_src.width * orig_src.height;
              // Wrap the image with the container and add resize handles
              $(image_target).wrap('<div class="resize-container"></div>').before('<span class="resize-handle resize-handle-nw"></span>').before('<span class="resize-handle resize-handle-ne"></span>').after('<span class="resize-handle resize-handle-se"></span>').after('<span class="resize-handle resize-handle-sw"></span>');
              // Assign the container to a variable
              $container = $(image_target).parent('.resize-container');
              $('.resize-image').attr('width', '360');
              //var a = resizeImage(360, 360 / orig_src.width * orig_src.height) + Math.random();  
              //$container.offset({'left': 10, 'top': 20});
              //$('.resize-image').attr('width','');
              //image_target.width = 360;
              //$container.offset({'left': left, 'top': top});
              // Add events
              $container.on('mousedown touchstart', '.resize-handle', startResize);
              $container.on('mousedown touchstart', 'img', startMoving);
              $('.js-crop').on('click', crop);
            };
            var startResize = function (e) {
              e.preventDefault();
              e.stopPropagation();
              saveEventState(e);
              $(document).on('mousemove touchmove', resizing);
              $(document).on('mouseup touchend', endResize);
            };
            var endResize = function (e) {
              e.preventDefault();
              $(document).off('mouseup touchend', endResize);
              $(document).off('mousemove touchmove', resizing);
            };
            var saveEventState = function (e) {
              // Save the initial event details and container state
              event_state.container_width = $container.width();
              event_state.container_height = $container.height();
              event_state.container_left = $container.offset().left;
              event_state.container_top = $container.offset().top;
              event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
              event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
              // This is a fix for mobile safari
              // For some reason it does not allow a direct copy of the touches property
              if (typeof e.originalEvent.touches !== 'undefined') {
                event_state.touches = [];
                $.each(e.originalEvent.touches, function (i, ob) {
                  event_state.touches[i] = {};
                  event_state.touches[i].clientX = 0 + ob.clientX;
                  event_state.touches[i].clientY = 0 + ob.clientY;
                });
              }
              event_state.evnt = e;
            };
            var resizing = function (e) {
              var mouse = {}, width, height, left, top, offset = $container.offset();
              mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
              mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
              e.shiftKey = true;
              // Position image differently depending on the corner dragged and constraints
              if ($(event_state.evnt.target).hasClass('resize-handle-se')) {
                width = mouse.x - event_state.container_left;
                height = mouse.y - event_state.container_top;
                left = event_state.container_left;
                top = event_state.container_top;
              } else if ($(event_state.evnt.target).hasClass('resize-handle-sw')) {
                width = event_state.container_width - (mouse.x - event_state.container_left);
                height = mouse.y - event_state.container_top;
                left = mouse.x;
                top = event_state.container_top;
              } else if ($(event_state.evnt.target).hasClass('resize-handle-nw')) {
                width = event_state.container_width - (mouse.x - event_state.container_left);
                height = event_state.container_height - (mouse.y - event_state.container_top);
                left = mouse.x;
                top = mouse.y;
                if (constrain || e.shiftKey) {
                  top = mouse.y - (width / orig_src.width * orig_src.height - height);
                }
              } else if ($(event_state.evnt.target).hasClass('resize-handle-ne')) {
                width = mouse.x - event_state.container_left;
                height = event_state.container_height - (mouse.y - event_state.container_top);
                left = event_state.container_left;
                top = mouse.y;
                if (constrain || e.shiftKey) {
                  top = mouse.y - (width / orig_src.width * orig_src.height - height);
                }
              }
              // Optionally maintain aspect ratio
              if (constrain || e.shiftKey) {
                height = width / orig_src.width * orig_src.height;
              }
              if (width > min_width && height > min_height && width < max_width && height < max_height) {
                // To improve performance you might limit how often resizeImage() is called
                $('.resize-image').attr('width', '');
                is_sized = true;
                resizeImage(width, height);
                // Without this Firefox will not re-calculate the the image dimensions until drag end
                $container.offset({
                  'left': left,
                  'top': top
                });
              }
            };
            var resizeImage = function (width, height) {
              resize_canvas.width = width;
              resize_canvas.height = height;
              resize_canvas.getContext('2d').drawImage(orig_src, 0, 0, width, height);
              $(image_target).attr('src', resize_canvas.toDataURL('image/png'));
            };
            var startMoving = function (e) {
              e.preventDefault();
              e.stopPropagation();
              saveEventState(e);
              $(document).on('mousemove touchmove', moving);
              $(document).on('mouseup touchend', endMoving);
            };
            var endMoving = function (e) {
              e.preventDefault();
              $(document).off('mouseup touchend', endMoving);
              $(document).off('mousemove touchmove', moving);
            };
            var moving = function (e) {
              var mouse = {}, touches;
              e.preventDefault();
              e.stopPropagation();
              touches = e.originalEvent.touches;
              mouse.x = (e.clientX || e.pageX || touches[0].clientX) + $(window).scrollLeft();
              mouse.y = (e.clientY || e.pageY || touches[0].clientY) + $(window).scrollTop();
              $container.offset({
                'left': mouse.x - (event_state.mouse_x - event_state.container_left),
                'top': mouse.y - (event_state.mouse_y - event_state.container_top)
              });
              // Watch for pinch zoom gesture while moving
              if (event_state.touches && event_state.touches.length > 1 && touches.length > 1) {
                var width = event_state.container_width, height = event_state.container_height;
                var a = event_state.touches[0].clientX - event_state.touches[1].clientX;
                a = a * a;
                var b = event_state.touches[0].clientY - event_state.touches[1].clientY;
                b = b * b;
                var dist1 = Math.sqrt(a + b);
                a = e.originalEvent.touches[0].clientX - touches[1].clientX;
                a = a * a;
                b = e.originalEvent.touches[0].clientY - touches[1].clientY;
                b = b * b;
                var dist2 = Math.sqrt(a + b);
                var ratio = dist2 / dist1;
                width = width * ratio;
                height = height * ratio;
                // To improve performance you might limit how often resizeImage() is called
                var x = resizeImage(width, height) + Math.random();
              }
            };
            var transfer = function (canvas) {
              var data = canvas.toDataURL();
              // dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
              data = data.split(',')[1];
              data = window.atob(data);
              var ia = new Uint8Array(data.length);
              for (var i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i);
              }
              ;
              // canvas.toDataURL 返回的默认格式就是 image/png
              var blob = new Blob([ia], { type: 'image/png' });
              return blob;
            };
            var crop = function () {
              //Find the part of the image that is inside the crop box
              var crop_canvas, left = $('.overlay').offset().left - $container.offset().left, top = $('.overlay').offset().top - $container.offset().top, width = $('.overlay').width(), height = $('.overlay').height();
              crop_canvas = document.createElement('canvas');
              crop_canvas.width = width;
              crop_canvas.height = height;
              if (!is_sized) {
                resize_canvas.width = 360;
                resize_canvas.height = 360 / orig_src.width * orig_src.height;
                resize_canvas.getContext('2d').drawImage(image_target, 0, 0, 360, 360 / orig_src.width * orig_src.height);
                $(image_target).attr('src', resize_canvas.toDataURL('image/png'));
              }
              crop_canvas.getContext('2d').drawImage(image_target, left, top, width, height, 0, 0, width, height);
              //window.open(crop_canvas.toDataURL("image/png"));
              var dataURL = crop_canvas.toDataURL();
              // dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
              var data = dataURL.split(',')[1];
              data = window.atob(data);
              var ia = new Uint8Array(data.length);
              for (var i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i);
              }
              ;
              // canvas.toDataURL 返回的默认格式就是 image/png
              var blob = new Blob([ia], { type: 'image/png' });
              //                $('.change_tab').innerHTML = '<img src="'+dataURL+'" alt=""/>' ;
              //                document.getElementById('#logo-preview').src="/api/file/"+ scope.companyinfo.logo_id+ "/download"; 
              //window.open(crop_canvas.toDataURL("image/png"));
              scope.upload(blob, file_t, category);
              $('.img-upload-preview').attr('src', crop_canvas.toDataURL('image/png'));
              scope.resize_area = false;
              scope.cancel_upload = false;  //location.reload();
                                            //$('#img_preview').attr('ngf-src',crop_canvas.toDataURL("image/png"));
            };
            init();
          };
          // Kick everything off with the target image
          resizeableImage($('.resize-image'));
        };
        if (file == undefined || file == null || file == '')
          return false;
        if (!/image\/\w+/.test(file.type)) {
          alert('\u6587\u4ef6\u5fc5\u987b\u4e3a\u56fe\u7247\uff01');
          scope.resize_area = false;
          return false;
        }
        $('#resize-box').html('<img class="resize-image" id="image-preview" ngf-src="logo" alt="image for resizing">');
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          $('.resize-image').attr('src', this.result);
          resize(file, file_t, category);
        };
        return true;
      }
    };
  }]).service('UserService', [
  'urls',
  '$http',
  '$cookies',
  '$rootScope',
  function (urls, $http, $cookies, $rootScope) {
    var user = {};
    if ($cookies.username) {
      user.username = $cookies.username;
    }
    if ($cookies.id) {
      user.id = $cookies.id;
    }
    if ($cookies.role) {
      user.role = $cookies.role;
    }
    return {
      'check_info': function () {
        if (user.username != undefined && user.role == 0) {
          $http.get(urls.api + '/account/userinfo/get').success(function (udata) {
            if (udata.error.code == 1) {
              $rootScope.is_tsinghua = udata.data.is_info;
              if (udata.data.major == undefined || udata.data.university == undefined || udata.data.grade == undefined || $rootScope.is_tsinghua && udata.data.email == undefined) {
                console.log('\u9700\u8981\u586b\u5199\u4fe1\u606f');
                window.location.href = '/intern/information';
              }
            } else
              $notice.show($errMsg.format_error('', udata.error).message);
          });
        }
      },
      'username': function () {
        return $cookies.username;
      },
      'refresh': function () {
        $.get(urls.api + '/user/status', function (data) {
          user = data;
        });
      },
      'id': function () {
        return user.id;
      },
      'role': function () {
        return user.role;
      },
      'school_manager': function () {
        if (!('role' in user)) {
          return false;
        }
        return parseInt(user.role) == 0 || parseInt(user.role) == 4;
      },
      'department_manager': function () {
        if (!('role' in user)) {
          return false;
        }
        return parseInt(user.role) == 0 || parseInt(user.role) == 3;
      },
      'logout': function () {
        delete $cookies['username'];
        delete $cookies['role'];
      }
    };
  }
]).factory('safeApply', [
  '$rootScope',
  function ($rootScope) {
    return function (scope, fn) {
      var phase = scope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn && typeof fn === 'function') {
          fn();
        }
      } else {
        scope.$apply(fn);
      }
    };
  }
]);
;
'use strict';
/* Filters */
angular.module('chuangplus.filters', []).filter('interpolate', [
  'version',
  function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/gm, version);
    };
  }
]).filter('id2date', function () {
  return function (value) {
    var secs = parseInt(value.substring(0, 8), 16) * 1000;
    var tmp_date = new Date(secs);
    return tmp_date.getFullYear() + '\u5e74' + (tmp_date.getMonth() + 1) + '\u6708' + tmp_date.getDate() + '\u65e5';
  };
});
;
'use strict';
/* Directives */
angular.module('chuangplus.directives', []).directive('appVersion', [
  'version',
  function (version) {
    return function (scope, elm, attrs) {
      elm.text(version);
    };
  }
]).directive('onBlur', [
  'safeApply',
  function (safeApply) {
    return {
      restrict: 'A',
      link: function (scope, elm, attrs) {
        elm.bind('blur', function () {
          safeApply(scope, attrs.onBlur);
        });
      }
    };
  }
]).directive('onFocus', [
  'safeApply',
  function (safeApply) {
    return {
      restrict: 'A',
      link: function (scope, elm, attrs) {
        elm.bind('focus', function () {
          safeApply(scope, attrs.onFocus);
        });
      }
    };
  }
]).directive('onMouseover', [
  'safeApply',
  function (safeApply) {
    return {
      restrict: 'A',
      link: function (scope, elm, attrs) {
        elm.bind('mouseover', function () {
          safeApply(scope, attrs.onMouseover);
        });
      }
    };
  }
]).directive('onMouseout', [
  'safeApply',
  function (safeApply) {
    return {
      restrict: 'A',
      link: function (scope, elm, attrs) {
        elm.bind('mouseout', function () {
          safeApply(scope, attrs.onMouseout);
        });
      }
    };
  }
]).directive('myText', function () {
  return {
    restrict: 'E',
    scope: { text: '=' },
    replace: true,
    templateUrl: '/static/partials/desktop/directive_templates/myText.html',
    link: function (scope, elem, attr) {
      scope.$watch('text', function (value) {
        if (value == undefined) {
          return;
        }
        scope.texts = value.split('\n');
        var timestamp = Date.parse(new Date());
        if (elem.children() != []) {
          elem.empty();
        }
        for (var i = 0; i < scope.texts.length; i++) {
          if (scope.texts[i] != '') {
            elem.append('<li>' + scope.texts[i] + '</li>');
          } else {
            elem.append('</br>');
          }
        }
      });
    }
  };
}).directive('page', function () {
  return {
    restrict: 'E',
    scope: {
      numPages: '=',
      currentPage: '=',
      onSelectPage: '&'
    },
    replace: true,
    templateUrl: '/static/partials/desktop/directive_templates/pagination.html',
    link: function (scope) {
      scope.update = function () {
        scope.pages = [];
        var start = 1;
        //更新列表
        if (scope.currentPage > 4)
          start = scope.currentPage - 3;
        for (var i = start; i <= start + 6 && i <= scope.pageNum; i++) {
          scope.pages.push(i);
        }
      };
      scope.$watch('numPages', function (value) {
        scope.pages = [];
        scope.pageNum = value;
        var start = 1;
        //更新列表
        if (scope.currentPage > 4) {
          start = scope.currentPage - 3;
        }
        for (var i = start; i <= start + 6 && i <= scope.pageNum; i++) {
          scope.pages.push(i);
        }
        if (scope.currentPage > value) {
          scope.selectPage(value);
        }
      });
      scope.isActive = function (page) {
        return scope.currentPage == page;
      };
      scope.selectPage = function (page) {
        if (!scope.isActive(page)) {
          scope.currentPage = page;
          scope.onSelectPage({ page: page });
          scope.update();
        }
      };
      scope.selectNext = function () {
        if (!scope.noNext()) {
          scope.selectPage(scope.currentPage + 1);
          scope.update();
        }
      };
      scope.selectPrevious = function () {
        if (!scope.noPrevious()) {
          scope.selectPage(scope.currentPage - 1);
          scope.update();
        }
      };
      scope.noPrevious = function () {
        return scope.currentPage == 1;
      };
      scope.noNext = function () {
        return scope.currentPage == scope.numPages;
      };
    }
  };
});
;
'use strict';
/* Controllers */
angular.module('chuangplus.controllers', []).controller('DT_HomepageCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user) {
    console.log('HomepageCtrl');
    $scope.role = $user.role();
    $scope.username = $user.username();
    $scope.company_id = '';
    $scope.myInterval = 3000;
    $scope.slides1 = [
      { image: '/static/image/banner/ceobanner-03.jpg' },
      { image: '/static/image/banner/ceobanner-04.jpg' },
      { image: '/static/image/banner/ceobanner-05.jpg' }
    ];
    $scope.slides2 = [
      { image: '/static/image/banner/banner-01.jpg' },
      { image: '/static/image/banner/banner-02.jpg' }
    ];
    $scope.scan = false;
    $scope.search = false;
    $scope.get_company_info = function () {
      $http.get(urls.api + '/account/company/detail').success(function (data) {
        if (data.error.code == 1) {
          $scope.company_id = data.data._id.$oid;
          if (data.data.abbreviation != null) {
            $scope.url = '/company/' + $scope.company_id + '/create/first';
          } else {
            $scope.url = '/company/' + $scope.company_id + '/no';
          }
        }
      });
    };
    $scope.get_company_info();
  }
]).controller('DT_HeaderCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  '$location',
  'HeaderService',
  '$rootScope',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $location, $header, $rootScope) {
    console.log('DT_HeaderCtrl');
    $scope.company_id = '';
    $scope.not_in_search = true;
    $scope.username = $user.username();
    $scope.scan_mouseover = function () {
      $scope.scan = true;
      $scope.search = false;
    };
    $scope.out_search_icon = function () {
      var leave = function () {
        if ($scope.not_in_search)
          $scope.search = false;
      };
      setTimeout(leave, 1000);
    };
    $scope.search_mouseout = function () {
      $scope.not_in_search = true;
      $scope.timeout_id = setTimeout($scope.hide_search, 1000);
    };
    $scope.hide_search = function () {
      $scope.$apply(function () {
        $scope.search = false;
      });
    };
    $scope.search_mouseover = function () {
      $scope.not_in_search = false;
      $scope.search = true;
      clearTimeout($scope.timeout_id);
    };
    $scope.hide_search = function () {
      $scope.$apply(function () {
        $scope.search = false;
      });
    };
    $scope.get_company_info = function () {
      $http.get(urls.api + '/account/company/detail').success(function (data) {
        if (data.error.code == 1) {
          $scope.company_id = data.data._id.$oid;
          if (data.data.abbreviation != null) {
            $scope.url = '/company/' + $scope.company_id + '/create/first';
          } else {
            $scope.url = '/company/' + $scope.company_id + '/no';
          }
        }
      });
    };
    $scope.register = function () {
      window.location.href = '/register';
    };
    $scope.login = function () {
      window.location.href = '/login';
    };
    $scope.home = function () {
      window.location.href = '/';
    };
    if ($user.role() == 1) {
      $scope.get_company_info();
    }
    $scope.logout = function () {
      $http.get(urls.api + '/account/logout').success(function (data) {
        console.log(data);
        if (data.error.code == 1) {
          $user.logout();
          window.location.href = '/';
        }
      });
    };
    //tab active control
    $scope.homepage_active = function () {
      $scope.header = $header.homepage();
    };
    $scope.company_active = function () {
      $rootScope.company_list_position = undefined;
      $rootScope.company_list_param_cache = undefined;
      $scope.header = $header.company();
    };
    $scope.position_active = function () {
      $rootScope.company_position_position = undefined;
      $rootScope.company_position_param_cache = undefined;
      $scope.header = $header.position();
    };
    $scope.resume_active = function () {
      $scope.header = $header.resume();
    };
    $scope.user_active = function () {
      $scope.header = $header.user();
    };
    $scope.choose_header = function () {
      var url = $location.url();
      if (url == '/') {
        $scope.header = $header.homepage();
      } else if (url.indexOf('position') == 1) {
        $scope.header = $header.position();
      } else if (url.indexOf('company') == 1 && (url.indexOf('list') == 9 || url.indexOf('detail') == 34)) {
        $scope.header = $header.company();
      } else if (url.indexOf('resume') > 0) {
        $scope.header = $header.resume();
      } else if (url.indexOf('login') > 0 || url.indexOf('register') > 0 || url.indexOf('password') > 0 || url.indexOf('intern') == 1 || url.indexOf('feedback') > 0 || url.indexOf('about') > 0) {
        $scope.header = $header.none();
      } else {
        $scope.header = $header.user();
      }
    };
    $scope.choose_header();
    $scope.search_it = function () {
      $scope.search = false;
      $rootScope.search_position_param_cache = undefined;
      $rootScope.search_company_param_cache = undefined;
      $rootScope.search_tab_cache = undefined;
      $rootScope.search_list_position = 0;
      $location.path('/search').search({
        'query': $scope.search_text,
        'type': '0'
      });  //            window.location.href="/search?query="++"&type=0&page=1";
    };
  }
]).controller('DT_NoHeaderCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user) {
    console.log('DT_NoHeaderCtrl');
    $scope.homepage_active = function () {
      window.location.href = '/';
    };
  }
]).controller('DT_LoginCtrl', [
  '$scope',
  '$rootScope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  '$location',
  function ($scope, $rootScope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg, $location) {
    console.log('DT_LoginCtrl');
    $scope.login_info = {};
    //$scope.login_info.role = 1;
    $scope.captcha_url = urls.api + '/captcha/image/';
    $scope.refresh = function () {
      $scope.captcha_url = urls.api + '/captcha/image/?' + Math.random();
    };
    $scope.login_user = function () {
      $csrf.set_csrf($scope.login_info);
      $scope.submit_loading = true;
      if ($scope.is_tsinghua == true)
        $scope.url = urls.api + '/account/login_by_tsinghua';
      else
        $scope.url = urls.api + '/account/login';
      $http.post($scope.url, $.param($scope.login_info)).success(function (data) {
        if (data.error.code == 1) {
          $rootScope.is_tsinghua = $scope.is_tsinghua;
          $scope.error = $errMsg.format_error('\u767b\u5f55\u6210\u529f', data.error);
          if (data.role == 1)
            setTimeout(function () {
              window.location.href = '/';
            }, 1000);
          else {
            if (data.completive == '1')
              setTimeout(function () {
                window.location.href = '/';
              }, 1000);
            else
              $location.url('/intern/information');
          }
        } else {
          $scope.error = $errMsg.format_error('', data.error);
          setTimeout(function () {
            $errMsg.remove_error($scope.error);
          }, 2000);
        }
        $scope.submit_loading = false;
      });
    };
    $scope.refresh();
  }
]).controller('DT_SearchCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$routeParams',
  'ErrorService',
  '$location',
  '$rootScope',
  function ($scope, $http, $csrf, urls, $routeParams, $errMsg, $location, $rootScope) {
    $scope.search_param = $location.search();
    $scope.tab = 1;
    $scope.now_ready = false;
    $scope.param_position = {
      field: null,
      pageCount: 1,
      currentPage: 1
    };
    $scope.param_company = {
      field: null,
      pageCount: 1,
      currentPage: 1
    };
    if ($rootScope.search_tab_cache != undefined) {
      if ($rootScope.search_position_param_cache != undefined)
        $scope.param_position = $rootScope.search_position_param_cache;
      if ($rootScope.search_company_param_cache != undefined)
        $scope.param_company = $rootScope.search_company_param_cache;
      $scope.tab = $rootScope.search_tab_cache;
      document.body.scrollTop = $rootScope.search_list_position;
    }
    document.body.onscroll = function record_position() {
      $rootScope.search_list_position = document.body.scrollTop;
      $rootScope.search_tab_cache = $scope.tab;
      $scope.tab = 1;
    };
    //换页
    $scope.position_type = {
      'technology': '\u6280\u672f',
      'product': '\u4ea7\u54c1',
      'design': '\u8bbe\u8ba1',
      'operate': '\u8fd0\u8425',
      'marketing': '\u5e02\u573a',
      'functions': '\u804c\u80fd',
      'others': '\u5176\u4ed6'
    };
    $scope.scale = [
      '\u521d\u521b',
      '\u5feb\u901f\u53d1\u5c55',
      '\u6210\u719f'
    ];
    $scope.field_type = {
      'social': '\u793e\u4ea4',
      'e-commerce': '\u7535\u5b50\u5546\u52a1',
      'education': '\u6559\u80b2',
      'health_medical': '\u5065\u5eb7\u533b\u7597',
      'culture_creativity': '\u6587\u5316\u521b\u610f',
      'living_consumption': '\u751f\u6d3b\u6d88\u8d39',
      'hardware': '\u786c\u4ef6',
      'O2O': 'O2O',
      'others': '\u5176\u4ed6'
    };
    $scope.selectPageCompany = function (page) {
      if (page > 0) {
        $scope.param_company.currentPage = page;
        //$rootScope.company_list_param_cachce = $scope.param;
        $scope.search_company();
        document.body.scrollTop = 0;
        $scope.loading = true;
        $rootScope.search_tab_cache = $scope.tab;
        $rootScope.search_company_param_cache = $scope.param_company;
        $rootScope.search_position_param_cache = $scope.param_position;
      }
    };
    $scope.selectPagePosition = function (page) {
      if (page > 0) {
        $scope.param_position.currentPage = page;
        //$rootScope.company_list_param_cachce = $scope.param;
        $scope.search_position();
        document.body.scrollTop = 0;
        $scope.loading = true;
        $rootScope.search_position_param_cache = $scope.param_position;
        $rootScope.search_company_param_cache = $scope.param_company;
      }
    };
    $scope.tab1_click = function () {
      $scope.tab = 1;
      $rootScope.search_tab_cache = $scope.tab;
    };
    $scope.tab2_click = function () {
      $scope.tab = 2;
      $rootScope.search_tab_cache = $scope.tab;
    };
    $scope.get_count = function () {
      $http.get(urls.api + '/account/' + $scope.search_param.query + '/search_count').success(function (data) {
        if (data.error.code = 1) {
          $scope.company_count = data.company_count;
          $scope.position_count = data.position_count;
        } else
          console.log(data.error.message);
      });
    };
    $scope.get_count();
    $scope.search_company = function () {
      var search_param = '?text=' + $scope.search_param.query + '&page=' + $scope.param_company.currentPage;
      if ($scope.param_company.currentPage > 0)
        $http.get(urls.api + '/account/company/list' + search_param).success(function (data) {
          if (data.error.code == 1) {
            //if($scope.param_company.pageCount < 0)
            $scope.param_company.pageCount = data.page_number;
            $scope.company_list = data.data;
            $scope.loading = false;
            for (var i = 0; i < $scope.company_list.length; i++) {
              $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
              $scope.company_list[i].scale_value = $scope.scale[$scope.company_list[i].scale];
              $scope.company_list[i].field_type = $scope.field_type[$scope.company_list[i].field];
              $scope.company_list[i].position_type_value = {};
              for (var j = 0; j < $scope.company_list[i].position_type.length; j++) {
                $scope.company_list[i].position_type_value[j] = $scope.position_type[$scope.company_list[i].position_type[j]];
              }
            }
            if ($scope.tab == 1)
              $scope.loading = false;
          } else
            console.log(data.error.message);
        });
    };
    $scope.search_company();
    $scope.search_position = function () {
      var search_param = '?name=' + $scope.search_param.query + '&page=' + $scope.param_position.currentPage;
      if ($scope.param_position.currentPage > 0)
        $http.get(urls.api + '/position/search' + search_param).success(function (data) {
          if (data.error.code == 1) {
            $scope.position_list = data.positions;
            //if($scope.param.position.pageCount < -1)
            $scope.param_position.pageCount = data.page_number;
            for (var i = 0; i < $scope.position_list.length; i++) {
              $scope.position_list[i].position_type_value = $scope.position_type[$scope.position_list[i].position_type];
              $scope.position_list[i].company.field_type = $scope.field_type[$scope.position_list[i].company.field];
              if ($scope.position_list[i].company.scale == 0) {
                $scope.position_list[i].company.scale_value = '\u521d\u521b';
              } else if ($scope.position_list[i].company.scale == 1) {
                $scope.position_list[i].company.scale_value = '\u5feb\u901f\u53d1\u5c55';
              } else {
                $scope.position_list[i].company.scale_value = '\u6210\u719f';
              }
            }
            if ($scope.tab == 2)
              $scope.loading = false;
          } else
            console.log(data.error.message);
        });
    };
    $scope.search_position();
  }
]).controller('DT_RegisterCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg) {
    console.log('DT_RegisterCtrl');
    $scope.show_footer = 'false';
    $scope.show_header = 'false';
    $scope.error = {};
    $scope.reg_info = {};
    $scope.reg_info.role = 0;
    $scope.captcha_url = urls.api + '/captcha/image/';
    $scope.check = {};
    $scope.e_check = {};
    $scope.ic_check = {
      'exist': true,
      'used': false
    };
    $scope.student = function () {
      $scope.tab1 = true;
      $scope.tab2 = false;
      $scope.reg_info.role = 0;
    };
    $scope.hr = function () {
      $scope.tab1 = false;
      $scope.tab2 = true;
      $scope.reg_info.role = 1;
    };
    $scope.refresh = function () {
      $scope.captcha_url = urls.api + '/captcha/image/?' + Math.random();
    };
    $scope.register = function () {
      if ($scope.reg_info.password != $scope.repeate_password) {
        $scope.error.code = -1;
        $scope.error = $errMsg.format_error('\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u4e00\u81f4', $scope.error);
        return;
      }
      if ($scope.reg_info.role == 1) {
        if ($scope.ic_check.used == true) {
          $scope.error.code = -1;
          $scope.error = $errMsg.format_error('\u9080\u8bf7\u7801\u5df2\u7ecf\u88ab\u6ce8\u518c\uff0c\u8bf7\u8054\u7cfb\u521b\u52a0\u83b7\u53d6\u9080\u8bf7\u7801', $scope.error);
          return;
        } else if ($scope.ic_check.exist = false) {
          $scope.error.code = -1;
          $scope.error = $errMsg.format_error('\u9080\u8bf7\u7801\u9519\u8bef\uff0c\u8bf7\u8054\u7cfb\u521b\u52a0\u83b7\u53d6\u9080\u8bf7\u7801', $scope.error);
          return;
        }
        var param = { 'code': $scope.reg_info.invitation_code };
        $csrf.set_csrf(param);
        $http.post(urls.api + '/captcha/register_invitation_code', $.param(param)).success(function (data) {
          if (data.error.code == 1) {
            $csrf.set_csrf($scope.reg_info);
            $scope.submit_loading = true;
            $http.post(urls.api + '/account/register', $.param($scope.reg_info)).success(function (data) {
              if (data.error.code == 1) {
                $scope.error = $errMsg.format_error('\u6ce8\u518c\u6210\u529f', data.error);
                $scope.id = data.id;
                if ($scope.reg_info.role == 1) {
                  setTimeout(function () {
                    window.location.href = '/company/' + $scope.id + '/create/first';
                  }, 1500);
                } else {
                  setTimeout(function () {
                    window.location.href = '/';
                  }, 1500);
                }
              } else {
                $scope.error = $errMsg.format_error('', data.error);
                setTimeout($scope.hide_error, 2000);
              }
              $scope.submit_loading = false;
            });
          } else {
            $scope.error = $errMsg.format_error('', data.error);
          }
        });
      } else {
        $csrf.set_csrf($scope.reg_info);
        $scope.submit_loading = true;
        $http.post(urls.api + '/account/register', $.param($scope.reg_info)).success(function (data) {
          if (data.error.code == 1) {
            $scope.error = $errMsg.format_error('\u6ce8\u518c\u6210\u529f', data.error);
            setTimeout(function () {
              window.location.href = '/intern/information';
            }, 1500);
          } else {
            $scope.error = $errMsg.format_error('', data.error);
            setTimeout($scope.hide_error, 2000);
          }
          $scope.submit_loading = false;
        });
      }
    };
    $scope.hide_error = function () {
      $scope.$apply(function () {
        $errMsg.remove_error($scope.error);
      });
    };
    $scope.showError = function (ngModelController, error) {
      return ngModelController.$error[error];
    };
    $scope.check_username = function () {
      $scope.check.username = $scope.reg_info.username;
      $csrf.set_csrf($scope.check);
      $http.post(urls.api + '/account/checkusername', $.param($scope.check)).success(function (data) {
        if (data.error.code == 1) {
          $scope.check.exist = data.username.exist;
        }
      });
    };
    $scope.check_invitation_code = function () {
      $scope.ic_check.code = $scope.reg_info.invitation_code;
      $csrf.set_csrf($scope.ic_check);
      $http.post(urls.api + '/captcha/check_ic', $.param($scope.ic_check)).success(function (data) {
        if (data.error.code == 1) {
          if (data.checked == true) {
            $scope.ic_check.used = true;
            $scope.ic_check.exist = true;
          } else {
            $scope.ic_check.exist = true;
            $scope.ic_check.used = false;
          }
        } else {
          $scope.ic_check.exist = false;
          $scope.ic_check.used = false;
        }
      });
    };
    $scope.check_email = function () {
      $scope.e_check.email = $scope.reg_info.email;
      $csrf.set_csrf($scope.e_check);
      $http.post(urls.api + '/account/checkemail', $.param($scope.e_check)).success(function (data) {
        if (data.error.code == 1) {
          $scope.e_check.exist = data.email.exist;
        }
      });
    };
    $scope.refresh();
  }
]).controller('DT_FindPwdCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  '$cookieStore',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookieStore) {
    console.log('DT_FindPwdCtrl');
    $scope.find = {};
    $scope.captcha_url = urls.api + '/captcha/image/';
    $scope.e_check = { 'exist': true };
    $scope.c_check = { 'valid': true };
    $scope.refresh = function () {
      $scope.captcha_url = urls.api + '/captcha/image/?' + Math.random();
    };
    $scope.findpwd = function () {
      $csrf.set_csrf($scope.find);
      $http.post(urls.api + '/account/sendemail', $.param($scope.find)).success(function (data) {
        if (data.error.code == 1) {
          $cookieStore.put('email', $scope.find.email);
          window.location.href = '/password/set';
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.showError = function (ngModelController, error) {
      return ngModelController.$error[error];
    };
    $scope.check_email = function () {
      $csrf.set_csrf($scope.e_check);
      $scope.e_check.email = $scope.find.email;
      $http.post(urls.api + '/account/checkemail', $.param($scope.e_check)).success(function (data) {
        if (data.error.code == 1) {
          $scope.e_check.exist = data.email.exist;
        }
      });
    };
    $scope.check_captcha = function () {
      $csrf.set_csrf($scope.c_check);
      $scope.c_check.captcha = $scope.find.captcha;
      $http.post(urls.api + '/captcha/check/', $.param($scope.c_check)).success(function (data) {
        if (data == 'yes') {
          $scope.c_check.valid = true;
        } else {
          $scope.c_check.valid = false;
        }
      });
    };
    $scope.refresh();
  }
]).controller('DT_SetPwdCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  '$cookieStore',
  'ErrorService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookieStore, $errMsg) {
    console.log('DT_SetPwdCtrl');
    $scope.email = $cookieStore.get('email');
    $scope.pass_verify = false;
    $scope.check_correct_code = function () {
      var param = {
          'input_code': $scope.set.verifycode,
          'csrfmiddlewaretoken': $csrf.val()
        };
      $http.post(urls.api + '/account/verifycode', $.param(param)).success(function (data) {
        $scope.pass_verify = data.pass_verify;
        return data.pass_verify;
      });
    };
    $scope.setpwd = function () {
      if ($scope.pass_verify == false) {
        $scope.error = $errMsg.format_error('\u90ae\u7bb1\u9a8c\u8bc1\u7801\u9519\u8bef', { code: '-1' });
        return;
      }
      if ($scope.set.password != $scope.set.repassword) {
        $scope.error = $errMsg.format_error('\u4e24\u6b21\u8f93\u5165\u5bc6\u7801\u4e0d\u4e00\u81f4', { code: '-1' });
        return;
      }
      var param = {
          'input_code': $scope.set.verifycode,
          'csrfmiddlewaretoken': $csrf.val(),
          'email': $scope.email,
          'new_password': $scope.set.password
        };
      $http.post(urls.api + '/account/password/set_withcode', $.param(param)).success(function (data) {
        if (data.error.code == 1) {
          window.location.href = '/password/finish';
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
  }
]).controller('DT_FinishPwdCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user) {
    console.log('DT_FinishPwdCtrl');
  }
]).controller('DT_InternInfoCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user) {
    console.log('DT_InternInfoCtrl');
  }
]).controller('DT_InternPostCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user) {
    console.log('DT_InternPostCtrl');
    $scope.positions = {};
    $scope.position_type = {
      'technology': '\u6280\u672f',
      'product': '\u4ea7\u54c1',
      'design': '\u8bbe\u8ba1',
      'operate': '\u8fd0\u8425',
      'marketing': '\u5e02\u573a',
      'functions': '\u804c\u80fd',
      'others': '\u5176\u4ed6'
    };
    $scope.field_type = {
      'social': '\u793e\u4ea4',
      'e-commerce': '\u7535\u5b50\u5546\u52a1',
      'education': '\u6559\u80b2',
      'health_medical': '\u5065\u5eb7\u533b\u7597',
      'culture_creativity': '\u6587\u5316\u521b\u610f',
      'living_consumption': '\u751f\u6d3b\u6d88\u8d39',
      'hardware': '\u786c\u4ef6',
      '020': 'O2O',
      'others': '\u5176\u4ed6'
    };
    $scope.task = {
      'pageCount': 1,
      'currentPage': 1
    };
    $scope.get_positions = function () {
      $scope.loading = true;
      $http.get(urls.api + '/account/userinfo/position/submit/list').success(function (data) {
        if (data.error.code == 1) {
          $scope.positions = data.data;
          $scope.task.pageCount = data.page_number;
          for (var i = 0; i < $scope.positions.length; i++) {
            $scope.positions[i].position_type_value = $scope.position_type[$scope.positions[i].position_type];
            $scope.positions[i].company.field_type = $scope.field_type[$scope.positions[i].company.field];
            if ($scope.positions[i].company.scale == 0) {
              $scope.positions[i].company.scale_value = '\u521d\u521b';
            } else if ($scope.positions[i].company.scale == 1) {
              $scope.positions[i].company.scale_value = '\u5feb\u901f\u53d1\u5c55';
            } else {
              $scope.positions[i].company.scale_value = '\u6210\u719f';
            }
            $scope.positions[i].submit_value = '\u6295\u9012\u7b80\u5386';
          }
        } else {
          console.log(data.error.message);
        }
        $scope.loading = false;
      });
    };
    $scope.get_positions();
  }
]).controller('DT_InternCompanyFavorCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user) {
    console.log('DT_InternCompanyFavorCtrl');
    $scope.company_list = {};
    $scope.position_type = {
      'technology': '\u6280\u672f',
      'product': '\u4ea7\u54c1',
      'design': '\u8bbe\u8ba1',
      'operate': '\u8fd0\u8425',
      'marketing': '\u5e02\u573a',
      'functions': '\u804c\u80fd',
      'others': '\u5176\u4ed6'
    };
    $scope.position_index = {
      'technology': 0,
      'product': 1,
      'design': 2,
      'operate': 3,
      'marketing': 4,
      'functions': 5,
      'others': 6
    };
    $scope.scale = {
      0: '\u521d\u521b',
      1: '\u5feb\u901f\u53d1\u5c55',
      2: '\u6210\u719f'
    };
    $scope.field_type = {
      'social': '\u793e\u4ea4',
      'e-commerce': '\u7535\u5b50\u5546\u52a1',
      'education': '\u6559\u80b2',
      'health_medical': '\u5065\u5eb7\u533b\u7597',
      'culture_creativity': '\u6587\u5316\u521b\u610f',
      'living_consumption': '\u751f\u6d3b\u6d88\u8d39',
      'hardware': '\u786c\u4ef6',
      '020': 'O2O',
      'others': '\u5176\u4ed6'
    };
    $scope.get_company_list = function () {
      $http.get(urls.api + '/account/userinfo/company/favor/list').success(function (data) {
        if (data.error.code == 1) {
          $scope.company_list = data.data;
          $scope.company_num = $scope.company_list.length;
          for (var i = 0; i < $scope.company_list.length; i++) {
            $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
            $scope.company_list[i].scale_value = $scope.scale[$scope.company_list[i].scale];
            $scope.company_list[i].field_type = $scope.field_type[$scope.company_list[i].field];
            $scope.company_list[i].position_type_value = {};
            for (var j = 0; j < $scope.company_list[i].position_type.length; j++) {
              $scope.company_list[i].position_type_value[j] = $scope.position_type[$scope.company_list[i].position_type[j]];
            }
          }
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.get_company_list();
  }
]).controller('DT_InternPositionFavorCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user) {
    console.log('DT_InternPositionFavorCtrl');
    $scope.positions = {};
    $scope.position_type = {
      'technology': '\u6280\u672f',
      'product': '\u4ea7\u54c1',
      'design': '\u8bbe\u8ba1',
      'operate': '\u8fd0\u8425',
      'marketing': '\u5e02\u573a',
      'functions': '\u804c\u80fd',
      'others': '\u5176\u4ed6'
    };
    $scope.field_type = {
      'social': '\u793e\u4ea4',
      'e-commerce': '\u7535\u5b50\u5546\u52a1',
      'education': '\u6559\u80b2',
      'health_medical': '\u5065\u5eb7\u533b\u7597',
      'culture_creativity': '\u6587\u5316\u521b\u610f',
      'living_consumption': '\u751f\u6d3b\u6d88\u8d39',
      'hardware': '\u786c\u4ef6',
      '020': 'O2O',
      'others': '\u5176\u4ed6'
    };
    $scope.get_userInfo = function () {
      $scope.userinfo = {};
      $http.get(urls.api + '/account/userinfo/get').success(function (data) {
        if (data.error.code == 1) {
          $scope.userinfo = data.data;
          $scope.submitResume = {};
          $scope.submitResume.position_id = $scope.position_id;
          console.log($scope.userinfo.resume_id);
          if ($scope.userinfo.resume_id != undefined && $scope.userinfo.resume_id != null) {
            $scope.submitResume.resume_choice = 1;
            $scope.resume_submitted = true;  //                            console.log("here");
          } else {
            $scope.resume_submitted = false;
          }
        } else {
          console.log(data.error).message;
        }
      });
    };
    $scope.get_positions = function () {
      $scope.loading = true;
      $http.get(urls.api + '/account/userinfo/position/favor/list').success(function (data) {
        if (data.error.code == 1) {
          $scope.positions = data.data;
          for (var i = 0; i < $scope.positions.length; i++) {
            $scope.positions[i].position_type_value = $scope.position_type[$scope.positions[i].position_type];
            if ($scope.positions[i].company.scale == 0) {
              $scope.positions[i].company.scale_value = '\u521d\u521b';
            } else if ($scope.positions[i].company.scale == 1) {
              $scope.positions[i].company.scale_value = '\u5feb\u901f\u53d1\u5c55';
            } else {
              $scope.positions[i].company.scale_value = '\u6210\u719f';
            }
            $scope.positions[i].company.field_type = $scope.field_type[$scope.positions[i].company.field];
            $scope.check_submit(i);
          }
        } else {
          console.log(data.error.message);
        }
        $scope.loading = false;
      });
    };
    $scope.check_submit = function (index) {
      $http.get(urls.api + '/position/' + $scope.positions[index]._id.$oid + '/check_submit').success(function (data) {
        if (data.error.code == 1) {
          if (data.exist == true) {
            $scope.positions[index].submit_value = '\u5df2\u6295\u9012';
            $scope.positions[index].resume_submitted = true;
          } else {
            $scope.positions[index].submit_value = '\u6295\u9012\u7b80\u5386';
            $scope.positions[index].resume_submitted = false;
          }
        } else {
          console.log(data.error.message);
        }
      });
    };
    $scope.get_userInfo();
    $scope.get_positions();
    $scope.submit = function (index) {
      console.log($scope.positions[index]);
      if ($scope.resume_submitted == true) {
        $scope.submitResume.resume_choice = 1;
      } else {
        $scope.submitResume.resume_choice = 3;
      }
      console.log('here');
      $csrf.set_csrf($scope.submitResume);
      $http.post(urls.api + '/position/' + $scope.positions[index]._id.$oid + '/submit', $.param($scope.submitResume)).success(function (data) {
        if (data.error.code == 1) {
          $scope.positions[index].submit_value = '\u5df2\u6295\u9012';
        } else {
          console.log(data.error.message);
        }
      });
    };
    $scope.complete_resume = function () {
      setTimeout(function () {
        window.location.href = '/intern/resume';
      }, 2000);
      $('#myModal').modal('hide');
    };
    $scope.submit_all = function () {
      for (var i = 0; i < $scope.positions.length; i++) {
        $scope.submit(i);
      }
    };
    $scope.param = function (index) {
      $scope.index = index;
    };
  }
]).controller('DT_InternResumeViewCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  'Upload',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg, Upload) {
    $scope.filename = '\u65e0\u7b80\u5386\u9644\u4ef6';
    $scope.intern_info = {};
    $scope.edit_resume = function () {
      window.location.href = '/intern/resume/edit';
    };
    $scope.get_intern_info = function () {
      $http.get(urls.api + '/account/userinfo/get').success(function (data) {
        if (data.error.code == 1) {
          $scope.intern_info = data.data;
          $scope.have_resume_info = false;
          if ($scope.intern_info.real_name != undefined) {
            $scope.have_resume_info = true;
          }
          if ($scope.intern_info.resume_name != undefined && $scope.intern_info.resume_id != undefined) {
            $scope.filename = $scope.intern_info.resume_name;
          }
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.get_intern_info();
  }
]).controller('DT_InternResumeEditCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  'Upload',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg, Upload) {
    console.log('DT_InternResumeCtrl');
    $scope.filename = '\u65e0\u7b80\u5386\u9644\u4ef6';
    $scope.progressPercentage = 0;
    $scope.intern_info = {};
    $scope.get_intern_info = function () {
      $http.get(urls.api + '/account/userinfo/get').success(function (data) {
        if (data.error.code == 1) {
          $scope.intern_info = data.data;
          if ($scope.intern_info.resume_name != undefined && $scope.intern_info.resume_id != undefined) {
            $scope.filename = $scope.intern_info.resume_name;
          }
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.get_intern_info();
    $scope.save_intern_info = function () {
      $csrf.set_csrf($scope.intern_info);
      $http.post(urls.api + '/account/userinfo/set', $.param($scope.intern_info)).success(function (data) {
        if (data.error.code == 1) {
          $scope.error = $errMsg.format_error('\u4fee\u6539\u6210\u529f', data.error);
          window.location.href = '/intern/resume/view';
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.upload = function (file, file_t) {
      alert('\u5fc5\u987b\u4e3adoc\u6216PDF\u683c\u5f0f');
      var param = {
          'file_type': file_t,
          'description': $user.username(),
          'category': $user.username() + '_' + file_t
        };
      var headers = {
          'X-CSRFToken': $csrf.val(),
          'Content-Type': file.type
        };
      Upload.upload({
        url: urls.api + '/file/upload',
        data: param,
        headers: headers,
        file: file
      }).progress(function (evt) {
        $scope.show_bar = true;
        $scope.progressPercentage = parseInt(100 * evt.loaded / evt.total) + '%';
        $('.progress-bar').css('width', $scope.progressPercentage);
        $scope.progress = 'progress: ' + $scope.progressPercentage + '% ' + evt.config.file.name;
      }).success(function (data, status, headers, config) {
        if (data.error.code == 1) {
          $scope.intern_info.resume_name = config.file.name;
          console.log('file ' + config.file.name + 'uploaded. Response: ' + data.data);
          $scope.intern_info.resume_id = data.data;
          $scope.filename = config.file.name;
        } else {
          console.log(data.error.message);
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
  }
]).controller('DT_RegEnterCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg) {
    console.log('DT_RegEnterCtrl');
  }
]).controller('DT_CompanyResumeCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  '$rootScope',
  'ErrorService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $rootScope, $errMsg) {
    console.log('DT_CompanyResumeCtrl');
    $scope.company_id = $routeParams.company_id;
    //$scope.active_index = null;
    $scope.submit_list = [];
    $scope.chosed_index = -1;
    $scope.filter_chosen = {
      'page': 1,
      'processed': 2,
      'interested': 2,
      'position_type': ''
    };
    $scope.position_type = {
      '': '\u5168\u90e8',
      'technology': '\u6280\u672f',
      'product': '\u4ea7\u54c1',
      'design': '\u8bbe\u8ba1',
      'operate': '\u8fd0\u8425',
      'marketing': '\u5e02\u573a',
      'functions': '\u804c\u80fd',
      'others': '\u5176\u4ed6'
    };
    $scope.task = {
      'pageCount': 1,
      'currentPage': 1
    };
    $scope.grade_name = {
      1: '\u672c\u79d1\u4e00\u5e74\u7ea7',
      2: '\u672c\u79d1\u4e8c\u5e74\u7ea7',
      3: '\u672c\u79d1\u4e09\u5e74\u7ea7',
      4: '\u672c\u79d1\u56db\u5e74\u7ea7',
      5: '\u672c\u79d1\u4e94\u5e74\u7ea7',
      11: '\u7855\u58eb\u4e00\u5e74\u7ea7',
      12: '\u7855\u58eb\u4e8c\u5e74\u7ea7',
      13: '\u7855\u58eb\u4e09\u5e74\u7ea7',
      21: '\u535a\u58eb\u4e00\u5e74\u7ea7',
      22: '\u535a\u58eb\u4e8c\u5e74\u7ea7',
      23: '\u535a\u58eb\u4e09\u5e74\u7ea7',
      24: '\u535a\u58eb\u56db\u5e74\u7ea7',
      25: '\u535a\u58eb\u4e94\u5e74\u7ea7'
    };
    $scope.show_right_bar = false;
    $scope.toggleRightBar = function () {
      $scope.show_right_bar = !$scope.show_right_bar;
    };
    /*
        * @function: get_grade_name
        * @detail: get the grade name of the person in submit_list
        * @time: 2015-10
        */
    $scope.get_grade_name = function () {
      for (var i = 0; i < $scope.submit_list.length; i++) {
        var temp = $scope.submit_list[i];
        if (temp.grade != undefined)
          temp.grade = $scope.grade_name[temp.grade];
        else
          temp.grade = '\u672a\u77e5\u5e74\u7ea7';
      }
    };
    $scope.get_submit_list = function () {
      $scope.loading = true;
      var param = [];
      var param_data = $scope.filter_chosen;
      if (param_data != null) {
        //param = '?';
        //if(param_data.hasOwnProperty('page')){
        //    param += "page=" + param_data.page;
        //}
        //if(param_data.hasOwnProperty('position_type')){
        //    if(param!='?'){
        //        param += '&'
        //    }
        //    param += "position_type=" + param_data.position_type;
        //}
        for (var key in param_data) {
          if (!(key == 'position_type' && param_data[key] == '') && !(key == 'processed' && param_data[key] == 2) && !(key == 'interested' && param_data[key] == 2)) {
            if (key == 'processed' || key == 'interested') {
              param.push(key + '=' + (param_data[key] == 1));
            } else
              param.push(key + '=' + param_data[key]);
          }
        }
        param = param.join('&');
        param = '?' + param;
      }
      $http.get(urls.api + '/account/company/submit/search' + param).success(function (data) {
        if (data.error.code == 1) {
          $scope.submit_list = data.data;
          $scope.get_grade_name();
          $scope.task.pageCount = data.page_number;
          if ($scope.submit_list.length == 0) {
            //if(param_data.hasOwnProperty('position_type')){
            //     $scope.marked_words = "尚无筛选结果";
            // }
            // else{
            //    $scope.marked_words = "尚未有人投递简历";
            //}
            $scope.marked_words = '\u5c1a\u65e0\u7b5b\u9009\u7ed3\u679c';
          }
        } else {
          console.log(data.error.message);
          // TODO: here is an error
          $scope.error = $errMsg.format_error('', data.error);
        }
        $scope.loading = false;
      });
    };
    $scope.get_submit_list();
    $scope.get_company_info = function () {
      $http.get(urls.api + '/account/company/' + $scope.company_id + '/detail').success(function (data) {
        if (data.error.code == 1) {
          $scope.companyinfo = data.data;
        }
      });
    };
    $scope.get_company_info();
    /*
        * @function: filter_select
        * @detail: filter resumes by intereset, process and type
        * @time: 2015-10
        */
    $scope.view_result = function () {
      $scope.get_submit_list();
    };
    $scope.choose_type = function (position_type) {
      $scope.filter_chosen.position_type = position_type;
      $scope.get_submit_list();
    };
    $scope.choose_process = function (process_type) {
      $scope.filter_chosen.processed = process_type;
      $scope.get_submit_list();
    };
    $scope.choose_interest = function (interest_type) {
      $scope.filter_chosen.interested = interest_type;
      $scope.get_submit_list();
    };
    /*
        * @function: interested_select
        * @detail: interest mark in the resume detail
        * @time: 2015-10
        */
    $scope.interested_change = false;
    $scope.interested_filed = '';
    $scope.interested_select = function (interested) {
      if ($scope.interested_filed == interested) {
        $scope.interested_change = false;
      } else {
        $scope.interested_change = true;
        $scope.interested_filed = interested;
      }
      var param = {
          'position_id': $scope.submit_list[$scope.chosed_index].position_id,
          'username': $scope.submit_list[$scope.chosed_index].username,
          'interested': $scope.interested_filed == 'interested' ? 1 : 0
        };
      $csrf.set_csrf(param);
      if ($scope.interested_change == true) {
        $http.post(urls.api + '/account/hr_set_interested_user', $.param(param)).success(function (data) {
          if (data.error.code == 1) {
            //$scope.$apply(function($scope){
            $scope.submit_list[$scope.chosed_index].interested = $scope.interested_filed == 'interested' ? true : false;  //});
                                                                                                                          //alert($scope.submit_list[index].position_id,$scope.submit_list[index].username);
                                                                                                                          //console.log("OK");
          }
        });
      }
    };
    $scope.process = function (index) {
      if (index == -1) {
        return;
      }
      if ($scope.submit_list[index].process == true) {
        return;
      }
      var param = {
          'username': $scope.submit_list[index].username,
          'position_id': $scope.submit_list[index].position_id
        };
      $csrf.set_csrf(param);
      $http.post(urls.api + '/account/company/process_single', $.param(param)).success(function (data) {
        if (data.error.code == 1) {
        }
      });
    };
    $scope.view_detail = function (index) {
      if (index != -1) {
        $scope.intern_info = $scope.submit_list[index];
        $scope.process(index);
        if ($scope.intern_info.interested == true)
          $scope.interested_filed = 'interested';
        else
          $scope.interested_filed = 'uninterested';
        if ($scope.chosed_index == -1) {
          $scope.chosed_index = index;
          $scope.toggle_show();
        } else {
          if ($scope.chosed_index == index) {
            $scope.chosed_index = -1;
            $scope.toggle_show();
          } else {
            if ($('#sideToggle').attr('checked') == 'checked') {
              $scope.chosed_index = index;
              $scope.toggle_show();
              setTimeout($scope.toggle_show, 500);
              $scope.show_right_bar = true;
            } else {
              $scope.toggle_show();
              $scope.chosed_index = index;
            }
          }
        }
      }
    };
    $scope.show = function () {
    };
    $scope.toggle_show = function () {
      if ($('#sideToggle').attr('checked') == 'checked') {
        $('#sideToggle').attr('checked', false);
        $scope.show_right_bar = false;
        $('aside').css({ width: '0px' });
      } else {
        $('#sideToggle').attr('checked', true);
        $('aside').css({ width: '600px' });
        $scope.show_right_bar = true;
      }
    };
    //$scope.close = false;
    $(document).on('click', function (e) {
      //console.log($(e.target).attr('id')!="header" && $(e.target).attr('id')!="submit_div");
      //console.log($("#header"));
      //console.log($(e.target).attr('id'));
      //TODO: fix the unanswered area
      if ($(e.target).attr('className') != 'view' && !$(e.target).hasClass('resume') && !$(e.target).hasClass('view') && !$(e.target).hasClass('first-line') && !$(e.target).hasClass('name') && !$(e.target).hasClass('gender') && !$(e.target).hasClass('second-line') && !$(e.target).hasClass('university') && !$(e.target).hasClass('department') && !$(e.target).hasClass('grade') && !$(e.target).hasClass('work_days') && !$(e.target).hasClass('cellphone') && !$(e.target).hasClass('line') && !$(e.target).hasClass('description') && !$(e.target).hasClass('basic-info') && !$(e.target).hasClass('real_name') && !$(e.target).hasClass('plain_text') && !$(e.target).hasClass('position_name') && !$(e.target).is('li') && !$(e.target).is('p') && !$(e.target).hasClass('resume') && !$(e.target).hasClass('resume_file') && !$(e.target).is('img') && $(e.target).attr('id') != 'header' && $(e.target).attr('id') != 'show_intern_info' && $(e.target).attr('id') != 'submit_div' && $(e.target).attr('id') != 'left_submit' && $(e.target).attr('id') != 'right_submit' && !$(e.target).is('table') && !$(e.target).is('tbody') && !$(e.target).is('tr') && !$(e.target).is('td') && !$(e.target).hasClass('resume_file_downoad') && !$(e.target).hasClass('resume_name') && $(e.target).attr('id') != 'item_interested' && $(e.target).attr('id') != 'processed' && !$(e.target).hasClass('interested')) {
        $scope.view_detail($scope.chosed_index);
      } else if ($(e.target).attr('id') == 'processed' && $('#sideToggle').attr('checked') != 'checked') {
        $scope.view_unprocessed();
      } else if ($(e.target).attr('id') == 'interested' && $('#sideToggle').attr('checked') != 'checked') {
        $scope.view_interested();
      }
    });
  }
]).controller('DT_PositionDetailCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user) {
    console.log('DT_PositionDetailCtrl');
    $scope.role = $user.role();
    $scope.username = $user.username();
    $scope.position_id = $routeParams.position_id;
    $scope.img2_src = '/static/image/icon/weixin-01.png';
    $scope.position_type = {
      'technology': '\u6280\u672f',
      'product': '\u4ea7\u54c1',
      'design': '\u8bbe\u8ba1',
      'operate': '\u8fd0\u8425',
      'marketing': '\u5e02\u573a',
      'functions': '\u804c\u80fd',
      'others': '\u5176\u4ed6'
    };
    $scope.scale = {
      0: '\u521d\u521b',
      1: '\u5feb\u901f\u53d1\u5c55',
      2: '\u6210\u719f'
    };
    $scope.field_type = {
      'social': '\u793e\u4ea4',
      'e-commerce': '\u7535\u5b50\u5546\u52a1',
      'education': '\u6559\u80b2',
      'health_medical': '\u5065\u5eb7\u533b\u7597',
      'culture_creativity': '\u6587\u5316\u521b\u610f',
      'living_consumption': '\u751f\u6d3b\u6d88\u8d39',
      'hardware': '\u786c\u4ef6',
      '020': 'O2O',
      'others': '\u5176\u4ed6'
    };
    $scope.stage = {
      'seed': '\u79cd\u5b50\u8f6e',
      'angel': '\u5929\u4f7f\u8f6e',
      'A': 'A\u8f6e',
      'B': 'B\u8f6e',
      'C': 'C\u8f6e',
      'D_plus': 'D\u53ca\u4ee5\u4e0a\u8f6e'
    };
    $scope.amount = {
      'ten': '\u5341\u4e07\u7ea7',
      'hundred': '\u767e\u4e07\u7ea7',
      'thousand': '\u5343\u4e07\u7ea7',
      'thousand_plus': '\u4ebf\u7ea7'
    };
    $scope.check_favor_position = function () {
      $http.get(urls.api + '/account/userinfo/' + $scope.position_id + '/check_favor_position').success(function (data) {
        if (data.error.code == 1) {
          $scope.favor_exist = data.data.exist;
          if ($scope.favor_exist == true) {
            $scope.post_value = '\u5df2\u6536\u85cf';
            $scope.img_src = '/static/image/icon/shoucangdianliang-01.png';
          } else {
            $scope.post_value = '\u6536\u85cf';
            $scope.img_src = '/static/image/icon/shoucang-01.png';
          }
        } else {
          console.log(data.error.message);
        }
      });
    };
    $scope.change_in = function () {
      if (!$scope.favor_exist)
        $scope.img_src = '/static/image/icon/shoucang2-01.png';
    };
    $scope.change_out = function () {
      if (!$scope.favor_exist)
        $scope.img_src = '/static/image/icon/shoucang-01.png';
    };
    $scope.change2_in = function () {
      $scope.img2_src = '/static/image/icon/weixin2-01.png';
    };
    $scope.change2_out = function () {
      $scope.img2_src = '/static/image/icon/weixin-01.png';
    };
    $scope.skip = function () {
      window.location.href = '/company/' + $scope.company_id + '/detail';
    };
    $scope.get_position_detail = function () {
      $http.get(urls.api + '/position/' + $scope.position_id + '/get_with_company').success(function (data) {
        if (data.error.code == 1) {
          $scope.position = data.data;
          $scope.position.position_type_value = $scope.position_type[$scope.position.position_type];
          $scope.position.company.field_type = $scope.field_type[$scope.position.company.field];
          $scope.position.company.scale_value = $scope.scale[$scope.position.company.scale];
          $scope.position.company.position_number = $scope.position.company.positions.length;
          if ($scope.position.company.homepage.indexOf('http://') == -1 && $scope.position.company.homepage.indexOf('https://') == -1)
            $scope.position.company.homepage = 'http://' + $scope.position.company.homepage;
          if ($scope.position.status == 'open') {
            $scope.position.status_value = '\u804c\u4f4d\u5728\u62db';
          } else {
            $scope.position.status_value = '\u804c\u4f4d\u5173\u95ed';
          }
          $scope.position.company.position_type_value = {};
          $scope.company_id = $scope.position.company._id.$oid;
          $scope.get_financing_list();
          for (var i = 0; i < $scope.position.company.position_type.length; i++) {
            $scope.position.company.position_type_value[i] = $scope.position_type[$scope.position.company.position_type[i]];
            console.log($scope.position_type[$scope.position.company.position_type[i]]);
          }
        } else {
          console.log(data.error.message);
        }
      });
    };
    $scope.get_financing_list = function () {
      $http.get(urls.api + '/account/financing/' + $scope.company_id + '/list').success(function (data) {
        if (data.error.code == 1) {
          $scope.financing_list = data.data;
          for (var i = 0; i < $scope.financing_list.length; i++) {
            $scope.financing_list[i].stage_value = $scope.stage[$scope.financing_list[i].stage];
            $scope.financing_list[i].amount_value = $scope.amount[$scope.financing_list[i].amount];
          }
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.check_favor_position();
    $scope.get_position_detail();
    $scope.userinfo = {};
    $http.get(urls.api + '/account/userinfo/get').success(function (data) {
      if (data.error.code == 1) {
        $scope.userinfo = data.data;
        $scope.submitResume = {};
        $scope.submitResume.position_id = $scope.position_id;
        console.log($scope.userinfo.resume_id);
        if ($scope.userinfo.resume_id != undefined && $scope.userinfo.resume_id != null) {
          $scope.submitResume.resume_choice = 1;
          $scope.resume_submitted = true;
          console.log('here');
        } else {
          $scope.resume_submitted = false;
        }
      } else {
        console.log(data.error.message);
      }
    });
    $http.get(urls.api + '/position/' + $scope.position_id + '/check_submit').success(function (data) {
      if (data.error.code == 1) {
        if (data.exist == true) {
          $scope.submit_value = '\u5df2\u6295\u9012';
          $scope.post_submitted = true;
        } else {
          $scope.submit_value = '\u6295\u9012\u7b80\u5386';
          $scope.post_submitted = false;
        }
      } else {
        console.log(data.error.message);
      }
    });
    $scope.post = function () {
      if ($scope.favor_exist == false) {
        $scope.submitFavor = {};
        $scope.submitFavor.position_id = $scope.position_id;
        $csrf.set_csrf($scope.submitFavor);
        $http.post(urls.api + '/position/' + $scope.position_id + '/userlikeposition', $.param($scope.submitFavor)).success(function (data) {
          $scope.post_value = '\u5df2\u6536\u85cf';
          $scope.favor_exist = true;
          $scope.img_src = '/static/image/icon/shoucangdianliang-01.png';
        });
      } else {
        $scope.submitUnFavor = {};
        $scope.submitUnFavor.position_id = $scope.position_id;
        $csrf.set_csrf($scope.submitUnFavor);
        $http.post(urls.api + '/position/' + $scope.position_id + '/userunlikeposition', $.param($scope.submitUnFavor)).success(function (data) {
          $scope.post_value = '\u6536\u85cf';
          $scope.favor_exist = false;
          $scope.img_src = '/static/image/icon/shoucang-01.png';
        });
      }
    };
    $scope.check_userinfo = function () {
      $http.get(urls.api + '/account/userinfo/check').success(function (data) {
        if (data.complete == 'True')
          $scope.userinfo_complete = true;
        else
          $scope.userinfo_complete = false;
      });
    };
    $scope.submit = function () {
      if ($scope.resume_submitted == true) {
        $scope.submitResume.resume_choice = 1;
      } else {
        $scope.submitResume.resume_choice = 3;
      }
      console.log('here');
      $csrf.set_csrf($scope.submitResume);
      $http.post(urls.api + '/position/' + $scope.position_id + '/submit', $.param($scope.submitResume)).success(function (data) {
        if (data.error.code == 1) {
          $scope.submit_value = '\u5df2\u6295\u9012';
          $scope.post_submitted = true;
        } else {
          console.log(data.error.message);
        }
      });
    };
    $scope.complete_resume = function () {
      setTimeout(function () {
        window.location.href = '/intern/resume/edit';
      }, 300);
      $('#myModal').modal('hide');
    };
    if ($user.username() && $user.role() == 0) {
      $scope.check_userinfo();
    }
  }
]).controller('DT_FeedbackCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user) {
    console.log('DT_FeedbackCtrl');
  }
]).controller('DT_AboutCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user) {
    console.log('DT_AboutCtrl');
  }
]).controller('DT_InformationCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$rootScope',
  'UserService',
  'ErrorService',
  function ($scope, $http, $csrf, urls, $rootScope, $user, $errMsg) {
    console.log('DT_InformationCtrl');
    $scope.infos = {};
    $scope.info_user = function () {
      $csrf.set_csrf($scope.infos);
      $http.post(urls.api + '/account/userinfo/set', $.param($scope.infos)).success(function (data) {
        if (data.error.code == 1) {
          $scope.error = $errMsg.format_error('\u4e2a\u4eba\u4fe1\u606f\u8bbe\u7f6e\u6210\u529f', data.error);
          setTimeout(function () {
            window.location.href = '/';
          }, 500);
        } else {
          console.log(data.error.message);
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.is_tsinghua == $rootScope.is_tsinghua;
    $scope.username = $user.username();
    if ($scope.is_tsinghua == true)
      $scope.infos.university = '\u6e05\u534e\u5927\u5b66';
  }
]).controller('DT_CompanyPositionManageCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user) {
    console.log('DT_CompanyPositionManageCtrl');
    $scope.position_type = {
      'technology': '\u6280\u672f',
      'product': '\u4ea7\u54c1',
      'design': '\u8bbe\u8ba1',
      'operate': '\u8fd0\u8425',
      'marketing': '\u5e02\u573a',
      'functions': '\u804c\u80fd',
      'others': '\u5176\u4ed6'
    };
    $scope.company_id = $routeParams.company_id;
    $scope.position_list = {};
    $scope.close_position = function (index) {
      $http.get(urls.api + '/position/' + $scope.position_list[index]['_id']['$oid'] + '/close').success(function (data) {
        if (data.error.code == 1) {
          console.log('\u5173\u95ed\u804c\u4f4d\u6210\u529f');
          $scope.get_position_list();
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.delete_position = function (index) {
      $http.get(urls.api + '/position/' + $scope.position_list[index]['_id']['$oid'] + '/delete').success(function (data) {
        if (data.error.code == 1) {
          console.log('\u5220\u9664\u804c\u4f4d\u6210\u529f');
          $scope.get_position_list();
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.get_position_list = function () {
      $http.get(urls.api + '/position/company/' + $scope.company_id + '/list').success(function (data) {
        if (data.error.code == 1) {
          $scope.position_list = data.data;
          for (var i = 0; i < $scope.position_list.length; i++) {
            $scope.position_list[i].position_type_value = $scope.position_type[$scope.position_list[i].position_type];
          }
        } else {
          alert(data.error.message);
        }
      });
    };
    $scope.get_position_list();
  }
]).controller('DT_CompanyPositionEditCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg) {
    console.log('DT_CompanyPositionEditCtrl');
    $scope.company_id = $routeParams.company_id;
    $scope.position_id = $routeParams.position_id;
    $scope.get_company_info = function () {
      $http.get(urls.api + '/account/company/' + $scope.company_id + '/detail').success(function (data) {
        if (data.error.code == 1) {
          $scope.companyinfo = data.data;
          if ($scope.companyinfo.info_complete == false) {
            $scope.error = $errMsg.format_error('\u516c\u53f8\u4fe1\u606f\u4e0d\u5b8c\u6574\uff0c\u4e0d\u80fd\u53d1\u5e03\u804c\u4f4d', { code: '-1' });
            setTimeout(function () {
              window.location.href = '/company/' + $scope.company_id + '/create/first';
            }, 2000);
          }
        }
      });
    };
    $scope.get_company_info();
    $scope.submit_position = function () {
      if ($scope.position_id == 'new') {
        $scope.create_position();
      } else {
        $scope.set_position();
      }
    };
    $scope.create_position = function () {
      $scope.disable_submit = true;
      $csrf.set_csrf($scope.position);
      if ($scope.position.end_time != '') {
        $scope.position.end_time = $filter('date')($scope.position.end_time, 'yyyy-MM-dd');
      }
      if ($scope.position.part_or_full_time == 1) {
        $scope.position.days_per_week = 5;
      }
      $scope.submit_loading = true;
      $http.post(urls.api + '/position/create', $.param($scope.position)).success(function (data) {
        if (data.error.code == 1) {
          $scope.error = $errMsg.format_error('\u53d1\u5e03\u804c\u4f4d\u6210\u529f', data.error);
          //setTimeout(function(){window.location.href='/company/' + $scope.company_id + '/position/manage'},1500);
          setTimeout(function () {
            window.location.href = '/position/list';
          }, 1500);
        } else {
          $scope.error = $errMsg.format_error('', data.error);
          setTimeout(function () {
            $errMsg.remove_error($scope.error);
          }, 2000);
        }
        $scope.disable_submit = false;
        $scope.submit_loading = false;
      });
    };
    $scope.set_position = function () {
      $scope.disable_submit = true;
      $csrf.set_csrf($scope.position);
      if ($scope.position.end_time != '') {
        $scope.position.end_time = $filter('date')($scope.position.end_time, 'yyyy-MM-dd');
      }
      if ($scope.position.part_or_full_time == 1) {
        $scope.position.days_per_week = 5;
      }
      $scope.submit_loading = true;
      $http.post(urls.api + '/position/' + $scope.position_id + '/set', $.param($scope.position)).success(function (data) {
        if (data.error.code == 1) {
          $scope.error = $errMsg.format_error('\u4fee\u6539\u804c\u4f4d\u6210\u529f', data.error);
          setTimeout(function () {
            window.location.href = '/company/' + $scope.company_id + '/position/manage';
          }, 1500);
        } else {
          $scope.error = $errMsg.format_error('', data.error);
          setTimeout(function () {
            $errMsg.remove_error($scope.error);
          }, 2000);
        }
        $scope.disable_submit = false;
        $scope.submit_loading = false;
      });
    };
    $scope.get_position_detail = function () {
      $http.get(urls.api + '/position/' + $scope.position_id + '/get').success(function (data) {
        if (data.error.code == 1) {
          $scope.position = data.data;
          $scope.position.end_time = $filter('date')($scope.position.end_time.$date, 'yyyy-MM-dd');
        } else {
          $scope.error = $errMsg.format_error('', data.error);
          setTimeout(function () {
            $errMsg.remove_error($scope.error);
          }, 2000);
        }
      });
    };
    if ($scope.position_id == 'new') {
      $scope.position = {};
      $scope.submit = $scope.create_position;
      $scope.title = '\u53d1\u5e03\u65b0\u804c\u4f4d';
    } else {
      $scope.get_position_detail();
      $scope.submit = $scope.set_position;
      $scope.title = '\u7f16\u8f91\u804c\u4f4d';
    }
  }
]).controller('DT_CompanyListCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  '$rootScope',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg, $rootScope) {
    console.log('DT_CompanyListCtrl');
    $scope.company_list = {};
    $scope.position_type = {
      'technology': '\u6280\u672f',
      'product': '\u4ea7\u54c1',
      'design': '\u8bbe\u8ba1',
      'operate': '\u8fd0\u8425',
      'marketing': '\u5e02\u573a',
      'functions': '\u804c\u80fd',
      'others': '\u5176\u4ed6'
    };
    $scope.scale = [
      '\u521d\u521b',
      '\u5feb\u901f\u53d1\u5c55',
      '\u6210\u719f'
    ];
    $scope.field_type = {
      'social': '\u793e\u4ea4',
      'e-commerce': '\u7535\u5b50\u5546\u52a1',
      'education': '\u6559\u80b2',
      'health_medical': '\u5065\u5eb7\u533b\u7597',
      'culture_creativity': '\u6587\u5316\u521b\u610f',
      'living_consumption': '\u751f\u6d3b\u6d88\u8d39',
      'hardware': '\u786c\u4ef6',
      'O2O': 'O2O',
      'others': '\u5176\u4ed6'
    };
    $scope.param = {
      field: null,
      pageCount: 1,
      currentPage: 1
    };
    $scope.scale_change = false;
    $scope.field_change = false;
    $scope.auth_organization_change = false;
    $scope.filed_choose = '\u884c\u4e1a\u9886\u57df';
    $scope.scale_choose = '\u89c4\u6a21|\u878d\u8d44\u8bba\u8ff0';
    $scope.auth_choose = '\u6295\u8d44\u673a\u6784\u8ba4\u8bc1';
    $scope.choose = function (field) {
      if ($scope.param.field == field) {
        $scope.field_change = false;
      } else {
        $scope.field_change = true;
        $scope.param.field = field;
        if (field != null)
          $scope.filed_choose = $scope.field_type[field];
        else
          $scope.filed_choose = '\u884c\u4e1a\u9886\u57df';
      }
      $scope.get_company_list($scope.param);
    };
    $scope.choose_scale = function (scale) {
      if ($scope.param.scale == scale) {
        $scope.scale_change = false;
      } else {
        $scope.param.scale = scale;
        $scope.scale_change = true;
        if (scale != null)
          $scope.scale_choose = $scope.scale[scale];
        else
          $scope.scale_choose = '\u89c4\u6a21|\u878d\u8d44\u8bba\u8ff0';
      }
      $scope.get_company_list($scope.param);
    };
    $scope.choose_auth_organization = function (auth_organization) {
      if ($scope.param.auth_organization == auth_organization) {
        $scope.auth_organization_change = false;
      } else {
        $scope.param.auth_organization = auth_organization;
        $scope.auth_organization_change = true;
        if (auth_organization != null)
          $scope.auth_choose = auth_organization;
        else
          $scope.auth_choose = '\u6295\u8d44\u673a\u6784\u8ba4\u8bc1';
      }
      $scope.get_company_list($scope.param);
    };
    $scope.get_company_list = function (data) {
      $scope.loading = true;
      var param = '';
      if (data != null) {
        param = '?';
        if (data.hasOwnProperty('page')) {
          if ($scope.scale_change || $scope.field_change || $scope.auth_organization_change) {
            $scope.scale_change = false;
            $scope.field_change = false;
            $scope.auth_organization_change = false;
            param += 'page=' + 1;
            $scope.param.currentPage = 1;
          } else if (data.page == 0)
            param += 'page=1';
          else
            param += 'page=' + data.page;
        } else {
          param += 'page=' + 1;
        }
        if (data.field != undefined && data.field != null) {
          param += '&fields=' + data.field;
        }
        if (data.scale != undefined && data.scale != null) {
          param += '&scale=' + data.scale;
        }
        if (data.hasOwnProperty('auth_organization') && data.auth_organization != null) {
          param += '&auth_organization=' + data.auth_organization;
        }
      }
      $http.get(urls.api + '/account/company/list' + param).success(function (data) {
        $scope.param.pageCount = data.page_number;
        if (data.error.code == 1) {
          $scope.company_list = data.data;
          for (var i = 0; i < $scope.company_list.length; i++) {
            $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
            $scope.company_list[i].scale_value = $scope.scale[$scope.company_list[i].scale];
            $scope.company_list[i].field_type = $scope.field_type[$scope.company_list[i].field];
            $scope.company_list[i].position_type_value = {};
            for (var j = 0; j < $scope.company_list[i].position_type.length; j++) {
              $scope.company_list[i].position_type_value[j] = $scope.position_type[$scope.company_list[i].position_type[j]];
            }
          }
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
        $scope.loading = false;
      });
    };
    //记录页面情况
    document.body.onscroll = function record_position() {
      $rootScope.company_list_position = document.body.scrollTop;  //alert('scroll1');
    };
    //换页
    $scope.selectPage = function (page) {
      $scope.param.page = page;
      $rootScope.company_list_param_cachce = $scope.param;
      $scope.get_company_list($scope.param);
      document.body.scrollTop = 0;
    };
    if ($rootScope.company_list_param_cachce != undefined) {
      $scope.param = $rootScope.company_list_param_cachce;
      $scope.selectPage($rootScope.company_list_param_cachce.page);
      document.body.scrollTop = $rootScope.company_list_position;
    } else
      $scope.selectPage(1);
    //控制左边筛选框的位置
    $scope.field = false;
    $scope.scale_show = false;
    $scope.auth = false;
    $scope.show_field = function () {
      $scope.field = true;
      setTimeout(function () {
        if ($scope.field)
          setTimeout(function () {
            if ($scope.field)
              $('.field-list').slideDown('fast');
          }, 170);
      }, 170);
    };
    $scope.hide_field = function () {
      $('.field-list').slideUp('fast');
      $scope.field = false;
    };
    $('.company-field').mouseenter($scope.show_field);
    $('.company-field').mouseleave($scope.hide_field);
    $scope.show_scale = function () {
      setTimeout(function () {
        if ($scope.scale_show)
          setTimeout(function () {
            if ($scope.scale_show)
              $('.scale-list').slideDown('fast');
          }, 170);
      }, 170);
      $scope.scale_show = true;
    };
    $scope.hide_scale = function () {
      $('.scale-list').slideUp('fast');
      $scope.scale_show = false;
    };
    $('.company-scale').mouseenter($scope.show_scale);
    $('.company-scale').mouseleave($scope.hide_scale);
    $scope.show_auth = function () {
      setTimeout(function () {
        if ($scope.auth)
          setTimeout(function () {
            if ($scope.auth)
              $('.organization-list').slideDown('fast');
          }, 170);
      }, 170);
      $scope.auth = true;
    };
    $scope.hide_auth = function () {
      $('.organization-list').slideUp('fast');
      $scope.auth = false;
    };
    $('.company-auth').mouseenter($scope.show_auth);
    $('.company-auth').mouseleave($scope.hide_auth);
  }
]).controller('DT_CompanyDetailCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errorMsg) {
    console.log('DT_CompanyDetailCtrl');
    $scope.company_id = $routeParams.company_id;
    $scope.role = $user.role();
    $scope.username = $user.username();
    console.log($scope.role);
    $scope.company = {};
    $scope.member_list = {};
    $scope.tab1 = true;
    $scope.tab2 = false;
    $scope.favored = false;
    $scope.img2_src = '/static/image/icon/weixin-01.png';
    $scope.position_type = {
      'technology': '\u6280\u672f',
      'product': '\u4ea7\u54c1',
      'design': '\u8bbe\u8ba1',
      'operate': '\u8fd0\u8425',
      'marketing': '\u5e02\u573a',
      'functions': '\u804c\u80fd',
      'others': '\u5176\u4ed6'
    };
    $scope.scale = {
      0: '\u521d\u521b',
      1: '\u5feb\u901f\u53d1\u5c55',
      2: '\u6210\u719f'
    };
    $scope.field_type = {
      'social': '\u793e\u4ea4',
      'e-commerce': '\u7535\u5b50\u5546\u52a1',
      'education': '\u6559\u80b2',
      'health_medical': '\u5065\u5eb7\u533b\u7597',
      'culture_creativity': '\u6587\u5316\u521b\u610f',
      'living_consumption': '\u751f\u6d3b\u6d88\u8d39',
      'hardware': '\u786c\u4ef6',
      'O2O': 'O2O',
      'others': '\u5176\u4ed6'
    };
    $scope.stage = {
      'seed': '\u79cd\u5b50\u8f6e',
      'angel': '\u5929\u4f7f\u8f6e',
      'A': 'A\u8f6e',
      'B': 'B\u8f6e',
      'C': 'C\u8f6e',
      'D_plus': 'D\u53ca\u4ee5\u4e0a\u8f6e'
    };
    $scope.amount = {
      'ten': '\u5341\u4e07\u7ea7',
      'hundred': '\u767e\u4e07\u7ea7',
      'thousand': '\u5343\u4e07\u7ea7',
      'thousand_plus': '\u4ebf\u7ea7'
    };
    $scope.tab1_click = function () {
      $scope.tab1 = true;
      $scope.tab2 = false;
    };
    $scope.tab2_click = function () {
      $scope.tab1 = false;
      $scope.tab2 = true;
    };
    $scope.position_detail = function ($index) {
      window.location.href = '/position/' + $scope.company.positions[$index].$oid + '/detail';
    };
    $scope.check_favor_company = function () {
      $http.get(urls.api + '/account/userinfo/' + $scope.company_id + '/check_favor_company').success(function (data) {
        if (data.error.code == 1) {
          if (data.data.exist == true) {
            $scope.favored = true;
            $scope.img_src = '/static/image/icon/shoucangdianliang-01.png';
          } else {
            $scope.favored = false;
            $scope.img_src = '/static/image/icon/shoucang-01.png';
          }
        } else {
          $scope.error = $errorMsg.format_error('', data.error);
        }
      });
    };
    $scope.change_in = function () {
      $scope.img_src = '/static/image/icon/shoucang2-01.png';
    };
    $scope.change_out = function () {
      $scope.img_src = '/static/image/icon/shoucang-01.png';
    };
    $scope.change2_in = function () {
      $scope.img2_src = '/static/image/icon/weixin2-01.png';
    };
    $scope.change2_out = function () {
      $scope.img2_src = '/static/image/icon/weixin-01.png';
    };
    $scope.get_company = function () {
      $http.get(urls.api + '/account/company/' + $scope.company_id + '/detail_with_positions').success(function (data, status, headers, config) {
        console.log(headers('Content-Type'));
        if (data.error.code == 1) {
          $scope.company = data.data;
          if ($scope.company.homepage.indexOf('http://') == -1 && $scope.company.homepage.indexOf('https://') == -1)
            $scope.company.homepage = 'http://' + $scope.company.homepage;
          $scope.company.position_number = $scope.company.positions.length;
          $scope.company.scale_value = $scope.scale[$scope.company.scale];
          $scope.company.field_type = $scope.field_type[$scope.company.field];
          $scope.company.position_type_value = {};
          for (var i = 0; i < $scope.company.position_type.length; i++) {
            $scope.company.position_type_value[i] = $scope.position_type[$scope.company.position_type[i]];
          }
          for (var i = 0; i < $scope.company.position_number; i++) {
            $scope.company.position_list[i].position_type_value = $scope.position_type[$scope.company.position_list[i].position_type];
          }
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.get_member_list = function () {
      $http.get(urls.api + '/account/member/' + $scope.company_id + '/list').success(function (data) {
        if (data.error.code == 1) {
          $scope.member_list = data.data;
          $scope.member_number = data.data.length;
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.get_financing_list = function () {
      $http.get(urls.api + '/account/financing/' + $scope.company_id + '/list').success(function (data) {
        if (data.error.code == 1) {
          $scope.financing_list = data.data;
          for (var i = 0; i < $scope.financing_list.length; i++) {
            $scope.financing_list[i].stage_value = $scope.stage[$scope.financing_list[i].stage];
            $scope.financing_list[i].amount_value = $scope.amount[$scope.financing_list[i].amount];
          }
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.get_financing_list();
    $scope.get_member_list();
    $scope.get_company();
    $scope.check_favor_company();
    $scope.favor = function () {
      $scope.param = { 'csrfmiddlewaretoken': $csrf.val() };
      $http.post(urls.api + '/account/company/' + $scope.company_id + '/like', $.param($scope.param)).success(function (data) {
        if (data.error.code == 1) {
          $scope.favored = true;
          $scope.img_src = '/static/image/icon/shoucangdianliang-01.png';
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.unfavor = function () {
      $scope.param = { 'csrfmiddlewaretoken': $csrf.val() };
      $http.post(urls.api + '/account/company/' + $scope.company_id + '/unlike', $.param($scope.param)).success(function (data) {
        if (data.error.code == 1) {
          $scope.favored = false;
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
  }
]).controller('DT_CompanyNoCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg) {
    console.log('DT_CompanyNoCtrl');
    $scope.company_id = $routeParams.company_id;
  }
]).controller('DT_ResizeImgCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  'Upload',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg, Upload) {
  }
]).controller('DT_CompanyTestCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  'Upload',
  'ImgResizeService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg, Upload, $imgResize) {
    console.log('DT_CompanyTestCtrl');
    $scope.company_id = $routeParams.company_id;
    $scope.add_member_flag = false;
    $scope.member_add = {};
    $scope.member_list = [];
    $scope.show_member_card = function () {
      $scope.add_member_flag = true;
    };
    $scope.get_member_list = function () {
      $http.get(urls.api + '/account/member/' + $scope.company_id + '/list').success(function (data) {
        if (data.error.code == 1) {
          $scope.member_list = data.data;
          $scope.member_number = data.data.length;
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.get_member_list();
    $scope.cancer_add = function () {
      $scope.add_member_flag = false;
      $scope.member_add = {};
      $('#addMember').modal('hide');
      $scope.avatar = null;
    };
    $scope.save_member = function () {
      if (!$scope.member_add.hasOwnProperty('m_avatar_id')) {
        $scope.error = $errMsg.format_error('\u8bf7\u4e0a\u4f20\u6210\u5458\u5934\u50cf', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      }
      $csrf.set_csrf($scope.member_add);
      var request_url;
      if ($scope.edit == false) {
        request_url = urls.api + '/account/member/create';
      } else {
        request_url = urls.api + '/account/member/' + $scope.member_list[$scope.index]._id['$oid'] + '/set';
      }
      $http.post(request_url, $.param($scope.member_add)).success(function (data) {
        if (data.error.code == 1) {
          $scope.get_member_list();
          $scope.member_add = {};
          $scope.avatar = undefined;
          $('#addMember').modal('hide');
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.delete_modal = function (index) {
      $scope.delete_index = index;
      $('#delete_member').modal('show');
    };
    $scope.delete_member = function (index) {
      var param = { 'csrfmiddlewaretoken': $csrf.val() };
      $http.post(urls.api + '/account/member/' + $scope.member_list[index]._id.$oid + '/delete', $.param(param)).success(function (data) {
        if (data.error.code == 1) {
          $http.post(urls.api + '/file/' + $scope.member_list[index].m_avatar_id + '/delete', $.param(param)).success(function (data) {
            if (data.error.code == 1) {
              $scope.get_member_list();
              $('#delete_member').modal('hide');
            } else {
              $scope.error = $errMsg.format_error('', data.error);
            }
          });
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.upload = function (file, file_t, category) {
      var param = {
          'file_type': file_t,
          'description': $scope.company_id + file_t,
          'category': $scope.company_id + '_' + $scope.member_number,
          'avatar_id': $scope.member_add.m_avatar_id
        };
      var headers = {
          'X-CSRFToken': $csrf.val(),
          'Content-Type': file.type
        };
      Upload.upload({
        url: urls.api + '/file/upload',
        data: param,
        headers: headers,
        file: file
      }).progress(function (evt) {
        var progressPercentage = parseInt(100 * evt.loaded / evt.total);
        $scope.progress = 'progress: ' + progressPercentage + '% ' + evt.config.file.name;
        console.log($scope.progress);
      }).success(function (data, status, headers, config) {
        if (data.error.code == 1) {
          $scope.member_add.m_avatar_id = data.data;
        } else {
          console.log(data.error.message);
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.add_member = function () {
      $scope.edit = false;
      $('#addMember').modal('show');
      $scope.member_number = $scope.member_list.length;
    };
    $scope.edit_member = function (index) {
      var mem = {};
      $scope.member_number = index;
      mem.m_avatar_id = $scope.member_list[index].m_avatar_id;
      mem.m_introduction = $scope.member_list[index].m_introduction;
      mem.m_name = $scope.member_list[index].m_name;
      mem.m_position = $scope.member_list[index].m_position;
      $scope.member_add = mem;
      $('#addMember').modal('show');
      $scope.edit = true;
      $scope.index = index;
    };
    $scope.pre_step = function () {
      window.location.href = '/company/' + $scope.company_id + '/create/third';
    };
    $scope.get_company_info = function () {
      $http.get(urls.api + '/account/company/' + $scope.company_id + '/detail').success(function (data) {
        if (data.error.code == 1) {
          $scope.companyinfo = data.data;
        }
      });
    };
    $scope.get_company_info();
    $scope.next_step = function () {
      if (!$scope.companyinfo.hasOwnProperty('team_description')) {
        $scope.error = $errMsg.format_error('\u8bf7\u586b\u5199\u56e2\u961f\u4ecb\u7ecd', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      } else if ($scope.member_number == 0) {
        $scope.error = $errMsg.format_error('\u8bf7\u81f3\u5c11\u4e0a\u4f20\u4e00\u4e2a\u56e2\u961f\u6210\u5458\u7684\u4fe1\u606f', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      }
      $scope.companyinfo.info_complete = true;
      $scope.submit_loading = true;
      $csrf.set_csrf($scope.companyinfo);
      $http.post(urls.api + '/account/company/' + $scope.company_id + '/set', $.param($scope.companyinfo)).success(function (data) {
        if (data.error.code == 1) {
          $scope.error = $errMsg.format_error('\u521b\u5efa\u516c\u53f8\u4fe1\u606f\u6210\u529f', data.error);
          setTimeout(function () {
            $errMsg.remove_error($scope.error);
          }, 2000);
          window.location.href = '/';
        } else {
          $scope.error = $errMsg.format_error('', data.error);
          setTimeout(function () {
            $errMsg.remove_error($scope.error);
          }, 2000);
        }
        $scope.submit_loading = false;
      });
    };
    $scope.type = 'circle';
    $scope.imageDataURI = '';
    $scope.resImageDataURI = '';
    $scope.resImgFormat = 'image/png';
    $scope.resImgQuality = 1;
    $scope.selMinSize = 100;
    $scope.enableCrop = true;
    $scope.resImgSize = 160;
    //$scope.aspectRatio=1.2;
    $scope.cancelUpload = function () {
      //$imgResize.cancel($scope,"/api/file/"+$scope.member_add.m_avatar_id+ "/download");
      //if($scope.cancel_upload == undefined)
      //            $scope.cancel_upload = true;
      //            $scope.cancel_upload = undefined;
      $scope.resize_area = false;  //alert($scope.cancel_upload);
    };
    $scope.startUpload = function (file_t, category) {
      /*
            if(file != null && file != undefined)
            {
                if(!/image\/\w+/.test(file.type)){
                    alert("文件必须为图片！");
                    return false;
                }
                //alert('here');
                $imgResize.startUpload(file,file_t,category,$scope);
                $scope.resize_area = true;
            }*/
      var data = $scope.resImageDataURI.split(',')[1];
      data = window.atob(data);
      var ia = new Uint8Array(data.length);
      for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
      }
      ;
      // canvas.toDataURL 返回的默认格式就是 image/png
      var blob = new Blob([ia], { type: 'image/png' });
      //$scope.upload(blob,file_t,category);
      $('.upload-img').attr('src', $scope.resImageDataURI);
      $('#avatar_show_' + $scope.member_number).attr('src', $scope.resImageDataURI);
      $scope.avatar = '66666';
      $scope.resize_area = false;
    };
    $scope.onChange = function ($dataURI) {
      console.log('onChange fired');
    };
    $scope.onLoadBegin = function () {
      console.log('onLoadBegin fired');
    };
    $scope.onLoadDone = function () {
      console.log('onLoadDone fired');
    };
    $scope.onLoadError = function () {
      console.log('onLoadError fired');
    };
    $scope.test = function () {
      $('#fileInput').click();
      if (document.querySelector('#fileInput').value != '')
        $scope.resize_area = true;
    };
    $scope.check = function () {
      alert($scope.imageDataURI);
    };
    var handleFileSelect = function (evt) {
      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function ($scope) {
          $scope.imageDataURI = evt.target.result;
          $scope.resize_area = true;
        });
      };
      if (file != undefined)
        reader.readAsDataURL(file);
      else
        $scope.$apply(function ($scope) {
          $scope.resize_area = false;
        });
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);  //$scope.$watch('imageDataURI',function(newValue,oldValue, scope){
                                                                                           //console.log('Res image', $scope.resImageDataURI);
                                                                                           //if(newValue != '' && document.querySelector('#fileInput').value != '')
                                                                                           //$scope.resize_area = true;
                                                                                           //});
  }
]).controller('DT_CompanyFirstCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  'Upload',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg, Upload) {
    console.log('DT_CompanyFirstCtrl');
    $scope.company_id = $routeParams.company_id;
    $scope.companyinfo = {};
    $scope.tag_list = [
      '\u6280\u80fd\u57f9\u8bad',
      '\u6241\u5e73\u7ba1\u7406',
      '\u53ef\u8f6c\u6b63',
      '\u5f39\u6027\u5de5\u4f5c',
      '\u5b9a\u671f\u51fa\u6e38',
      '\u5730\u94c1\u5468\u8fb9',
      '\u80a1\u7968\u671f\u6743',
      '\u6c34\u679c\u96f6\u98df',
      '\u6b63\u9910\u8865\u52a9',
      '\u73ed\u8f66\u63a5\u9001'
    ];
    $scope.tags = [
      {
        'chosed': false,
        'value': '\u6280\u80fd\u57f9\u8bad'
      },
      {
        'chosed': false,
        'value': '\u6241\u5e73\u7ba1\u7406'
      },
      {
        'chosed': false,
        'value': '\u5f39\u6027\u5de5\u4f5c'
      },
      {
        'chosed': false,
        'value': '\u5b9a\u671f\u51fa\u6e38'
      },
      {
        'chosed': false,
        'value': '\u5730\u94c1\u5468\u8fb9'
      },
      {
        'chosed': false,
        'value': '\u80a1\u7968\u671f\u6743'
      },
      {
        'chosed': false,
        'value': '\u6b63\u9910\u8865\u52a9'
      },
      {
        'chosed': false,
        'value': '\u73ed\u8f66\u63a5\u9001'
      }
    ];
    $scope.cancelUpload = function () {
      $scope.resize_area = false;
    };
    $scope.imageDataURI = '';
    $scope.resImageDataURI = '';
    $scope.resImgFormat = 'image/png';
    $scope.resImgQuality = 1;
    $scope.selMinSize = 100;
    $scope.enableCrop = true;
    $scope.resImgSize = 160;
    //$scope.aspectRatio=1.2;
    $scope.startUpload = function (file_t, category) {
      var data = $scope.resImageDataURI.split(',')[1];
      data = window.atob(data);
      var ia = new Uint8Array(data.length);
      for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
      }
      ;
      // canvas.toDataURL 返回的默认格式就是 image/png
      var blob = new Blob([ia], { type: 'image/png' });
      $scope.logo = '6666';
      $scope.upload(blob, file_t, category);
      $('.upload-img').attr('src', $scope.resImageDataURI);
      $scope.resize_area = false;
    };
    $scope.test = function () {
      $('#fileInput').click();
      if (document.querySelector('#fileInput').value != '')
        $scope.resize_area = true;
    };
    $scope.check = function () {
      alert($scope.imageDataURI);
    };
    var handleFileSelect = function (evt) {
      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function ($scope) {
          $scope.imageDataURI = evt.target.result;
          $scope.resize_area = true;
        });
      };
      if (file != undefined)
        reader.readAsDataURL(file);
      else
        $scope.$apply(function ($scope) {
          $scope.resize_area = false;
        });
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    //$scope.$watch('imageDataURI',function(newValue,oldValue, scope){
    //console.log('Res image', $scope.resImageDataURI);
    //if(newValue != '' && document.querySelector('#fileInput').value != '')
    //$scope.resize_area = true;
    //});
    $scope.get_company_info = function () {
      $http.get(urls.api + '/account/company/' + $scope.company_id + '/detail').success(function (data) {
        if (data.error.code == 1) {
          $scope.companyinfo = data.data;
          var i = 0;
          var j = 0;
          var welfare_tags = data.data.welfare_tags;
          for (var i = 0; i < welfare_tags.length; i++) {
            for (var j = 0; j < $scope.tags.length; j++) {
              if ($scope.tags[j].value == welfare_tags[i]) {
                $scope.tags[j].chosed = true;
                break;
              }
            }
            if (j == $scope.tags.length) {
              $scope.tags.push({
                'value': welfare_tags[i],
                'chosed': true
              });
            }
          }
        }
      });
    };
    $scope.add_tag = function () {
      $scope.tags.push({
        'chosed': false,
        'value': $scope.tag_added
      });
    };
    $scope.remove_error = function () {
      $scope.$apply(function () {
        $scope.tags_full = false;
      });
    };
    $scope.canAdd = function (ngModelController) {
      if ($scope.tags.length > 13) {
        $scope.tags_full = true;
        setTimeout($scope.remove_error, 1500);
        return true;
      } else {
        return ngModelController.$invalid && ngModelController.$dirty || ngModelController.$pristine;
      }
    };
    $scope.upload = function (file, file_t, category) {
      var param = {
          'file_type': file_t,
          'description': $scope.company_id + file_t,
          'category': $scope.company_id + '_' + file_t
        };
      var headers = {
          'X-CSRFToken': $csrf.val(),
          'Content-Type': file.type
        };
      Upload.upload({
        url: urls.api + '/file/upload',
        data: param,
        headers: headers,
        file: file
      }).progress(function (evt) {
        var progressPercentage = parseInt(100 * evt.loaded / evt.total);
        $scope.progress = 'progress: ' + progressPercentage + '% ' + evt.config.file.name;
      }).success(function (data, status, headers, config) {
        if (data.error.code == 1) {
          $scope.companyinfo.logo_id = data.data;
        } else {
          console.log(data.error.message);
          $scope.error = $errMsg.format_error('', data.error);
        }
      }).error(function (data, status, headers, config) {
        if (status == 413) {
          $scope.error = $errMsg.format_error('\u4e0a\u4f20\u56fe\u7247\u5931\u8d25\uff0c\u6587\u4ef6\u8fc7\u5927', { code: '-1' });
        }
      });
    };
    $scope.next_step = function () {
      if (!$scope.companyinfo.hasOwnProperty('abbreviation')) {
        $scope.error = $errMsg.format_error('\u8bf7\u586b\u5199\u516c\u53f8\u7b80\u79f0', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      } else if (!$scope.companyinfo.hasOwnProperty('brief_introduction')) {
        $scope.error = $errMsg.format_error('\u8bf7\u586b\u5199\u516c\u53f8\u4e00\u53e5\u8bdd\u7b80\u4ecb', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      } else if (!$scope.companyinfo.hasOwnProperty('logo_id')) {
        $scope.error = $errMsg.format_error('\u516c\u53f8logo\u672a\u4e0a\u4f20\u6216\u4e0a\u4f20\u5931\u8d25\uff0c\u8bf7\u4e0a\u4f20\u516c\u53f8logo', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      } else if (!$scope.companyinfo.hasOwnProperty('field')) {
        $scope.error = $errMsg.format_error('\u8bf7\u9009\u62e9\u516c\u53f8\u9886\u57df\u4fe1\u606f', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      } else if (!$scope.companyinfo.hasOwnProperty('scale')) {
        $scope.error = $errMsg.format_error('\u8bf7\u9009\u62e9\u516c\u53f8\u53d1\u5c55\u9636\u6bb5\u4fe1\u606f', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      }
      $scope.companyinfo.welfare_tags = '';
      var tag_number = 0;
      for (var i = 0; i < $scope.tags.length; i++) {
        if ($scope.tags[i].chosed == true) {
          $scope.companyinfo.welfare_tags += $scope.tags[i].value;
          $scope.companyinfo.welfare_tags += ',';
          tag_number++;
        }
      }
      if (tag_number == 0) {
        $scope.error = $errMsg.format_error('\u81f3\u5c11\u9009\u62e9\u4e00\u4e2a\u798f\u5229\u6807\u7b7e', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      } else if (tag_number > 6) {
        $scope.error = $errMsg.format_error('\u798f\u5229\u6807\u7b7e\u6570\u4e0d\u80fd\u8d85\u8fc76\u4e2a', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      }
      $scope.companyinfo.welfare_tags = $scope.companyinfo.welfare_tags.substring(0, $scope.companyinfo.welfare_tags.length - 1);
      $csrf.set_csrf($scope.companyinfo);
      $scope.submit_loading = true;
      $http.post(urls.api + '/account/company/' + $scope.company_id + '/set', $.param($scope.companyinfo)).success(function (data) {
        if (data.error.code == 1) {
          //                        $scope.error = $errMsg.format_error("保存公司信息成功",data.error);
          setTimeout(function () {
            $errMsg.remove_error($scope.error);
          }, 2000);
          window.location.href = '/company/' + $scope.company_id + '/create/second';
        } else {
          $scope.error = $errMsg.format_error('', data.error);
          setTimeout(function () {
            $errMsg.remove_error($scope.error);
          }, 2000);
        }
        $scope.submit_loading = false;
      });
    };
    $scope.get_company_info();
  }
]).controller('DT_CompanySecondCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  'Upload',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg, Upload) {
    console.log('DT_CompanySecondCtrl');
    $scope.company_id = $routeParams.company_id;
    $scope.companyinfo = {};
    $scope.financing_list = [];
    $scope.toggle_checkbox = function () {
      $scope.companyinfo.no_financing = !$scope.companyinfo.no_financing;
    };
    $scope.get_financing_list = function () {
      $http.get(urls.api + '/account/financing/' + $scope.company_id + '/list').success(function (data) {
        if (data.error.code == 1) {
          $scope.financing_list = data.data;
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.get_company_info = function () {
      $http.get(urls.api + '/account/company/' + $scope.company_id + '/detail').success(function (data) {
        if (data.error.code == 1) {
          $scope.companyinfo = data.data;
          $scope.companyinfo.no_financing = false;
          if ($scope.companyinfo.financings.length == 0) {
            $scope.companyinfo.no_financing = true;
            $('#financing_checkbox').attr('checked', true);
          }
        }
      });
    };
    $scope.get_financing_list();
    $scope.get_company_info();
    $scope.upload = function (file, file_t) {
      var param = {
          'file_type': file_t,
          'description': $scope.company_id + file_t,
          'category': $scope.company_id + '_' + file_t
        };
      var headers = {
          'X-CSRFToken': $csrf.val(),
          'Content-Type': file.type
        };
      Upload.upload({
        url: urls.api + '/file/upload',
        data: param,
        headers: headers,
        file: file
      }).progress(function (evt) {
        var progressPercentage = parseInt(100 * evt.loaded / evt.total);
        $scope.progress = 'progress: ' + progressPercentage + '% ' + evt.config.file.name;
      }).success(function (data, status, headers, config) {
        if (data.error.code == 1) {
          $scope.companyinfo.qrcode_id = data.data;
        } else {
          console.log(data.error.message);
          $scope.error = $errMsg.format_error('', data.error);
        }
      }).error(function (data, status, headers, config) {
        if (status == 413) {
          $scope.error = $errMsg.format_error('\u4e0a\u4f20\u56fe\u7247\u5931\u8d25\uff0c\u6587\u4ef6\u8fc7\u5927', { code: '-1' });
        }
      });
    };
    $scope.get_delete_index = function ($index) {
      $scope.delete_index = $index;
      $('#delete_financing').modal('show');
    };
    $scope.delete_financing = function (index) {
      var param = { 'csrfmiddlewaretoken': $csrf.val() };
      $http.post(urls.api + '/account/financing/' + $scope.financing_list[index]._id.$oid + '/delete', $.param(param)).success(function (data) {
        if (data.error.code == 1) {
          $scope.get_financing_list();
          $('#delete_financing').modal('hide');
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.add_financing = function () {
      $csrf.set_csrf($scope.financing_add);
      $http.post(urls.api + '/account/financing/create', $.param($scope.financing_add)).success(function (data) {
        if (data.error.code == 1) {
          $scope.get_financing_list();
          $scope.financing_add = null;
          $('#add_financing').modal('hide');
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.pre_step = function () {
      window.location.href = '/company/' + $scope.company_id + '/create/first';
    };
    $scope.next_step = function () {
      if (!$scope.companyinfo.hasOwnProperty('ICregist_name')) {
        $scope.error = $errMsg.format_error('\u8bf7\u586b\u5199\u516c\u53f8\u5de5\u5546\u6ce8\u518c\u540d', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      } else if (!$scope.companyinfo.hasOwnProperty('homepage')) {
        $scope.error = $errMsg.format_error('\u8bf7\u586b\u5199\u516c\u53f8\u4e3b\u9875\u5730\u5740', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      } else if (!$scope.companyinfo.hasOwnProperty('city')) {
        $scope.error = $errMsg.format_error('\u8bf7\u586b\u5199\u516c\u53f8\u6240\u5728\u5730', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      } else if (!$scope.companyinfo.hasOwnProperty('qrcode_id')) {
        $scope.error = $errMsg.format_error('\u8bf7\u4e0a\u4f20\u516c\u53f8\u5fae\u4fe1\u4e8c\u7ef4\u7801', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      } else if ($scope.companyinfo.no_financing == false && $scope.financing_list.length == 0) {
        $scope.error = $errMsg.format_error('\u8bf7\u586b\u5199\u878d\u8d44\u4fe1\u606f\uff0c\u82e5\u65e0\u8bf7\u52fe\u9009\u65e0\u878d\u8d44', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      }
      $csrf.set_csrf($scope.companyinfo);
      $scope.submit_loading = true;
      $http.post(urls.api + '/account/company/' + $scope.company_id + '/set', $.param($scope.companyinfo)).success(function (data) {
        if (data.error.code == 1) {
          //                        $scope.error = $errMsg.format_error("保存公司信息成功",data.error);
          //                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
          window.location.href = '/company/' + $scope.company_id + '/create/third';
        } else {
          $scope.error = $errMsg.format_error('', data.error);
          setTimeout(function () {
            $errMsg.remove_error($scope.error);
          }, 2000);
        }
        $scope.submit_loading = false;
      });
    };
  }
]).controller('DT_CompanyThirdCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg) {
    console.log('DT_CompanyThirdCtrl');
    $scope.company_id = $routeParams.company_id;
    $scope.get_company_info = function () {
      $http.get(urls.api + '/account/company/' + $scope.company_id + '/detail').success(function (data) {
        if (data.error.code == 1) {
          $scope.companyinfo = data.data;
        }
      });
    };
    $scope.get_company_info();
    $scope.pre_step = function () {
      window.location.href = '/company/' + $scope.company_id + '/create/second';
    };
    $scope.next_step = function () {
      if (!$scope.companyinfo.hasOwnProperty('company_description')) {
        $scope.error = $errMsg.format_error('\u8bf7\u586b\u5199\u516c\u53f8\u4ecb\u7ecd', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      } else if (!$scope.companyinfo.hasOwnProperty('product_description')) {
        $scope.error = $errMsg.format_error('\u8bf7\u586b\u5199\u4ea7\u54c1\u6216\u670d\u52a1\u4ecb\u7ecd', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      }
      $csrf.set_csrf($scope.companyinfo);
      $scope.submit_loading = true;
      $http.post(urls.api + '/account/company/' + $scope.company_id + '/set', $.param($scope.companyinfo)).success(function (data) {
        if (data.error.code == 1) {
          //                        $scope.error = $errMsg.format_error("保存公司信息成功",data.error);
          //                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
          window.location.href = '/company/' + $scope.company_id + '/create/forth';
        } else {
          $scope.error = $errMsg.format_error('', data.error);
          setTimeout(function () {
            $errMsg.remove_error($scope.error);
          }, 2000);
        }
        $scope.submit_loading = false;
      });
    };
  }
]).controller('DT_CompanyForthCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  'Upload',
  'ImgResizeService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg, Upload, $imgResize) {
    console.log('DT_CompanyForthCtrl');
    $scope.company_id = $routeParams.company_id;
    $scope.add_member_flag = false;
    $scope.member_add = {};
    $scope.member_list = [];
    $scope.show_member_card = function () {
      $scope.add_member_flag = true;
    };
    $scope.get_member_list = function () {
      $http.get(urls.api + '/account/member/' + $scope.company_id + '/list').success(function (data) {
        if (data.error.code == 1) {
          $scope.member_list = data.data;
          $scope.member_number = data.data.length;
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.get_member_list();
    $scope.cancer_add = function () {
      $scope.add_member_flag = false;
      $scope.member_add = {};
      $('#addMember').modal('hide');
      $scope.avatar = null;
    };
    $scope.save_member = function () {
      if (!$scope.member_add.hasOwnProperty('m_avatar_id')) {
        $scope.error = $errMsg.format_error('\u8bf7\u4e0a\u4f20\u6210\u5458\u5934\u50cf', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      }
      $csrf.set_csrf($scope.member_add);
      var request_url;
      if ($scope.edit == false) {
        request_url = urls.api + '/account/member/create';
      } else {
        request_url = urls.api + '/account/member/' + $scope.member_list[$scope.index]._id['$oid'] + '/set';
      }
      $http.post(request_url, $.param($scope.member_add)).success(function (data) {
        if (data.error.code == 1) {
          $scope.get_member_list();
          $scope.member_add = {};
          $scope.avatar = undefined;
          $('#addMember').modal('hide');
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.delete_modal = function (index) {
      $scope.delete_index = index;
      $('#delete_member').modal('show');
    };
    $scope.delete_member = function (index) {
      var param = { 'csrfmiddlewaretoken': $csrf.val() };
      $http.post(urls.api + '/account/member/' + $scope.member_list[index]._id.$oid + '/delete', $.param(param)).success(function (data) {
        if (data.error.code == 1) {
          $http.post(urls.api + '/file/' + $scope.member_list[index].m_avatar_id + '/delete', $.param(param)).success(function (data) {
            if (data.error.code == 1) {
              $scope.get_member_list();
              $('#delete_member').modal('hide');
            } else {
              $scope.error = $errMsg.format_error('', data.error);
            }
          });
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.upload = function (file, file_t, category) {
      var param = {
          'file_type': file_t,
          'description': $scope.company_id + file_t,
          'category': $scope.company_id + '_' + $scope.member_number,
          'avatar_id': $scope.member_add.m_avatar_id
        };
      var headers = {
          'X-CSRFToken': $csrf.val(),
          'Content-Type': file.type
        };
      Upload.upload({
        url: urls.api + '/file/upload',
        data: param,
        headers: headers,
        file: file
      }).progress(function (evt) {
        var progressPercentage = parseInt(100 * evt.loaded / evt.total);
        $scope.progress = 'progress: ' + progressPercentage + '% ' + evt.config.file.name;
        console.log($scope.progress);
      }).success(function (data, status, headers, config) {
        if (data.error.code == 1) {
          $scope.member_add.m_avatar_id = data.data;
        } else {
          console.log(data.error.message);
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
    $scope.add_member = function () {
      $scope.edit = false;
      $('#addMember').modal('show');
      $scope.member_number = $scope.member_list.length;
    };
    $scope.edit_member = function (index) {
      var mem = {};
      $scope.member_number = index;
      mem.m_avatar_id = $scope.member_list[index].m_avatar_id;
      mem.m_introduction = $scope.member_list[index].m_introduction;
      mem.m_name = $scope.member_list[index].m_name;
      mem.m_position = $scope.member_list[index].m_position;
      $scope.member_add = mem;
      $('#addMember').modal('show');
      $scope.edit = true;
      $scope.index = index;
    };
    $scope.pre_step = function () {
      window.location.href = '/company/' + $scope.company_id + '/create/third';
    };
    $scope.get_company_info = function () {
      $http.get(urls.api + '/account/company/' + $scope.company_id + '/detail').success(function (data) {
        if (data.error.code == 1) {
          $scope.companyinfo = data.data;
        }
      });
    };
    $scope.get_company_info();
    $scope.next_step = function () {
      if (!$scope.companyinfo.hasOwnProperty('team_description')) {
        $scope.error = $errMsg.format_error('\u8bf7\u586b\u5199\u56e2\u961f\u4ecb\u7ecd', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      } else if ($scope.member_number == 0) {
        $scope.error = $errMsg.format_error('\u8bf7\u81f3\u5c11\u4e0a\u4f20\u4e00\u4e2a\u56e2\u961f\u6210\u5458\u7684\u4fe1\u606f', { code: '-1' });
        setTimeout(function () {
          $errMsg.remove_error($scope.error);
        }, 2000);
        return;
      }
      $scope.companyinfo.info_complete = true;
      $scope.submit_loading = true;
      $csrf.set_csrf($scope.companyinfo);
      $http.post(urls.api + '/account/company/' + $scope.company_id + '/set', $.param($scope.companyinfo)).success(function (data) {
        if (data.error.code == 1) {
          $scope.error = $errMsg.format_error('\u521b\u5efa\u516c\u53f8\u4fe1\u606f\u6210\u529f', data.error);
          setTimeout(function () {
            $errMsg.remove_error($scope.error);
          }, 2000);
          window.location.href = '/';
        } else {
          $scope.error = $errMsg.format_error('', data.error);
          setTimeout(function () {
            $errMsg.remove_error($scope.error);
          }, 2000);
        }
        $scope.submit_loading = false;
      });
    };
    $scope.type = 'circle';
    $scope.imageDataURI = '';
    $scope.resImageDataURI = '';
    $scope.resImgFormat = 'image/png';
    $scope.resImgQuality = 1;
    $scope.selMinSize = 100;
    $scope.enableCrop = true;
    $scope.resImgSize = 160;
    //$scope.aspectRatio=1.2;
    $scope.cancelUpload = function () {
      //$imgResize.cancel($scope,"/api/file/"+$scope.member_add.m_avatar_id+ "/download");
      //if($scope.cancel_upload == undefined)
      //            $scope.cancel_upload = true;
      //            $scope.cancel_upload = undefined;
      $scope.resize_area = false;  //alert($scope.cancel_upload);
    };
    $scope.startUpload = function (file_t, category) {
      /*
            if(file != null && file != undefined)
            {
                if(!/image\/\w+/.test(file.type)){
                    alert("文件必须为图片！");
                    return false;
                }
                //alert('here');
                $imgResize.startUpload(file,file_t,category,$scope);
                $scope.resize_area = true;
            }*/
      var data = $scope.resImageDataURI.split(',')[1];
      data = window.atob(data);
      var ia = new Uint8Array(data.length);
      for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
      }
      ;
      // canvas.toDataURL 返回的默认格式就是 image/png
      var blob = new Blob([ia], { type: 'image/png' });
      $scope.upload(blob, file_t, category);
      $('.upload-img').attr('src', $scope.resImageDataURI);
      $('#avatar_show_' + $scope.member_number).attr('src', $scope.resImageDataURI);
      $scope.avatar = '66666';
      $scope.resize_area = false;
    };
    $scope.test = function () {
      $('#fileInput').click();
      if (document.querySelector('#fileInput').value != '')
        $scope.resize_area = true;
    };
    $scope.check = function () {
      alert($scope.imageDataURI);
    };
    var handleFileSelect = function (evt) {
      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function ($scope) {
          $scope.imageDataURI = evt.target.result;
          $scope.resize_area = true;
        });
      };
      if (file != undefined)
        reader.readAsDataURL(file);
      else
        $scope.$apply(function ($scope) {
          $scope.resize_area = false;
        });
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
  }
]).controller('DT_PositionListCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  '$rootScope',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg, $rootScope) {
    console.log('DT_PositionListCtrl');
    $scope.filter = {
      'workdays': {
        'day0': true,
        'day3': true,
        'day4': true,
        'day5': true,
        'day6': true,
        'day7': true
      },
      'field': {
        'social': true,
        'e_commerce': true,
        'education': true,
        'health_medical': true,
        'culture_creativity': true,
        'living_consumption': true,
        'hardware': true,
        'O2O': true,
        'others': true
      },
      'type': {
        'technology': true,
        'product': true,
        'design': true,
        'operate': true,
        'marketing': true,
        'functions': true,
        'others': true
      },
      'salary': ''
    };
    $scope.position_type = {
      'technology': '\u6280\u672f',
      'product': '\u4ea7\u54c1',
      'design': '\u8bbe\u8ba1',
      'operate': '\u8fd0\u8425',
      'marketing': '\u5e02\u573a',
      'functions': '\u804c\u80fd',
      'others': '\u5176\u4ed6'
    };
    $scope.field_type = {
      'social': '\u793e\u4ea4',
      'e-commerce': '\u7535\u5b50\u5546\u52a1',
      'education': '\u6559\u80b2',
      'health_medical': '\u5065\u5eb7\u533b\u7597',
      'culture_creativity': '\u6587\u5316\u521b\u610f',
      'living_consumption': '\u751f\u6d3b\u6d88\u8d39',
      'hardware': '\u786c\u4ef6',
      'O2O': 'O2O',
      'others': '\u5176\u4ed6'
    };
    $scope.positions = {};
    $scope.param = {
      field: null,
      pageCount: 1,
      currentPage: 1
    };
    $scope.filed_choose = '\u884c\u4e1a\u9886\u57df';
    $scope.type_choose = '\u804c\u4f4d\u7c7b\u578b';
    $scope.salary_choose = '\u6708\u85aa\u4e0b\u9650';
    $scope.workdays_choose = '\u6bcf\u5468\u5de5\u4f5c\u65f6\u95f4';
    $scope.field_change = false;
    $scope.choose = function (field) {
      if ($scope.param.field == field) {
        $scope.field_change = false;
      } else {
        $scope.field_change = true;
        $scope.param.field = field;
      }
      $scope.get_company_list($scope.param);
    };
    $scope.show_field = function () {
      $scope.field = true;
      setTimeout(function () {
        if ($scope.field)
          setTimeout(function () {
            if ($scope.field)
              $('.field-list').slideDown('fast');
          }, 170);
      }, 170);
    };
    $scope.hide_field = function () {
      $('.field-list').slideUp('fast');
      $scope.field = false;
    };
    $('.company-field').mouseenter($scope.show_field);
    $('.company-field').mouseleave($scope.hide_field);
    $scope.show_type = function () {
      $scope.type = true;
      setTimeout(function () {
        if ($scope.type)
          setTimeout(function () {
            if ($scope.type)
              $('.type-list').slideDown('fast');
          }, 170);
      }, 170);
    };
    $scope.hide_type = function () {
      $('.type-list').slideUp('fast');
      $scope.type = false;
    };
    $('.position-type').mouseenter($scope.show_type);
    $('.position-type').mouseleave($scope.hide_type);
    $scope.show_salary = function () {
      $scope.salary = true;
      setTimeout(function () {
        if ($scope.salary)
          setTimeout(function () {
            if ($scope.salary)
              $('.salary_min').slideDown('fast');
          }, 170);
      }, 170);
    };
    $scope.hide_salary = function () {
      $('.salary_min').slideUp('fast');
      $scope.salary = false;
    };
    $('.salary_set').mouseenter($scope.show_salary);
    $('.salary_set').mouseleave($scope.hide_salary);
    $scope.show_work_days = function () {
      $scope.work_days = true;
      setTimeout(function () {
        if ($scope.work_days)
          setTimeout(function () {
            if ($scope.work_days)
              $('.work_days_max').slideDown('fast');
          }, 170);
      }, 170);
    };
    $scope.hide_work_days = function () {
      $('.work_days_max').slideUp('fast');
      $scope.work_days = false;
    };
    $('.work_days').mouseenter($scope.show_work_days);
    $('.work_days').mouseleave($scope.hide_work_days);
    $scope.get_positions = function (data) {
      $scope.loading = true;
      var param = '';
      if (data != null) {
        param = '?';
        if (data.hasOwnProperty('page')) {
          if ($scope.field_change) {
            $scope.field_change = false;
            param += 'page=' + 1;
            $scope.param.currentPage = 1;
          } else if (data.page == 0)
            param += 'page=1';
          else
            param += 'page=' + data.page;
        } else {
          param += 'page=' + 1;
        }
        if (data.field != undefined && data.field != null) {
          param += '&fields=' + data.field;
        }
        if (data.type != undefined && data.type != null) {
          param += '&types=' + data.type;
        }
        if (data.salary != undefined && data.salary != '') {
          param += '&salary_min=' + data.salary;
        }
        if (data.workdays != undefined && data.workdays != null) {
          param += '&workdays=' + data.workdays;
        }
      }
      $http.get(urls.api + '/position/search' + param).success(function (data) {
        if (data.error.code == 1) {
          $scope.positions = data.positions;
          $scope.param.pageCount = data.page_number;
          for (var i = 0; i < $scope.positions.length; i++) {
            $scope.positions[i].position_type_value = $scope.position_type[$scope.positions[i].position_type];
            $scope.positions[i].company.field_type = $scope.field_type[$scope.positions[i].company.field];
            if ($scope.positions[i].company.scale == 0) {
              $scope.positions[i].company.scale_value = '\u521d\u521b';
            } else if ($scope.positions[i].company.scale == 1) {
              $scope.positions[i].company.scale_value = '\u5feb\u901f\u53d1\u5c55';
            } else {
              $scope.positions[i].company.scale_value = '\u6210\u719f';
            }
          }
        } else {
          console.log(data.error.message);
        }
        $scope.loading = false;
      });
    };
    document.body.onscroll = function record_position() {
      $rootScope.position_list_position = document.body.scrollTop;  //alert('scroll1');
    };
    //换页
    $scope.selectPage = function (page) {
      $scope.param.page = page;
      $rootScope.position_list_param_cachce = $scope.param;
      $scope.get_positions($scope.param);
      document.body.scrollTop = 0;
    };
    if ($rootScope.position_list_param_cachce != undefined) {
      $scope.param = $rootScope.position_list_param_cachce;
      $scope.selectPage($rootScope.position_list_param_cachce.page);
      document.body.scrollTop = $rootScope.position_list_position;
    } else
      $scope.selectPage(1);
    $scope.choose = function (field) {
      if ($scope.param.field == field) {
        $scope.field_change = false;
      } else {
        $scope.field_change = true;
        $scope.param.field = field;
        if (field != null)
          $scope.filed_choose = $scope.field_type[field];
        else
          $scope.filed_choose = '\u884c\u4e1a\u9886\u57df';
      }
      $scope.get_positions($scope.param);
    };
    $scope.choose_type = function (type) {
      if ($scope.param.type == type) {
        $scope.type_change = false;
      } else {
        $scope.type_change = true;
        $scope.param.type = type;
        if (type != null)
          $scope.type_choose = $scope.position_type[type];
        else
          $scope.type_choose = '\u804c\u4f4d\u7c7b\u578b';
      }
      $scope.get_positions($scope.param);
    };
    $scope.choose_salary = function (salary) {
      if ($scope.param.salary == salary) {
        $scope.salary_change = false;
      } else {
        $scope.salary_change = true;
        $scope.param.salary = salary;
        if (salary != null)
          $scope.salary_choose = salary + 'K';
        else
          $scope.salary_choose = '\u6708\u85aa\u4e0b\u9650';
      }
      $scope.get_positions($scope.param);
    };
    $scope.choose_workdays = function (workdays) {
      if ($scope.param.workdays == workdays) {
        $scope.workdays_change = false;
      } else {
        $scope.workdays_change = true;
        $scope.param.workdays = workdays;
        if (workdays != null) {
          if (workdays == '0')
            $scope.workdays_choose = '\u7075\u6d3b\u65f6\u95f4';
          else
            $scope.workdays_choose = '\u6bcf\u5468' + workdays + '\u5929';
        } else
          $scope.workdays_choose = '\u6bcf\u5468\u5de5\u4f5c\u65f6\u95f4';
      }
      $scope.get_positions($scope.param);
    };
  }
]).controller('DT_UserInfoCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg) {
    console.log('DT_UserInfoCtrl');
    $scope.info = {};
    $scope.user_info = {};
    $scope.user_pwd = {};
    $scope.error = {};
    $scope.info.username = $user.username();
    $scope.e_check = {};
    $http.get(urls.api + '/account/userinfo/get').success(function (data) {
      if (data.error.code == 1) {
        $scope.user_info = data.data;
      }
    });
    $scope.view_tab = 'tab1';
    $scope.changeTab = function (tab) {
      $scope.view_tab = tab;
    };
    $scope.showError = function (ngModelController, error) {
      return ngModelController.$error[error];
    };
    $scope.update_info = function () {
      if ($scope.view_tab == 'tab1') {
        $csrf.set_csrf($scope.user_info);
        $http.post(urls.api + '/account/userinfo/set', $.param($scope.user_info)).success(function (data) {
          if (data.error.code == 1) {
            $scope.error = $errMsg.format_error('\u4fee\u6539\u6210\u529f', data.error);
          } else {
            $scope.error = $errMsg.format_error('', data.error);
          }
        });
      } else if ($scope.view_tab == 'tab2') {
        $csrf.set_csrf($scope.user_pwd);
        $http.post(urls.api + '/account/password/set', $.param($scope.user_pwd)).success(function (data) {
          console.log(data);
          if (data.error.code == 1) {
            $scope.error = $errMsg.format_error('\u4fee\u6539\u6210\u529f', data.error);
          } else {
            $scope.error = $errMsg.format_error('', data.error);
          }
        });
      }
    };
  }
]).controller('DT_InternEnterCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user) {
    console.log('DT_InternEnterCtrl');
    $scope.Upload_personal_profile = function () {
    };
    $scope.Enter_Xiniu = function () {
      window.location.href = '/';
    };
  }
]).controller('DT_ManagerCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg) {
    console.log('DT_ManagerCtrl');
    $scope.company_list = {};
    $scope.position_type = {
      'technology': '\u6280\u672f',
      'product': '\u4ea7\u54c1',
      'design': '\u8bbe\u8ba1',
      'operate': '\u8fd0\u8425',
      'marketing': '\u5e02\u573a',
      'functions': '\u804c\u80fd',
      'others': '\u5176\u4ed6'
    };
    $scope.scale = [
      '\u521d\u521b',
      '\u5feb\u901f\u53d1\u5c55',
      '\u6210\u719f'
    ];
    $scope.field_type = {
      'social': '\u793e\u4ea4',
      'e-commerce': '\u7535\u5b50\u5546\u52a1',
      'education': '\u6559\u80b2',
      'health_medical': '\u5065\u5eb7\u533b\u7597',
      'culture_creativity': '\u6587\u5316\u521b\u610f',
      'living_consumption': '\u751f\u6d3b\u6d88\u8d39',
      'hardware': '\u786c\u4ef6',
      'O2O': 'O2O',
      'others': '\u5176\u4ed6'
    };
    $scope.stage = {
      'seed': '\u79cd\u5b50\u8f6e',
      'angel': '\u5929\u4f7f\u8f6e',
      'A': 'A\u8f6e',
      'B': 'B\u8f6e',
      'C': 'C\u8f6e',
      'D_plus': 'D\u53ca\u4ee5\u4e0a\u8f6e'
    };
    $scope.amount = {
      'ten': '\u5341\u4e07\u7ea7',
      'hundred': '\u767e\u4e07\u7ea7',
      'thousand': '\u5343\u4e07\u7ea7',
      'thousand_plus': '\u4ebf\u7ea7'
    };
    $scope.param = {
      field: null,
      pageCount: 1,
      currentPage: 1
    };
    $scope.scale_change = false;
    $scope.field_change = false;
    $scope.choose = function (field) {
      if ($scope.param.field == field) {
        $scope.field_change = false;
      } else {
        $scope.field_change = true;
        $scope.param.field = field;
      }
      $scope.get_company_list($scope.param);
    };
    $scope.choose_scale = function (scale) {
      if ($scope.param.scale == scale) {
        $scope.scale_change = false;
      } else {
        $scope.param.scale = scale;
        $scope.scale_change = true;
      }
      $scope.get_company_list($scope.param);
    };
    $scope.selectPage = function (page) {
      $scope.param.page = page;
      $scope.get_company_list($scope.param);
    };
    $scope.get_company_list = function (data) {
      $scope.loading = true;
      var param = '';
      if (data != null) {
        param = '?';
        if (data.hasOwnProperty('page')) {
          if ($scope.scale_change || $scope.field_change) {
            $scope.scale_change = false;
            $scope.field_change = false;
            param += 'page=' + 1;
            $scope.param.currentPage = 1;
          } else
            param += 'page=' + data.page;
        }
        if (data.field != undefined && data.field != null) {
          param += '&field=' + data.field;
        }
        if (data.scale != undefined && data.scale != null) {
          param += '&scale=' + data.scale;
        }
        if (data.hasOwnProperty('auth_organization')) {
        }
      } else
        $scope.selectPage(1);
      $http.get(urls.api + '/account/admin/company/list' + param).success(function (data) {
        $scope.param.pageCount = data.page_number;
        $scope.company_list = data.data;
        for (var i = 0; i < $scope.company_list.length; i++) {
          $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
          $scope.company_list[i].scale_value = $scope.scale[$scope.company_list[i].scale];
          $scope.company_list[i].field_type = $scope.field_type[$scope.company_list[i].field];
          $scope.company_list[i].position_type_value = {};
          for (var j = 0; j < $scope.company_list[i].financing.length; j++) {
            $scope.company_list[i].financing[j].stage_value = $scope.stage[$scope.company_list[i].financing[j].stage];
            $scope.company_list[i].financing[j].amount_value = $scope.amount[$scope.company_list[i].financing[j].amount];
          }
        }
        $scope.loading = false;
      });  /*$http.get(urls.api+"/account/admin/company/list").
                success(function(data){
                $scope.param.pageCount = data.page_number;
                if(data.error.code == 1){
                    $scope.company_list = data.data;
                    for(var i=0;i<$scope.company_list.length;i++){
                        $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                        $scope.company_list[i].scale_value = $scope.scale[$scope.company_list[i].scale];
                        $scope.company_list[i].field_type = $scope.field_type[$scope.company_list[i].field];
                        $scope.company_list[i].position_type_value = {};
                        $scope.company_list[i].financing_list = {};
                        $scope.company_list[i].financing_list = $scope.company_list[i].financing;
                        for(var j = 0; j < $scope.company_list[i].position_type.length; j ++){
                            $scope.company_list[i].position_type_value[j] = $scope.position_type[$scope.company_list[i].position_type[j]];
                        }
                    }
                }
                else{
                     $scope.error = $errMsg.format_error('',data.error);
                }
                $scope.loading = false;
            });*/
    };
    $scope.get_company_list();
    $scope.auth = function (index) {
      var param = { 'auth_organization': $scope.company_list[index].auth_organization };
      $csrf.set_csrf(param);
      $http.post(urls.api + '/account/company/' + $scope.company_list[index]._id.$oid + '/auth', $.param(param)).success(function (data) {
        if (data.error.code == 1) {
          $http.get(urls.api + '/account/admin/company/' + $scope.company_list[index]._id.$oid + '/detail_with_financing').success(function (data1) {
            if (data1.error.code == 1) {
              $scope.company_list[index] = data1.data;
              $scope.error = $errMsg.format_error('\u8ba4\u8bc1\u6210\u529f', data1.error);
            } else {
              $scope.error = $errMsg.format_error('', data1.error);
            }
          });
        } else {
          $scope.error = $errMsg.format_error('', data.error);
        }
      });
    };
  }
]).controller('DT_CompanyAccountCtrl', [
  '$scope',
  '$http',
  'CsrfService',
  'urls',
  '$filter',
  '$routeParams',
  'UserService',
  'ErrorService',
  function ($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg) {
    console.log('DT_CompanyAccountCtrl');
    $scope.info = {};
    $scope.user_info = {};
    $scope.user_pwd = {};
    $scope.error = {};
    $scope.e_check = {};
    $scope.company_id = '';
    $http.get(urls.api + '/account/company/detail').success(function (data) {
      if (data.error.code == 1) {
        $scope.user_info = data.data;
        $scope.company_id = data.data._id.$oid;
      } else {
        console.log(data.error.message);
      }
    });
    $scope.view_tab = 'tab1';
    $scope.changeTab = function (tab) {
      $scope.view_tab = tab;
    };
    $scope.showError = function (ngModelController, error) {
      return ngModelController.$error[error];
    };
    $scope.update_info = function () {
      if ($scope.view_tab == 'tab1') {
        $csrf.set_csrf($scope.user_info);
        $http.post(urls.api + '/account/company/' + $scope.company_id + '/set', $.param($scope.user_info)).success(function (data) {
          if (data.error.code == 1) {
            $scope.error = $errMsg.format_error('\u4fee\u6539\u6210\u529f', data.error);
          } else {
            $scope.error = $errMsg.format_error('', data.error);
          }
        });
      } else if ($scope.view_tab == 'tab2') {
        $csrf.set_csrf($scope.user_pwd);
        console.log($scope.user_pwd);
        $http.post(urls.api + '/account/password/set', $.param($scope.user_pwd)).success(function (data) {
          console.log(data);
          if (data.error.code == 1) {
            $scope.error = $errMsg.format_error('\u4fee\u6539\u6210\u529f', data.error);
          } else {
            $scope.error = $errMsg.format_error('', data.error);
          }
        });
      }
    };
  }
]);