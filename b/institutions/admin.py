from django.contrib import admin
from .models import Institution, Curriculum, Subject, Combination, Course, Service


admin.site.register(Institution)


@admin.register(Curriculum)
class CurriculumAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at", "updated_at")
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at", "updated_at")
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(Combination)
class CombinationAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at", "updated_at")
    search_fields = ("name",)
    filter_horizontal = ("subjects",)
    ordering = ("name",)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "duration_years", "created_at", "updated_at")
    search_fields = ("name", "description")
    list_filter = ("duration_years",)
    ordering = ("name",)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at", "updated_at")
    search_fields = ("name", "description")
    ordering = ("name",)
