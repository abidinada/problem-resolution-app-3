import type { User, Problem, Team, Step8D, Action, Notification } from "./types"

export const mockUsers: User[] = [
  {
    user_id: 1,
    nom: "Ahmed Benali",
    role: "Manager",
    service: "Direction",
    competence: "Management",
    email: "ahmed.benali@usine.com",
    password: "password123",
  },
  {
    user_id: 2,
    nom: "Fatima Zahra",
    role: "Responsable",
    service: "Qualité",
    competence: "Lean Management",
    email: "fatima.zahra@usine.com",
    password: "password123",
  },
  {
    user_id: 3,
    nom: "Mohamed Alami",
    role: "Superviseur",
    service: "Production Ligne A",
    competence: "Supervision",
    email: "mohamed.alami@usine.com",
    password: "password123",
  },
  {
    user_id: 4,
    nom: "Rachid Idrissi",
    role: "Chef d'équipe",
    service: "Atelier 1",
    competence: "Assemblage",
    email: "rachid.idrissi@usine.com",
    password: "password123",
  },
  {
    user_id: 5,
    nom: "Karim Tazi",
    role: "Operateur",
    service: "Atelier 1",
    competence: "Opération",
    email: "karim.tazi@usine.com",
    password: "password123",
  },
]

export const mockTeams: Team[] = [
  {
    team_id: 1,
    nom_equipe: "Équipe 8D - Défaut Ligne A",
    date_creation: "2025-01-15",
    created_by: 3,
  },
  {
    team_id: 2,
    nom_equipe: "Équipe 8D - Retard Production",
    date_creation: "2025-01-18",
    created_by: 2,
  },
]

export const mockProblems: Problem[] = [
  {
    problem_id: 1,
    titre: "Défaut de peinture sur pièces finies",
    description: "Présence de bulles dans la peinture sur 15% des pièces produites",
    date_declaration: "2025-01-15",
    declared_by: 4,
    team_id: 1,
    status: "En cours",
    level: "Ligne",
    qui: "Ligne A - Poste peinture",
    quoi: "Bulles dans la peinture",
    ou: "Zone de peinture automatique",
    quand: "15 Janvier 2025, 14h30",
    comment: "Application automatique par robot",
    combien: "15% des pièces",
    pourquoi: "À déterminer",
    photos: [],
  },
  {
    problem_id: 2,
    titre: "Retard de production - Ligne B",
    description: "Retard accumulé de 2 heures sur planning quotidien",
    date_declaration: "2025-01-18",
    declared_by: 4,
    team_id: 2,
    status: "Ouvert",
    level: "Ligne",
    qui: "Ligne B - Équipe matin",
    quoi: "Retard de production",
    ou: "Ligne B complète",
    quand: "18 Janvier 2025, matin",
    comment: "Ralentissement progressif",
    combien: "2 heures de retard",
    pourquoi: "À analyser",
    photos: [],
  },
  {
    problem_id: 3,
    titre: "Non-conformité dimensions pièce X34",
    description: "Dimensions hors tolérance sur lot de 500 pièces",
    date_declaration: "2025-01-20",
    declared_by: 5,
    status: "Ouvert",
    level: "Atelier",
    qui: "Atelier usinage",
    quoi: "Dimensions hors spécification",
    ou: "Machine CNC-05",
    quand: "20 Janvier 2025",
    comment: "Contrôle qualité",
    combien: "500 pièces",
    pourquoi: "À déterminer",
    photos: [],
  },
]

export const mockSteps: Step8D[] = [
  {
    step_id: 1,
    problem_id: 1,
    step_number: 1,
    description: "Équipe constituée : Mohamed Alami (Leader), Rachid Idrissi, Karim Tazi",
    assigned_to: 3,
    date_start: "2025-01-15",
    status: "Terminé",
    proof: [],
  },
  {
    step_id: 2,
    problem_id: 1,
    step_number: 2,
    description: "Problème décrit avec QQOQCCP - Photos prises",
    assigned_to: 4,
    date_start: "2025-01-15",
    status: "Terminé",
    proof: [],
  },
  {
    step_id: 3,
    problem_id: 1,
    step_number: 3,
    description: "Action de containment : Inspection 100% des pièces avant expédition",
    assigned_to: 3,
    date_start: "2025-01-15",
    status: "En cours",
    proof: [],
  },
  {
    step_id: 4,
    problem_id: 1,
    step_number: 4,
    description: "Analyse des causes racines en cours - Méthode 5 Pourquoi",
    assigned_to: 2,
    date_start: "2025-01-16",
    status: "En cours",
    proof: [],
  },
]

export const mockActions: Action[] = [
  {
    action_id: 1,
    step_id: 3,
    description: "Mettre en place inspection visuelle systématique",
    assigned_to: 4,
    status: "En cours",
    date_due: "2025-01-16",
    proof: [],
  },
  {
    action_id: 2,
    step_id: 3,
    description: "Isoler les pièces non conformes",
    assigned_to: 5,
    status: "Terminé",
    date_due: "2025-01-15",
    proof: [],
  },
]

export const mockNotifications: Notification[] = [
  {
    notification_id: 1,
    user_id: 3,
    problem_id: 1,
    step_id: 3,
    message: "Nouvelle action corrective assignée",
    date_created: "2025-01-15T14:30:00",
    is_read: false,
  },
  {
    notification_id: 2,
    user_id: 2,
    problem_id: 2,
    message: "Nouveau problème déclaré - Ligne B",
    date_created: "2025-01-18T09:00:00",
    is_read: false,
  },
]

// Storage keys
export const STORAGE_KEYS = {
  CURRENT_USER: "current_user",
  USERS: "users",
  PROBLEMS: "problems",
  TEAMS: "teams",
  STEPS: "steps_8d",
  ACTIONS: "actions",
  NOTIFICATIONS: "notifications",
}

// Initialize localStorage with mock data
export function initializeMockData() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers))
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROBLEMS)) {
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(mockProblems))
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEAMS)) {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(mockTeams))
  }
  if (!localStorage.getItem(STORAGE_KEYS.STEPS)) {
    localStorage.setItem(STORAGE_KEYS.STEPS, JSON.stringify(mockSteps))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(mockActions))
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(mockNotifications))
  }
}
