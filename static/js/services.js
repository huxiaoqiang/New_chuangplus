'use strict';
/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('chuangplus.services', []).
    value('version', '0.1').
    service('CsrfService', ['$cookies' ,function($cookies){
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
    }]).
    service("ErrorService",['$cookies' ,function($cookies){
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
    service("HeaderService",[function(){
        var headerCtr = {
            "homepage":false,
            "company":false,
            "position":false,
            "resume":false,
            "none":false,
            "user":false
        };
        return {
            'homepage':function(){
                headerCtr = {
                    "homepage":true,
                    "company":false,
                    "position":false,
                    "resume":false,
                    "none":false,
                    "user":false
                };
                return headerCtr;
            },
            'company':function(){
                headerCtr = {
                    "homepage":false,
                    "company":true,
                    "position":false,
                    "resume":false,
                    "none":false,
                    "user":false
                };
                return headerCtr;
            },
            'position':function (){
                var headerCtr = {
                    "homepage":false,
                    "company":false,
                    "position":true,
                    "resume":false,
                    "none":false,
                    "user":false
                };
                return headerCtr;
            },
            'resume':function(){
                var headerCtr = {
                    "homepage":false,
                    "company":false,
                    "position":false,
                    "resume":true,
                    "none":false,
                    "user":false
                };
                return headerCtr;
            },
             'none':function(){
                var headerCtr = {
                    "homepage":false,
                    "company":false,
                    "position":false,
                    "resume":false,
                    "none":true,
                    "user":false
                };
                return headerCtr;
            },
             'user':function(){
                var headerCtr = {
                    "homepage":false,
                    "company":false,
                    "position":false,
                    "resume":false,
                    "none":false,
                    "user":true
                };
                return headerCtr;
            }
        };
    }]).
    service('ImgResizeService', [ function(){
        return{
            'cancle' : function(scope, src)
            {
                scope.resize_area = false;
                $('.img-upload-preview').attr('src',src);
                //$('.resize-image').attr('src',src);
            },
            'startUpload' : function(file,file_t,category,scope)
            {
                var resize = function(file,file_t,category)
                {
                    scope.resize_area = true;
                    var resizeableImage = function(image_target) {
                  // Some variable and settings
                      var $container,
                          orig_src = new Image(),
                          image_target = $(image_target).get(0),
                          event_state = {},
                          constrain = false,
                          min_width = 60, // Change as required
                          min_height = 60,
                          max_width = 500, // Change as required
                          max_height = 400,
                          resize_canvas = document.createElement('canvas');
                        

                      var init = function(){

                        // When resizing, we will always use this copy of the original as the base
                        orig_src.src=image_target.src;
                        //orig_src.width = 360;
                        //image_target.width = 360;
                        //resize_canvas.width = 360;
                        //resize_canvas.height = 360 / orig_src.width * orig_src.height;
                        // Wrap the image with the container and add resize handles
                        $(image_target).wrap('<div class="resize-container"></div>')
                        .before('<span class="resize-handle resize-handle-nw"></span>')
                        .before('<span class="resize-handle resize-handle-ne"></span>')
                        .after('<span class="resize-handle resize-handle-se"></span>')
                        .after('<span class="resize-handle resize-handle-sw"></span>');

                        // Assign the container to a variable
                        $container =  $(image_target).parent('.resize-container');

                        // Add events
                        $container.on('mousedown touchstart', '.resize-handle', startResize);
                        $container.on('mousedown touchstart', 'img', startMoving);
                        $('.js-crop').on('click', crop);
                      };

                      var startResize = function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        saveEventState(e);
                        $(document).on('mousemove touchmove', resizing);
                        $(document).on('mouseup touchend', endResize);
                      };

                      var endResize = function(e){
                        e.preventDefault();
                        $(document).off('mouseup touchend', endResize);
                        $(document).off('mousemove touchmove', resizing);
                      };

                      var saveEventState = function(e){
                        // Save the initial event details and container state
                        event_state.container_width = $container.width();
                        event_state.container_height = $container.height();
                        event_state.container_left = $container.offset().left; 
                        event_state.container_top = $container.offset().top;
                        event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft(); 
                        event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
                        
                        // This is a fix for mobile safari
                        // For some reason it does not allow a direct copy of the touches property
                        if(typeof e.originalEvent.touches !== 'undefined'){
                            event_state.touches = [];
                            $.each(e.originalEvent.touches, function(i, ob){
                              event_state.touches[i] = {};
                              event_state.touches[i].clientX = 0+ob.clientX;
                              event_state.touches[i].clientY = 0+ob.clientY;
                            });
                        }
                        event_state.evnt = e;
                      };

                      var resizing = function(e){
                        var mouse={},width,height,left,top,offset=$container.offset();
                        mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft(); 
                        mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
                        
                        e.shiftKey = true;
                        // Position image differently depending on the corner dragged and constraints
                        if( $(event_state.evnt.target).hasClass('resize-handle-se') ){
                          width = mouse.x - event_state.container_left;
                          height = mouse.y  - event_state.container_top;
                          left = event_state.container_left;
                          top = event_state.container_top;
                        } else if($(event_state.evnt.target).hasClass('resize-handle-sw') ){
                          width = event_state.container_width - (mouse.x - event_state.container_left);
                          height = mouse.y  - event_state.container_top;
                          left = mouse.x;
                          top = event_state.container_top;
                        } else if($(event_state.evnt.target).hasClass('resize-handle-nw') ){
                          width = event_state.container_width - (mouse.x - event_state.container_left);
                          height = event_state.container_height - (mouse.y - event_state.container_top);
                          left = mouse.x;
                          top = mouse.y;
                          if(constrain || e.shiftKey){
                            top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
                          }
                        } else if($(event_state.evnt.target).hasClass('resize-handle-ne') ){
                          width = mouse.x - event_state.container_left;
                          height = event_state.container_height - (mouse.y - event_state.container_top);
                          left = event_state.container_left;
                          top = mouse.y;
                          if(constrain || e.shiftKey){
                            top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
                          }
                        }
                        
                        // Optionally maintain aspect ratio
                        if(constrain || e.shiftKey){
                          height = width / orig_src.width * orig_src.height;
                        }

                        if(width > min_width && height > min_height && width < max_width && height < max_height){
                          // To improve performance you might limit how often resizeImage() is called
                          resizeImage(width, height);  
                          // Without this Firefox will not re-calculate the the image dimensions until drag end
                          $container.offset({'left': left, 'top': top});
                        }
                      };

                      var resizeImage = function(width, height){
                        resize_canvas.width = width;
                        resize_canvas.height = height;
                        resize_canvas.getContext('2d').drawImage(orig_src, 0, 0, width, height);   
                        $(image_target).attr('src', resize_canvas.toDataURL("image/png"));  
                      };

                      var startMoving = function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        saveEventState(e);
                        $(document).on('mousemove touchmove', moving);
                        $(document).on('mouseup touchend', endMoving);
                      };

                      var endMoving = function(e){
                        e.preventDefault();
                        $(document).off('mouseup touchend', endMoving);
                        $(document).off('mousemove touchmove', moving);
                      };

                      var moving = function(e){
                        var  mouse={}, touches;
                        e.preventDefault();
                        e.stopPropagation();
                        
                        touches = e.originalEvent.touches;
                        
                        mouse.x = (e.clientX || e.pageX || touches[0].clientX) + $(window).scrollLeft(); 
                        mouse.y = (e.clientY || e.pageY || touches[0].clientY) + $(window).scrollTop();
                        $container.offset({
                          'left': mouse.x - ( event_state.mouse_x - event_state.container_left ),
                          'top': mouse.y - ( event_state.mouse_y - event_state.container_top ) 
                        });
                        // Watch for pinch zoom gesture while moving
                        if(event_state.touches && event_state.touches.length > 1 && touches.length > 1){
                          var width = event_state.container_width, height = event_state.container_height;
                          var a = event_state.touches[0].clientX - event_state.touches[1].clientX;
                          a = a * a; 
                          var b = event_state.touches[0].clientY - event_state.touches[1].clientY;
                          b = b * b; 
                          var dist1 = Math.sqrt( a + b );
                          
                          a = e.originalEvent.touches[0].clientX - touches[1].clientX;
                          a = a * a; 
                          b = e.originalEvent.touches[0].clientY - touches[1].clientY;
                          b = b * b; 
                          var dist2 = Math.sqrt( a + b );

                          var ratio = dist2 /dist1;

                          width = width * ratio;
                          height = height * ratio;
                          // To improve performance you might limit how often resizeImage() is called
                          resizeImage(width, height);
                        }
                      };

                      var transfer = function(canvas)
                      {
                        var data=canvas.toDataURL();
                        // dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
                        data=data.split(',')[1];
                        data=window.atob(data);
                        var ia = new Uint8Array(data.length);
                        for (var i = 0; i < data.length; i++) {
                            ia[i] = data.charCodeAt(i);
                        };

                        // canvas.toDataURL 返回的默认格式就是 image/png
                        var blob=new Blob([ia], {type:"image/png"});
                        return blob;
                      }

                      var crop = function(){
                        //Find the part of the image that is inside the crop box
                        var crop_canvas,
                            left = $('.overlay').offset().left - $container.offset().left,
                            top =  $('.overlay').offset().top - $container.offset().top,
                            width = $('.overlay').width(),
                            height = $('.overlay').height();
                            
                        crop_canvas = document.createElement('canvas');
                        crop_canvas.width = width;
                        crop_canvas.height = height;
                        
                        crop_canvas.getContext('2d').drawImage(image_target, left, top, width, height, 0, 0, width, height);
                        //window.open(crop_canvas.toDataURL("image/png"));
                        var dataURL=crop_canvas.toDataURL();
                        // dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
                        var data=dataURL.split(',')[1];
                        data=window.atob(data);
                        var ia = new Uint8Array(data.length);
                        for (var i = 0; i < data.length; i++) {
                            ia[i] = data.charCodeAt(i);
                        };
                        // canvas.toDataURL 返回的默认格式就是 image/png
                        var blob=new Blob([ia], {type:"image/png"});

        //                $('.change_tab').innerHTML = '<img src="'+dataURL+'" alt=""/>' ;
        //                document.getElementById('#logo-preview').src="/api/file/"+ scope.companyinfo.logo_id+ "/download"; 
                        //window.open(crop_canvas.toDataURL("image/png"));
                        scope.upload(blob,file_t,category);
                        $('.img-upload-preview').attr('src',crop_canvas.toDataURL("image/png"));
                        scope.resize_area = false;
                        //location.reload();
                        //$('#img_preview').attr('ngf-src',crop_canvas.toDataURL("image/png"));
                        
                      }

                      init();
                    };

                    // Kick everything off with the target image
                    resizeableImage($('.resize-image'));
                };

                if (file == undefined || file == null || file == '') 
                    return false;
                if(!/image\/\w+/.test(file.type)){ 
                    alert("文件必须为图片！"); 
                    return false; 
                } 
                var reader = new FileReader(); 
                reader.readAsDataURL(file); 
                reader.onload = function(e){ 
                    $('.resize-image').attr('src',this.result);
                    resize(file,file_t,category);
                } 
            }
        };
    }])
    .service('UserService', ['urls', '$http', '$cookies', function(urls, $http, $cookies){
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
        return {
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
                delete $cookies['username'];
                delete $cookies['role'];
            }
        };
    }]).
    filter('id2date', function(){
        return function(value) {
            var secs = parseInt(value.substring(0,8), 16)*1000;
            var tmp_date = new Date(secs);
            return tmp_date.getFullYear() + '年' + (tmp_date.getMonth() + 1) + '月' + tmp_date.getDate() + '日';
        };
    }).
    factory('safeApply', function($rootScope) {
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
    });