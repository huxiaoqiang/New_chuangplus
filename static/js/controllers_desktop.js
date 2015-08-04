'use strict';

/* Controllers */

angular.module('chuangplus.controllers', []).
    controller('DT_HomepageCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('HomepageCtrl');
    }]).
    controller('DT_LoginCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_LoginCtrl');
        $scope.login_info = {};
        $scope.captcha_url = urls.api+"/captcha/image/";

        $scope.refresh = function(){
            $scope.captcha_url = urls.api+'/captcha/image/?'+Math.random();
        };
        $scope.login_user = function(){
            $csrf.set_csrf($scope.login_info);
            $http.post(urls.api+"/account/login", $.param($scope.login_info)).
                success(function(data){
                    if(data.error.code == 1){
                        console.log("login successfully!");
                        window.location.href = '/';
                    }
                    else{
                        console.log(data.error.message);
                    }
                }).
                error(function(data){
                    console.log(data);

                });
        };
    }]).
    controller('DT_RegisterCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_RegisterCtrl');
        $scope.reg_info = {};
        $scope.captcha_url = urls.api+"/captcha/image/";
        $scope.refresh = function(){
            $scope.captcha_url = urls.api+'/captcha/image/?'+Math.random();
        };
        $scope.register = function(){
            $csrf.set_csrf($scope.reg_info);
            $http.post(urls.api+"/account/register", $.param($scope.reg_info)).
                success(function(data){
                    if(data.error.code == 1){
                        console.log("regist successfully!");
                        alert("注册成功");
                        setTimeout(function(){location.href='/'},2000);
                    }
                    else{
                        alert(data.error.message);
                    }
                });
        };
    }]).
    controller('DT_InfomationCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
      console.log('DT_InfomationCtrl');
      $scope.infos = {};
      $scope.enter = function(){
        $csrf.set_csrf($scope.infos);
        $http.post(urls.api+"/account/userinfo/set",$.param($scope.infos)).
          success(function(data){
            if (data.error.code){
              console.log("Set infomation successfully!");
              alert("个人信息设置成功");
              setTimeout(function(){location.href='/'},2000);
            }
            else{
              alert(data.error.message);
            }
          });
      };
    }]).
    controller('DT_HeaderCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_HeaderCtrl');
        $scope.logout = function(){
            $http.get(urls.api+"/account/logout").
                success(function(data){
                    if(data.error.code == 1){
                        window.location.href = '/login';
                    }
                });
        };
    }]);