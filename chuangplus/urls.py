from django.conf.urls import patterns, include, url
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
admin.autodiscover()

urlpatterns = [
    # Examples:
    # url(r'^$', 'chuangplus.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),

    url(r'^api/captcha/', include('Captcha.urls')),
    url(r'^api/account/', include('account.urls')),
    url(r'^api/position/',include('position.urls')),
    url(r'^api/file/',include('filedata.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    url(r'^weixin/','app.weixinInterface.weixin'),
    url(r'^mobile/.*','app.views.mobile_index'),
    url(r'^.*$', 'app.views.index'),
]
