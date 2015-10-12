chuangplus项目api文档
=========================
****
### Author：huxiaoqiang
=========================
##<a name="table"/>数据模型结构
###Account
####User
字段      |类型      |修饰      |解释
----------|----------|----------|----------
id            |primarykey  |          |主键
username      |StringField |          |
is_info       |BooleanFiled|          |True:info账号，False不是info账号
password      |            |          |
email         |EmailFiedl  |          |
is_staff      |BooleanFiled|          |True：企业用户，False：个人用户

####实习生信息表Userinfo
字段   |类型   |修饰   |解释
----------|----------|----------|----------
id            |primarykey  |          |主键
user          |ReferenceField|关联数据  |对应的user
username      |StringField |同User中  |用户名
email         |EmailFiele  |同User中  |邮箱
real_name     |StringField |          |真实姓名
work_city     |StringField |          |工作城市
cellphone     |StringField |          |电话  
university    |StringField |          |大学
major         |StringField |          |专业
description   |StringField |          |个人百字简介
grade         |IntField    |默认：1   |年级
gender        |IntField    |默认：0   |0代表女性，1代表男性
work_days     |IntField    |默认：3   |每周工作天数
position_type |StringField |          |工作类别
resume_id     |StringField |          |简历附件id
resume_name   |StringField |          |简历附件名字
date_joined   |DateTimeField|默认now  |创建时间
update_time   |DateTimeField|默认now  |更新时间
info_complete |BooleanField|默认：0   |信息是否完整


####公司信息表Companyinfo
字段   |类型   |修饰   |解释
----------|----------|----------|----------
id                 |primarykey  |             |主键
user               |ReferenceField|关联数据   |对应的user
username           |StringField |             |和注册的用户名一样
hr_cellphone       |StringField |             |hr电话
ICregist_name      |StringField |             |公司工商注册名称
abbreviation       |StringField |             |公司简称
city               |StringFiled |             |公司所在地
field              |StringFiled |             |行业领域（FIELD见表下）
scale              |IntField    |默认为0      |0：初创1：快速发展2：成熟（根据stage确定）
stage              |StringFiled |默认为'none' |融资阶段（STAGE见表下）
homepage           |URLField    |             |公司主页
wechat             |StringField |             |公司公众号
email_resume       |EmailField  |             |收简历邮箱
qrcode_id          |StringField|File          |微信二维码id
logo_id            |StringField|File          |公司logo id
welfare_tags       |ListField(StringField) |  |福利标签
product_link       |URLField    |             |产品链接
brief_introduction |StringField |             |公司一句话简介
Company_descrition |StringFiled |             |公司简介
product_description|StringField |             |产品简介
team_description   |StringField |             |团队介绍
slogan             |StringFiled |             |公司标语
status             |BooleanField|             |是否被后台管理员认证通过
is_auth            |BooleanField|default=False|投资机构认证
auth_organization  |StringField |             |认证机构
date_joined        |DateTimeField|默认now     |创建时间
update_time        |DateTimeField|默认now     |更新时间
info_complete      |BooleanField|默认：0      |信息是否完整
positions          |ListField(ReferenceField) |发布的所有职位
financings         |ListField(ReferenceField) |融资信息
members            |ListField(ReferenceField) |公司成员信息

FIELD = ('social','e-commerce','education','health_medical','culture_creativity','living_consumption','hardware','O2O','others')<br/>
STAGE=('none','seed','angel','A','B','C','D_plus')


####融资信息表Financing
字段   |类型   |修饰   |解释
------------|-----------|-----------|-----------
company     |ReferenceField|          |关联的公司
stage       |StringField|choices=STAGE|融资阶段
organization|StringField|           |融资机构
amount      |StringField|choices=AMOUNT|数量级
AMOUNT=('ten','hundred','thousand','thousand_plus')数量级分别表示十万级，百万级，千万级，以及亿级<br/>
STAGE=('no','angel','A','B','C','D_plus') 分别表示没有融资，天使轮，A轮，B轮，C轮，D及D以上轮融资<br/>

####公司成员表Member
字段   |类型   |修饰   |解释
------------|-----------|-----------|-----------
company       |ReferenceField|        |关联的公司
m_name        |StringField|           |成员名字
m_position    |StringField|           |成员职位
m_introduction|StringField|           |成员介绍
m_avatar      |ReferenceField|关联File|成员头像

####求职者和公司关系表UC_Relationship(收藏关系)
字段   |域
------------|-----------
company     |Companyinfo
user        |Userinfo



###职位模块position
####职位表Position
字段   |类型   |修饰   |解释
------------|-----------|-----------|-----------
id                  |primarykey     |              |
company             |ReferenceField |Companyinfo   |关联的公司
name                |StringField    |              |职位名
position_type       |StringField    |choices=TYPE  |类别(TYPE见表下)
work_city           |StringField    |              |工作城市
work_addr           |StringField    |              |工作具体地点
release_time        |DateTimeField  |=now          |发布时间
end_time            |DateTimeField  |              |职位截止时间
position_description|StringField    |              |职位描述
position_request    |StringField    |              |职位要求
days_per_week       |IntField       |default=3     |每周工作天数
internship_time     |IntField       |default=1     |实习时间（月）
salary_min          |IntField       |default=0     |薪水下限
salary_max          |IntField       |default=0     |薪水上限
delivery_number     |IntField       |default=0     |职位已经投递的人数
status              |Stringfield    |choices=STATUS|职位状态(STATUS见表下)
TYPE = ('technology','product','design','operate','marketing','functions','others')<br/>
STATUS = ('open','closed')

####实习生和职位收藏关系表UP_Relationship
字段   |域
------------|-----------
user        |User
position    |Position

####实习生投递职位表UserPosition
字段   |类型   |修饰   |解释
------------|-----------|-----------|-----------
user        |ReferenceField|User    |关联用户（实习生）
position    |ReferenceField|Position|关联职位
submit_date |DateTimeField |        |投递日期
resume_submitted|FileField |        |投递的简历附件
processed   |BooleanField  |default=False|处理状态，默认是未处理
interested  |BooleanField  |default=False|hr是否感兴趣

###文件模块filedata
####文件表File
字段   |类型   |修饰   |解释
------------|-----------|-----------|-----------
name        |StringField|           |文件名
type        |StringField|           |文件类型
description |StringField|           |文件描述
upload_time |DateTimeField|         |上传时间
value       |FileField  |           |文件

#api接口
##登录注册相关
考虑到django的csrf机制，需要在HTTP请求头添加X-CSRF-token,内容为cookie中的csrftoken，或者在请求中增加一个csrfmiddlewaretoken字段，内容也是cookie中的csrftoken。我们使用的方法是后者，在static/js/services.js中构建了CsfrService，在post表单之前执行
```javascript
set_csrf(data)
```
##请求返回错误码，见error_code.txt
每个post请求都会有错误码返回，当错误码为1时，表明请求处理成功，如果错误码不为1，则表明后台处理前台请求时出现了相应的错误，需要根据错误码来排查错误
###/api/captcha/image/
获取验证码（method:get）
###/api/account/register/
新用户注册 (method: post)
需要post的表单字段如下
```javascript
  {
    "username" : "someone",           //用户名
    "password" : "password",          //密码
    "email"    : "someone@where.com", //邮箱
    "captcha"  : "FCR3",              //验证码
    "role"     : "0"                  //角色，0代表求职者，1代表企业
  }
```
###/api/account/checkusername/ 
验证用户名是否存在(method:post)
在注册页面，可以通过Ajax来测试用户名是否可用。post的字段只有一个键 "username"，内容是需要检测的用户名。
```javascript
  {
    "username" : "someuser"
  }
```
返回的 json 也只有一个键 "exist"，即用户是否存在。
```
  {
    "error": {"code":1,"message":"some message"},
    "data" : {"exist":true} (或者{"exist":false})
  }
```
###/api/account/checkemail/
验证邮箱是否已经被注册(method:post)
```javascript
  {
    "email" : "someone@email.com"
  }
```
返回同上

###/api/account/login_by_tsinghua
通过清华info账号登录（methed:post）
向url post 用户名与密码
```javascript
  {
    "username" : "someone",
    "password" : "password",
    "captcha"  : "FCR3",              
  }

```
若登录成功则返回
```
{
	"error": {"code":1,"message":"login succeed"},
	"completive":0 or 1(信息完全)
	"role" : 0（学生用户） or 1(代表公司用户)
}
```
###/api/account/login
用户登录 （method : post）
向url post用户名和密码
```javascript
  {
    "username" : "someone",
    "password" : "password",
    "captcha"  : "FCR3",              
  }
```
若登录成功则返回
```
{
	"error": {"code":1,"message":"login succeed"},
	"completive":0 or 1(信息完全)
	"role" : 0（学生用户） or 1(代表公司用户)
}
```
###/api/account/logout
用户注销
返回 
{
	"error":{"code":1,"message":"logout successfully!"
}
###/api/account/password/set
修改密码(method : post)
向url post密码和新密码（在用户已经登录的条件下）
```javascript
  {
    "password" : "*******",
    "new_password" : "********"
  }
```
###/api/account/set_withcode
忘记密码时修改密码(method:post)
向url post邮箱 邮箱验证码和新密码
```javascript
   {
	"input_code":
	"email":
	"new_password":
   }
```
返回
  errorcode   状态
	1          成功
	2          没有post
	117        数据库错误
	270        邮箱验证码错误
	271        邮箱验证码无效

###/api/account/userinfo/get
获取实习生用户信息(method : get)
返回实习生用户信息的json对象和错误码

###/api/account/userinfo/set
修改实习生用户信息(method : post)
post userinfo信息，返回错误码和post的用户信息json对象
其中必须要写的字段是：
```javascript
  {
    "real_name"     : "real_name",
    "email"         : "real_name",
    "position_type" : "type1,type2,type3", //用','连接不同的type
    "work_city"     : "work_city",
    "cellphone"     : "cellphone",
    "university"    : "university",
    "major"         : "major",
    "grade"         : "grade",
    "gender"        : "gender",
    "work_days"     : "work_days",
    "description"   : "description"
  }
```


###/api/account/userinfo/set_by_tsinghua
修改清华info账号实习生用户信息(method : post)
post userinfo信息，返回错误码和post的用户信息json对象
其中必须要写的字段是：
```javascript
  {
    "email"         : "real_name",
    "university"    : "university",
    "major"         : "major",
    "grade"         : "grade",
  }
```

###/api/userinfo/checkall
判断实习生用户的信息是否填写完全(比下面的函数多检查了简历信息)(method : get)
返回如下
```javascript
  {
  "error":{}
  "complete" : "True"(or "False")
  }
```

###/api/account/userinfo/check
判断实习生用户的信息是否填写完全(method : get)
返回如下
```javascript
  {
  "error":{}
  "complete" : "True"(or "False")
  }
```

###/api/account/userinfo/position/favor/list
获取用户收藏的职位列表(method : get)
在用户已经登录的状态下，请求处理成功时，返回一个list,list中每一个对象是一个职位

###/api/account/userinfo/position/favor/submitall
向所有还没有投递简历的职位投递简历(method:post)
返回errorcode

###/api/account/userinfo/position/submit/list
获取用户投递的职位列表(method : get)
在用户已经登录的状态下，请求处理成功时，返回一个list,list中每一个对象是一个职位

###/api/account/userinfo/company/favor/list
获取用户收藏的公司列表(method : get)
在用户已经登录的状态下，请求处理成功时，返回一个list,list中每一个对象是一个公司信息

###/api/account/userinfo/(?P<position_id>.*?)/check_favor_position
判断用户是否关注了position_id这个职位(method : get)
返回结果为
```javascript
  {
    'data'  : {'exist' : true}, (或者{'exist' : false} )
    'error' : {}
  }
```

###/api/account/userinfo/(?P<company_id>.*?)/check_favor_company
判断用户是否关注了company_id这个公司(method : get)
返回结果同上

###/api/account/userinfo/remove/closed_position
移除用户position列表中被关闭的职位(method : post)
返回errorcode

###/api/account/sendemail
“找回密码”时，向用户邮箱发送验证码 (method : post)
向url post用户邮箱,其中邮箱是用户注册时填写的邮箱
```javascript
  {
    "email"    : "someone@where.com", //邮箱
  }
```

###/api/account/verifycode
验证用户输入的验证码与发送到用户邮箱的验证码是否一致
向url post用户输入的验证码：
```javascript
  {
    "input_code"    : "******", //用户输入的验证码，六位0-9的数字 
  }
```
返回内容为：
```javascript
  {
    "pass_verify"    : True or False, //True表示验证通过，False表示验证不通过
  }
```

##member 相关
###/api/account/member/create
创建一个成员(method : post)
表单字段必须包含：
```javascript
  {
    "m_name"         : "m_name",
    "m_position"     : "m_position",
    "m_introduction" : "m_introduction",
  }
```
###/api/account/member/(?P<company_id>.*?)/list
参数:company_id，获取company_id公司的所有成员(method : get)
返回一个list,list中的每一个对象是一个成员
###/api/account/member/(?P<mem_id>.*?)/set
参数:mem_id，修改成员mem_id的信息(method : post)
###/api/account/member/(?P<mem_id>.*?)/delete
参数为mem_id，删除成员mem_id


##financing相关
###/api/account/financing/create
创建一个融资轮(method : post)
必须post的字段有：
```javascript
  {
    "username"       : "username"    //如果是企业用户，可为空；如果是超级用户，需要post对应公司的username
    "stage"          : "stage",
    "organization"   : "organization",
    "amount"         : "amount"
  }
```
###/api/account/financing/(?P<company_id>.*?)/list
参数:company_id，获取company_id公司的所有融资信息(method:get)
###/api/account/financing/(?P<fin_id>.*?)/set
参数:fin_id，修改fin_id的融资信息(method:post)
###/api/account/financing/(?P<fin_id>.*?)/delete
参数:fin_id，删除fin_id的融资信息(method : post)

##公司相关Company
###/api/account/company/list
获取公司列表,获取公司列表时，有5个过滤字段，分别如下：
```javascript
  {
    "text"              : "text"    //文本信息，根据公司的工商注册名和公司简称来过滤
    "field"             : "field",  //根据公司所在领域来过滤
    "auth_organization" : "auth_organization", //根据投资机构认证信息来过滤
    "scale"             : "scale",   //根据公司规模来过滤
    "status"            : "status"   //根据公司是否被后台管理员认证来过滤
  }
```
###/api/account/company/(?P<company_id>.*?)/detail
参数为company_id，获取company_id公司的详细信息 (method : get)
此接口返回的公司信息不包含公司的职位信息，在不需要公司职位信息时用。


###/api/account/company/(?P<company_id>.*?)/detail_with_positions
参数为company_id，获取company_id公司的详细信息 (method : get)
此接口返回的公司信息包含公司的职位信息，职位详情信息在position_list字段中，职位在招信息(在招的职位类别)在position_type这个字段中。

###/api/account/company/detail
无参数，通过用户的username获取公司的详细信息 (method : get)
此接口返回的公司信息不包含公司的职位信息，在不需要公司职位信息时用。

###/api/account/company/(?P<company_id>.*?)/set
参数为company_id，修改company_id公司的信息 (method : set)

###/api/account/company/(?P<company_id>.*?)/auth
参数为company_id，认证company_id这个公司，提交表单如下
```javascript
  {
  "status"            : "0" or "1",    //0代表后台审批不通过
  "auth_organization" : "" or "auth_organization"  //空表示没有投资机构认证，有表示投资机构认证
  }
```

###/api/account/company/count 
获取公司数量（method:get）
返回参数
```
   {
	'companyNumber' : 公司数量
	error
   }
```


###api/account/position/count
获取职位数量（method:get）
返回参数
```
   {
	'positionNumber' : 公司数量
	error
   }

###/api/account/company/(?P<company_id>.*?)/check
参数为company_id，检查公司信息是否填写完全,返回如下：
```javascript
  {
  "error":{}
  "complete" : "True"(or "False")
  }
```

###/api/account/company/(?P<company_id>.*?)/like
参数为company_id，收藏公司company_id(method : post)

###/api/account/company/(?P<company_id>.*?)/unlike
参数为company_id，取消对公司company_id的收藏 (method : post)

###/api/account/company/(?P<position_id>.*?)/process
position_id，hr批量处理该职位的投递者，将所有投递该职位的投递设为已处理(method : post)

###/api/account/company/(?P<position_id>.*?)/(?P<username>.*?)/process
position_id，hr处理username用户对该职位的投递，将状态改为hr已经处理(method : post)

###/api/account/company/(?P<position_id>.*?)/submit/list
参数为position_id，获取公司发布的position_id这个职位的所有投递者信息(method : get)

###管理员相关admin
###/api/account/admin/company/list
获取公司列表(method:get)
```javascript
	{
	"status"
	"info_complete"
	"is_auth"
	"page" :若无则为1
	}
```
返回
```
{
	error : {code :"1",message:"succeed"}
	'data': 公司信息
	'page_number':
}
```
###/api/account/admin/company/(?P<company_id>.*?)/detail_with_financing
通过融资获取公司列表（method:get）

###/api/account/admin/image/list
通过邮件获得公司logo（method：get）

##职位相关position
###/api/position/create
创建职位，post如下字段
```javascript
  {
  "name"                 : "name", 
  "position_type"        : "position_type",
  "work_address"         : "work_address",
  "end_time"             : "end_time",
  "position_description" : "position_description",
  "position_request"     : "position_request",
  "days_per_week"        : "days_per_week",
  "internship_time"      : "internship_time",
  "salary_min"           : "salary_min",
  "salary_max"           : "salary_max",
  "status"               : "status",
  }
```
###/api/position/(?P<position_id>.*?)/delete
参数是position_id，删除position_id这个职位 (method : post)
###/api/position/(?P<position_id>.*?)/set
参数是position_id，修改position_id这个职位信息 (method : post)
###/api/position/(?P<position_id>.*?)/get
参数是position_id，获取position_id这个职位信息 (mothod : get)
###/api/position/(?P<position_id>.*?)/get_with_company$
参数是position_id，获取position_id这个职位信息，其中职位信息中包含了该职位所在的公司的信息， 在company这个字段中(mothod : get)

###/api/position/(?P<position_id>.*?)/submit
参数是position_id，投递position_id这个职位信息

###/api/position/search
搜索职位，可以通过如下几个字段去过滤
```javascript
  {
  
  "id"     : "id",
  "name"   : "name",
  "types"   : "type",
  "fields"   : "fields",
  "work_city" : "work_city",
  "mindays"  : "mindays",
  "maxdays"  : "maxdays",
  "salary_min" : "salary_min",
  "salary_max" : "salary_max",
  "status"     : "status",
  "page"       : "page",
  }
```

###/api/position/company/(?P<company_id>.*?)/list
获取公司的所有的职位信息(method : get)

###/api/position/(?P<position_id>.*?)/submit
投递简历(method : post)
参数: position_id，post的字段信息如下
```javascript
  {
  "resume_choice" : "1" or "2", //1表示用上传保存的简历来投递，2表示新上传一个简历马上投递
  "file"          : "file",     //当resume_choice为2时，必需
  "position_id"   : "position_id"
  }
```
###/api/position/(?P<position_id>.*?)/check_submit
验证用户是否投递了position_id该职位(method : get)
返回如下：
```javascript
  {
    "error" : {},
    'data'  : {'exist' : true}, (或者{'exist' : false} )
  }
  
```
###/api/position/emailresume
向公司邮寄昨天到今天投递的简历


###/api/position/(?P<position_id>.*?)/userlikeposition
用户收藏该职位(method : post)
参数为position_id

###/api/position/(?P<position_id>.*?)/userunlikeposition
用户取消收藏该职位(method : post)
参数为position_id

###/api/position/(?P<position_id>.*?)/close
hr关闭职位(method : post)
参数为position_id

###/api/position/(?P<position_id>.*?)/open
hr开放职位(method : post)
参数为position_id

###文件处理filedata
###/api/filedata/upload
上传文件函数（method:post）
包括上传公司logo，二维码；创始人头像和简历并生成缩略图(除简历外)
request.FILES.get来获得文件
post如下字段
```javascript
   {
   "data" :{"file_type"(文件类型),"category"(flag),
		    "description"(对文件的描述),
			"avatar_id"(创始人id 只有在上传头像时才有)}
   }
```
返回参数
```
   {
		"error" : {code: errorcode , message : "some messagae"},
		"data" : 文件的id
   }
```


###/api/filedata/(?P<file_id>.*?)/download
下载文件（method:get）
参数file_id如下:
```javascript
   {
     "file_id" : 文件id
   }
```
返回
```
	文件本身
   {
	"filename"(文件名字)
	"Content-Disposition" : "attachment; filename=\"" + 文件名
   }
```


###/api/filedata/(?P<file_type>.*?)/(?P<category>.*?)/download_special
下载某个文件(method: get)
参数如下
```javascript
   {
	"file_type" : 文件类型
	"category"  :  文件某个flag(用于和公司关联)
   }
```
返回
```
   文件本身
   {
    "Content-Disposition" : "attachment; filename=\"" + 文件名
   }
###/api/filedata/(?P<file_id>.*?)/delete
删除某文件(method:get)
参数如下
```javascript
   {
	"file_id" : 文件id
   }
```
返回errorcode

###/api/account/(?P<position_id>.*?)/(?P<username>.*?)/hr_set_interested
hr设置对某个简历投递者感兴趣（method:get）
参数如下
```javascript
   {
    "position_id" :职位id
	"username":  投递简历者的用户名
   }
```

###/api/account/(?P<position_id>.*?)/hr_get_interested_by_position
hr根据职位获取感兴趣的简历投递者(method：get)
参数如下
```javascript
   {
    "position_id":职位id
   }
```
返回参数
```
   {
	error:
	data :数据库中userinfo的所有内容 
   }
```