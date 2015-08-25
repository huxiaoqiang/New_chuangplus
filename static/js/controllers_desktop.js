'use strict';

/* Controllers */

angular.module('chuangplus.controllers', []).
    controller('DT_HomepageCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('HomepageCtrl');
    }]).
    controller('DT_HeaderCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_HeaderCtrl');
        $scope.get_company_info = function(){
            $http.get(urls.api+"/account/company/detail").
                success(function(data){
                    if(data.error.code == 1){
                        if(data.data.abbreviation != null){
                            $scope.url = '/company/'+data.data._id.$oid+'/infodetail';
                        }
                        else{
                            $scope.url = '/company/info';
                        }
                    }
                });
        };
        if($user.role()==1){
            $scope.get_company_info();
        }
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
    controller('DT_LoginCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg){
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
    controller('DT_RegisterCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg){
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
    controller('DT_InternPositionFavorCtrl',['$scope','$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
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
//                        var welfare_tags = $scope.companyinfo.welfare_tags.split(',');
//                        for(i=0; i<welfare_tags.length; i++){
//
//                        }

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
                    $scope.member_add.m_avatar_id = data.data;
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
            for(i=0; i<$scope.tags.length; i++){
                if(tags[i].chosed == true)
                    $scope.companyinfo.welfare_tags += tags[i].value;
                    $scope.companyinfo.welfare_tags += ',';
            }
            $scope.companyinfo.welfare_tags = $scope.companyinfo.welfare_tags.substring(0,$scope.companyinfo.welfare_tags-1);
            $csrf.set_csrf($scope.companyinfo);
            $http.post(urls.api+"/account/company/"+$scope.company_id+"/set", $.param($scope.companyinfo)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.error = $errMsg.format_error("保存公司信息成功",data.error);
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                    }
                });
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
        $scope.position_list = {};
        $scope.get_position_list = function(){
            $http.get(urls.api+"/position/company/list").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.position_list = data.data;
                        for(i=0; i<$scope.position_list.length;i++){
                            $scope.position_list[i].position_type = $scope.position_type[$scope.position_list[i].position_type];
                        }
                    }
                });
        };
        $scope.get_position_list();


    }]).
    controller('DT_CompanyPositionEditCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService','ErrorService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user,$errMsg){
        console.log('DT_CompanyPositionEditCtrl');
        $scope.position = {};
        $scope.create_position = function(){
            $csrf.set_csrf($scope.position);
            if($scope.position.end_time != ''){
                $scope.position.end_time = $filter('date')( $scope.position.end_time, 'yyyy-MM-dd HH:mm:ss');
            }
            $http.post(urls.api+"/position/create", $.param($scope.position)).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.error = $errMsg.format_error('发布职位成功',data.error);
                        setTimeout(function(){window.location.href='/'},2000);
                    }
                    else{
                        $scope.error = $errMsg.format_error('',data.error);
                    }
                })
        };

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

    controller('DT_UserInfoCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('DT_UserInfoCtrl');
        $scope.view_tab = 'tab1';
        $scope.changeTab = function(tab){
            $scope.view_tab = tab;
        }
    }]).
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

