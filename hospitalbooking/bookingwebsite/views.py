from django.shortcuts import render
from django.shortcuts import redirect,get_object_or_404
from .models import Doctors, Appointment, User, Feedback
from django.http import JsonResponse
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.forms import UserCreationForm
from rest_framework import permissions
from django.views.decorators.http import require_POST
from .serializers import FeedbackSerializer
from datetime import date

#login imports
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_200_OK
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required



def admin_login(request):
    if request.method == "POST":
        email = request.POST.get("username")
        password = request.POST.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return render(request, 'admin_login.html', {'error': 'Invalid email'})

        if user.check_password(password) and user.is_superuser:
            login(request, user)
            return redirect('dashboard/')
        else:
            return render(request, 'admin_login.html', {'error': 'Invalid credentials'})

    return render(request, 'admin_login.html')

@login_required
def dashboard(request):
    total_users = User.objects.filter(is_superuser=False).count()
    total_doctors = Doctors.objects.count()
    total_appointments = Appointment.objects.count()

    # ✅ FIXED LINE
    today_appointments = Appointment.objects.filter(
        appointment_date=date.today()
    ).count()

    confirmed = Appointment.objects.filter(status="confirmed").count()
    cancelled = Appointment.objects.filter(status="cancelled").count()
    completed = Appointment.objects.filter(status="completed").count()

    recent_appointments = Appointment.objects.select_related(
        "patient", "doctors"
    ).order_by("-id")[:5]

    return render(request, "admin_dashboard.html", {
        "total_users": total_users,
        "total_doctors": total_doctors,
        "total_appointments": total_appointments,
        "today_appointments": today_appointments,
        "confirmed": confirmed,
        "cancelled": cancelled,
        "completed": completed,
        "recent_appointments": recent_appointments,
    })

def admin_logout(request):
    logout(request)
    request.session.flush()

    return redirect('/') 

def doctors(request):
    doctors_list = Doctors.objects.all()
    return render(request, 'doctors_management.html', {
        'doctors': doctors_list
    })


def add_doctor(request):
    if request.method == "POST":

        days = request.POST.getlist("days")
        time_slots = request.POST.getlist("time_slots")

        Doctors.objects.create(
            name=request.POST.get("name"),
            field=request.POST.get("field"),
            qualification=request.POST.get("qualification"),
            experience=request.POST.get("experience"),
            image=request.FILES.get("image"),

            available_days=",".join(days),
            available_time_slots=",".join(time_slots),
        )

        return redirect("doctors")

    return render(request, "add_doctors.html")

def view_doctor(request, doctor_id):
    doctor = get_object_or_404(Doctors, id=doctor_id)

    # ✅ SPLIT DATA
    selected_days = doctor.available_days.split(",") if doctor.available_days else []
    selected_times = doctor.available_time_slots.split(",") if doctor.available_time_slots else []

    if request.method == "POST":
        days = request.POST.getlist("days")
        times = request.POST.getlist("time_slots")  # ✅ GET TIMES

        doctor.name = request.POST.get("name")
        doctor.gender = request.POST.get("gender")
        doctor.phone = request.POST.get("phone")
        doctor.email = request.POST.get("email")
        doctor.field = request.POST.get("field")
        doctor.qualification = request.POST.get("qualification")
        doctor.experience = request.POST.get("experience")

        # ✅ SAVE
        doctor.available_days = ",".join(days)
        doctor.available_time_slots = ",".join(times)

        if request.FILES.get("image"):
            doctor.image = request.FILES.get("image")

        doctor.save()
        return redirect("doctors")

    return render(request, "view_doctor.html", {
        "doctor": doctor,
        "selected_days": selected_days,
        "selected_times": selected_times   # ✅ PASS TIMES
    })
def delete_doctor(request, id):
    if request.method == "POST":   # ✅ MUST be POST
        try:
            doctor = Doctors.objects.get(id=id)
            doctor.delete()
            return JsonResponse({"message": "Doctor deleted"})
        except Doctors.DoesNotExist:
            return JsonResponse({"error": "Doctor not found"}, status=404)

    return JsonResponse({"error": "Invalid request"}, status=400)

def users(request):
    all_users = User.objects.filter(is_superuser=False)  # ✅ exclude admin
    return render(request, 'viewuser_list.html', {
        'users': all_users
    })

def user_details(request, id):
    user = User.objects.get(id=id)
    appointments = Appointment.objects.filter(patient=user)

    return render(request, 'user_details.html', {
        'user': user,
        'appointments': appointments
    })
@require_POST
def block_user(request, id):
    user = User.objects.get(id=id)
    user.is_active = False
    user.save()
    return JsonResponse({'message': 'User blocked successfully'})

@require_POST
def unblock_user(request, id):
    user = User.objects.get(id=id)
    user.is_active = True
    user.save()
    return JsonResponse({'message': 'User unblocked successfully'})
    
@login_required
def appointments(request):
    appointments = Appointment.objects.select_related('patient', 'doctors').all()

    search = request.GET.get('search')
    date = request.GET.get('date')
    status = request.GET.get('status')

    if search:
        appointments = appointments.filter(
            Q(patient__name__icontains=search) |
            Q(doctors__name__icontains=search)
        )

    if date:
        appointments = appointments.filter(appointment_date__date=date)

    if status:
        appointments = appointments.filter(status=status)

    return render(request, 'appointment_manage.html', {
        'appointments': appointments
    })
@login_required
def update_appointment_status(request, id, status):
    appointment = get_object_or_404(Appointment, id=id)

    # ✅ allow only valid values
    if status in ['confirmed', 'cancelled']:
        appointment.status = status
        appointment.save()

    return redirect('appointments')

@login_required
def reports(request):
    doctors = Doctors.objects.all().order_by('-view_count')

    return render(request, 'report.html', {
        'doctors': doctors
    })
#api for signup
@api_view(['POST'])
@permission_classes((AllowAny,))
def Signup(request):
    email  = request.data.get("email")
    password = request.data.get("password")
    name = request.data.get("name")
    dob = request.data.get("dob")
    gender = request.data.get("gender")
    address = request.data.get("address")
    contactno = request.data.get("phone")

    if not name or not email or not password:
        return Response({'message': 'All fields are required'}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'message': 'Email already exists'}, status=400)

    # ✅ Create user
    user = User.objects.create_user(
        email=email,
        password=password
    )

    # ✅ Save extra fields
    user.name = name
    user.dob = dob
    user.gender = gender
    user.address = address
    user.contactno = contactno

    user.save()

    return JsonResponse({'message': 'User created successfully'}, status=200)

#api for login

@api_view(["POST"])
@permission_classes([AllowAny])
def login_api(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(email=email, password=password)

    if not user:
        return Response({"error": "Invalid credentials"}, status=400)

    # 🔥 delete old tokens (optional safety)
    Token.objects.filter(user=user).delete()

    # 🔥 create new token
    token = Token.objects.create(user=user)

    return Response({
        "token": token.key,
        "email": user.email
    })
#api to get all doctors
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_all_doctors(request):
    doctors = Doctors.objects.all()
    doctor_list = []

    for doctor in doctors:
        doctor_data = {
            'id': doctor.id,
            'name': doctor.name,
            'field': doctor.field,
            'experience': doctor.experience,
            'qualification': doctor.qualification,
            'image': request.build_absolute_uri(doctor.image.url) if doctor.image else None,
        }
        doctor_list.append(doctor_data)

    return JsonResponse({'doctors': doctor_list}, status=200)

#doctor details api
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def doctor_details(request, doctor_id):
    try:
        doctor = Doctors.objects.get(id=doctor_id)

        # ✅ ADD THIS (VERY IMPORTANT)
        doctor.view_count += 1
        doctor.save()

        doctor_data = {
            'id': doctor.id,
            'name': doctor.name,
            'gender': doctor.gender, 
            'email': doctor.email,
            'field': doctor.field,
            'experience': doctor.experience,
            'qualification': doctor.qualification,
            'image': request.build_absolute_uri(doctor.image.url) if doctor.image else None,

            'available_days': doctor.available_days.split(",") if doctor.available_days else [],
            'available_time_slots': doctor.available_time_slots.split(",") if doctor.available_time_slots else [],
        }

        return JsonResponse({'doctor': doctor_data}, status=200)

    except Doctors.DoesNotExist:
        return JsonResponse({'error': 'Doctor not found'}, status=404)
#appointments booking
from django.db import IntegrityError

@api_view(['POST'])
@permission_classes([IsAuthenticated])   # ✅ FIX
def book_appointment(request):
    try:
        appointment = Appointment.objects.create(
            patient=request.user,
            doctors_id=request.data.get('doctor_id'),
            appointment_date=request.data.get('appointment_date'),
            time_slot=request.data.get('time_slot')
        )

        return Response({"message": "Booked successfully"})

    except IntegrityError:
        return Response(
            {"error": "You already booked this doctor on this date"},
            status=400
        )

#my appointments
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def my_appointments(request):
    appointments = Appointment.objects.filter(patient=request.user)

    data = []
    for appointment in appointments:
        data.append({
            'id': appointment.id,
            'doctor_name': appointment.doctors.name,
            'appointment_date': appointment.appointment_date,
            'time_slot': appointment.time_slot,
            'status': appointment.status   # ✅ ADD THIS
        })

    return JsonResponse(data, safe=False)

#profile update api
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user

    return Response({
        "full_name": user.name,
        "email": user.email,
        "phone": user.contactno,
        "address": user.address,
        "gender": user.gender,
        "dob": user.dob,
    })

#change password api
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user

    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not user.check_password(old_password):
        return Response({"error": "Old password incorrect"}, status=400)

    user.set_password(new_password)
    user.save()

    # 🔥 logout all sessions (delete token)
    Token.objects.filter(user=user).delete()

    return Response({"message": "Password changed successfully"})

#cancel appointment api
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_appointment(request, appointment_id):
    try:
        appointment = Appointment.objects.get(
            id=appointment_id,
            patient=request.user
        )

        appointment.status = "cancelled"
        appointment.save()

        return Response({'message': 'Cancelled successfully'}, status=200)

    except Appointment.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

#search doctors api
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def search_doctors(request):
    query = request.GET.get('q')
    if not query:
        return JsonResponse({'error': 'Query parameter "q" is required'}, status=400)
    doctors = Doctors.objects.filter(
        Q(name__icontains=query) |
        Q(field__icontains=query) |
        Q(qualification__icontains=query)
    )
    data = []
    for doctor in doctors:
        data.append({
            'id': doctor.id,
            'name': doctor.name,
            'field': doctor.field,
            'experience': doctor.experience,
            'qualification': doctor.qualification,
            'image': doctor.image.url if doctor.image else None
        })
    return JsonResponse({'doctors': data}, status=200)
# ✅ FEEDBACK API
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def doctor_feedback(request, doctor_id):

    # 🔹 GET → fetch all reviews of a doctor
    if request.method == 'GET':
        feedbacks = Feedback.objects.filter(doctor_id=doctor_id).order_by('-created_at')
        serializer = FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data)

    # 🔹 POST → create or update review
    if request.method == 'POST':
        feedback, created = Feedback.objects.update_or_create(
            doctor_id=doctor_id,
            user=request.user,
            defaults={
                'rating': request.data.get('rating'),
                'comment': request.data.get('comment')
            }
        )
        serializer = FeedbackSerializer(feedback)
        return Response(serializer.data)
