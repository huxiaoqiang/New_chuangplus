'use strict';

/* Controllers */

angular.module('chuangplus.controllers', []).
    controller('DT_HomepageCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('HomepageCtrl');
    }]).
    controller('DT_HeaderCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_HeaderCtrl');
        $scope.logout = function(){
            $http.get(urls.api+"/account/logout").
                success(function(data){
                    console.log(data);
                    if(data.error.code == 1){
                        window.location.href = '/login';
                    }
                });
        };
        //tab active control
        $scope.company_active = function(){
            $scope.company = true;
            $scope.position = $scope.resume = $scope.login = $scope.register = false;
        };
        $scope.position_active = function(){
            $scope.position = true;
            $scope.company = $scope.resume = $scope.login = $scope.register = false;
        };
        $scope.resume_active = function(){
            $scope.resume = true;
            $scope.position = $scope.company = $scope.login = $scope.register = false;
        };
        $scope.login_active = function(){
            $scope.login = true;
            $scope.position = $scope.company = $scope.resume = $scope.register = false;
        };
        $scope.register_active = function(){
            $scope.register = true;
            $scope.position = $scope.company = $scope.login = $scope.resume = false;
        };
    }]).
    controller('DT_LoginCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrMsgService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg){
        console.log('DT_LoginCtrl');

        $scope.login_info = {};
        $scope.login_info.role = 0;
        $scope.captcha_url = urls.api+"/captcha/image/";

        $scope.student = function(){
            $scope.tab1 = true;
            $scope.tab2 = false;
            $scope.login_info.role = 0;
        };
        $scope.hr = function(){
            $scope.tab1 = false;
            $scope.tab2 = true;
            $scope.login_info.role = 1;
        };
        $scope.refresh = function(){
            $scope.captcha_url = urls.api+'/captcha/image/?'+Math.random();
        };
        $scope.login_user = function(){
            $csrf.set_csrf($scope.login_info);
            $http.post(urls.api+"/account/login", $.param($scope.login_info)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.error = $errMsg.format_error("登录成功",data.error);
                        setTimeout(function(){window.location.href='/'},1000);
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                    }
                });
        };
        $scope.refresh();
    }]).
    controller('DT_RegisterCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrMsgService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg){
        console.log('DT_RegisterCtrl');
        $scope.error = {};
        $scope.reg_info = {};
        $scope.reg_info.role = 0;
        $scope.captcha_url = urls.api+"/captcha/image/";
        $scope.check = {};
        $scope.e_check = {};

        $scope.refresh = function(){
            $scope.captcha_url = urls.api+'/captcha/image/?'+Math.random();
        };
         $scope.student = function(){
            $scope.tab1 = true;
            $scope.tab2 = false;
            $scope.reg_info.role = 0;
        };
        $scope.hr = function(){
            $scope.tab1 = false;
            $scope.tab2 = true;
            $scope.reg_info.role = 1;
        };
        $scope.register = function(){
            if ($scope.reg_info.password != $scope.repeate_password)
            {
                $scope.error.code = -1;
                $scope.error = $errMsg.format_error("两次输入的密码不一致",$scope.error);
                return;
            }
            $csrf.set_csrf($scope.reg_info);
            $http.post(urls.api+"/account/register", $.param($scope.reg_info)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.error = $errMsg.format_error("注册成功",data.error);
                        setTimeout(function(){window.location.href='/'},1500);
                    }
                    else{
                        $scope.error = $errMsg.format_error("",data.error);
                    }
                });
        };
        $scope.showError = function(ngModelController,error){
            return ngModelController.$error[error];
        };
        $scope.check_username = function(){
            $scope.check.username = $scope.reg_info.username;
            $csrf.set_csrf($scope.check);
            $http.post(urls.api+"/account/checkusername", $.param($scope.check)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.check.exist = data.username.exist;
                    }
                });
        };
        $scope.check_email = function(){
            $scope.e_check.email = $scope.reg_info.email;
            $csrf.set_csrf($scope.e_check);
            $http.post(urls.api+"/account/checkemail", $.param($scope.e_check)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.e_check.exist = data.email.exist;
                    }
                });
        };
        $scope.refresh();
    }]).
    controller('DT_FindPwdCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','$cookieStore', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$cookieStore){
      console.log('DT_FindPwdCtrl');
      $scope.find = {};
      $scope.captcha_url = urls.api+"/captcha/image/";
      $scope.e_check = {"exist" : true };
      $scope.c_check = {"valid" : true};
      $scope.refresh = function(){
            $scope.captcha_url = urls.api+'/captcha/image/?'+Math.random();
        };
      $scope.findpwd = function(){
        $csrf.set_csrf($scope.find);
        $http.post(urls.api+"/account/sendemail", $.param($scope.find)).
            success(function(data){
                if(data.error.code == 1){
                    $cookieStore.put("email",$scope.find.email);
                    window.location.href = '/password/set';
                }
                else{
                    alert(data.error.message);
                    setTimeout(function(){location.href='/password/findpwd'},2000);
                }
            });
      };
      $scope.showError = function(ngModelController,error){
            return ngModelController.$error[error];
      };
      $scope.check_email = function(){
        $csrf.set_csrf($scope.e_check);
        $scope.e_check.email = $scope.find.email;
        $http.post(urls.api+"/account/checkemail", $.param($scope.e_check)).
            success(function(data){
                if(data.error.code == 1){
                    $scope.e_check.exist = data.email.exist;
                }
            });
      };
      $scope.check_captcha = function(){
        $csrf.set_csrf($scope.c_check);
        $scope.c_check.captcha = $scope.find.captcha;
        $http.post(urls.api+"/captcha/check/", $.param($scope.c_check)).
            success(function(data){
                if(data == 'yes'){
                    $scope.c_check.valid = true;
                }
                else{
                    $scope.c_check.valid = false;
                }
            });
      };
      $scope.refresh();
    }]).
    controller('DT_SetPwdCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','$cookieStore', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookieStore){
      console.log('DT_SetPwdCtrl');
      $scope.email = $cookieStore.get("email");
    }]).
    controller('DT_FinishPwdCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_FinishPwdCtrl');
    }]).
    //intern controllers
    controller('DT_InternInfoCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_InternInfoCtrl');
    }]).
    controller('DT_InternPostCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_InternPostCtrl');
    }]).
    controller('DT_InternCompanyFavorCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_InternCompanyFavorCtrl');
    }]).
    controller('DT_InternPositionFavorCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_InternPositionFavorCtrl');
    }]).
    controller('DT_InternResumeCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_InternResumeCtrl');
    }]).
    controller('DT_InternResumeCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_InternResumeCtrl');
    }]).
    //company controllers
    controller('DT_RegEnterCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_RegEnterCtrl');
    }]).
    controller('DT_CompanyResumeCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_CompanyResumeCtrl');
    }]).
    controller('DT_CompanyInfoCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_CompanyInfoCtrl');

    }]).
    controller('DT_CompanyPositionManageCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_CompanyPositionManageCtrl');
    }]).
    controller('DT_CompanyPositionEditCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_CompanyPositionEditCtrl');
    }]).
    controller('DT_CompanyListCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_CompanyListCtrl');
    }]).
    controller('DT_CompanyDetailCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_CompanyDetailCtrl');
    }]).
    controller('DT_PositionListCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_PositionListCtrl');
        $scope.filter = {
            "workdays":{
                "day0": true,
                "day3": true,
                "day4": true,
                "day5": true,
                "day6": true,
                "day7": true
            },
            "field":{
                'social':true,
                'e-commerce':true,
                'education':true,
                'health_medical':true,
                'culture_creativity':true,
                'living_consumption':true,
                'hardware':true,
                'O2O':true,
                'others':true
            },
            "type":{
                'technology':true,
                'product':true,
                'design':true,
                'operate':true,
                'marketing':true,
                'functions':true,
                'others':true
            },
            "salary": ''
        };
        $scope.positions = {};
        $scope.get_positions = function(){

        };
    }]).
    controller('DT_CompanyInfoDetailCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_CompanyInfoDetailCtrl');
        $scope.welfare_tags = {
            "tag0":
            {
                "chosed":false,
                "value" :"技能培训"
            },
            "tag1":
            {
                "chosed":false,
                "value" :"扁平管理"
            },
            "tag2":
            {
                "chosed":false,
                "value" :"可转正"
            },
            "tag3":
            {
                "chosed":false,
                "value" :"弹性工作"
            },
            "tag4":
            {
                "chosed":false,
                "value" :"定期出游"
            },
            "tag5":
            {
                "chosed":false,
                "value" :"地铁周边"
            },
            "tag6":
            {
                "chosed":false,
                "value" :"股票期权"
            },
            "tag7":
            {
                "chosed":false,
                "value" :"水果零食"
            },
            "tag8":
            {
                "chosed":false,
                "value" :"正餐补助"
            },
            "tag9":
            {
                "chosed":false,
                "value" :"班车接送"
            }
        };
        $scope.member_list=[
            {
                "m_name":"宁博",
                "m_position":"CEO",
                "m_introduction": "描述"
            }];
        $scope.add_tag = function(){
            $scope.new_tag_name = "tag"+$scope.tag_added;
            $scope.welfare_tags[$scope.new_tag_name] = {
                "chosed":false,
                "value" :$scope.tag_added
            };
        };
        $scope.canAdd = function(ngModelController){
            return (ngModelController.$invalid && ngModelController.$dirty) ||  ngModelController.$pristine;
        };
        $scope.tag_long_error=function(ngModelController){
            return ngModelController.$invalid && ngModelController.$dirty;
        };
        $scope.add_member = function(){
            $scope.member_list.push({});
        };
    }]).
    controller('DT_PositionDetailCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_PositionDetailCtrl');
    }]).
    controller('DT_FeedbackCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_FeedbackCtrl');
    }]).
    controller('DT_AboutCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_AboutCtrl');
    }]).
    controller('DT_InformationCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
      console.log('DT_InformationCtrl');
      $scope.infos = {};
      $scope.info_user = function(){
        $csrf.set_csrf($scope.infos);
        $http.post(urls.api+"/account/userinfo/set",$.param($scope.infos)).
          success(function(data){
            if (data.error.code == 1){
              console.log("Set information successfully!");
              alert("个人信息设置成功");
              setTimeout(function(){window.location.href='/'},2000);
            }
            else{
              alert(data.error.message);
            }
          });
      };
    }]).

//    controller('DT_UserInfoCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
//        console.log('DT_UserInfoCtrl');
//        $scope.view_tab = 'tab1';
//        $scope.changeTab = function(tab){
//            $scope.view_tab = tab;
//        }
//    }]).
    controller('DT_InternEnterCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_InternEnterCtrl');
        $scope.Upload_personal_profile = function(){}
        $scope.Enter_Xiniu = function(){
            window.location.href = '/';
        }
    }]).
    controller('DT_PositionListCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_PositionListCtrl');
    }]);

