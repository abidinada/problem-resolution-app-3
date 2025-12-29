from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Team, TeamMember, Problem, Step8D, Action, Notification, History


class UserSerializer(serializers.ModelSerializer):
    """Serializer pour les utilisateurs"""
    class Meta:
        model = User
        fields = ['id', 'nom', 'role', 'service', 'competence', 'email', 'username']
        read_only_fields = ['id']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer un utilisateur"""
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['id', 'nom', 'role', 'service', 'competence', 'email', 'username', 'password']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer pour l'authentification"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    attrs['user'] = user
                    return attrs
                else:
                    raise serializers.ValidationError('Invalid password')
            except User.DoesNotExist:
                raise serializers.ValidationError('User not found')
        else:
            raise serializers.ValidationError('Must include email and password')


class TeamMemberSerializer(serializers.ModelSerializer):
    """Serializer pour les membres d'équipe"""
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = TeamMember
        fields = ['id', 'team', 'user', 'user_id', 'role_in_team']
        read_only_fields = ['id']
    
    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        team_member = TeamMember.objects.create(user_id=user_id, **validated_data)
        return team_member
    
    def update(self, instance, validated_data):
        user_id = validated_data.pop('user_id', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if user_id:
            instance.user_id = user_id
        instance.save()
        return instance


class TeamSerializer(serializers.ModelSerializer):
    """Serializer pour les équipes"""
    created_by = UserSerializer(read_only=True)
    created_by_id = serializers.IntegerField(write_only=True, required=False)
    members = TeamMemberSerializer(many=True, read_only=True)
    
    class Meta:
        model = Team
        fields = ['id', 'nom_equipe', 'date_creation', 'created_by', 'created_by_id', 'members']
        read_only_fields = ['id']
    
    def create(self, validated_data):
        created_by_id = validated_data.pop('created_by_id', None)
        team = Team.objects.create(**validated_data)
        if created_by_id:
            team.created_by_id = created_by_id
            team.save()
        return team
    
    def update(self, instance, validated_data):
        created_by_id = validated_data.pop('created_by_id', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if created_by_id:
            instance.created_by_id = created_by_id
        instance.save()
        return instance


class ProblemSerializer(serializers.ModelSerializer):
    """Serializer pour les problèmes"""
    declared_by = UserSerializer(read_only=True)
    declared_by_id = serializers.IntegerField(write_only=True)
    team = serializers.PrimaryKeyRelatedField(read_only=True, required=False)
    team_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Problem
        fields = [
            'id', 'titre', 'description', 'date_declaration', 'declared_by', 'declared_by_id',
            'team', 'team_id', 'status', 'level', 'qui', 'quoi', 'ou', 'quand', 'comment',
            'combien', 'pourquoi', 'photos'
        ]
        read_only_fields = ['id']
    
    def create(self, validated_data):
        declared_by_id = validated_data.pop('declared_by_id')
        team_id = validated_data.pop('team_id', None)
        problem = Problem.objects.create(declared_by_id=declared_by_id, **validated_data)
        if team_id:
            problem.team_id = team_id
            problem.save()
        return problem
    
    def update(self, instance, validated_data):
        declared_by_id = validated_data.pop('declared_by_id', None)
        team_id = validated_data.pop('team_id', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if declared_by_id:
            instance.declared_by_id = declared_by_id
        if team_id is not None:
            instance.team_id = team_id
        instance.save()
        return instance


class Step8DSerializer(serializers.ModelSerializer):
    """Serializer pour les étapes 8D"""
    problem = serializers.PrimaryKeyRelatedField(read_only=True)
    problem_id = serializers.IntegerField(write_only=True)
    assigned_to = UserSerializer(read_only=True, required=False)
    assigned_to_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Step8D
        fields = [
            'id', 'problem', 'problem_id', 'step_number', 'description', 'assigned_to',
            'assigned_to_id', 'date_start', 'date_end', 'status', 'proof'
        ]
        read_only_fields = ['id']
    
    def create(self, validated_data):
        problem_id = validated_data.pop('problem_id')
        assigned_to_id = validated_data.pop('assigned_to_id', None)
        step = Step8D.objects.create(problem_id=problem_id, **validated_data)
        if assigned_to_id:
            step.assigned_to_id = assigned_to_id
            step.save()
        return step
    
    def update(self, instance, validated_data):
        problem_id = validated_data.pop('problem_id', None)
        assigned_to_id = validated_data.pop('assigned_to_id', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if problem_id:
            instance.problem_id = problem_id
        if assigned_to_id is not None:
            instance.assigned_to_id = assigned_to_id
        instance.save()
        return instance


class ActionSerializer(serializers.ModelSerializer):
    """Serializer pour les actions"""
    step = serializers.PrimaryKeyRelatedField(read_only=True)
    step_id = serializers.IntegerField(write_only=True)
    assigned_to = UserSerializer(read_only=True, required=False)
    assigned_to_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Action
        fields = [
            'id', 'step', 'step_id', 'description', 'assigned_to', 'assigned_to_id',
            'status', 'date_due', 'proof'
        ]
        read_only_fields = ['id']
    
    def create(self, validated_data):
        step_id = validated_data.pop('step_id')
        assigned_to_id = validated_data.pop('assigned_to_id', None)
        action = Action.objects.create(step_id=step_id, **validated_data)
        if assigned_to_id:
            action.assigned_to_id = assigned_to_id
            action.save()
        return action
    
    def update(self, instance, validated_data):
        step_id = validated_data.pop('step_id', None)
        assigned_to_id = validated_data.pop('assigned_to_id', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if step_id:
            instance.step_id = step_id
        if assigned_to_id is not None:
            instance.assigned_to_id = assigned_to_id
        instance.save()
        return instance


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer pour les notifications"""
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    problem = serializers.PrimaryKeyRelatedField(read_only=True, required=False)
    problem_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    step = serializers.PrimaryKeyRelatedField(read_only=True, required=False)
    step_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'user_id', 'problem', 'problem_id', 'step', 'step_id',
            'message', 'date_created', 'is_read'
        ]
        read_only_fields = ['id', 'date_created']
    
    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        problem_id = validated_data.pop('problem_id', None)
        step_id = validated_data.pop('step_id', None)
        notification = Notification.objects.create(user_id=user_id, **validated_data)
        if problem_id:
            notification.problem_id = problem_id
        if step_id:
            notification.step_id = step_id
        notification.save()
        return notification
    
    def update(self, instance, validated_data):
        user_id = validated_data.pop('user_id', None)
        problem_id = validated_data.pop('problem_id', None)
        step_id = validated_data.pop('step_id', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if user_id:
            instance.user_id = user_id
        if problem_id is not None:
            instance.problem_id = problem_id
        if step_id is not None:
            instance.step_id = step_id
        instance.save()
        return instance


class HistorySerializer(serializers.ModelSerializer):
    """Serializer pour l'historique"""
    problem = serializers.PrimaryKeyRelatedField(read_only=True)
    problem_id = serializers.IntegerField(write_only=True)
    step = serializers.PrimaryKeyRelatedField(read_only=True, required=False)
    step_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    performed_by = UserSerializer(read_only=True)
    performed_by_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = History
        fields = [
            'id', 'problem', 'problem_id', 'step', 'step_id', 'action',
            'performed_by', 'performed_by_id', 'date_performed'
        ]
        read_only_fields = ['id', 'date_performed']
    
    def create(self, validated_data):
        problem_id = validated_data.pop('problem_id')
        step_id = validated_data.pop('step_id', None)
        performed_by_id = validated_data.pop('performed_by_id')
        history = History.objects.create(problem_id=problem_id, performed_by_id=performed_by_id, **validated_data)
        if step_id:
            history.step_id = step_id
            history.save()
        return history

