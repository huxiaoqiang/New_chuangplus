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
position_type |StringField |          |工作类别
work_city     |StringField |          |工作城市
cellphone     |StringField |          |          
university    |StringField |          |
major         |StringField |          |
grade         |IntField    |默认：1   |年级
gender        |IntField    |默认：0   |0代表女性，1代表男性
work_days     |IntField    |默认：3   |每周工作天数
description   |StringField |          |个人百字简介
info_complete |BooleanField|默认：0   |信息是否完整
has_resume    |BooleanFiedl|默认：0   |是否上传简历
User          |OnetoOne    |关联数据  |对应的user

####公司信息表Companyinfo
字段   |类型   |修饰   |解释
----------|----------|----------|----------
id                 |primarykey  |             |主键
username           |StringField |             |和注册的用户名一样
contacts           |StringField |             |联系人
abbreviation       |StringField |             |公司简称
city               |StringFiled |             |公司所在地
field              |StringFiled |             |行业领域
financing_info     |ListField   |关联Financing|融资信息
is_auth            |BooleanField|default=False|投资机构认证
auth_organization  |StringField |             |认证机构
people_scale       |IntField    |             |规模人数
homepage           |URLField    |             |公司主页
wechat             |StringField |             |公司公众号
email_resume       |EmailField  |             |收简历邮箱
qrcode             |ReferenceField|Image      |微信二维码
welfare_tags       |StringField |             |福利标签
product_link       |URLField    |             |产品链接
ICregist_name      |StringField |             |公司工商注册名称
Company_descrition |StringFiled |             |公司简介
product_description|StringField |             |产品简介
team_description   |StringField |             |团队介绍
team_info          |ListField   |Member       |团队信息
position_type      |StringField |             |职位类别
position_number    |IntField    |default=0    |发布的职位数
position           |ListField   |Position     |发布的职位
slogan             |StringFiled |             |公司标语
status             |BooleanField|             |是否被后台管理员认证通过
User               |OnetoOne    |关联数据     |对应的user
###融资信息表Financing
字段   |类型   |修饰   |解释
------------|-----------|-----------|-----------
stage       |StringField|choices=STAGE|融资阶段
organization|StringField|           |融资机构
amount      |StringField|choices=AMOUNT|数量级
AMOUNT=('ten','hundred','thousand','thousand_plus')数量级分别表示十万级，百万级，千万级，以及亿级<br/>
STAGE=('no','angel','A','B','C','D_plus') 分别表示没有融资，天使轮，A轮，B轮，C轮，D及D以上轮融资<br/>

###公司成员表Member
字段   |类型   |修饰   |解释
------------|-----------|-----------|-----------
m_name        |StringField|         |成员名字
m_position    |StringField|         |成员职位
m_introduction|StringField|         |成员介绍
m_avatar_path |StringField|关联Image|成员头像

###求职者和公司关系表UC_Relationship
字段   |域
------------|-----------
company     |Companyinfo
user        |Userinfo
###求职者和职位关系表PC_Relationship
字段   |域
------------|-----------
user        |Userinfo
position    |Position
status      |IntField(default=0)
status 有四种状态，默认是0，表示没有关系，1表示投递了，但是hr还未处理，2表示投递了hr也处理了，3表示收藏
##<a name="table"/>错误信息码
错误码   |返回信息   |意义
-------------|-------------|-------------
1            |succeed       |操作成功
100          |Need captcha  |需要验证码
101          |captcha error |验证码错误
102          |Need post username|需要POST用户名
103          |User not exist |用户不存在
104          |user data not exist|用户资料尚未填写资料
105          |company data not exist|企业资料尚未填写

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
```javascrip
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
