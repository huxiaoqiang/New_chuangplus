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
resume        |ReferenceField(File)|  |简历附件
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
qrcode             |ReferenceField|File       |微信二维码
logo               |ReferenceField|File       |公司logo
welfare_tags       |ListField(StringField) |  |福利标签
product_link       |URLField    |             |产品链接
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



###职位模块
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
daysperweek         |IntField       |default=3     |每周工作天数
internship_time     |IntField       |default=1     |实习时间（月）
salary_min          |IntField       |default=0     |薪水下限
salary_max          |IntField       |default=0     |薪水上限
delivery_number     |IntField       |default=0     |职位已经投递的人数
status              |Stringfield    |choices=STATUS|职位状态(STATUS见表下)
TYPE = ('technology','product','design','operate','marketing','functions','others')<br/>
STATUS = ('employing','hide','delete')

####实习生和职位收藏关系表UP_Relationship
字段   |域
------------|-----------
user        |User
position    |Position

####实习生投递职位表
字段   |类型   |修饰   |解释
------------|-----------|-----------|-----------
user        |ReferenceField|User    |关联用户（实习生）
position    |ReferenceField|Position|关联职位
submit_date |DateTimeField |        |投递日期
resume_submitted|FileField |        |投递的简历附件
processed   |BooleanField  |default=False|处理状态，默认是未处理

##api接口
考虑到django的csrf机制，需要在HTTP请求头添加X-CSRF-token,内容为cookie中的csrftoken，或者在请求中增加一个csrfmiddlewaretoken字段，内容也是cookie中的csrftoken。我们使用的方法是后者，在static/js/services.js中构建了CsfrService，在post表单之前执行
```javascript
set_csrf(data)
```
###/api/captcha/image/
获取验证码
###/api/account/register/
新用户注册
向url post一个json格式的请求，需要post的内容如下
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
验证用户名是否存在，在注册页面，可以通过Ajax来测试用户名是否可用。向该 url 发送一个 json 来检测。发送内容只有一个键 "username"，内容是需要检测的用户名。返回的 json 也只有一个键 "exist"，即用户是否存在。
###/api/account/checkemail/
同上，验证邮箱是否已经被注册

###/api/account/login
用户登录，向url post用户名和密码
```javascript
  {
    "username" : "someone",
    "password" : "password"
  }
```
###/api/account/logout
用户注销
###/api/account/password/set
修改密码，向url post密码和新密码（在用户已经登录的条件下）
```javascript
  {
    "password" : "*******",
    "new_password" : "********"
  }
```
###/api/account/userinfo/get
获取实习生用户信息，返回实习生用户信息的json对象和错误码
###/api/account/userinfo/set
修改实习生用户信息，post userinfo信息，返回错误码和post的用户信息json对象


###/api/account/sendemail
“找回密码”时，向用户邮箱发送验证码
向url post用户邮箱：
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

###/


###/
