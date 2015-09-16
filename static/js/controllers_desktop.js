'use strict';

/* Controllers */

angular.module('chuangplus.controllers', []).
    controller('DT_HomepageCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('HomepageCtrl');
        $scope.role = $user.role();
        $scope.username = $user.username();
        $scope.myInterval = 3000;
        $scope.slides1 = [
            {image:"/static/image/logo/banner-1.jpg"},
            {image:"/static/image/logo/banner-2.jpg"},
            {image:"/static/image/logo/banner-3.jpg"}
        ];
        $scope.slides2 = [
            {image:"/static/image/logo/banner-1.jpg"},
            {image:"/static/image/logo/banner-2.jpg"},
            {image:"/static/image/logo/banner-3.jpg"}
        ];
        $scope.scan = false;
        $scope.search = false;
    }]).
    controller('DT_HeaderCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_HeaderCtrl');
        $scope.company_id = '';
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
        $scope.homepage_active = function(){
            $scope.homepage = true;
            $scope.position = $scope.company = $scope.resume = false;
        };
        $scope.company_active = function(){
            $scope.company = true;
            $scope.position = $scope.resume = $scope.homepage = false;
        };
        $scope.position_active = function(){
            $scope.position = true;
            $scope.company = $scope.resume = $scope.homepage = false;
        };
        $scope.resume_active = function(){
            $scope.resume = true;
            $scope.position = $scope.company = $scope.homepage = false;
        };
    }]).
    controller('DT_NoHeaderCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_NoHeaderCtrl');
        $scope.homepage_active = function(){
            window.location.href = '/';
        };
                            
    }]).
    controller('DT_LoginCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg){
        console.log('DT_LoginCtrl');
        $scope.login_info = {};
        //$scope.login_info.role = 1;
        $scope.captcha_url = urls.api+"/captcha/image/";
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
                        setTimeout(function(){
                            $errMsg.remove_error($scope.error);
                        },2000);
                    }
                });
        };
        $scope.refresh();
    }]).
    controller('DT_RegisterCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg){
        console.log('DT_RegisterCtrl');
        $scope.show_footer = 'false';
        $scope.show_header = 'false';
        $scope.error = {};
        $scope.reg_info = {};
        $scope.reg_info.role = 0;
        $scope.captcha_url = urls.api+"/captcha/image/";
        $scope.check = {};
        $scope.e_check = {};
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
        $scope.get_positions = function(){
            $http.get(urls.api+"/account/userinfo/position/submit/list").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.positions = data.data;
                        for(i = 0; i < $scope.positions.length; i ++){
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
        $scope.get_company_list = function(){
            $http.get(urls.api+"/account/userinfo/company/favor/list").
            success(function(data){
                if(data.error.code == 1){
                $scope.company_list = data.data;
		$scope.company_num = $scope.company_list.length;
                for(i = 0; i < $scope.company_list.length; i ++){
                    $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                    $scope.company_list[i].position_types = {};
                    $scope.company_list[i].scale_value = $scope.scale[$scope.company_list[i].scale];
                    for(j = 0; j < $scope.company_list[i].positions.length; j ++)
                    {
                        $scope.company_list[i].position_types[$scope.position_index[$scope.company_list[i].positions[j].position_type]] = $scope.position_type[$scope.company_list[i].positions[j].position_type];
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
                            console.log("here");
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
                    for(i = 0; i < $scope.positions.length; i ++){
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
    for(i = 0; i < $scope.positions.length; i ++){
        $scope.submit(i);
    }
    };
  
    $scope.param = function(index){
	$scope.index = index;
    };

    }]).
    controller('DT_InternResumeViewCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService','Upload', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg,Upload){
        $scope.filename = "无简历附件";
        $scope.have_resume_info = false;
        $scope.intern_info = {};
        $scope.edit_resume = function(){
            window.location.href = "/intern/resume/edit";
        };
        $scope.get_intern_info = function(){
            $http.get(urls.api+"/account/userinfo/get").
              success(function(data){
                if(data.error.code == 1){
                    $scope.intern_info = data.data;
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
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.progress= 'progress: ' + progressPercentage + '% ' + evt.config.file.name;
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
    controller('DT_RegEnterCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_RegEnterCtrl');
    }]).
    controller('DT_CompanyResumeCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_CompanyResumeCtrl');
    }]).
    controller('DT_CompanyInfoCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','Upload','ErrorService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, Upload,$errMsg){
        console.log('DT_CompanyInfoCtrl');
        if ($user.username() == undefined){
            window.location.href='/login';
        };
        $scope.company_id = "";
        $scope.companyinfo = {};
        $scope.company_id = '';
        $scope.CEO = {
            "m_position":"CEO"
        };
        //get company info
        $scope.get_company_info = function(){
            $http.get(urls.api+"/account/company/detail").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.companyinfo = data.data;
                        $scope.company_id = data.data._id.$oid;
                    }
                });
        };
        $scope.get_company_info();

        $scope.upload = function(file,file_t){
            var param = {
               "file_type":file_t,
               "description":$scope.company_id + file_t,
               "category":$scope.company_id + '_'+file_t
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
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data.data);
                    if(file_t == 'logo'){
                        $scope.companyinfo.logo_id = data.data
                    }
                    else{
                        $scope.CEO.m_avatar_id = data.data
                    }
                }
                else{
                    console.log(data.error.message);
                    $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $scope.create_CEO = function(){
        $csrf.set_csrf($scope.CEO);
        $http.post(urls.api+'/account/member/create',$.param($scope.CEO)).
        success(function(data){
            if(data.error.code == 1){
            
            }
            else{
                $scope.error = $errMsg.format_error('',data.error);
            }
        });
    };
        $scope.create_company = function(){
            $csrf.set_csrf($scope.companyinfo);
            $http.post(urls.api+'/account/company/'+$scope.company_id+'/set', $.param($scope.companyinfo)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.create_CEO();
                        window.location.href='/company/'+$scope.company_id+ '/infodetail';
                    }
                    else{
                        console.log(data.error.message);
                        $scope.error = $errMsg.format_error('',data.error);
                    }
            });
        };
        $scope.showError = function(ngModelController,error){
            return ngModelController.$error[error];
        };
    }]).
    controller('DT_CompanyInfoDetailCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService','Upload', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg,Upload){
        console.log('DT_CompanyInfoDetailCtrl');
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
                "value" :"可转正"
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
                "value" :"水果零食"
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
        $scope.company_id = $routeParams.company_id;
        $scope.delete_index = 0;
        $scope.get_company_info = function(){
            $http.get(urls.api+"/account/company/"+$scope.company_id+"/detail").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.companyinfo = data.data;
                        if(data.data.company_description == undefined)
                            $scope.old_company_description = "";
                        else
                            $scope.old_company_description = data.data.company_description;
                        if(data.data.team_description == undefined)
                            $scope.old_team_description = "";
                        else
                            $scope.old_team_description = data.data.team_description;
                    }
                });
            };
        $scope.companyinfo = {};
        $scope.get_company_info();
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
        $scope.member_list=[];
        $scope.get_member_list();

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
        $scope.financing_list=[];
        $scope.get_financing_list();
        $scope.old_team_description = "";
        $scope.old_company_description = "";

        $scope.add_tag = function(){
            $scope.welfare_tags.append({
                "chosed":false,
                "value" :$scope.tag_added
            });
        };
        $scope.canAdd = function(ngModelController){
            return (ngModelController.$invalid && ngModelController.$dirty) ||  ngModelController.$pristine;
        };
        $scope.tag_long_error=function(ngModelController){
            return ngModelController.$invalid && ngModelController.$dirty;
        };

        $scope.save_team_description = function(){
            $scope.edit_team_intro=false;
            $scope.old_team_description = $scope.companyinfo.team_description;
            var param = {
                "team_description":$scope.companyinfo.team_description,
                "csrfmiddlewaretoken" : $csrf.val()
            };
            $http.post(urls.api+"/account/company/"+$scope.company_id+"/set", $.param(param)).
               success(function(data){
               if(data.error.code == 1){
                    $scope.error = $errMsg.format_error("保存成功",data.error);
               }
               else{
                   $scope.error = $errMsg.format_error('',data.error);
               }
            });
        };
        $scope.cancel_edit = function(){
            $scope.edit_team_intro=false
            $scope.companyinfo.team_description = $scope.old_team_description;
        };
        $scope.company_cancel_edit = function(){
            $scope.edit_company_intro=false
            $scope.companyinfo.company_description = $scope.old_company_description;
        };
        $scope.save_company_description = function(){
            $scope.edit_company_intro=false;
            $scope.old_company_description = $scope.companyinfo.company_description;
            var param = {
                "company_description":$scope.companyinfo.company_description,
                "csrfmiddlewaretoken" : $csrf.val()
            };
            $http.post(urls.api+"/account/company/"+$scope.company_id+"/set", $.param(param)).
               success(function(data){
               if(data.error.code == 1){
                    $scope.error = $errMsg.format_error("保存成功",data.error);
               }
               else{
                   $scope.error = $errMsg.format_error('',data.error);
               }
            });
        };
         $scope.upload = function(file,file_t,category){
            var param = {
               "file_type":file_t,
               "description":$scope.company_id + file_t,
               "category":$scope.company_id + '_'+category
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
            success(function(data, status, headers, config){
                if(data.error.code == 1){
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data.data);
                    if(file_t == 'memberavatar'){
                        $scope.member_add.m_avatar_id = data.data;
                    }
                    else if(file_t == 'logo'){
                        $scope.companyinfo.logo_id = data.data;
                    }
                    else if(file_t == 'qrcode'){
                         $scope.companyinfo.qrcode_id = data.data;
                    }
                }
                else{
                    console.log(data.error.message);
                    $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $scope.add_member = function(){
            $csrf.set_csrf($scope.member_add);
            $http.post(urls.api+'/account/member/create',$.param($scope.member_add)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.get_member_list();
                        $scope.member_add = null;
                        $scope.avatar = null;
                        $('#myModal').modal('hide');
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                    }
                });
        };
        $scope.get_delete_index = function($index){
            $scope.delete_index = $index;
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
        $scope.save_company_info = function(){
            $scope.companyinfo.welfare_tags = '';
            var tag_number = 0;
            for(i=0; i<$scope.tags.length; i++){
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
            else if(tag_number > 5){
                $scope.error = $errMsg.format_error("福利标签数不能超过5个",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
            $scope.companyinfo.welfare_tags = $scope.companyinfo.welfare_tags.substring(0,$scope.companyinfo.welfare_tags.length-1);
            $csrf.set_csrf($scope.companyinfo);
            $http.post(urls.api+"/account/company/"+$scope.company_id+"/set", $.param($scope.companyinfo)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.error = $errMsg.format_error("保存公司信息成功",data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                    }
                });
        };
    }]).
    controller('DT_PositionDetailCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_PositionDetailCtrl');
        $scope.position_id = $routeParams.position_id;
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };

    $http.get(urls.api+"/account/userinfo/"+$scope.position_id+"/check_favor_position").
        success(function(data){
        if(data.error.code == 1){
            $scope.favor_exist = data.data.exist;
            if($scope.favor_exist == true){
            $scope.post_value = "取消收藏";
            }
            else{
            $scope.post_value = "先收藏";
            }
        }
        else{
            console.log(data.error.message);
        }
    });
    
        $http.get(urls.api+"/position/"+ $scope.position_id +"/get_with_company").
            success(function(data){
                if(data.error.code == 1){
                    $scope.position = data.data;
                    $scope.position.position_type_value = $scope.position_type[$scope.position.position_type];
                }
                else{
                    console.log(data.error.message)
                }
            });
    console.log($scope.position_id);
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
            console.log(data.error).message;
        }
    });
    
    $http.get(urls.api+"/position/"+$scope.position_id+"/check_submit").
            success(function(data){
                if(data.error.code == 1){
                    if(data.exist == true){
                        $scope.submit_value = "已投递";
                        $scope.resume_submitted = true;
            }
            else{
            $scope.submit_value = "投递简历";
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
		    	$scope.post_value = "取消收藏";
			$scope.favor_exist = true;
		});
	    }
	    else{
		$scope.submitUnFavor = {};
		$scope.submitUnFavor.position_id = $scope.position_id;
		$csrf.set_csrf($scope.submitUnFavor);
		$http.post(urls.api+"/position/"+$scope.position_id+"/userunlikeposition", $.param($scope.submitUnFavor)).
		    success(function(data){
			$scope.post_value = "收藏职位";
			$scope.favor_exist = false;
		    });
	    }
		
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
    controller('DT_CompanyPositionManageCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
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
        $scope.get_position_list = function(){
            $http.get(urls.api+"/position/company/"+$scope.company_id+"/list").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.position_list = data.data;
                        for(i=0; i<$scope.position_list.length;i++){
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
        $scope.position_id = $routeParams.position_id;
        $scope.create_position = function(){
            $csrf.set_csrf($scope.position);
            if($scope.position.end_time != ''){
                $scope.position.end_time = $filter('date')($scope.position.end_time, 'yyyy-MM-dd HH:mm:ss');
            }
            $http.post(urls.api+"/position/create", $.param($scope.position)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.error = $errMsg.format_error('发布职位成功',data.error);
                        setTimeout(function(){window.location.href='/company/'+$scope.position.company.$oid+'/position/manage'},2000);
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                    }
                })
        };
        $scope.set_position = function(){
            $csrf.set_csrf($scope.position);
            if($scope.position.end_time != ''){
                $scope.position.end_time = $filter('date')($scope.position.end_time, 'yyyy-MM-dd HH:mm:ss');
            }
            $http.post(urls.api+"/position/"+$scope.position_id+"/set", $.param($scope.position)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.error = $errMsg.format_error('修改职位成功',data.error);
                        setTimeout(function(){window.location.href='/company/'+$scope.position.company.$oid+'/position/manage'},1500);
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                        setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                    }
                })
        };
        $scope.get_position_detail = function(){
            $http.get(urls.api+"/position/"+$scope.position_id+"/get").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.position = data.data;
                        $scope.position.end_time = $filter('date')($scope.position.end_time.$date, 'yyyy-MM-dd HH:mm:ss');
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
    controller('DT_CompanyListCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg){
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
            $http.get(urls.api+"/account/company/list").
                success(function(data){
                if(data.error.code == 1){
                    $scope.company_list = data.data;
                    for(i=0;i<$scope.company_list.length;i++){
                        $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                        $scope.company_list[i].scale_value = $scope.scale[$scope.company_list[i].scale];
                        $scope.company_list[i].field_type = $scope.field_type[$scope.company_list[i].field];
                        $scope.company_list[i].position_type_value = {};
                        for(j = 0; j < $scope.company_list[i].position_type.length; j ++){
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
    controller('DT_CompanyDetailCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_CompanyDetailCtrl');
        $scope.company_id = $routeParams.company_id;
        $scope.company = {};
        $scope.member_list = {};
        $scope.tab1 = true;
        $scope.tab2 = false;
        $scope.favored = false;
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
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
                    }
                    else{
                        $scope.favored = false;
                    }
                }
                else{
                    $scope.error = $errorMsg.format_error('',data.error);
                }
            });
        };
        $scope.get_company = function(){
            $http.get(urls.api+"/account/company/" + $scope.company_id + "/detail_with_positions").
              success(function(data,status,headers,config){
                console.log(headers('Content-Type'));
                if(data.error.code == 1){
                    $scope.company = data.data;

                    $scope.company.position_number = $scope.company.positions.length;
                    for(i=0;i<$scope.company.position_number;i++){
                        $scope.company.position_list[i].position_type_value = $scope.position_type[$scope.company.position_list[i].position_type];
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
                    for(i=0;$scope.financing_list.length;i++){
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
        $scope.get_company_info = function(){
            $http.get(urls.api+"/account/company/"+$scope.company_id+"/detail").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.companyinfo = data.data;
                        var i=j=0;
                        var welfare_tags = data.data.welfare_tags;
                        for(i=0;i<welfare_tags.length;i++){
                            for(j=0;j<$scope.tags.length;j++){
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
        $scope.canAdd = function(ngModelController){
            return (ngModelController.$invalid && ngModelController.$dirty) ||  ngModelController.$pristine;
        };
        $scope.tag_long_error=function(ngModelController){
            return ngModelController.$invalid && ngModelController.$dirty;
        };
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
                    $scope.companyinfo.logo_id = data.data;
                }
                else{
                    console.log(data.error.message);
                    $scope.error = $errMsg.format_error('',data.error);
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
                $scope.error = $errMsg.format_error("请上传公司logo",{code:"-1"});
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
            for(i=0; i<$scope.tags.length; i++){
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
                });
        };
        $scope.get_company_info();
    }]).
    controller('DT_CompanySecondCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService','Upload',
        function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg,Upload){
        console.log('DT_CompanySecondCtrl');
        $scope.test = 'aaaa';
        $scope.company_id = $routeParams.company_id;
        $scope.financing_list = [
            {
                'stage':'seed',
                'organization':'清华创加',
                'amount' : 'ten'
            },
            {
                'stage':'seed',
                'organization':'清华创加',
                'amount' : 'ten'
            }
        ];
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
            });
        };
        $scope.get_delete_index = function($index){
            $scope.delete_index = $index;
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
            else if(!$scope.companyinfo.hasOwnProperty('no_financing') && $scope.financing_list.length==0){
                $scope.error = $errMsg.format_error("请填写融资信息，若无请勾选无融资",{code:"-1"});
                setTimeout(function(){$errMsg.remove_error($scope.error)},2000);
                return;
            }
             $csrf.set_csrf($scope.companyinfo);
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
                });
        };
    }]).
    controller('DT_CompanyForthCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService','Upload', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg,Upload){
        console.log('DT_CompanyForthCtrl');
        $scope.company_id = $routeParams.company_id;

        $scope.add_member_flag = false;
        $scope.member_add = {};
        $scope.company_id = $routeParams.company_id;
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
               "category": $scope.company_id + '_'+category
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
        };
        $scope.edit_member = function(index){
            $scope.member_add = $scope.member_list[index];
            $('#addMember').modal('show');
            $scope.edit = true;
            $scope.index = index;
        };
                $scope.pre_step = function(){
            window.location.href = '/company/'+$scope.company_id+'/create/second';
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
            $scope.companyinfo.info_complete = true;
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
                });
        };
    }]).
    controller('DT_PositionListCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg){
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
            '020':"O2O",
            'others':"其他"
        };

        $scope.positions = {};
        $scope.get_positions = function(){
            $http.get(urls.api+"/position/search").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.positions = data.positions;
                        for(i=0; i<$scope.positions.length;i++){
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
                });
        };
        $scope.get_positions();
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
    controller('DT_CompanyAccountCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', 'ErrorService',function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $errMsg){
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
