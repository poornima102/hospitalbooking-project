from django.contrib import admin 
from django.urls import path
from bookingwebsite import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', views.admin_login, name='admin_login'),

    path('dashboard/', views.dashboard, name='dashboard'),
    path('logout/', views.admin_logout, name='logout'),

    path('doctors/', views.doctors, name='doctors'),
    path('add-doctor/', views.add_doctor, name='add_doctor'),
    path('view-doctor/<int:doctor_id>/', views.view_doctor, name='view_doctor'),
    path('delete-doctor/<int:id>/', views.delete_doctor, name='delete_doctor'),

    path('users/', views.users, name='users'),
    path('user-details/<int:id>/', views.user_details, name='user_details'),
    path('block-user/<int:id>/', views.block_user),
    path('unblock-user/<int:id>/', views.unblock_user),
    path('appointments/', views.appointments, name='appointments'),
    path('appointment-status/<int:id>/<str:status>/', views.update_appointment_status, name='update_status'),
    path('reports/', views.reports, name='reports'),

    # API urls
    path('signup/', views.Signup, name='signup'),
    path('login/', views.login_api, name='login_api'),

    path('doctors-list/', views.get_all_doctors, name='doctors_list'),
    path('doctor-details/<int:doctor_id>/', views.doctor_details, name='doctor_details'),

    path('book-appointment/', views.book_appointment, name='book_appointment'),
    path('my-appointments/', views.my_appointments, name='my_appointments'),

    path('profile/', views.profile, name='profile'),
    path('change-password/', views.change_password, name='change_password'),

    path('cancel-appointment/<int:appointment_id>/', views.cancel_appointment, name='cancel_appointment'),

    path('doctor_search/', views.search_doctors, name='doctor_search'),
    path('doctor-feedback/<int:doctor_id>/', views.doctor_feedback),
]

# ✅ ADD THIS LINE
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)