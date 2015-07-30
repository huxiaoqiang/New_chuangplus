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

####用户信息表（求职者）
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

####公司信息表
字段   |类型   |修饰   |解释
----------|----------|----------|----------
id            |primarykey |         |主键
用户名        |String
###公司信息表
###融资信息表
###公司成员表
###求职者和公司关系表
###求职者和职位关系表

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
