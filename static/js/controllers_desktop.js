'use strict';

/* Controllers */

angular.module('chuangplus.controllers', []).
    controller('DT_HomepageCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('HomepageCtrl');
    }]).
    controller('DT_LoginCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_LoginCtrl');
        $scope.login_info={};
        $scope.captcha_url = urls.api+"/captcha/image/";

        $scope.refresh=function(){
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
    }]);

