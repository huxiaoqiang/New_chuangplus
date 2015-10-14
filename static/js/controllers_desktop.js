'use strict';

/* Controllers */

angular.module('chuangplus.controllers', []).
    controller('DT_HomepageCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('HomepageCtrl');
        $scope.role = $user.role();
        $scope.username = $user.username();
        $scope.company_id='';
        $scope.myInterval = 3000;
        $scope.slides1 = [
            {image:"/static/image/banner/ceobanner-03.jpg"},
            {image:"/static/image/banner/ceobanner-04.jpg"},
            {image:"/static/image/banner/ceobanner-05.jpg"}
        ];
        $scope.slides2 = [
            {image:"/static/image/banner/banner-01.jpg"},
            {image:"/static/image/banner/banner-02.jpg"}
        ];
        $scope.scan = false;
        $scope.search = false;
        $scope.get_company_info = function(){
            $http.get(urls.api+"/account/company/detail").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.company_id = data.data._id.$oid;
                        if(data.data.abbreviation != null){
                            $scope.url = '/company/'+$scope.company_id+'/create/first';
                        }
                        else{
                            $scope.url = '/company/'+$scope.company_id+'/no';
                        }
                    }
                });
        };
        $scope.get_company_info();
    }]).
    controller('DT_HeaderCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','$location','HeaderService','$rootScope',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$location,$header,$rootScope){
        console.log('DT_HeaderCtrl');
        $scope.company_id = '';
        $scope.not_in_search = true;
        $scope.username = $user.username();
        $scope.scan_mouseover = function(){
            $scope.scan=true;
            $scope.search=false;
        };
        $scope.out_search_icon = function(){
            var leave = function()
            {
                if($scope.not_in_search)
                    $scope.search = false;
            }
            setTimeout(leave,1000);
        };
        $scope.search_mouseout = function(){
            $scope.not_in_search = true;
            $scope.timeout_id = setTimeout($scope.hide_search,1000);
        };
        $scope.hide_search = function(){
            $scope.$apply(function(){
               $scope.search = false;
            });
        };
        $scope.search_mouseover = function(){
            $scope.not_in_search = false;
            $scope.search=true;
            clearTimeout($scope.timeout_id);
        };
        $scope.hide_search = function(){
            $scope.$apply(function(){
               $scope.search = false;
            });
        };

        $scope.get_company_info = function(){
            $http.get(urls.api+"/account/company/detail").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.company_id = data.data._id.$oid;
                        if(data.data.abbreviation != null){
                            $scope.url = '/company/'+$scope.company_id+'/create/first';
                        }
                        else{
                            $scope.url = '/company/'+$scope.company_id+'/no';
                        }
                    }
                });
        };
        $scope.register  = function(){
            window.location.href='/register';
        };
        $scope.login  = function(){
            window.location.href='/login';
        };
        $scope.home = function(){
            window.location.href='/';
        };
        if($user.role()==1){
            $scope.get_company_info();
        }
        $scope.logout = function(){
            $http.get(urls.api+"/account/logout").
                success(function(data){
                    console.log(data);
                    if(data.error.code == 1){
                        $user.logout();
                        window.location.href = '/';
                    }
                });
        };
       //tab active control
        $scope.homepage_active =  function(){
            $scope.header = $header.homepage();
        }
        $scope.company_active = function(){
            $rootScope.company_list_position = undefined;
            $rootScope.company_list_param_cache = undefined;
            $scope.header = $header.company();
        }
        $scope.position_active = function(){
            $rootScope.company_position_position = undefined;
            $rootScope.company_position_param_cache = undefined;
            $scope.header = $header.position();
        }
        $scope.resume_active = function(){$scope.header = $header.resume();}
        $scope.user_active = function(){$scope.header = $header.user();}
        $scope.choose_header = function(){
            var url = $location.url();
            if(url == '/'){
                $scope.header = $header.homepage();
            }
            else if(url.indexOf("position")==1){
                $scope.header = $header.position();
            }
            else if(url.indexOf("company")==1&&(url.indexOf("list")==9||url.indexOf("detail")==34)){
                $scope.header = $header.company();
            }
            else if(url.indexOf("resume")>0){
                $scope.header = $header.resume();
            }
            else if(url.indexOf("login")>0||url.indexOf("register")>0||url.indexOf("password")>0||url.indexOf("intern")>0||url.indexOf("feedback")>0||url.indexOf("about")>0){
                $scope.header = $header.none();
            }
            else{
                $scope.header = $header.user();
            }
        };
        $scope.choose_header();
        $scope.search = function(){
            window.location.href="/search?query="+search_text+"&type=0&page=1";
        };
    }]).
    controller('DT_NoHeaderCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_NoHeaderCtrl');
        $scope.homepage_active = function(){
            window.location.href = '/';
        };
    }]).
    controller('DT_LoginCtrl',['$scope','$rootScope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService','$location',
        function($scope,$rootScope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg,$location){
        console.log('DT_LoginCtrl');
        $scope.login_info = {};
        //$scope.login_info.role = 1;
        $scope.captcha_url = urls.api+"/captcha/image/";
        $scope.refresh = function(){
            $scope.captcha_url = urls.api+'/captcha/image/?'+Math.random();
        };

        $scope.login_user = function(){
            $csrf.set_csrf($scope.login_info);
            $scope.submit_loading = true;

            if($scope.is_tsinghua == true)
                $scope.url = urls.api+"/account/login_by_tsinghua";
            else
                $scope.url = urls.api+"/account/login";
            $http.post($scope.url, $.param($scope.login_info)).
                success(function(data){
                    if(data.error.code == 1){
                        $rootScope.is_tsinghua = $scope.is_tsinghua;
                        $scope.error = $errMsg.format_error("登录成功",data.error);
                        if($scope.is_tsinghua != true)
                            setTimeout(function(){window.location.href='/'},1000);
                        else{
                            if(data.completive == '1')
                                setTimeout(function(){window.location.href='/'},1000);
                            else
                                $location.url('/intern/information');
                        }
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                        setTimeout(function(){
                            $errMsg.remove_error($scope.error);
                        },2000);
                    }
                    $scope.submit_loading = false;
                });
        };
        $scope.refresh();
    }]).
    controller('DT_SearchCtrl',['$scope', '$http', 'CsrfService', 'urls','$routeParams','ErrorService',
        function($scope, $http, $csrf, urls,$routeParams,$errMsg){
            $scope.param = $routeParams;
            $scope.get_count = function(){
                $http.get(urls.api+"/account/"+$scope.param.query+"/search_count").
                  success(function(data){
                    if(data.error.code=1){
                        $scope.company_count = data.company_count;
                        $scope.position_count = data.position_count;
                    }
                    else
                        console.log(data.error.message);
                  });
            };
            $scope.get_count();

            $scope.search_company = function(){
                var param = "text=" + $scope.param.query + "page="+$scope.param.page;
                $http.get(urls.api+"/account/company/list"+param).
                  success(function(data){
                    if(data.error.code == 1)
                        $scope.company_list = data.data;
                    else
                        console.log(data.error.message);
                  });
            };
            $scope.search_position = function(){
                var param = "name=" + $scope.param.query + "page="+$scope.param.page;
                $http.get(urls.api+"/position/search"+param).
                  success(function(data){
                    if(data.error.code==1)
                        $scope.position_list = data.positions;
                    else
                        console.log(data.error.message);
                  });
            };
            $scope.search_company();
    }]).
    controller('DT_RegisterCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg){
        console.log('DT_RegisterCtrl');
        $scope.show_footer = 'false';
        $scope.show_header = 'false';
        $scope.error = {};
        $scope.reg_info = {};
        $scope.reg_info.role = 0;
        $scope.captcha_url = urls.api+"/captcha/image/";
        $scope.check = {};
        $scope.e_check = {};
        $scope.ic_check = {
            'exist':true,
            'used' :false
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
        $scope.refresh = function(){
            $scope.captcha_url = urls.api+'/captcha/image/?'+Math.random();
        };
        $scope.register = function(){
            if ($scope.reg_info.password != $scope.repeate_password)
            {
                $scope.error.code = -1;
                $scope.error = $errMsg.format_error("两次输入的密码不一致",$scope.error);
                return;
            }
            if($scope.reg_info.role == 1){
                if($scope.ic_check.used == true){
                    $scope.error.code = -1;
                    $scope.error = $errMsg.format_error("邀请码已经被注册，请联系创加获取邀请码",$scope.error);
                    return;
                }
                else if($scope.ic_check.exist = false){
                    $scope.error.code = -1;
                    $scope.error = $errMsg.format_error("邀请码错误，请联系创加获取邀请码",$scope.error);
                    return;
                }
                var param = {
                    'code':$scope.reg_info.invitation_code
                };
                $csrf.set_csrf(param);
                $http.post(urls.api+"/captcha/register_invitation_code",$.param(param)).
                success(function(data){
                    if(data.error.code == 1){
                        $csrf.set_csrf($scope.reg_info);
                        $scope.submit_loading = true;
                        $http.post(urls.api+"/account/register", $.param($scope.reg_info)).
                            success(function(data){
                                if(data.error.code == 1){
                                    $scope.error = $errMsg.format_error("注册成功",data.error);
                                    $scope.id = data.id;
                                    if($scope.reg_info.role == 1){
                                        setTimeout(function(){window.location.href='/company/'+$scope.id+'/create/first'},1500);
                                    }
                                    else{
                                        setTimeout(function(){window.location.href='/'},1500);
                                    }
                                }
                                else{
                                    $scope.error = $errMsg.format_error("",data.error);
                                    setTimeout($scope.hide_error,2000);
                                }
                                $scope.submit_loading = false;
                        });
                    }
                    else{
                        $scope.error = $errMsg.format_error("",data.error);
                    }
                });
            }
            else{
                $csrf.set_csrf($scope.reg_info);
                $scope.submit_loading = true;
                $http.post(urls.api+"/account/register", $.param($scope.reg_info)).
                    success(function(data){
                        if(data.error.code == 1){
                            $scope.error = $errMsg.format_error("注册成功",data.error);
                            setTimeout(function(){window.location.href='/intern/information'},1500);
                        }
                        else{
                            $scope.error = $errMsg.format_error("",data.error);
                            setTimeout($scope.hide_error,2000);
                        }
                        $scope.submit_loading = false;
                });
            }
        };
        $scope.hide_error = function(){
            $scope.$apply(function(){
                $errMsg.remove_error($scope.error);
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
        $scope.check_invitation_code = function(){
            $scope.ic_check.code = $scope.reg_info.invitation_code;
            $csrf.set_csrf($scope.ic_check);
            $http.post(urls.api+"/captcha/check_ic", $.param($scope.ic_check)).
                success(function(data){
                    if(data.error.code == 1){
                        if(data.checked == true){
                            $scope.ic_check.used = true;
                            $scope.ic_check.exist = true;
                        }
                        else{
                            $scope.ic_check.exist = true;
                            $scope.ic_check.used = false;
                        }
                    }
                    else{
                        $scope.ic_check.exist = false;
                        $scope.ic_check.used = false;
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
                    $scope.error = $errMsg.format_error("",data.error);
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
    controller('DT_SetPwdCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','$cookieStore','ErrorService',
      function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookieStore,$errMsg){
      console.log('DT_SetPwdCtrl');
      $scope.email = $cookieStore.get("email");
      $scope.pass_verify = false;
      $scope.check_correct_code = function(){
        var param = {
            'input_code': $scope.set.verifycode,
            "csrfmiddlewaretoken" : $csrf.val()
        };
        $http.post(urls.api+"/account/verifycode", $.param(param)).
            success(function(data){
                $scope.pass_verify = data.pass_verify;
                return data.pass_verify;
            });
      };
      $scope.setpwd = function(){
        if($scope.pass_verify==false){
            $scope.error = $errMsg.format_error("邮箱验证码错误",{code:"-1"});
            return;
        }
        if($scope.set.password!=$scope.set.repassword){
            $scope.error = $errMsg.format_error("两次输入密码不一致",{code:"-1"});
            return;
        }
        var param = {
           "input_code": $scope.set.verifycode,
            "csrfmiddlewaretoken" : $csrf.val(),
            "email" : $scope.email,
            "new_password" : $scope.set.password
        };
        $http.post(urls.api+"/account/password/set_withcode", $.param(param)).
          success(function(data){
              if(data.error.code == 1){
                  window.location.href="/password/finish";
              }
              else{
                  $scope.error = $errMsg.format_error("",data.error);
              }
            });
      };
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
        $scope.positions = {};
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
            };
        $scope.field_type={
            'social':"社交",
            'e-commerce':"电子商务",
            'education':"教育",
            'health_medical':"健康医疗",
            'culture_creativity':"文化创意",
            'living_consumption':"生活消费",
            'hardware':"硬件",
            '020':"O2O",
            'others':"其他"
        };
        $scope.task = {
            'pageCount' : 1,
            'currentPage' : 1
        };
        $scope.get_positions = function(){
            $http.get(urls.api+"/account/userinfo/position/submit/list").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.positions = data.data;
                        $scope.task.pageCount = data.page_number;
                        for(var i = 0; i < $scope.positions.length; i ++){
                            $scope.positions[i].position_type_value = $scope.position_type[$scope.positions[i].position_type];
                            $scope.positions[i].company.field_type = $scope.field_type[$scope.positions[i].company.field];
                            if($scope.positions[i].company.scale == 0){
                                $scope.positions[i].company.scale_value = "初创";
                            }
                            else if($scope.positions[i].company.scale == 1){
                                $scope.positions[i].company.scale_value = "快速发展";
                            }
                            else{
                                $scope.positions[i].company.scale_value = "成熟";
                            }
                            $scope.positions[i].submit_value = "投递简历";
                        }
                    }
                    else{
                        console.log(data.error.message);
                    }
            });
        };
        $scope.get_positions();
    }]).
    controller('DT_InternCompanyFavorCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_InternCompanyFavorCtrl');
        $scope.company_list = {};
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.position_index = {
            "technology":0,
            "product":1,
            "design":2,
            "operate":3,
            "marketing":4,
            "functions":5,
            "others":6
        };
        $scope.scale = {
            0:"初创",
            1:"快速发展",
            2:"成熟"
        };
        $scope.field_type={
            'social':"社交",
            'e-commerce':"电子商务",
            'education':"教育",
            'health_medical':"健康医疗",
            'culture_creativity':"文化创意",
            'living_consumption':"生活消费",
            'hardware':"硬件",
            '020':"O2O",
            'others':"其他"
        };
        $scope.get_company_list = function(){
            $http.get(urls.api+"/account/userinfo/company/favor/list").
            success(function(data){
                if(data.error.code == 1){
                $scope.company_list = data.data;
		$scope.company_num = $scope.company_list.length;
                for(var i = 0; i < $scope.company_list.length; i ++){
                    $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                    $scope.company_list[i].scale_value = $scope.scale[$scope.company_list[i].scale];
                    $scope.company_list[i].field_type = $scope.field_type[$scope.company_list[i].field];
                    $scope.company_list[i].position_type_value = {};
                    for(var j = 0; j < $scope.company_list[i].position_type.length; j ++){
                        $scope.company_list[i].position_type_value[j] = $scope.position_type[$scope.company_list[i].position_type[j]];
                    }
                }
                }
                else{
                $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $scope.get_company_list();
    }]).
    controller('DT_InternPositionFavorCtrl',['$scope','$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_InternPositionFavorCtrl');
        $scope.positions = {};
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.field_type={
            'social':"社交",
            'e-commerce':"电子商务",
            'education':"教育",
            'health_medical':"健康医疗",
            'culture_creativity':"文化创意",
            'living_consumption':"生活消费",
            'hardware':"硬件",
            '020':"O2O",
            'others':"其他"
        };
        $scope.get_userInfo = function(){
            $scope.userinfo = {};
            $http.get(urls.api + "/account/userinfo/get").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.userinfo = data.data;
                        $scope.submitResume = {};
                        $scope.submitResume.position_id = $scope.position_id;
                        console.log($scope.userinfo.resume_id);
                        if($scope.userinfo.resume_id != undefined && $scope.userinfo.resume_id != null)
                        {
                            $scope.submitResume.resume_choice = 1;
                            $scope.resume_submitted = true;
//                            console.log("here");
                        }
                        else{
                            $scope.resume_submitted = false;
                        }
                    }
                    else{
                        console.log(data.error).message;
                    }
            });
       };
        $scope.get_positions = function(){
        $http.get(urls.api+"/account/userinfo/position/favor/list").
            success(function(data){
                if(data.error.code == 1){
                    $scope.positions = data.data;
                    for(var i = 0; i < $scope.positions.length; i ++){
                        $scope.positions[i].position_type_value = $scope.position_type[$scope.positions[i].position_type];
                        if($scope.positions[i].company.scale == 0){
                            $scope.positions[i].company.scale_value = "初创";
                        }
                        else if($scope.positions[i].company.scale == 1){
                            $scope.positions[i].company.scale_value = "快速发展";
                        }
                        else{
                            $scope.positions[i].company.scale_value = "成熟";
                        }
                        $scope.positions[i].company.field_type = $scope.field_type[$scope.positions[i].company.field];
            $scope.check_submit(i);
                    }
                }
                else{
                    console.log(data.error.message);
                }
        });
    };
    $scope.check_submit = function(index){
    $http.get(urls.api+"/position/"+$scope.positions[index]._id.$oid+"/check_submit").
            success(function(data){
                if(data.error.code == 1){
                    if(data.exist == true){
                        $scope.positions[index].submit_value = "已投递";
                        $scope.positions[index].resume_submitted = true;
                    }
                    else{
                        $scope.positions[index].submit_value = "投递简历";
                $scope.positions[index].resume_submitted = false;
                    }
                }
                else{
                    console.log(data.error.message);
                }
        });
    };
    $scope.get_userInfo();
    $scope.get_positions();
    $scope.submit = function(index) {
    	console.log($scope.positions[index]);
	if($scope.resume_submitted == true){
            $scope.submitResume.resume_choice = 1;
        }
	else{
	    $scope.submitResume.resume_choice = 3;
	}
	console.log("here");
        $csrf.set_csrf($scope.submitResume);
        $http.post(urls.api + "/position/"+$scope.positions[index]._id.$oid+"/submit", $.param($scope.submitResume)).
            success(function(data){
                if(data.error.code == 1){
                    $scope.positions[index].submit_value = "已投递";
                }
                else{
                    console.log(data.error.message);
                }
            });
        };
    $scope.complete_resume = function(){
        setTimeout(function(){window.location.href='/intern/resume'},2000);
        $('#myModal').modal('hide');

    };

    $scope.submit_all = function(){
    for(var i = 0; i < $scope.positions.length; i ++){
        $scope.submit(i);
    }
    };
  
    $scope.param = function(index){
	$scope.index = index;
    };

    }]).
    controller('DT_InternResumeViewCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService','Upload', 
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg,Upload){
        $scope.filename = "无简历附件";
        $scope.intern_info = {};
        $scope.edit_resume = function(){
            window.location.href = "/intern/resume/edit";
        };
        $scope.get_intern_info = function(){
            $http.get(urls.api+"/account/userinfo/get").
              success(function(data){
                if(data.error.code == 1){
                    $scope.intern_info = data.data;
                    $scope.have_resume_info = false;
                    if($scope.intern_info.real_name != undefined){
                        $scope.have_resume_info = true;
                    }
                    if($scope.intern_info.resume_name != undefined && $scope.intern_info.resume_id != undefined){
                        $scope.filename = $scope.intern_info.resume_name;
                    }
                }
                else{
                    $scope.error = $errMsg.format_error("",data.error);
                }
              });
        };
        $scope.get_intern_info();
    }]).
    controller('DT_InternResumeEditCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService','Upload', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg,Upload){
        console.log('DT_InternResumeCtrl');
        $scope.filename = "无简历附件";
        $scope.progressPercentage = 0;
        $scope.intern_info = {};
        $scope.get_intern_info = function(){
            $http.get(urls.api+"/account/userinfo/get").
              success(function(data){
                if(data.error.code == 1){
                    $scope.intern_info = data.data;
                    if($scope.intern_info.resume_name != undefined && $scope.intern_info.resume_id != undefined){
                        $scope.filename = $scope.intern_info.resume_name;
                    }
                }
                else{
                    $scope.error = $errMsg.format_error("",data.error);
                }
              });
        };
        $scope.get_intern_info();
        $scope.save_intern_info = function(){
            $csrf.set_csrf($scope.intern_info);
            $http.post(urls.api+"/account/userinfo/set", $.param($scope.intern_info)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.error = $errMsg.format_error("修改成功",data.error);
                        window.location.href="/intern/resume/view";
                    }
                    else{
                        $scope.error = $errMsg.format_error("",data.error);
                    }
                });
        };
        $scope.upload = function(file,file_t){
            var param = {
               "file_type": file_t,
               "description": $user.username(),
               "category": $user.username() + '_'+file_t
            };
            var headers = {
                   'X-CSRFToken': $csrf.val(),
                   'Content-Type': file.type
               };
            Upload.upload({
               url:urls.api+'/file/upload',
               data: param,
               headers:headers,
               file: file
            }).
            progress(function(evt){
                $scope.show_bar = true;
                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total)+"%";
                $('.progress-bar').css("width",$scope.progressPercentage);
                $scope.progress= 'progress: ' + $scope.progressPercentage + '% ' + evt.config.file.name;
            }).
            success(function(data, status, headers, config){
                if(data.error.code == 1){
                    $scope.intern_info.resume_name = config.file.name;
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data.data);
                    $scope.intern_info.resume_id = data.data;
		            $scope.filename = config.file.name;
                }
                else{
                    console.log(data.error.message);
                    $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
    }]).
    //company controllers
    controller('DT_RegEnterCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', 'ErrorService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg){
        console.log('DT_RegEnterCtrl');
    }]).
    controller('DT_CompanyResumeCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_CompanyResumeCtrl');
        $scope.company_id = $routeParams.company_id;
        //$scope.active_index = null;
        $scope.submit_list = [];
        $scope.chosed_index = -1;
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.search_params = {
          position_type:''
        };
        $scope.search_params = {
            "position_type":''
        };
        $scope.task = {
            'pageCount' : 1,
            'currentPage' : 1
        };
        $scope.param = {
            'page' : 1
        };
        $scope.show_right_bar = false;
        $scope.toggleRightBar = function(){
            $scope.show_right_bar = !$scope.show_right_bar;
        };
        $scope.get_submit_list = function(){
            var param = [];
            var param_data = $scope.param;
            if(param_data != null){
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
                for(var key in param_data) {
                    param.push(key + '=' + param_data[key]);
                }
                param = param.join('&');
                param = '?' + param;
            }
            $http.get(urls.api+"/account/company/submit/search"+param).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.submit_list = data.data;
                        $scope.task.pageCount = data.page_number;
                        if($scope.submit_list.length == 0){
                           if(param_data.hasOwnProperty('position_type')){
                                $scope.marked_words = "尚未有人投递 " + $scope.position_type[param_data.position_type]+" 相关职位";
                            }
                            else{
                               $scope.marked_words = "尚未有人投递简历";
                           }
                        }
                    }
                    else{
                        console.log(data.error.message);
                        // TODO
                        $scope.error = $errMsg.format_error('',data.error);
                    }
                });
        };
        $scope.get_submit_list();
        $scope.get_company_info = function(){
            $http.get(urls.api+"/account/company/"+$scope.company_id+"/detail").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.companyinfo = data.data;
                    }
                });
        };
        $scope.get_company_info();
        $scope.change = function(position_type){
            $scope.param.position_type = position_type;
            $scope.get_submit_list();
        };
        $scope.view_unprocessed = function(){
            $scope.param = {
                'page' : 1,
                'processed':false
            };
            $scope.search_params_position_type = '';
            $scope.get_submit_list();
        };

        $scope.view_interested = function(){
            //TODO: back-end url should be fixed
            $scope.param = {
                'page' : 1,
                'interested': true
            };
            $scope.search_params_position_type = '';
            $scope.get_submit_list();
        };

        $scope.process = function(index){
            if($scope.submit_list[index].process == true){
                return;
            }
            var param = {
                "username" : $scope.submit_list[index].username,
                "position_id":$scope.submit_list[index].position_id
            };
            $csrf.set_csrf(param);
            $http.post(urls.api+"/account/company/process_single", $.param(param)).
                success(function(data){
                    if(data.error.code == 1){
                        alert($scope.submit_list[index].position_id,$scope.submit_list[index].username);
                        console.log("OK");
                    }
                });
        };
        $scope.view_detail = function(index){
            $scope.intern_info = $scope.submit_list[index];
            $scope.process(index);
            if($scope.chosed_index == -1){
                $scope.chosed_index = index;
                $scope.toggle_show();
            }
            else{
                if($scope.chosed_index == index){
                    $scope.chosed_index = -1;
                    $scope.toggle_show();
                }
                else{
                    if($('#sideToggle').attr("checked") == "checked"){
                        $scope.chosed_index = index;
                        $scope.toggle_show();
                        setTimeout($scope.toggle_show,500);
                        $scope.show_right_bar = true;
                    }
                    else{
                        $scope.toggle_show();
                        $scope.chosed_index = index;
                    }
                }
            }
        };
        $scope.show = function(){};
        $scope.toggle_show = function(){
            if($('#sideToggle').attr("checked") == "checked"){
                $('#sideToggle').attr('checked',false);
                $scope.show_right_bar = false;
                $('aside').css({width:"0px"});
            }
            else{
                $('#sideToggle').attr("checked",true);
                $('aside').css({width:"600px"});
                $scope.show_right_bar = true;
            }
        };
        //$scope.close = false;
        $(document).on("click",function(e){
            //TODO
            //console.log($(e.target).attr('id')!="header" && $(e.target).attr('id')!="submit_div");
            //console.log($("#header"));
            //console.log($(e.target).attr('id'));
            if($(e.target).attr('className')!="view" && $(e.target).attr('className')!="resume" && $(e.target).attr('id')!="header" && $(e.target).attr('id')!="show_intern_info" && $(e.target).attr('id')!="submit_div" && $(e.target).attr('className')!="resume_name"){
                $scope.view_detail($scope.chosed_index);
            }
        });
    }]).
//    controller('DT_CompanyInfoCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','Upload','ErrorService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, Upload,$errMsg){
//        console.log('DT_CompanyInfoCtrl');
//        if ($user.username() == undefined){
//            window.location.href='/login';
//        };
//        $scope.company_id = "";
//        $scope.companyinfo = {};
//        $scope.company_id = '';
//        $scope.CEO = {
//            "m_position":"CEO"
//        };
//        //get company info
//        $scope.get_company_info = function(){
//            $http.get(urls.api+"/account/company/detail").
//                success(function(data){
//                    if(data.error.code == 1){
//                        $scope.companyinfo = data.data;
//                        $scope.company_id = data.data._id.$oid;
//                    }
//                });
//        };
//        $scope.get_company_info();
//
//        $scope.upload = function(file,file_t){
//            var param = {
//               "file_type":file_t,
//               "description":$scope.company_id + file_t,
//               "category":$scope.company_id + '_'+file_t
//            };
//            var headers = {
//                   'X-CSRFToken': $csrf.val(),
//                   'Content-Type': file.type
//               };
//            Upload.upload({
//               url:urls.api+'/file/upload',
//               data: param,
//               headers:headers,
//               file: file
//            }).
//            progress(function(evt){
//                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//                $scope.progress= 'progress: ' + progressPercentage + '% ' + evt.config.file.name;
//            }).
//            success(function(data, status, headers, config){
//                if(data.error.code == 1){
//                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data.data);
//                    if(file_t == 'logo'){
//                        $scope.companyinfo.logo_id = data.data
//                    }
//                    else{
//                        $scope.CEO.m_avatar_id = data.data
//                    }
//                }
//                else{
//                    console.log(data.error.message);
//                    $scope.error = $errMsg.format_error('',data.error);
//                }
//            });
//        };
//        $scope.create_CEO = function(){
//        $csrf.set_csrf($scope.CEO);
//        $http.post(urls.api+'/account/member/create',$.param($scope.CEO)).
//        success(function(data){
//            if(data.error.code == 1){
//
//            }
//            else{
//                $scope.error = $errMsg.format_error('',data.error);
//            }
//        });
//    };
//        $scope.create_company = function(){
//            $csrf.set_csrf($scope.companyinfo);
//            $http.post(urls.api+'/account/company/'+$scope.company_id+'/set', $.param($scope.companyinfo)).
//                success(function(data){
//                    if(data.error.code == 1){
//                        $scope.create_CEO();
//                        window.location.href='/company/'+$scope.company_id+ '/infodetail';
//                    }
//                    else{
//                        console.log(data.error.message);
//                        $scope.error = $errMsg.format_error('',data.error);
//                    }
//            });
//        };
//        $scope.showError = function(ngModelController,error){
//            return ngModelController.$error[error];
//        };
//    }]).
//    controller('DT_CompanyInfoDetailCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService','Upload', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg,Upload){
//        console.log('DT_CompanyInfoDetailCtrl');
//        $scope.tag_list = ["技能培训","扁平管理","可转正","弹性工作","定期出游","地铁周边","股票期权","水果零食","正餐补助","班车接送"];
//        $scope.tags = [
//            {
//                "chosed":false,
//                "value" :"技能培训"
//            },
//            {
//                "chosed":false,
//                "value" :"扁平管理"
//            },
//            {
//                "chosed":false,
//                "value" :"可转正"
//            },
//            {
//                "chosed":false,
//                "value" :"弹性工作"
//            },
//            {
//                "chosed":false,
//                "value" :"定期出游"
//            },
//            {
//                "chosed":false,
//                "value" :"地铁周边"
//            },
//            {
//                "chosed":false,
//                "value" :"股票期权"
//            },
//            {
//                "chosed":false,
//                "value" :"水果零食"
//            },
//            {
//                "chosed":false,
//                "value" :"正餐补助"
//            },
//            {
//                "chosed":false,
//                "value" :"班车接送"
//            }
//        ];
//        $scope.company_id = $routeParams.company_id;
//        $scope.delete_index = 0;
//        $scope.get_company_info = function(){
//            $http.get(urls.api+"/account/company/"+$scope.company_id+"/detail").
//                success(function(data){
//                    if(data.error.code == 1){
//                        $scope.companyinfo = data.data;
//                        if(data.data.company_description == undefined)
//                            $scope.old_company_description = "";
//                        else
//                            $scope.old_company_description = data.data.company_description;
//                        if(data.data.team_description == undefined)
//                            $scope.old_team_description = "";
//                        else
//                            $scope.old_team_description = data.data.team_description;
//                    }
//                });
//            };
//        $scope.companyinfo = {};
//        $scope.get_company_info();
//        $scope.get_member_list = function(){
//        $http.get(urls.api+"/account/member/"+$scope.company_id+"/list").
//            success(function(data){
//                if(data.error.code == 1){
//                    $scope.member_list = data.data;
//                    $scope.member_number = data.data.length;
//                }
//                else{
//                    $scope.error = $errMsg.format_error('',data.error);
//                }
//            });
//        };
//        $scope.member_list=[];
//        $scope.get_member_list();
//
//        $scope.get_financing_list = function(){
//            $http.get(urls.api+"/account/financing/"+$scope.company_id+"/list").
//                success(function(data){
//                if(data.error.code == 1){
//                    $scope.financing_list = data.data;
//                }
//                else{
//                    $scope.error = $errMsg.format_error('',data.error);
//                }
//            });
//        };
//        $scope.financing_list=[];
//        $scope.get_financing_list();
//        $scope.old_team_description = "";
//        $scope.old_company_description = "";
//
//        $scope.add_tag = function(){
//            $scope.welfare_tags.append({
//                "chosed":true,
//                "value" :$scope.tag_added
//            });
//
//        };
//        $scope.canAdd = function(ngModelController){
//            return (ngModelController.$invalid && ngModelController.$dirty) ||  ngModelController.$pristine;
//        };
//
//        $scope.save_team_description = function(){
//            $scope.edit_team_intro=false;
//            $scope.old_team_description = $scope.companyinfo.team_description;
//            var param = {
//                "team_description":$scope.companyinfo.team_description,
//                "csrfmiddlewaretoken" : $csrf.val()
//            };
//            $http.post(urls.api+"/account/company/"+$scope.company_id+"/set", $.param(param)).
//               success(function(data){
//               if(data.error.code == 1){
//                    $scope.error = $errMsg.format_error("保存成功",data.error);
//               }
//               else{
//                   $scope.error = $errMsg.format_error('',data.error);
//               }
//            });
//        };
//        $scope.cancel_edit = function(){
//            $scope.edit_team_intro=false
//            $scope.companyinfo.team_description = $scope.old_team_description;
//        };
//        $scope.company_cancel_edit = function(){
//            $scope.edit_company_intro=false
//            $scope.companyinfo.company_description = $scope.old_company_description;
//        };
//        $scope.save_company_description = function(){
//            $scope.edit_company_intro=false;
//            $scope.old_company_description = $scope.companyinfo.company_description;
//            var param = {
//                "company_description":$scope.companyinfo.company_description,
//                "csrfmiddlewaretoken" : $csrf.val()
//            };
//            $http.post(urls.api+"/account/company/"+$scope.company_id+"/set", $.param(param)).
//               success(function(data){
//               if(data.error.code == 1){
//                    $scope.error = $errMsg.format_error("保存成功",data.error);
//               }
//               else{
//                   $scope.error = $errMsg.format_error('',data.error);
//               }
//            });
//        };
//         $scope.upload = function(file,file_t,category){
//            var param = {
//               "file_type":file_t,
//               "description":$scope.company_id + file_t,
//               "category":$scope.company_id + '_'+category
//            };
//            var headers = {
//                   'X-CSRFToken': $csrf.val(),
//                   'Content-Type': file.type
//            };
//            Upload.upload({
//               url:urls.api+'/file/upload',
//               data: param,
//               headers:headers,
//               file: file
//            }).
//            success(function(data, status, headers, config){
//                if(data.error.code == 1){
//                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data.data);
//                    if(file_t == 'memberavatar'){
//                        $scope.member_add.m_avatar_id = data.data;
//                    }
//                    else if(file_t == 'logo'){
//                        $scope.companyinfo.logo_id = data.data;
//                    }
//                    else if(file_t == 'qrcode'){
//                         $scope.companyinfo.qrcode_id = data.data;
//                    }
//                }
//                else{
//                    console.log(data.error.message);
//                    $scope.error = $errMsg.format_error('',data.error);
//                }
//            });
//        };
//        $scope.add_member = function(){
//            $csrf.set_csrf($scope.member_add);
//            $http.post(urls.api+'/account/member/create',$.param($scope.member_add)).
//                success(function(data){
//                    if(data.error.code == 1){
//                        $scope.get_member_list();
//                        $scope.member_add = null;
//                        $scope.avatar = null;
//                        $('#myModal').modal('hide');
//                    }
//                    else{
//                        $scope.error = $errMsg.format_error('',data.error);
//                    }
//                });
//        };
//        $scope.get_delete_index = function($index){
//            $scope.delete_index = $index;
//        };
//        $scope.delete_member = function(index){
//        var param = {
//            "csrfmiddlewaretoken" : $csrf.val()
//        };
//
//        $http.post(urls.api+"/account/member/"+$scope.member_list[index]._id.$oid+"/delete", $.param(param)).
//            success(function(data){
//                if(data.error.code == 1){
//
//                    $http.post(urls.api+"/file/" + $scope.member_list[index].m_avatar_id + "/delete", $.param(param)).
//                        success(function(data){
//                            if(data.error.code == 1){
//                                $scope.get_member_list();
//                                $('#delete_member').modal('hide');
//                            }
//                            else{
//                                $scope.error = $errMsg.format_error('',data.error);
//                            }
//                        });
//                }
//                else{
//                    $scope.error = $errMsg.format_error('',data.error);
//                }
//            });
//        };
//        $scope.add_financing = function(){
//            $csrf.set_csrf($scope.financing_add);
//            $http.post(urls.api+'/account/financing/create',$.param($scope.financing_add)).
//            success(function(data){
//                if(data.error.code == 1){
//                    $scope.get_financing_list();
//                    $scope.financing_add = null;
//                    $('#add_financing').modal('hide');
//                }
//                else{
//                    $scope.error = $errMsg.format_error('',data.error);
//                }
//            });
//        };
//        $scope.delete_financing = function(index){
//            var param = {
//                "csrfmiddlewaretoken" : $csrf.val()
//            };
//            $http.post(urls.api+"/account/financing/"+$scope.financing_list[index]._id.$oid+"/delete", $.param(param)).
//                success(function(data){
//                    if(data.error.code == 1){
//                        $scope.get_financing_list();
//                        $('#delete_financing').modal('hide');
//                    }
//                    else{
//                        $scope.error = $errMsg.format_error('',data.error);
//                    }
//                });
//        };
//        $scope.save_company_info = function(){
//            $scope.companyinfo.welfare_tags = '';
//            var tag_number = 0;
//            for(var i=0; i<$scope.tags.length; i++){
//                if($scope.tags[i].chosed == true){
//                    $scope.companyinfo.welfare_tags += $scope.tags[i].value;
//                    $scope.companyinfo.welfare_tags += ',';
//                    tag_number++;
//                }
//            }
//            if(tag_number == 0){
//                $scope.error = $errMsg.format_error("至少选择一个福利标签",{code:"-1"});
//                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
//                return;
//            }
//            else if(tag_number > 5){
//                $scope.error = $errMsg.format_error("福利标签数不能超过5个",{code:"-1"});
//                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
//                return;
//            }
//            $scope.companyinfo.welfare_tags = $scope.companyinfo.welfare_tags.substring(0,$scope.companyinfo.welfare_tags.length-1);
//            $csrf.set_csrf($scope.companyinfo);
//            $http.post(urls.api+"/account/company/"+$scope.company_id+"/set", $.param($scope.companyinfo)).
//                success(function(data){
//                    if(data.error.code == 1){
//                        $scope.error = $errMsg.format_error("保存公司信息成功",data.error);
//                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
//                    }
//                    else{
//                        $scope.error = $errMsg.format_error('',data.error);
//                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
//                    }
//                });
//        };
//    }]).
    controller('DT_PositionDetailCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_PositionDetailCtrl');
        $scope.role = $user.role();
        $scope.username = $user.username();
        $scope.position_id = $routeParams.position_id;
        $scope.img2_src = "/static/image/icon/weixin-01.png";
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.scale = {
            0:"初创",
            1:"快速发展",
            2:"成熟"
        };
        $scope.field_type={
            'social':"社交",
            'e-commerce':"电子商务",
            'education':"教育",
            'health_medical':"健康医疗",
            'culture_creativity':"文化创意",
            'living_consumption':"生活消费",
            'hardware':"硬件",
            '020':"O2O",
            'others':"其他"
        };

        $scope.stage = {
            "seed" :"种子轮",
            "angel":"天使轮",
            "A":"A轮",
            "B":"B轮",
            "C":"C轮",
            "D_plus":"D及以上轮"
        };
        $scope.amount = {
            "ten":"十万级",
            "hundred":"百万级",
            "thousand":"千万级",
            "thousand_plus":"亿级"
        };
        $scope.check_favor_position = function(){
            $http.get(urls.api+"/account/userinfo/"+$scope.position_id+"/check_favor_position").
            success(function(data){
                if(data.error.code == 1){
                    $scope.favor_exist = data.data.exist;
                    if($scope.favor_exist == true){
                        $scope.post_value = "已收藏";
                         $scope.img_src = "/static/image/icon/shoucangdianliang-01.png";
                    }
                    else{
                        $scope.post_value = "收藏";
                     $scope.img_src = "/static/image/icon/shoucang-01.png";
                    }
                }
                else{
                    console.log(data.error.message);
                }
            });
        };
        $scope.change_in = function(){
            if(!$scope.favor_exist)
                $scope.img_src = "/static/image/icon/shoucang2-01.png";
        };
        $scope.change_out = function(){
            if(!$scope.favor_exist)
                $scope.img_src = "/static/image/icon/shoucang-01.png";
        };
        $scope.change2_in = function(){
            $scope.img2_src="/static/image/icon/weixin2-01.png";
        };
        $scope.change2_out = function(){
            $scope.img2_src="/static/image/icon/weixin-01.png";
        };
    $scope.skip = function(){
        window.location.href = "/company/" + $scope.company_id + "/detail";
    };
    $scope.get_position_detail = function(){
        $http.get(urls.api+"/position/"+ $scope.position_id +"/get_with_company").
        success(function(data){
            if(data.error.code == 1){
                $scope.position = data.data;
                $scope.position.position_type_value = $scope.position_type[$scope.position.position_type];
                $scope.position.company.field_type = $scope.field_type[$scope.position.company.field];
                $scope.position.company.scale_value = $scope.scale[$scope.position.company.scale];
                $scope.position.company.position_number = $scope.position.company.positions.length;
                if($scope.position.company.homepage.indexOf("http://") == -1 && $scope.position.company.homepage.indexOf("https://") == -1)
                    $scope.position.company.homepage = "http://" + $scope.position.company.homepage;
                if($scope.position.status == "open")
                {
                    $scope.position.status_value = "职位在招";
                }
                else{
                    $scope.position.status_value = "职位关闭";
                }
                $scope.position.company.position_type_value = {};
                $scope.company_id = $scope.position.company._id.$oid;
                $scope.get_financing_list();

                for(var i=0;i<$scope.position.company.position_type.length;i++){
                    $scope.position.company.position_type_value[i] = $scope.position_type[$scope.position.company.position_type[i]];
                    console.log( $scope.position_type[$scope.position.company.position_type[i]]);
                }
            }
            else{
                console.log(data.error.message)
            }
        });
    };
                                      
    $scope.get_financing_list = function(){
        $http.get(urls.api+"/account/financing/"+$scope.company_id+"/list").
        success(function(data){
            if(data.error.code == 1){
                $scope.financing_list = data.data;
                for(var i=0;i<$scope.financing_list.length;i++){
                    $scope.financing_list[i].stage_value = $scope.stage[$scope.financing_list[i].stage];
                    $scope.financing_list[i].amount_value = $scope.amount[$scope.financing_list[i].amount];
                }
            }
            else{
                $scope.error = $errMsg.format_error('',data.error);
            }
        });
    };
    $scope.check_favor_position();
    $scope.get_position_detail();
                                       
    $scope.userinfo = {};
    $http.get(urls.api + "/account/userinfo/get").
        success(function(data){
            if(data.error.code == 1){
                $scope.userinfo = data.data;
                $scope.submitResume = {};
                $scope.submitResume.position_id = $scope.position_id;
                console.log($scope.userinfo.resume_id);
                if($scope.userinfo.resume_id != undefined && $scope.userinfo.resume_id != null)
                {
                    $scope.submitResume.resume_choice = 1;
                    $scope.resume_submitted = true;
                    console.log("here");
                }
                else{
                    $scope.resume_submitted = false;
                }
             }
            else{
                console.log(data.error.message);
            }
        });
    
    $http.get(urls.api+"/position/"+$scope.position_id+"/check_submit").
        success(function(data){
            if(data.error.code == 1){
                if(data.exist == true){
                    $scope.submit_value = "已投递";
                    $scope.post_submitted = true;
        }
        else{
        $scope.submit_value = "投递简历";
        $scope.post_submitted = false;
        }
    }
    else{
        console.log(data.error.message);
    }
    });
	$scope.post = function(){
	    if($scope.favor_exist == false){
		$scope.submitFavor = {};
           	$scope.submitFavor.position_id = $scope.position_id;
            	$csrf.set_csrf($scope.submitFavor);
	    	$http.post(urls.api + "/position/"+$scope.position_id+"/userlikeposition", $.param($scope.submitFavor)).
		    success(function(data){
		    	$scope.post_value = "已收藏";
			$scope.favor_exist = true;
                    $scope.img_src = "/static/image/icon/shoucangdianliang-01.png";
		});
	    }
	    else{
		$scope.submitUnFavor = {};
		$scope.submitUnFavor.position_id = $scope.position_id;
		$csrf.set_csrf($scope.submitUnFavor);
		$http.post(urls.api+"/position/"+$scope.position_id+"/userunlikeposition", $.param($scope.submitUnFavor)).
		    success(function(data){
			$scope.post_value = "收藏";
			$scope.favor_exist = false;
            $scope.img_src = "/static/image/icon/shoucang-01.png";
		    });
	    }
		
	};
    $scope.check_userinfo = function(){
        $http.get(urls.api+"/account/userinfo/check").
            success(function(data){
                if(data.complete == "True")
                    $scope.userinfo_complete = true;
                else
                    $scope.userinfo_complete = false;
        });
    };
	$scope.submit = function(){
	    if($scope.resume_submitted == true){
	    	$scope.submitResume.resume_choice = 1;
	    }
	    else{
		$scope.submitResume.resume_choice = 3;
	    }
	    console.log("here");
            $csrf.set_csrf($scope.submitResume);
            $http.post(urls.api + "/position/"+$scope.position_id+"/submit", $.param($scope.submitResume)).
            	success(function(data){
           	    if(data.error.code == 1){
               		$scope.submit_value = "已投递";
                    $scope.post_submitted = true;
            	    }
                    else{
               		console.log(data.error.message);
           	    }
        }); 
    };
    
    $scope.complete_resume = function(){
         setTimeout(function(){window.location.href='/intern/resume/edit'},300);
         $('#myModal').modal('hide');
    };
    if($user.username()&&$user.role()==0){
         $scope.check_userinfo();
    }
    }]).
    controller('DT_FeedbackCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_FeedbackCtrl');
    }]).
    controller('DT_AboutCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_AboutCtrl');
    }]).
    controller('DT_InformationCtrl',['$scope', '$http', 'CsrfService', 'urls','$rootScope','UserService',
      function($scope, $http, $csrf, urls,$rootScope,$user){
      console.log('DT_InformationCtrl');
      $scope.infos = {};
      $scope.info_user = function(){
        $csrf.set_csrf($scope.infos);
        $http.post(urls.api+"/account/userinfo/set",$.param($scope.infos)).
          success(function(data){
            if (data.error.code == 1){
              console.log("Set information successfully!");
              //alert("个人信息设置成功");
              setTimeout(function(){window.location.href='/'},100);
            }
            else{
              console.log(data.error.message);
            }
          });
      };

      $scope.is_tsinghua == $rootScope.is_tsinghua;
      $scope.username = $user.username();
      if($scope.is_tsinghua == true)
        $scope.infos.university = "清华大学";
    }]).
    controller('DT_CompanyPositionManageCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_CompanyPositionManageCtrl');
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.company_id = $routeParams.company_id;
        $scope.position_list = {};
        $scope.close_position = function(index){
            $http.get(urls.api+"/position/"+$scope.position_list[index]['_id']['$oid']+"/close").
              success(function(data){
                if(data.error.code==1){
                  console.log('关闭职位成功');
                  $scope.get_position_list();
                }
                else{
                  $scope.error = $errMsg.format_error('',data.error);
                }
              });
        };
        $scope.delete_position = function(index){
            $http.get(urls.api+"/position/"+$scope.position_list[index]['_id']['$oid']+"/delete").
              success(function(data){
                    if(data.error.code == 1){
                        console.log('删除职位成功');
                        $scope.get_position_list();
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                    }
                });
        };
        $scope.get_position_list = function(){
            $http.get(urls.api+"/position/company/"+$scope.company_id+"/list").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.position_list = data.data;
                        for(var i=0; i<$scope.position_list.length;i++){
                            $scope.position_list[i].position_type_value = $scope.position_type[$scope.position_list[i].position_type];
                        }
                    }
                    else{
                        alert(data.error.message);
                    }
                });
        };
        $scope.get_position_list();
        
    }]).
    controller('DT_CompanyPositionEditCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg){
        console.log('DT_CompanyPositionEditCtrl');
        $scope.company_id = $routeParams.company_id;
        $scope.position_id = $routeParams.position_id;
        $scope.get_company_info = function(){
            $http.get(urls.api+"/account/company/"+$scope.company_id+"/detail").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.companyinfo = data.data;
                        if($scope.companyinfo.info_complete == false){
                            $scope.error = $errMsg.format_error("公司信息不完整，不能发布职位",{code:"-1"});
                            setTimeout(function(){window.location.href="/company/"+$scope.company_id+"/create/first"},2000);
                        }
                    }
                });
            };
        $scope.get_company_info();
        $scope.submit_position = function(){
            if($scope.position_id == 'new'){
                $scope.create_position();
            }
            else{
                $scope.set_position();
            }
        }
        $scope.create_position = function(){
            $scope.disable_submit = true;
            $csrf.set_csrf($scope.position);
            if($scope.position.end_time != ''){
                $scope.position.end_time = $filter('date')($scope.position.end_time, 'yyyy-MM-dd');
            }
            if($scope.position.part_or_full_time == 1){
                $scope.position.days_per_week = 5;
            }
            $scope.submit_loading = true;
            $http.post(urls.api+"/position/create", $.param($scope.position)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.error = $errMsg.format_error('发布职位成功',data.error);
                        //setTimeout(function(){window.location.href='/company/' + $scope.company_id + '/position/manage'},1500);
                        setTimeout(function(){window.location.href='/position/list'},1500);
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                    }
                    $scope.disable_submit = false;
                    $scope.submit_loading = false;
                });
        };
        $scope.set_position = function(){
            $scope.disable_submit = true;
            $csrf.set_csrf($scope.position);
            if($scope.position.end_time != ''){
                $scope.position.end_time = $filter('date')($scope.position.end_time, 'yyyy-MM-dd');
            }
            if($scope.position.part_or_full_time == 1){
                $scope.position.days_per_week = 5;
            }
            $scope.submit_loading = true;
            $http.post(urls.api+"/position/"+$scope.position_id+"/set", $.param($scope.position)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.error = $errMsg.format_error('修改职位成功',data.error);
                        setTimeout(function(){window.location.href='/company/' + $scope.company_id + '/position/manage'},1500);
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                    }
                    $scope.disable_submit = false;
                    $scope.submit_loading = false;
                });

        };
        $scope.get_position_detail = function(){
            $http.get(urls.api+"/position/"+$scope.position_id+"/get").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.position = data.data;
                        $scope.position.end_time = $filter('date')($scope.position.end_time.$date, 'yyyy-MM-dd');
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                    }
                });
        };
        if($scope.position_id == 'new'){
            $scope.position = {};
            $scope.submit = $scope.create_position;
            $scope.title = "发布新职位";
        }
        else{
            $scope.get_position_detail();
            $scope.submit = $scope.set_position;
            $scope.title = "编辑职位";
        }
    }]).
    controller('DT_CompanyListCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService', '$rootScope',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg, $rootScope){
        console.log('DT_CompanyListCtrl');
        $scope.company_list = {};
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.scale = ["初创","快速发展","成熟"];
        $scope.field_type={
            'social':"社交",
            'e-commerce':"电子商务",
            'education':"教育",
            'health_medical':"健康医疗",
            'culture_creativity':"文化创意",
            'living_consumption':"生活消费",
            'hardware':"硬件",
            'O2O':"O2O",
            'others':"其他"
        };
        $scope.param = {
            field: null,
            pageCount: 1,
            currentPage: 1
        };
        $scope.scale_change = false;
        $scope.field_change = false;
        $scope.auth_organization_change = false;
        $scope.filed_choose = "行业领域";
        $scope.scale_choose = "规模|融资论述";
        $scope.auth_choose = "投资机构认证";
        $scope.choose = function(field){
            if($scope.param.field == field){
                $scope.field_change = false;
            }
            else{
                $scope.field_change = true;
                $scope.param.field = field;
                if(field != null)
                    $scope.filed_choose = $scope.field_type[field];
                else
                    $scope.filed_choose = "行业领域";
            }
            $scope.get_company_list($scope.param);
        };
        $scope.choose_scale = function(scale){
            if($scope.param.scale == scale){
                $scope.scale_change = false;
            }
            else{
                $scope.param.scale = scale;
                $scope.scale_change = true;
                if(scale != null)
                    $scope.scale_choose = $scope.scale[scale];
                else
                    $scope.scale_choose = "规模|融资论述";
            }
            $scope.get_company_list($scope.param);
        };
        $scope.choose_auth_organization = function(auth_organization){
            if($scope.param.auth_organization == auth_organization){
                $scope.auth_organization_change = false;
            }
            else{
                $scope.param.auth_organization = auth_organization;
                $scope.auth_organization_change = true;
                if(auth_organization != null)
                    $scope.auth_choose = auth_organization;
                else
                    $scope.auth_choose = "投资机构认证";
            }
            $scope.get_company_list($scope.param);
        };
        $scope.get_company_list = function(data){
            $scope.loading = true;
            var param = '';
            if(data != null){
                param = '?';
                if(data.hasOwnProperty('page')){
                    if($scope.scale_change || $scope.field_change || $scope.auth_organization_change)
                    {
                        $scope.scale_change = false;
                        $scope.field_change = false;
                        $scope.auth_organization_change = false;
                        param += "page=" + 1;
                        $scope.param.currentPage = 1;
                    }
                    else if(data.page == 0)
                        param += "page=1";
                    else
                        param += "page="+data.page;
                }
                else{
                    param += "page=" + 1;
                }
                if(data.field != undefined && data.field != null){
                    param += "&fields=" + data.field;
                }
                if(data.scale != undefined && data.scale != null){
                    param += "&scale=" + data.scale;
                }
                if(data.hasOwnProperty('auth_organization') && data.auth_organization != null){
                    param += "&auth_organization=" + data.auth_organization;
                }
            }
            $http.get(urls.api+"/account/company/list"+param).
                success(function(data){
                $scope.param.pageCount = data.page_number;
                if(data.error.code == 1){
                    $scope.company_list = data.data;
                    for(var i=0;i<$scope.company_list.length;i++){
                        $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                        $scope.company_list[i].scale_value = $scope.scale[$scope.company_list[i].scale];
                        $scope.company_list[i].field_type = $scope.field_type[$scope.company_list[i].field];
                        $scope.company_list[i].position_type_value = {};
                        for(var j = 0; j < $scope.company_list[i].position_type.length; j ++){
                            $scope.company_list[i].position_type_value[j] = $scope.position_type[$scope.company_list[i].position_type[j]];
                        }
                    }
                }
                else{
                     $scope.error = $errMsg.format_error('',data.error);
                }
                $scope.loading = false;
            });
        };

        //记录页面情况
        document.body.onscroll = function record_position(){
            $rootScope.company_list_position = document.body.scrollTop;
            //alert('scroll1');
        };
        //换页
        $scope.selectPage = function(page){
            $scope.param.page = page;
            $rootScope.company_list_param_cachce = $scope.param;
            $scope.get_company_list($scope.param);
            document.body.scrollTop = 0;
        };
        if($rootScope.company_list_param_cachce != undefined)
        {
            $scope.param = $rootScope.company_list_param_cachce;
            $scope.selectPage($rootScope.company_list_param_cachce.page);
            document.body.scrollTop = $rootScope.company_list_position;
        }
        else
            $scope.selectPage(1);

        //控制左边筛选框的位置
        $scope.field = false;
        $scope.scale_show = false;
        $scope.auth = false;
        $scope.show_field = function(){
            $scope.field = true;
            setTimeout(function(){
                if($scope.field)
                setTimeout(function(){
                    if($scope.field)
                        $(".field-list").slideDown("fast");
                },170);
            },170);
        };
        $scope.hide_field = function(){
                $(".field-list").slideUp("fast");
                $scope.field = false;
        };
        $(".company-field").mouseenter($scope.show_field);
        $(".company-field").mouseleave($scope.hide_field);

        $scope.show_scale = function(){
            setTimeout(function(){
                if($scope.scale_show)
                setTimeout(function(){
                if($scope.scale_show)
                    $(".scale-list").slideDown("fast");
                },170);
            },170);
            $scope.scale_show = true;
        };
        $scope.hide_scale = function(){
                $(".scale-list").slideUp("fast");
                $scope.scale_show = false;
        };
        $(".company-scale").mouseenter($scope.show_scale);
        $(".company-scale").mouseleave($scope.hide_scale);

        $scope.show_auth = function(){
            setTimeout(function(){
                if($scope.auth)
                setTimeout(function(){
                if($scope.auth)
                    $(".organization-list").slideDown("fast");
                },170);
            },170);
            $scope.auth = true;
        };
        $scope.hide_auth = function(){
                $(".organization-list").slideUp("fast");
            $scope.auth = false;
        };
        $(".company-auth").mouseenter($scope.show_auth);
        $(".company-auth").mouseleave($scope.hide_auth);

    }]).
    controller('DT_CompanyDetailCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errorMsg){
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
        $scope.img2_src="/static/image/icon/weixin-01.png";
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.scale = {
            0:"初创",
            1:"快速发展",
            2:"成熟"
        };
        $scope.field_type={
            'social':"社交",
            'e-commerce':"电子商务",
            'education':"教育",
            'health_medical':"健康医疗",
            'culture_creativity':"文化创意",
            'living_consumption':"生活消费",
            'hardware':"硬件",
            'O2O':"O2O",
            'others':"其他"
        };

        $scope.stage = {
            "seed" :"种子轮",
            "angel":"天使轮",
            "A":"A轮",
            "B":"B轮",
            "C":"C轮",
            "D_plus":"D及以上轮"
        };
        $scope.amount = {
            "ten":"十万级",
            "hundred":"百万级",
            "thousand":"千万级",
            "thousand_plus":"亿级"
        };
        $scope.tab1_click = function(){
            $scope.tab1 = true;
            $scope.tab2 = false;
        };
        $scope.tab2_click = function(){
            $scope.tab1 = false;
            $scope.tab2 = true;
        };
        $scope.position_detail = function($index){
            window.location.href = "/position/"+$scope.company.positions[$index].$oid+"/detail";
        };
        $scope.check_favor_company = function(){
            $http.get(urls.api+"/account/userinfo/"+$scope.company_id+"/check_favor_company").
                success(function(data){
                if(data.error.code == 1){
                    if(data.data.exist == true){
                        $scope.favored = true;
                        $scope.img_src = "/static/image/icon/shoucangdianliang-01.png";
                    }
                    else{
                        $scope.favored = false;
                        $scope.img_src = "/static/image/icon/shoucang-01.png";
                    }
                }
                else{
                    $scope.error = $errorMsg.format_error('',data.error);
                }
            });
        };
        $scope.change_in = function(){
            $scope.img_src = "/static/image/icon/shoucang2-01.png";
        };
        $scope.change_out = function(){
            $scope.img_src = "/static/image/icon/shoucang-01.png";
        };
        $scope.change2_in = function(){
            $scope.img2_src="/static/image/icon/weixin2-01.png";
        };
        $scope.change2_out = function(){
            $scope.img2_src="/static/image/icon/weixin-01.png";
        };
        $scope.get_company = function(){
            $http.get(urls.api+"/account/company/" + $scope.company_id + "/detail_with_positions").
              success(function(data,status,headers,config){
                console.log(headers('Content-Type'));
                if(data.error.code == 1){
                    $scope.company = data.data;
                    if($scope.company.homepage.indexOf("http://") == -1 && $scope.company.homepage.indexOf("https://") == -1)
                        $scope.company.homepage = "http://" + $scope.company.homepage;
                    $scope.company.position_number = $scope.company.positions.length;
                    $scope.company.scale_value = $scope.scale[$scope.company.scale];
                    $scope.company.field_type = $scope.field_type[$scope.company.field];
                      $scope.company.position_type_value = {};
                    for(var i=0;i<$scope.company.position_type.length;i++){
                      $scope.company.position_type_value[i] = $scope.position_type[$scope.company.position_type[i]];
                    }
                      for(var i=0;i<$scope.company.position_number;i++){
                        $scope.company.position_list[i].position_type_value = $scope.position_type[$scope.company.position_list[i].position_type]
                      }
                }
                else{
                    $scope.error = $errMsg.format_error("",data.error);
                }
                });
        };
        $scope.get_member_list = function(){
        $http.get(urls.api+"/account/member/"+$scope.company_id+"/list").
            success(function(data){
                if(data.error.code == 1){
                    $scope.member_list = data.data;
                    $scope.member_number = data.data.length;
                }
                else{
                    $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $scope.get_financing_list = function(){
            $http.get(urls.api+"/account/financing/"+$scope.company_id+"/list").
                success(function(data){
                if(data.error.code == 1){
                    $scope.financing_list = data.data;
                    for(var i=0;i<$scope.financing_list.length;i++){
                        $scope.financing_list[i].stage_value = $scope.stage[$scope.financing_list[i].stage];
                        $scope.financing_list[i].amount_value = $scope.amount[$scope.financing_list[i].amount];
                    }
                }
                else{
                    $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $scope.get_financing_list();
        $scope.get_member_list();
        $scope.get_company();
        $scope.check_favor_company();
        $scope.favor = function(){
            $scope.param = {
                "csrfmiddlewaretoken" : $csrf.val()
            };
            $http.post(urls.api + "/account/company/"+$scope.company_id+"/like", $.param($scope.param)).
            success(function(data){
                if(data.error.code == 1){
                    $scope.favored = true;
                    $scope.img_src = "/static/image/icon/shoucangdianliang-01.png"
                }
                else{
                    $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $scope.unfavor = function(){
            $scope.param = {
                "csrfmiddlewaretoken" : $csrf.val()
            };
            $http.post(urls.api + "/account/company/"+$scope.company_id+"/unlike", $.param($scope.param)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.favored = false;
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                    }
                });
        };
    }]).
    controller('DT_CompanyNoCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg){
        console.log('DT_CompanyNoCtrl');
        $scope.company_id = $routeParams.company_id;
    }]).
    controller('DT_ResizeImgCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService','Upload',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg,Upload){
        //$rootScope.loading = false;
    }]).
    controller('DT_CompanyTestCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService','Upload','ImgResizeService',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg,Upload, $imgResize){
        console.log('DT_CompanyTestCtrl');
        
        $scope.company_id = $routeParams.company_id;
        $scope.add_member_flag = false;
        $scope.member_add = {};
        $scope.member_list = [];
        $scope.show_member_card = function(){
            $scope.add_member_flag = true;
        };
        $scope.get_member_list = function(){
            $http.get(urls.api+"/account/member/"+$scope.company_id+"/list").
            success(function(data){
                if(data.error.code == 1){
                    $scope.member_list = data.data;
                    $scope.member_number = data.data.length;
                }
                else{
                    $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $scope.get_member_list();
        $scope.cancer_add = function(){
            $scope.add_member_flag = false;
            $scope.member_add = {};
            $('#addMember').modal('hide');
            $scope.avatar = null;
        };
        $scope.save_member = function(){
            if(!$scope.member_add.hasOwnProperty('m_avatar_id')){
                $scope.error = $errMsg.format_error("请上传成员头像",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            $csrf.set_csrf($scope.member_add);
            var request_url;
            if($scope.edit == false){
                request_url = urls.api+'/account/member/create';
            }
            else{
                request_url = urls.api+'/account/member/'+$scope.member_list[$scope.index]._id['$oid']+'/set';
            }
            $http.post(request_url,$.param($scope.member_add)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.get_member_list();
                        $scope.member_add = {};
                        $scope.avatar = undefined;
                        $('#addMember').modal('hide');
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                    }
                });
        };
        $scope.delete_modal = function(index){
            $scope.delete_index = index;
            $('#delete_member').modal('show');
        };
        $scope.delete_member = function(index){
            var param = {
                "csrfmiddlewaretoken" : $csrf.val()
            };
            $http.post(urls.api+"/account/member/"+$scope.member_list[index]._id.$oid+"/delete", $.param(param)).
                success(function(data){
                    if(data.error.code == 1){
                        $http.post(urls.api+"/file/" + $scope.member_list[index].m_avatar_id + "/delete", $.param(param)).
                            success(function(data){
                                if(data.error.code == 1){
                                    $scope.get_member_list();
                                    $('#delete_member').modal('hide');
                                }
                                else{
                                    $scope.error = $errMsg.format_error('',data.error);
                                }
                            });
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                    }
                });
        };
        $scope.upload = function(file,file_t,category){
            var param = {
               "file_type": file_t,
               "description": $scope.company_id + file_t,
               "category": $scope.company_id + '_'+$scope.member_number,
               "avatar_id" : $scope.member_add.m_avatar_id
            };
            var headers = {
                   'X-CSRFToken': $csrf.val(),
                   'Content-Type': file.type
               };
            Upload.upload({
               url:urls.api+'/file/upload',
               data: param,
               headers:headers,
               file: file
            }).
            progress(function(evt){
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.progress= 'progress: ' + progressPercentage + '% ' + evt.config.file.name;
                console.log($scope.progress);
            }).
            success(function(data, status, headers, config){
                if(data.error.code == 1){
                    $scope.member_add.m_avatar_id = data.data;
                }
                else{
                    console.log(data.error.message);
                    $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $scope.add_member = function(){
            $scope.edit = false;
            $('#addMember').modal('show');
            $scope.member_number = $scope.member_list.length;
        };
        $scope.edit_member = function(index){
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
        $scope.pre_step = function(){
            window.location.href = '/company/'+$scope.company_id+'/create/third';
        };

        $scope.get_company_info = function(){
            $http.get(urls.api+"/account/company/"+$scope.company_id+"/detail").
                success(function(data){
                    if(data.error.code == 1){
                            $scope.companyinfo = data.data;
                        }
                });
        };
        $scope.get_company_info();

        $scope.next_step = function(){
            if(!$scope.companyinfo.hasOwnProperty('team_description')){
                $scope.error = $errMsg.format_error("请填写团队介绍",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            else if($scope.member_number == 0){
                $scope.error = $errMsg.format_error("请至少上传一个团队成员的信息",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            $scope.companyinfo.info_complete = true;
            $scope.submit_loading = true;
            $csrf.set_csrf($scope.companyinfo);
            $http.post(urls.api+"/account/company/"+$scope.company_id+"/set", $.param($scope.companyinfo)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.error = $errMsg.format_error("创建公司信息成功",data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                        window.location.href = '/';
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                    }
                    $scope.submit_loading = false;
                });
        };



        $scope.type='circle';
        $scope.imageDataURI='';
        $scope.resImageDataURI='';
        $scope.resImgFormat='image/png';
        $scope.resImgQuality=1;
        $scope.selMinSize=100;
        $scope.enableCrop=true;
        $scope.resImgSize=160;
        //$scope.aspectRatio=1.2;
        $scope.cancelUpload = function()
        {
            //$imgResize.cancel($scope,"/api/file/"+$scope.member_add.m_avatar_id+ "/download");
            //if($scope.cancel_upload == undefined)
//            $scope.cancel_upload = true;
//            $scope.cancel_upload = undefined;
            $scope.resize_area = false;
            //alert($scope.cancel_upload);
        };
        $scope.startUpload = function(file_t,category)
        {
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
            var data=$scope.resImageDataURI.split(',')[1];
            data=window.atob(data);
            var ia = new Uint8Array(data.length);
            for (var i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i);
            };
            // canvas.toDataURL 返回的默认格式就是 image/png
            var blob=new Blob([ia], {type:"image/png"});
            //$scope.upload(blob,file_t,category);
            $('.upload-img').attr('src',$scope.resImageDataURI);
            $('#avatar_show_'+$scope.member_number).attr('src',$scope.resImageDataURI);
            $scope.avatar = '66666';
            $scope.resize_area = false;
        };
        $scope.onChange=function($dataURI) {
          console.log('onChange fired');
        };
        $scope.onLoadBegin=function() {
          console.log('onLoadBegin fired');
        };
        $scope.onLoadDone=function() {
          console.log('onLoadDone fired');
        };
        $scope.onLoadError=function() {
          console.log('onLoadError fired');
        };
        $scope.test = function(){
            $("#fileInput").click();
            if(document.querySelector('#fileInput').value != '')
                $scope.resize_area = true;
        };
        $scope.check = function(){
            alert($scope.imageDataURI);
        }
        var handleFileSelect=function(evt) {
          var file=evt.currentTarget.files[0];
          var reader = new FileReader();
          reader.onload = function (evt) {
            $scope.$apply(function($scope){
              $scope.imageDataURI=evt.target.result;
              $scope.resize_area = true;
            });
          };
        if(file != undefined)
            reader.readAsDataURL(file);
        else
            $scope.$apply(function($scope){
              $scope.resize_area = false;
            });
                
        };
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
        //$scope.$watch('imageDataURI',function(newValue,oldValue, scope){
          //console.log('Res image', $scope.resImageDataURI);
          //if(newValue != '' && document.querySelector('#fileInput').value != '')
            //$scope.resize_area = true;

        //});
    }]).
    controller('DT_CompanyFirstCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService','Upload',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg,Upload){
        console.log('DT_CompanyFirstCtrl');
        $scope.company_id = $routeParams.company_id;
        $scope.companyinfo = {};
        $scope.tag_list = ["技能培训","扁平管理","可转正","弹性工作","定期出游","地铁周边","股票期权","水果零食","正餐补助","班车接送"];
        $scope.tags = [
            {
                "chosed":false,
                "value" :"技能培训"
            },
            {
                "chosed":false,
                "value" :"扁平管理"
            },
            {
                "chosed":false,
                "value" :"弹性工作"
            },
            {
                "chosed":false,
                "value" :"定期出游"
            },
            {
                "chosed":false,
                "value" :"地铁周边"
            },
            {
                "chosed":false,
                "value" :"股票期权"
            },
            {
                "chosed":false,
                "value" :"正餐补助"
            },
            {
                "chosed":false,
                "value" :"班车接送"
            }
        ];
        $scope.cancelUpload = function()
        {
              $scope.resize_area = false;
        };

        $scope.imageDataURI='';
        $scope.resImageDataURI='';
        $scope.resImgFormat='image/png';
        $scope.resImgQuality=1;
        $scope.selMinSize=100;
        $scope.enableCrop=true;
        $scope.resImgSize=160;
        //$scope.aspectRatio=1.2;
        $scope.startUpload = function(file_t,category)
        {
            var data=$scope.resImageDataURI.split(',')[1];
            data=window.atob(data);
            var ia = new Uint8Array(data.length);
            for (var i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i);
            };
            // canvas.toDataURL 返回的默认格式就是 image/png
            var blob=new Blob([ia], {type:"image/png"});
            $scope.logo = '6666';
            $scope.upload(blob,file_t,category);
            $('.upload-img').attr('src',$scope.resImageDataURI);
            $scope.resize_area = false;
        };
        $scope.test = function(){
            $("#fileInput").click();
            if(document.querySelector('#fileInput').value != '')
                $scope.resize_area = true;
        };
        $scope.check = function(){
            alert($scope.imageDataURI);
        }
        var handleFileSelect=function(evt) {
          var file=evt.currentTarget.files[0];
          var reader = new FileReader();
          reader.onload = function (evt) {
            $scope.$apply(function($scope){
              $scope.imageDataURI=evt.target.result;
              $scope.resize_area = true;
            });
          };
        if(file != undefined)
            reader.readAsDataURL(file);
        else
            $scope.$apply(function($scope){
              $scope.resize_area = false;
            });
                
        };
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
        //$scope.$watch('imageDataURI',function(newValue,oldValue, scope){
          //console.log('Res image', $scope.resImageDataURI);
          //if(newValue != '' && document.querySelector('#fileInput').value != '')
            //$scope.resize_area = true;

        //});
        $scope.get_company_info = function(){
            $http.get(urls.api+"/account/company/"+$scope.company_id+"/detail").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.companyinfo = data.data;
                        var i = 0;
                        var j = 0;
                        var welfare_tags = data.data.welfare_tags;
                        for(var i=0;i<welfare_tags.length;i++){
                            for(var j=0;j<$scope.tags.length;j++){
                                if($scope.tags[j].value == welfare_tags[i]){
                                    $scope.tags[j].chosed = true;
                                    break;
                                }
                            }
                            if(j==$scope.tags.length){
                                $scope.tags.push({
                                   "value":welfare_tags[i],
                                    "chosed":true
                                });
                            }
                        }
                    }
                });
        };
        $scope.add_tag = function(){
            $scope.tags.push({
                "chosed":false,
                "value" :$scope.tag_added
            });
        };
        $scope.remove_error = function(){
             $scope.$apply(function(){$scope.tags_full = false;});
        };
        $scope.canAdd = function(ngModelController){
            if($scope.tags.length > 13){
                $scope.tags_full = true;
                setTimeout($scope.remove_error,1500);
                 return true;
            }
            else{
                return (ngModelController.$invalid && ngModelController.$dirty) ||  ngModelController.$pristine;
            }
        };
        $scope.upload = function(file,file_t,category){
            var param = {
               "file_type": file_t,
               "description": $scope.company_id + file_t,
               "category": $scope.company_id + '_'+file_t
            };
            var headers = {
                   'X-CSRFToken': $csrf.val(),
                   'Content-Type': file.type
               };
            Upload.upload({
               url:urls.api+'/file/upload',
               data: param,
               headers:headers,
               file: file
            }).
            progress(function(evt){
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.progress= 'progress: ' + progressPercentage + '% ' + evt.config.file.name;
            }).
            success(function(data, status, headers, config){
                if(data.error.code == 1){
                    $scope.companyinfo.logo_id = data.data;
                }
                else{
                    console.log(data.error.message);
                    $scope.error = $errMsg.format_error('',data.error);
                }
            }).error(function(data,status,headers,config){
                if(status == 413){
                    $scope.error = $errMsg.format_error("上传图片失败，文件过大",{code:'-1'});
                }

            });
        };
        $scope.next_step = function(){
            if(!$scope.companyinfo.hasOwnProperty('abbreviation')){
                $scope.error = $errMsg.format_error("请填写公司简称",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            else if(!$scope.companyinfo.hasOwnProperty('brief_introduction')){
                $scope.error = $errMsg.format_error("请填写公司一句话简介",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            else if(!$scope.companyinfo.hasOwnProperty('logo_id')){
                $scope.error = $errMsg.format_error("公司logo未上传或上传失败，请上传公司logo",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            else if(!$scope.companyinfo.hasOwnProperty('field')){
                $scope.error = $errMsg.format_error("请选择公司领域信息",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            else if(!$scope.companyinfo.hasOwnProperty('scale')){
                $scope.error = $errMsg.format_error("请选择公司发展阶段信息",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            $scope.companyinfo.welfare_tags = '';
            var tag_number = 0;
            for(var i=0; i<$scope.tags.length; i++){
                if($scope.tags[i].chosed == true){
                    $scope.companyinfo.welfare_tags += $scope.tags[i].value;
                    $scope.companyinfo.welfare_tags += ',';
                    tag_number++;
                }
            }
            if(tag_number == 0){
                $scope.error = $errMsg.format_error("至少选择一个福利标签",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            else if(tag_number > 6){
                $scope.error = $errMsg.format_error("福利标签数不能超过6个",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            $scope.companyinfo.welfare_tags = $scope.companyinfo.welfare_tags.substring(0,$scope.companyinfo.welfare_tags.length-1);
            $csrf.set_csrf($scope.companyinfo);
            $scope.submit_loading = true;
                $http.post(urls.api+"/account/company/"+$scope.company_id+"/set", $.param($scope.companyinfo)).
                success(function(data){
                    if(data.error.code == 1){
//                        $scope.error = $errMsg.format_error("保存公司信息成功",data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                        window.location.href = '/company/'+ $scope.company_id+'/create/second';
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                    }
                    $scope.submit_loading = false;
                });
        };
        $scope.get_company_info();
    }]).
    controller('DT_CompanySecondCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService','Upload',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg,Upload){
        console.log('DT_CompanySecondCtrl');
        $scope.company_id = $routeParams.company_id;
        $scope.companyinfo = {};
        $scope.financing_list = [];
        $scope.toggle_checkbox = function(){
            $scope.companyinfo.no_financing = !$scope.companyinfo.no_financing;
        };
        $scope.get_financing_list = function(){
            $http.get(urls.api+"/account/financing/"+$scope.company_id+"/list").
                success(function(data){
                if(data.error.code == 1){
                    $scope.financing_list = data.data;
                }
                else{
                    $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $scope.get_company_info = function(){
            $http.get(urls.api+"/account/company/"+$scope.company_id+"/detail").
                success(function(data){
                    if(data.error.code == 1){
                            $scope.companyinfo = data.data;
                            $scope.companyinfo.no_financing = false;
                            if($scope.companyinfo.financings.length == 0){
                                $scope.companyinfo.no_financing = true;
                                $('#financing_checkbox').attr("checked",true);
                            }
                        }
                });
        };
        $scope.get_financing_list();
        $scope.get_company_info();
        $scope.upload = function(file,file_t){
            var param = {
               "file_type": file_t,
               "description": $scope.company_id + file_t,
               "category": $scope.company_id + '_'+file_t
            };
            var headers = {
                   'X-CSRFToken': $csrf.val(),
                   'Content-Type': file.type
               };
            Upload.upload({
               url:urls.api+'/file/upload',
               data: param,
               headers:headers,
               file: file
            }).
            progress(function(evt){
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.progress= 'progress: ' + progressPercentage + '% ' + evt.config.file.name;
            }).
            success(function(data, status, headers, config){
                if(data.error.code == 1){
                    $scope.companyinfo.qrcode_id = data.data;
                }
                else{
                    console.log(data.error.message);
                    $scope.error = $errMsg.format_error('',data.error);
                }
            }).error(function(data, status, headers, config){
                    if(status == 413){
                         $scope.error = $errMsg.format_error("上传图片失败，文件过大",{code:'-1'});
                    }
                });
        }
        $scope.get_delete_index = function($index){
            $scope.delete_index = $index;
            $('#delete_financing').modal('show');
        };
        $scope.delete_financing = function(index){
            var param = {
                "csrfmiddlewaretoken" : $csrf.val()
            };
            $http.post(urls.api+"/account/financing/"+$scope.financing_list[index]._id.$oid+"/delete", $.param(param)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.get_financing_list();
                        $('#delete_financing').modal('hide');
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                    }
                });
        };
        $scope.add_financing = function(){
            $csrf.set_csrf($scope.financing_add);
            $http.post(urls.api+'/account/financing/create',$.param($scope.financing_add)).
            success(function(data){
                if(data.error.code == 1){
                    $scope.get_financing_list();
                    $scope.financing_add = null;
                    $('#add_financing').modal('hide');
                }
                else{
                    $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $scope.pre_step = function(){
            window.location.href = '/company/'+ $scope.company_id+'/create/first';
        };
        $scope.next_step = function(){
            if(!$scope.companyinfo.hasOwnProperty('ICregist_name')){
                $scope.error = $errMsg.format_error("请填写公司工商注册名",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            else if(!$scope.companyinfo.hasOwnProperty('homepage')){
                $scope.error = $errMsg.format_error("请填写公司主页地址",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            else if(!$scope.companyinfo.hasOwnProperty('city')){
                $scope.error = $errMsg.format_error("请填写公司所在地",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            else if(!$scope.companyinfo.hasOwnProperty('qrcode_id')){
                $scope.error = $errMsg.format_error("请上传公司微信二维码",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            else if($scope.companyinfo.no_financing == false  && $scope.financing_list.length==0){
                $scope.error = $errMsg.format_error("请填写融资信息，若无请勾选无融资",{code:"-1"});

                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
             $csrf.set_csrf($scope.companyinfo);
             $scope.submit_loading = true;
                $http.post(urls.api+"/account/company/"+$scope.company_id+"/set", $.param($scope.companyinfo)).
                success(function(data){
                    if(data.error.code == 1){
//                        $scope.error = $errMsg.format_error("保存公司信息成功",data.error);
//                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                        window.location.href = '/company/'+ $scope.company_id+'/create/third';
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                    }
                    $scope.submit_loading = false;
                });
        };

    }]).
    controller('DT_CompanyThirdCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg){
        console.log('DT_CompanyThirdCtrl');
        $scope.company_id = $routeParams.company_id;
        $scope.get_company_info = function(){
            $http.get(urls.api+"/account/company/"+$scope.company_id+"/detail").
                success(function(data){
                    if(data.error.code == 1){
                            $scope.companyinfo = data.data;
                        }
                });
        };
        $scope.get_company_info();
        $scope.pre_step = function(){
            window.location.href = '/company/'+$scope.company_id+'/create/second';
        };
        $scope.next_step = function(){
            if(!$scope.companyinfo.hasOwnProperty('company_description')){
                $scope.error = $errMsg.format_error("请填写公司介绍",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            else if(!$scope.companyinfo.hasOwnProperty('product_description')){
                $scope.error = $errMsg.format_error("请填写产品或服务介绍",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
             $csrf.set_csrf($scope.companyinfo);
             $scope.submit_loading = true;
                $http.post(urls.api+"/account/company/"+$scope.company_id+"/set", $.param($scope.companyinfo)).
                success(function(data){
                    if(data.error.code == 1){
//                        $scope.error = $errMsg.format_error("保存公司信息成功",data.error);
//                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                        window.location.href = '/company/'+ $scope.company_id+'/create/forth';
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                    }
                    $scope.submit_loading = false;
                });
        };
    }]).
    controller('DT_CompanyForthCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService','Upload','ImgResizeService',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg,Upload, $imgResize){
        console.log('DT_CompanyForthCtrl');
        $scope.company_id = $routeParams.company_id;
        $scope.add_member_flag = false;
        $scope.member_add = {};
        $scope.member_list = [];
        $scope.show_member_card = function(){
            $scope.add_member_flag = true;
        };
        $scope.get_member_list = function(){
            $http.get(urls.api+"/account/member/"+$scope.company_id+"/list").
            success(function(data){
                if(data.error.code == 1){
                    $scope.member_list = data.data;
                    $scope.member_number = data.data.length;
                }
                else{
                    $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $scope.get_member_list();
        $scope.cancer_add = function(){
            $scope.add_member_flag = false;
            $scope.member_add = {};
            $('#addMember').modal('hide');
            $scope.avatar = null;
        };
        $scope.save_member = function(){
            if(!$scope.member_add.hasOwnProperty('m_avatar_id')){
                $scope.error = $errMsg.format_error("请上传成员头像",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            $csrf.set_csrf($scope.member_add);
            var request_url;
            if($scope.edit == false){
                request_url = urls.api+'/account/member/create';
            }
            else{
                request_url = urls.api+'/account/member/'+$scope.member_list[$scope.index]._id['$oid']+'/set';
            }
            $http.post(request_url,$.param($scope.member_add)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.get_member_list();
                        $scope.member_add = {};
                        $scope.avatar = undefined;
                        $('#addMember').modal('hide');
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                    }
                });
        };
        $scope.delete_modal = function(index){
            $scope.delete_index = index;
            $('#delete_member').modal('show');
        };
        $scope.delete_member = function(index){
            var param = {
                "csrfmiddlewaretoken" : $csrf.val()
            };
            $http.post(urls.api+"/account/member/"+$scope.member_list[index]._id.$oid+"/delete", $.param(param)).
                success(function(data){
                    if(data.error.code == 1){
                        $http.post(urls.api+"/file/" + $scope.member_list[index].m_avatar_id + "/delete", $.param(param)).
                            success(function(data){
                                if(data.error.code == 1){
                                    $scope.get_member_list();
                                    $('#delete_member').modal('hide');
                                }
                                else{
                                    $scope.error = $errMsg.format_error('',data.error);
                                }
                            });
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                    }
                });
        };
        $scope.upload = function(file,file_t,category){
            var param = {
               "file_type": file_t,
               "description": $scope.company_id + file_t,
               "category": $scope.company_id + '_'+$scope.member_number,
               "avatar_id" : $scope.member_add.m_avatar_id
            };
            var headers = {
                   'X-CSRFToken': $csrf.val(),
                   'Content-Type': file.type
               };
            Upload.upload({
               url:urls.api+'/file/upload',
               data: param,
               headers:headers,
               file: file
            }).
            progress(function(evt){
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.progress= 'progress: ' + progressPercentage + '% ' + evt.config.file.name;
                console.log($scope.progress);
            }).
            success(function(data, status, headers, config){
                if(data.error.code == 1){
                    $scope.member_add.m_avatar_id = data.data;
                }
                else{
                    console.log(data.error.message);
                    $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $scope.add_member = function(){
            $scope.edit = false;
            $('#addMember').modal('show');
            $scope.member_number = $scope.member_list.length;
        };
        $scope.edit_member = function(index){
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
        $scope.pre_step = function(){
            window.location.href = '/company/'+$scope.company_id+'/create/third';
        };

        $scope.get_company_info = function(){
            $http.get(urls.api+"/account/company/"+$scope.company_id+"/detail").
                success(function(data){
                    if(data.error.code == 1){
                            $scope.companyinfo = data.data;
                        }
                });
        };
        $scope.get_company_info();

        $scope.next_step = function(){
            if(!$scope.companyinfo.hasOwnProperty('team_description')){
                $scope.error = $errMsg.format_error("请填写团队介绍",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            else if($scope.member_number == 0){
                $scope.error = $errMsg.format_error("请至少上传一个团队成员的信息",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            $scope.companyinfo.info_complete = true;
            $scope.submit_loading = true;
            $csrf.set_csrf($scope.companyinfo);
            $http.post(urls.api+"/account/company/"+$scope.company_id+"/set", $.param($scope.companyinfo)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.error = $errMsg.format_error("创建公司信息成功",data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                        window.location.href = '/';
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                    }
                    $scope.submit_loading = false;
                });
        };



        $scope.type='circle';
        $scope.imageDataURI='';
        $scope.resImageDataURI='';
        $scope.resImgFormat='image/png';
        $scope.resImgQuality=1;
        $scope.selMinSize=100;
        $scope.enableCrop=true;
        $scope.resImgSize=160;
        //$scope.aspectRatio=1.2;
        $scope.cancelUpload = function()
        {
            //$imgResize.cancel($scope,"/api/file/"+$scope.member_add.m_avatar_id+ "/download");
            //if($scope.cancel_upload == undefined)
//            $scope.cancel_upload = true;
//            $scope.cancel_upload = undefined;
            $scope.resize_area = false;
            //alert($scope.cancel_upload);
        };
        $scope.startUpload = function(file_t,category)
        {
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
            var data=$scope.resImageDataURI.split(',')[1];
            data=window.atob(data);
            var ia = new Uint8Array(data.length);
            for (var i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i);
            };
            // canvas.toDataURL 返回的默认格式就是 image/png
            var blob=new Blob([ia], {type:"image/png"});
            $scope.upload(blob,file_t,category);
            $('.upload-img').attr('src',$scope.resImageDataURI);
            $('#avatar_show_'+$scope.member_number).attr('src',$scope.resImageDataURI);
            $scope.avatar = '66666';
            $scope.resize_area = false;
        };
        $scope.test = function(){
            $("#fileInput").click();
            if(document.querySelector('#fileInput').value != '')
                $scope.resize_area = true;
        };
        $scope.check = function(){
            alert($scope.imageDataURI);
        }
        var handleFileSelect=function(evt) {
          var file=evt.currentTarget.files[0];
          var reader = new FileReader();
          reader.onload = function (evt) {
            $scope.$apply(function($scope){
              $scope.imageDataURI=evt.target.result;
              $scope.resize_area = true;
            });
          };
        if(file != undefined)
            reader.readAsDataURL(file);
        else
            $scope.$apply(function($scope){
              $scope.resize_area = false;
            });
                
        };
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    }]).
    controller('DT_PositionListCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService', '$rootScope', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg,$rootScope){
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
                'e_commerce':true,
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
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.field_type={
            'social':"社交",
            'e-commerce':"电子商务",
            'education':"教育",
            'health_medical':"健康医疗",
            'culture_creativity':"文化创意",
            'living_consumption':"生活消费",
            'hardware':"硬件",
            'O2O':"O2O",
            'others':"其他"
        };
        $scope.positions = {};
        $scope.param = {
            field: null,
            pageCount: 1,
            currentPage: 1
        };
        $scope.filed_choose = "行业领域";
        $scope.type_choose = "职位类型";
        $scope.salary_choose = "月薪下限";
        $scope.workdays_choose = "每周工作时间";
        $scope.field_change = false;
        $scope.choose = function(field){
            if($scope.param.field == field){
                $scope.field_change = false;
            }
            else{
                $scope.field_change = true;
                $scope.param.field = field;
            }
            $scope.get_company_list($scope.param);
        };
        $scope.show_field = function(){
            $scope.field = true;
            setTimeout(function(){
                if($scope.field)
                setTimeout(function(){
                    if($scope.field)
                        $(".field-list").slideDown("fast");
                },170);
            },170);
        };
        $scope.hide_field = function(){
            $(".field-list").slideUp("fast");
            $scope.field = false;
        };
        $(".company-field").mouseenter($scope.show_field);
        $(".company-field").mouseleave($scope.hide_field);

        $scope.show_type = function(){
            $scope.type = true;
            setTimeout(function(){
                if($scope.type)
                setTimeout(function(){
                    if($scope.type)
            $(".type-list").slideDown("fast");
                },170);
            },170);
        };
        $scope.hide_type = function(){
            $(".type-list").slideUp("fast");
            $scope.type = false;
        };
        $(".position-type").mouseenter($scope.show_type);
        $(".position-type").mouseleave($scope.hide_type);

        $scope.show_salary = function(){
            $scope.salary = true;
            setTimeout(function(){
                if($scope.salary)
                setTimeout(function(){
                    if($scope.salary)
                        $(".salary_min").slideDown("fast");
                },170);
            },170);
        };
        $scope.hide_salary = function(){
            $(".salary_min").slideUp("fast");
            $scope.salary = false;
        };
        $(".salary_set").mouseenter($scope.show_salary);
        $(".salary_set").mouseleave($scope.hide_salary);

        $scope.show_work_days = function(){
            $scope.work_days = true;
            setTimeout(function(){
                if($scope.work_days)
                setTimeout(function(){
                    if($scope.work_days)
                        $(".work_days_max").slideDown("fast");
                },170);
            },170);
        };
        $scope.hide_work_days = function(){
            $(".work_days_max").slideUp("fast");
            $scope.work_days = false;
        };
        $(".work_days").mouseenter($scope.show_work_days);
        $(".work_days").mouseleave($scope.hide_work_days);







        $scope.get_positions = function(data){
            $scope.loading = true;
             var param = '';
            if(data != null){
                param = '?';
                if(data.hasOwnProperty('page')){
                    if($scope.field_change)
                    {
                        $scope.field_change = false;
                        param += "page=" + 1;
                        $scope.param.currentPage = 1;
                    }
                    else if(data.page == 0)
                        param += "page=1";
                    else
                        param += "page="+data.page;
                }
                else{
                    param += "page=" + 1;
                }
                if(data.field != undefined && data.field != null){
                    param += "&fields=" + data.field;
                }
                if(data.type != undefined && data.type != null){
                    param += "&types=" + data.type;
                }
                if(data.salary != undefined && data.salary != ""){
                    param += "&salary_min=" + data.salary;
                }
                if(data.workdays != undefined && data.workdays != null){
                    param += "&workdays=" + data.workdays;
                }
            }
            $http.get(urls.api+"/position/search"+param).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.positions = data.positions;
                        $scope.param.pageCount = data.page_number;
                        for(var i=0; i<$scope.positions.length;i++){
                            $scope.positions[i].position_type_value = $scope.position_type[$scope.positions[i].position_type];
                            $scope.positions[i].company.field_type = $scope.field_type[$scope.positions[i].company.field];
                            if($scope.positions[i].company.scale == 0){
                                $scope.positions[i].company.scale_value = "初创";
                            }
                            else if($scope.positions[i].company.scale == 1){
                                $scope.positions[i].company.scale_value = "快速发展";
                            }
                            else{
                                $scope.positions[i].company.scale_value = "成熟";
                            }
                        }
                    }
                    else{
                        console.log(data.error.message);
                    }
                    $scope.loading=false;
                });
        };

        document.body.onscroll = function record_position(){
            $rootScope.position_list_position = document.body.scrollTop;
            //alert('scroll1');
        };
        //换页
        $scope.selectPage = function(page){
            $scope.param.page = page;
            $rootScope.position_list_param_cachce = $scope.param;
            $scope.get_positions($scope.param);
            document.body.scrollTop = 0;
        };
        if($rootScope.position_list_param_cachce != undefined)
        {
            $scope.param = $rootScope.position_list_param_cachce;
            $scope.selectPage($rootScope.position_list_param_cachce.page);
            document.body.scrollTop = $rootScope.position_list_position;
        }
        else
            $scope.selectPage(1);

        
        $scope.choose = function(field){
            if($scope.param.field == field){
                $scope.field_change = false;
            }
            else{
                $scope.field_change = true;
                $scope.param.field = field;
                if(field != null)
                    $scope.filed_choose = $scope.field_type[field];
                else
                    $scope.filed_choose = "行业领域";
            }
            $scope.get_positions($scope.param);
        };
        $scope.choose_type = function(type){
            if($scope.param.type == type){
                $scope.type_change = false;
            }
            else{
                $scope.type_change = true;
                $scope.param.type = type;
                if(type!=null)
                    $scope.type_choose = $scope.position_type[type];
                else
                    $scope.type_choose = "职位类型";
            }
            $scope.get_positions($scope.param);
        };
        $scope.choose_salary = function(salary){
            if($scope.param.salary == salary){
                $scope.salary_change = false;
            }
            else{
                $scope.salary_change = true;
                $scope.param.salary = salary;
                if(salary!='')
                    $scope.salary_choose = salary+"K";
                else
                    $scope.salary_choose = "月薪下限";
            }
            $scope.get_positions($scope.param);
        };
        $scope.choose_workdays = function(workdays){
            if($scope.param.workdays == workdays){
                $scope.workdays_change = false;
            }
            else{
                $scope.workdays_change = true;
                $scope.param.workdays = workdays;
                if(workdays!=null){
                    if(workdays=='0')
                        $scope.workdays_choose = "灵活时间";
                    else
                        $scope.workdays_choose = "每周"+workdays+"天";
                }
                else
                    $scope.workdays_choose = "每周工作时间";
            }
            $scope.get_positions($scope.param);
        };
    }]).

    controller('DT_UserInfoCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', 'ErrorService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg){
        console.log('DT_UserInfoCtrl');
    $scope.info = {};
    $scope.user_info = {};
    $scope.user_pwd = {};
    $scope.error = {};
        $scope.info.username = $user.username();
    $scope.e_check = {};

    $http.get(urls.api+"/account/userinfo/get").
        success(function(data){
        if(data.error.code == 1){
            $scope.user_info = data.data;
        }
        });

        $scope.view_tab = 'tab1';        
        $scope.changeTab = function(tab){
            $scope.view_tab = tab;
        };

    $scope.showError = function(ngModelController,error){
        return ngModelController.$error[error];
    };

    $scope.update_info = function(){
        if($scope.view_tab == 'tab1'){
         $csrf.set_csrf($scope.user_info);
         $http.post(urls.api+"/account/userinfo/set", $.param($scope.user_info))
            .success(function(data){
            if(data.error.code == 1){
                $scope.error = $errMsg.format_error("修改成功",data.error);
            }
            else{
                $scope.error = $errMsg.format_error("",data.error);
            }
            });
        }   
        else if($scope.view_tab == 'tab2'){
        $csrf.set_csrf($scope.user_pwd);
        $http.post(urls.api+"/account/password/set", $.param($scope.user_pwd))
            .success(function(data){
            console.log(data);
            if(data.error.code == 1){
                $scope.error = $errMsg.format_error("修改成功",data.error);
            }
            else{
                $scope.error = $errMsg.format_error('',data.error);
            }
            });
        } 
    }   

    }]).
    controller('DT_InternEnterCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_InternEnterCtrl');
        $scope.Upload_personal_profile = function(){}
        $scope.Enter_Xiniu = function(){
            window.location.href = '/';
        }
    }]).
    controller('DT_ManagerCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg){
        console.log('DT_ManagerCtrl');
        $scope.company_list = {};
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.scale = ["初创","快速发展","成熟"];
        $scope.field_type={
            'social':"社交",
            'e-commerce':"电子商务",
            'education':"教育",
            'health_medical':"健康医疗",
            'culture_creativity':"文化创意",
            'living_consumption':"生活消费",
            'hardware':"硬件",
            'O2O':"O2O",
            'others':"其他"
        };
        $scope.stage = {
            "seed" :"种子轮",
            "angel":"天使轮",
            "A":"A轮",
            "B":"B轮",
            "C":"C轮",
            "D_plus":"D及以上轮"
        };
        $scope.amount = {
            "ten":"十万级",
            "hundred":"百万级",
            "thousand":"千万级",
            "thousand_plus":"亿级"
        };
        $scope.param = {
            field: null,
            pageCount: 1,
            currentPage: 1
        };
        $scope.scale_change = false;
        $scope.field_change = false;
        $scope.choose = function(field){
            if($scope.param.field == field){
                $scope.field_change = false;
            }
            else{
                $scope.field_change = true;
                $scope.param.field = field;
            }
            $scope.get_company_list($scope.param);
        };
        $scope.choose_scale = function(scale){
            if($scope.param.scale == scale){
                $scope.scale_change = false;
            }
            else{
                $scope.param.scale = scale;
                $scope.scale_change = true;
            }
            $scope.get_company_list($scope.param);
        };
        $scope.selectPage = function(page){
            $scope.param.page = page;
            $scope.get_company_list($scope.param);
        };
        $scope.get_company_list = function(data){
            $scope.loading = true;
            var param = '';
            if(data != null){
                param = '?';
                if(data.hasOwnProperty('page')){
                    if($scope.scale_change || $scope.field_change)
                    {
                        $scope.scale_change = false;
                        $scope.field_change = false;
                        param += "page=" + 1;
                        $scope.param.currentPage = 1;
                    }
                    else
                        param += "page=" + data.page;
                }
                if(data.field != undefined && data.field != null){
                    param += "&field=" + data.field;
                }
                if(data.scale != undefined && data.scale != null){
                    param += "&scale=" + data.scale;
                }
                if(data.hasOwnProperty('auth_organization')){

                }
            }
            else
                $scope.selectPage(1);
                $http.get(urls.api+"/account/admin/company/list"+param).
                success(function(data){
                $scope.param.pageCount = data.page_number;
                
                    $scope.company_list = data.data;
                    for(var i=0;i<$scope.company_list.length;i++){
                        $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                        $scope.company_list[i].scale_value = $scope.scale[$scope.company_list[i].scale];
                        $scope.company_list[i].field_type = $scope.field_type[$scope.company_list[i].field];
                        $scope.company_list[i].position_type_value = {};
                        for(var j=0; j<$scope.company_list[i].financing.length; j++){
                        $scope.company_list[i].financing[j].stage_value = $scope.stage[$scope.company_list[i].financing[j].stage];
                        $scope.company_list[i].financing[j].amount_value = $scope.amount[$scope.company_list[i].financing[j].amount];
                        }
                    }
                $scope.loading = false;
            });
            /*$http.get(urls.api+"/account/admin/company/list").
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
        $scope.auth = function(index){
            var param = {
                'auth_organization':$scope.company_list[index].auth_organization
            };
            $csrf.set_csrf(param);
            $http.post(urls.api+"/account/company/"+ $scope.company_list[index]._id.$oid+"/auth", $.param(param)).
                success(function(data){
                    if(data.error.code == 1){
                        $http.get(urls.api+"/account/admin/company/"+$scope.company_list[index]._id.$oid+"/detail_with_financing").
                            success(function(data1){
                                if(data1.error.code == 1){
                                    $scope.company_list[index] = data1.data;
                                    $scope.error = $errMsg.format_error("认证成功",data1.error);
                                }
                                else{
                                    $scope.error = $errMsg.format_error("",data1.error);
                                }
                            });
                    }
                    else{
                        $scope.error = $errMsg.format_error("",data.error);
                    }
                });
        };
    }]).
    controller('DT_CompanyAccountCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', 'ErrorService',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg){
        console.log('DT_CompanyAccountCtrl');
        $scope.info = {};
        $scope.user_info = {};
        $scope.user_pwd = {};
        $scope.error = {};
        $scope.e_check = {};
        $scope.company_id = '';
                                        
        $http.get(urls.api+"/account/company/detail").
        success(function(data){
            if(data.error.code == 1){
                $scope.user_info = data.data;
                $scope.company_id = data.data._id.$oid;
                
            }
                else{
                console.log(data.error.message);
                }
        });
                                        

        $scope.view_tab = 'tab1';
        $scope.changeTab = function(tab){
            $scope.view_tab = tab;
        };
                                        
        $scope.showError = function(ngModelController,error){
            return ngModelController.$error[error];
        };

        $scope.update_info = function(){
            if($scope.view_tab == 'tab1'){
                $csrf.set_csrf($scope.user_info);
                $http.post(urls.api+"/account/company/"+$scope.company_id+"/set", $.param($scope.user_info))
                .success(function(data){
                    if(data.error.code == 1){
                        $scope.error = $errMsg.format_error("修改成功",data.error);
                    }
                    else{
                        $scope.error = $errMsg.format_error("",data.error);
                    }
                });
            }
            else if($scope.view_tab == 'tab2'){
                $csrf.set_csrf($scope.user_pwd);
                                        console.log($scope.user_pwd);
                $http.post(urls.api+"/account/password/set", $.param($scope.user_pwd))
                .success(function(data){
                    console.log(data);
                    if(data.error.code == 1){
                        $scope.error = $errMsg.format_error("修改成功",data.error);
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                    }
                });
            }
        }
    }]);
