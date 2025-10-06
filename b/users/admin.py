from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth import get_user_model

MyUser = get_user_model()  # ✅ This is the actual model class


# Custom forms for admin
class MyUserCreationForm(UserCreationForm):
    class Meta:
        model = MyUser
        fields = ('username', 'profile_image', 'user_type')  # include role and profile_image

class MyUserChangeForm(UserChangeForm):
    class Meta:
        model = MyUser
        fields = ('username', 'profile_image', 'user_type')  # only these fields visible in edit

# Custom admin
class MyUserAdmin(BaseUserAdmin):
    add_form = MyUserCreationForm
    form = MyUserChangeForm

    list_display = ('username', 'user_type', 'is_staff', 'is_active')
    search_fields = ('username',)
    ordering = ('username',)

    fieldsets = (
        (None, {'fields': ('username', 'password', 'profile_image', 'user_type')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'profile_image', 'user_type'),
        }),
    )

    filter_horizontal = ()  # remove groups/permissions

admin.site.register(MyUser, MyUserAdmin)
