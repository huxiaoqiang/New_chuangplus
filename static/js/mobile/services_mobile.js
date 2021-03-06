'use strict';
/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('chuangplus_mobile.services', ['chuangplus_mobile.services']).
    value('version', '0.1')
    .service('CsrfService', ['$cookies' ,function($cookies){
        return {
            'val': function() {
                return $cookies.csrftoken;
            },
            'set_csrf': function(data) {
                data['csrfmiddlewaretoken'] = $cookies.csrftoken;
            },
            'set_csrf_array': function(data){
                data.push({'csrfmiddlewaretoken': $cookies.csrftoken});
            }
        };
    }])
    .service('NoticeService',['$cookies',function($cookies){
        $(".notice-bar").html("欢迎来到犀牛");
        return {
            'show': function(data) {
                $(".notice-bar").html(data);
                $(".notice-bar").slideDown("fast");
                setTimeout(function(){$(".notice-bar").slideUp("fast");},1800);
            }
        };
    }])
    .service("ErrorService",['$cookies' ,function($cookies){
        var error_message = {
            'code15':"文件大小超过10M",
            'code18':"没有上传文件权限",
            'code19':'上传文件为空',
            'code20':'要下载的文件不存在',
            'code30':'没有删除文件的权限',
            'code31':'文件不存在，删除失败',
            'code98':"验证码已经失效，请刷新验证码重试",
            'code99':"需要验证码",
            'code100':'没有权限 ',
            'code101':'验证码错误',
            'code103':'用户不存在',
            'code104':'用户信息不存在',
            'code105':'公司信息不存在',
            'code106':'注册失败',
            'code107':'用户名已存在或用户名包含特殊字符',
            'code108':'用户名或密码错误',
            'code109':'新旧密码一样',
            'code110':'没有修改权限',
            'code112':'公司成员不存在',
            'code113':'您是hr，请到hr页面登录',
            'code114':'您是实习生，请到实习生页面登录',
            'code115':'邮箱已经被注册',
            'code116':'邮箱格式不正确',
            'code117':'密码错误',
            'code120':'简历不存在',
            'code121':'融资信息不存在',
            'code210':'职位名太长或者太短',
            'code211':'职位名中包含非法字符',
            'code212':'非法的职位类别',
            'code213':'工作城市字数长度过长或过短',
            'code214':'工作城市中包含非法字符',
            'code215':'工作地址字数长度过长或过短',
            'code216':'工作地址中包含非法字符',
            'code217':'非法的时间形式',
            'code218':'截止时间不能早于发布时间',
            'code219':'职位描述长度超出限度',
            'code220':'职位描述包含非法字符',
            'code221':'职位要求长度超出限度 ',
            'code222':'职位描述中包含非法字符 ',
            'code223':'每周工作时间选择错误，在1到7之间 ',
            'code224':'实习时间错误，应该是一个非负整数 ',
            'code225':'薪资最低值填写错误',
            'code226':'薪资最高值填写错误',
            'code227':'薪资上限应该大于薪酬下限',
            'code228':'职位状态错误',
            'code231':'错误的搜索值：id',
            'code232':'错误的搜索值：城市',
            'code233':'错误的搜索值：每周至少工作的天数',
            'code234':'错误的搜索值：每周最多工作的天数',
            'code235':'错误的搜索值：最低薪资',
            'code236':'错误的搜索值：最高薪资',
            'code237':'错误的搜索值：职位状态',
            'code249':'对象不存在',
            'code250':'存储失败',
            'code251':'搜索失败',
            'code252':'删除失败',
            'code260':'职位不存在',
            'code261':'关注关系不存在，不能取消关注',
            'code262':'职位只能是兼职或全职',
            'code263':'关注公司关系不存在',
            'code264':'用户未投递该职位',
            'code265':'用户未投递任何职位',
            'code266':"已经投递了该职位",
            'code267':'没有实习生投递该职位',
            'code268':'没有岗位消息要处理',
            'code269':'邀请码错误，请联系创加获取邀请码',
            'code270':'邮箱验证码错误',
            'code271':'邮箱验证码失效，请重新发送邮箱验证码',
            'code272':"登录错误",
            'code273':"您的info用户名已经被注册，请去普通登录页登录",
            'code299':'未知错误'
        };
        return {
            'format_error': function (msg,error) {
                if(msg != '' && error.code == 1){
                    error.message = msg;
                    error.class = "alert alert-success";
                }
                else{
                    error.class = "alert alert-danger";
                    error.message = msg;
                    if(error.code != -1){
                        error.code_key = 'code'+error.code;
                        error.message = error_message[error.code_key];
                    }
                }
                error.show = true;
                return error;
            },
            'remove_error':function(error){
                error.show = false;
            }
        };
    }]).
    service('UserService', ['urls', '$http', '$cookies', '$location', '$rootScope', function(urls, $http, $cookies, $location, $rootScope){
        var user = {};
        // $.get(urls.api + '/user/status', function(data){
        //     user = data;
        // });
        if($cookies.username){
            user.username = $cookies.username;
        }
        if($cookies.id){
            user.id = $cookies.id;
        }
        if($cookies.role){
            user.role = $cookies.role;
        }
        //alert(user.username);
        //if(user.username == undefined && $location.path() != '/mobile/login' && $location.path() != '/mobile/register')
        //{
        //   window.location.href='/mobile/login';
        //}
        return {
            'check_info' : function(){
                if(user.username != undefined)
                {
                    $http.get(urls.api+"/account/userinfo/get").
                        success(function(udata){
                        if(udata.error.code == 1){
                            $rootScope.is_tsinghua = udata.data.is_info;
                            if( udata.data.major == undefined ||
                                udata.data.university == undefined ||
                                udata.data.grade == undefined ||
                                ($rootScope.is_tsinghua && udata.data.email == undefined))
                            {
                                console.log('需要填写信息');
                                window.location.href='/mobile/info';
                            }
                        }
                        else
                            $notice.show($errMsg.format_error("",udata.error).message);
                    });
                }
            },
            'check_login' : function(){
                if(user.username == undefined)
                {
                    window.location.href='/mobile/login';
                    return;
                }
                $http.get(urls.api+"/account/userinfo/get").
                    success(function(udata){
                    if(udata.error.code == 1){
                        if( udata.data.major == undefined ||
                            udata.data.university == undefined)
                        {
                            console.log('需要填写信息');
                            window.location.href='/mobile/info';
                        }
                    }
                    else
                        $notice.show($errMsg.format_error("",udata.error).message);
                });
            },
            'is_login' : function(){
                return (user.username != undefined)
            },
            'username': function(){
                return user.username;
            },
            'refresh': function(){
                $.get(urls.api + '/user/status', function(data){
                    user = data;
                });
            },
            'id': function(){
                return user.id;
            },
            'role': function(){
                return user.role;
            },
            'school_manager': function(){
                if(!('role' in user)){
                    return false;
                }
                return parseInt(user.role) == 0 || parseInt(user.role) == 4;
            },
            'department_manager': function(){
                if(!('role' in user)){
                    return false;
                }
                return parseInt(user.role) == 0 || parseInt(user.role) == 3;
            },
            'logout': function(){
                //delete $cookies['username'];
                $.cookie('username','',{path:"/"});
                //delete $cookies['role'];
                $.cookie('role', '',{path:"/"}); 
            }
        };
    }]).
    factory('safeApply',['$rootScope',function($rootScope){
    return function(scope, fn) {
        var phase = scope.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && ( typeof (fn) === 'function')) {
                fn();
            }
        } else {
            scope.$apply(fn);
        }
    }
    }]);

