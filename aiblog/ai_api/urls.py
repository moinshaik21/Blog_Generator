from django.urls import path
from .views import GenerateBlogView

urlpatterns = [
    path("generate/", GenerateBlogView.as_view(), name="generate-blog"),
]