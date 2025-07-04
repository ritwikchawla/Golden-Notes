from rest_framework.decorators import api_view ,authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .serializers import UserSerializer,NoteSerializer
from rest_framework_simplejwt.tokens import RefreshToken,TokenError
from .models import User,Notes

# MAIN HOME VIEW FOR URL = '/', HTTP METHOD = GET
@api_view(['GET','POST','PUT','DELETE'])
def home(request):
    return Response({"message":"Api is running on Port 8000...."},status=status.HTTP_200_OK)

# REGISTER VIEW FOR URL = 'register/', HTTP METHOD = POST, DATA IN BODY(JSON) = 'fullname','email','phone','password','confirm_password'
@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"User created successfully."},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    return Response({"message":"Bad HTTP request made."},status=status.HTTP_400_BAD_REQUEST)


# LOGIN VIEW FOR URL = 'login/', HTTP METHOD = POST, DATA IN BODY(JSON) = 'email','password'
@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message":"Incorrect Email"},status=status.HTTP_401_UNAUTHORIZED)
        if not check_password(password,user.password):
            return Response({"message":"Incorrect password"},status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        return Response({'refresh':str(refresh),'access':str(refresh.access_token)})        
    return Response({"message":"Bad HTTP request made."},status=status.HTTP_400_BAD_REQUEST)


# LOGOUT VIEW FOR URL = 'logout/', HTTP METHOD = POST, DATA IN auth header bearer token  = 'refresh'
@api_view(['POST'])
@authentication_classes([])  # <--- prevent DRF from trying to decode as AccessToken
@permission_classes([])      # <--- avoid auth check so you can handle token manually
def logout(request):
    if request.method == 'POST':
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({"error": "Authorization header with Bearer token required."}, status=status.HTTP_401_UNAUTHORIZED)

        token_str = auth_header.split(' ')[1]

        try:
            # This line will raise if token is not a refresh token
            token = RefreshToken(token_str)
            # token.blacklist()
            return Response({"message": "User logged out successfully."}, status=status.HTTP_205_RESET_CONTENT)
        except TokenError:
            return Response({"error": "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "Bad HTTP request made."}, status=status.HTTP_400_BAD_REQUEST)
    

# -------------------------------------------------------------------------------- CRUD FUNCTIONALITY --------------------------------------------------------------------------------

# GET ALL NOTES 
# PROFILE VIEW FOR URL = 'profile/', HTTP METHOD = GET, DATA IN auth header bearer token  = 'refresh'
@api_view(['GET'])
@authentication_classes([])  # Disabling default auth
@permission_classes([])      # Disabling default permission
def getNotes(request):
    auth_header = request.headers.get('Authorization')

    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({"error": "Authorization header with Bearer token required."}, status=status.HTTP_401_UNAUTHORIZED)

    token_str = auth_header.split(' ')[1]

    try:
        # Decode the access token or refresh token
        token = RefreshToken(token_str)
        user_id = token['user_id']  # or 'user' depending on your payload

        user = User.objects.get(id=user_id)

        notes = Notes.objects.filter(email=user.email)  # fixed from get() to filter()

        notes_list = []
        for note in notes:
            notes_list.append({
                "id":note.id,
                "title": note.title,
                "description": note.description,
                "image": note.image.url if note.image else None
            })

        return Response({
            "message": {
                "User": {
                    "Name":user.fullname,
                    "Email":user.email,
                },
                "Notes": notes_list
            }
        }, status=status.HTTP_200_OK)

    except TokenError:
        return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ADD_NOTE 
# PROFILE VIEW FOR URL = 'profile/addnote', HTTP METHOD = POST, DATA - email,title,description and image (optional) IN auth header bearer token  = 'refresh'
@api_view(['POST'])
@authentication_classes([])  # Disabling default auth
@permission_classes([])      # Disabling default permission
def addNote(request):
    auth_header = request.headers.get('Authorization')

    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({"error": "Authorization header with Bearer token required."}, status=status.HTTP_401_UNAUTHORIZED)

    token_str = auth_header.split(' ')[1]

    try:
        # Decode the access token or refresh token
        token = RefreshToken(token_str)
        user_id = token['user_id']  # or 'user' depending on your payload

        user = User.objects.get(id=user_id)
        new_note = NoteSerializer(data = request.data)
        if new_note.is_valid():
            new_note.save()
        return Response(new_note.data,status=status.HTTP_201_CREATED)    
    except TokenError:
        return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)    


# UPDATE_DELETE_NOTE 
# PROFILE VIEW FOR URL = 'profile/id', HTTP METHOD = PUT , DATA - email,title,description and image (optional) IN auth header bearer token  = 'refresh'
# PROFILE VIEW FOR URL = 'profile/id', HTTP METHOD = DELETE, auth header bearer token  = 'refresh'
@api_view(['PUT','DELETE'])
@authentication_classes([])  # Disabling default auth
@permission_classes([])      # Disabling default permission
def updateDelete(request,id):
    try:
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({"error": "Authorization header with Bearer token required."}, status=status.HTTP_401_UNAUTHORIZED)

        token_str = auth_header.split(' ')[1]
        # Decode the access token or refresh token
        token = RefreshToken(token_str)
        user_id = token['user_id']  # or 'user' depending on your payload
        if request.method == 'PUT':
            note = Notes.objects.get(id=id)
            serializer = NoteSerializer(instance=note, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_205_RESET_CONTENT)    
        if request.method == 'DELETE':
            note = Notes.objects.get(id=id)
            if note:
                note.delete()
                return Response({"message":"Note deleted successfully"},status=status.HTTP_204_NO_CONTENT)
    except TokenError:
        return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)    
    return Response({"message":"Bad HTTTP request made"},status=status.HTTP_400_BAD_REQUEST)