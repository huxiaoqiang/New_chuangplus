chuangplus项目api文档
=========================
****
### Author：huxiaoqiang
=========================
##<a name="table"/>数据模型结构
###Account
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

#todo 填完整信息
####公司信息表
字段   |类型   |修饰   |解释
----------|----------|----------|----------
id            |primarykey |         |主键

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
