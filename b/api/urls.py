from django.urls import path

from rest_framework_simplejwt.views import ( # type: ignore
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from users.views import (UserRegisterView,CurrentUserView,user_favorites ,
                         toggle_favorite,UpdateCredentialsView,
                         UpdateProfileImageView)
from institutions.views import (InstitutionCreateView,get_all_institutions,
                                InstDetailsView,InstitutionUpdateView,
                                ProgrammeUpdateView,ProgrammeDeleteView,
                                InstitutionCombinationDeleteView,
                                EventsDeleteView,EventUpdateView,MaterialDeleteView,
                                NoticeListCreateView, NoticeDetailView
                                )
import institutions.views as views
import edutools.views as views2
import online_platforms.views as views3
import tuition_centers.views as views4
import vendors.views as views5
from Feedback.views import CreateFeedbackAPIView

urlpatterns = [
    path('help/',CreateFeedbackAPIView.as_view()),
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('me/', CurrentUserView.as_view(), name='user-me'),
    path('institutions/', InstitutionCreateView.as_view(), name='institution-create'),
    path('institutions/all/', get_all_institutions, name='get-institutions'),
    path("favorites/", user_favorites, name="favorites-list"),        # GET
    path("favorites/toggle/", toggle_favorite, name="favorites-toggle"),  # POST toggle
    path('curriculums/', views.get_curriculums, name='curriculums-list'),
    path('subjects/', views.get_subjects, name='subjects-list'),
    path('courses/', views.get_courses, name='courses-list'),
    path('inst_details/<int:pk>/', InstDetailsView.as_view(), name='institution_details'),
    path('inst/programmes/<int:instId>/', views.get_inst_courses, name='institution_programs'),
    path('inst/ac_details/<int:instId>/', views.get_inst_ac_details, name='institution_ac_details'),
    path('inst/combs/<int:instId>/', views.get_inst_combs, name='combs'),
    path('inst/subs/<int:instId>/', views.get_inst_subs, name='subs'),
    path("institutions/<int:pk>/",InstDetailsView.as_view(), name="institution"),
    path("institutions/update/<int:pk>/", InstitutionUpdateView.as_view(), name="institution-update"),
    path("me/update/", UpdateProfileImageView.as_view(), name="update-profile-image"),
    path("me/update_credentials/", UpdateCredentialsView.as_view(), name="update-credentials"),
    path("institutions/fetch/", views.get_institutions, name="get-insts"),
    path("programmes/", views.create_list_progs, name="programmes"),
    path("combinations/", views.addInstCombs, name="combinations-create"),
    path("combinations/<int:instId>/",views.getInstCombs, name="combinations-get"),
    path("programmes/<int:instId>/list/", views.getInstProgs, name="getInst_programmes"),
    path("combinations/<int:pk>/delete/", InstitutionCombinationDeleteView.as_view(), name="delete_comb"),
    path("events/<int:pk>/delete/", EventsDeleteView.as_view(), name="delete_event"),
    path('programmes/<int:pk>/update/', ProgrammeUpdateView.as_view(), name='programme-update'),
    path('events/<int:pk>/update/', EventUpdateView.as_view(), name='event-update'),
    path('programmes/<int:pk>/delete/', ProgrammeDeleteView.as_view(), name='programme-delete'),
    path('materials/<int:pk>/delete/', MaterialDeleteView.as_view(), name='material-delete'),
    path("institution/<int:pk>/view/",views.add_view, name="Inst View"),
    path("institutions/<int:instId>/events/", views.institution_events, name="institution_events"),
    path("institutions/<int:instId>/events/add/", views.add_event, name="add_event"),
    path("institutions/material/add/", views.add_material, name="add_material"),
    path("institutions/<int:instId>/materials/", views.institution_materials, name="institution_materials"),
    path("institutions/<int:inst_id>/gallery/", views.gallery_list, name="gallery_list"),
    path("institutions/gallery/add/", views.gallery_add, name="gallery_add"),
    path("gallery/<int:item_id>/update/", views.gallery_update, name="gallery_update"),
    path("gallery/<int:item_id>/delete/", views.gallery_delete, name="gallery_delete"),
    path("edutools/", views2.get_edutools, name="edutools_list"),
    path("edutools/<int:pk>/", views2.edutool_detail, name="edutool_detail"),
    path("edutools/<int:pk>/comment/", views2.add_comment, name="add_comment"),
    path("edutools/<int:pk>/vote/", views2.add_vote, name="add_vote"),
    path("platforms/", views3.get_platforms, name="platforms_list"),
    path("platforms/<int:pk>/", views3.platform_detail, name="platform_detail"),
    path("platforms/<int:pk>/comment/", views3.add_comment, name="add_platform_comment"),
    path("platforms/<int:pk>/vote/", views3.add_vote, name="add_platform_vote"),
    path("centres/", views4.get_centres, name="centres_list"),
    path("centres/<int:pk>/", views4.centre_detail, name="centre_detail"),
    path("centres/<int:pk>/comment/", views4.add_comment, name="add_centre_comment"),
    path("centres/<int:pk>/vote/", views4.add_vote, name="add_centre_vote"),
    path("services/", views5.get_vendor_services, name="vendor_services_list"),
    path("services/<int:pk>/", views5.vendor_service_detail, name="vendor_service_detail"),
    path("services/<int:pk>/vote/", views5.add_service_vote, name="vendor_service_vote"),
    path("services/create/", views5.create_vendor_service, name="vendor_service_create"),
    path("services/<int:pk>/comment/", views5.add_vendor_comment, name="vendor_service_comment"),
    path("services/<int:pk>/image/", views5.add_vendor_image, name="vendor_service_image"),
    path("notices/", NoticeListCreateView.as_view(), name="notice-list-create"),
    path("notices/<int:pk>/", NoticeDetailView.as_view(), name="notice-detail"),
    path("institution/<int:inst_id>/notices/", views.notices_list, name="notices_list"),

]
