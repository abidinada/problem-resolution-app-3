from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import User, Team, TeamMember, Problem, Step8D, Action, Notification, History
from .serializers import (
    UserSerializer, UserCreateSerializer, LoginSerializer,
    TeamSerializer, TeamMemberSerializer,
    ProblemSerializer,
    Step8DSerializer,
    ActionSerializer,
    NotificationSerializer,
    HistorySerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet pour les utilisateurs"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer


class LoginView(APIView):
    """Vue pour l'authentification"""
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            user_serializer = UserSerializer(user)
            return Response({
                'user': user_serializer.data,
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeamViewSet(viewsets.ModelViewSet):
    """ViewSet pour les équipes"""
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """Ajouter un membre à l'équipe"""
        team = self.get_object()
        user_id = request.data.get('user_id')
        role_in_team = request.data.get('role_in_team', 'Membre')
        
        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = get_object_or_404(User, id=user_id)
        member, created = TeamMember.objects.get_or_create(
            team=team,
            user=user,
            defaults={'role_in_team': role_in_team}
        )
        
        serializer = TeamMemberSerializer(member)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    @action(detail=True, methods=['delete'])
    def remove_member(self, request, pk=None):
        """Retirer un membre de l'équipe"""
        team = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        member = get_object_or_404(TeamMember, team=team, user_id=user_id)
        member.delete()
        return Response({'message': 'Member removed'}, status=status.HTTP_200_OK)


class ProblemViewSet(viewsets.ModelViewSet):
    """ViewSet pour les problèmes"""
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    
    @action(detail=True, methods=['get'])
    def steps(self, request, pk=None):
        """Récupérer les étapes 8D d'un problème"""
        problem = self.get_object()
        steps = Step8D.objects.filter(problem=problem).order_by('step_number')
        serializer = Step8DSerializer(steps, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Mettre à jour le statut d'un problème"""
        problem = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['Ouvert', 'En cours', 'Clôturé']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        problem.status = new_status
        problem.save()
        
        # Créer une entrée d'historique
        History.objects.create(
            problem=problem,
            action=f"Statut changé en: {new_status}",
            performed_by_id=request.data.get('performed_by_id', 1)
        )
        
        serializer = self.get_serializer(problem)
        return Response(serializer.data)


class Step8DViewSet(viewsets.ModelViewSet):
    """ViewSet pour les étapes 8D"""
    queryset = Step8D.objects.all()
    serializer_class = Step8DSerializer
    
    @action(detail=True, methods=['get'])
    def actions(self, request, pk=None):
        """Récupérer les actions d'une étape"""
        step = self.get_object()
        actions = Action.objects.filter(step=step)
        serializer = ActionSerializer(actions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Mettre à jour le statut d'une étape"""
        step = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['Non commencé', 'En cours', 'Terminé']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        step.status = new_status
        step.save()
        
        # Créer une entrée d'historique
        History.objects.create(
            problem=step.problem,
            step=step,
            action=f"Étape D{step.step_number} - Statut changé en: {new_status}",
            performed_by_id=request.data.get('performed_by_id', 1)
        )
        
        serializer = self.get_serializer(step)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def initialize_steps(self, request):
        """Initialiser les 8 étapes pour un problème"""
        problem_id = request.data.get('problem_id')
        if not problem_id:
            return Response({'error': 'problem_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        problem = get_object_or_404(Problem, id=problem_id)
        
        # Vérifier si les étapes existent déjà
        existing_steps = Step8D.objects.filter(problem=problem)
        if existing_steps.exists():
            return Response({'error': 'Steps already initialized'}, status=status.HTTP_400_BAD_REQUEST)
        
        step_titles = [
            (1, "Équipe constituée"),
            (2, "Problème décrit avec QQOQCCP"),
            (3, "Actions de containment"),
            (4, "Analyse des causes racines"),
            (5, "Actions correctives permanentes"),
            (6, "Mise en œuvre"),
            (7, "Prévention de la récurrence"),
            (8, "Féliciter l'équipe"),
        ]
        
        steps = []
        for step_number, description in step_titles:
            step = Step8D.objects.create(
                problem=problem,
                step_number=step_number,
                description=description,
                status="Non commencé"
            )
            steps.append(step)
        
        serializer = Step8DSerializer(steps, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ActionViewSet(viewsets.ModelViewSet):
    """ViewSet pour les actions"""
    queryset = Action.objects.all()
    serializer_class = ActionSerializer
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Mettre à jour le statut d'une action"""
        action = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['Non commencé', 'En cours', 'Terminé', 'Validé']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        action.status = new_status
        action.save()
        
        # Créer une entrée d'historique
        History.objects.create(
            problem=action.step.problem,
            step=action.step,
            action=f"Action mise à jour - Statut: {new_status}",
            performed_by_id=request.data.get('performed_by_id', 1)
        )
        
        serializer = self.get_serializer(action)
        return Response(serializer.data)


class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet pour les notifications"""
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    
    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Récupérer les notifications d'un utilisateur"""
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        notifications = Notification.objects.filter(user_id=user_id).order_by('-date_created')
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def mark_read(self, request, pk=None):
        """Marquer une notification comme lue"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
    
    @action(detail=False, methods=['patch'])
    def mark_all_read(self, request):
        """Marquer toutes les notifications d'un utilisateur comme lues"""
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        Notification.objects.filter(user_id=user_id, is_read=False).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})


class HistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour l'historique (lecture seule)"""
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    
    @action(detail=False, methods=['get'])
    def by_problem(self, request):
        """Récupérer l'historique d'un problème"""
        problem_id = request.query_params.get('problem_id')
        if not problem_id:
            return Response({'error': 'problem_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        history = History.objects.filter(problem_id=problem_id).order_by('-date_performed')
        serializer = self.get_serializer(history, many=True)
        return Response(serializer.data)

