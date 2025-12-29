export type UserRole = "Operateur" | "Chef d'équipe" | "Superviseur" | "Responsable" | "Manager"

export type ProblemStatus = "Ouvert" | "En cours" | "Clôturé"

export type StepStatus = "Non commencé" | "En cours" | "Terminé"

export type ActionStatus = "Non commencé" | "En cours" | "Terminé" | "Validé"

export type ProblemLevel = "Usine" | "Ligne" | "Atelier"

export interface User {
  user_id: number
  nom: string
  role: UserRole
  service: string
  competence: string
  email: string
  password: string
}

export interface Team {
  team_id: number
  nom_equipe: string
  date_creation: string
  created_by: number
}

export interface TeamMember {
  team_member_id: number
  team_id: number
  user_id: number
  role_in_team: string
}

export interface Problem {
  problem_id: number
  titre: string
  description: string
  date_declaration: string
  declared_by: number
  team_id?: number
  status: ProblemStatus
  level: ProblemLevel
  qui?: string
  quoi?: string
  ou?: string
  quand?: string
  comment?: string
  combien?: string
  pourquoi?: string
  photos?: string[]
}

export interface Step8D {
  step_id: number
  problem_id: number
  step_number: number
  description: string
  assigned_to?: number
  date_start?: string
  date_end?: string
  status: StepStatus
  proof?: string[]
}

export interface Action {
  action_id: number
  step_id: number
  description: string
  assigned_to?: number
  status: ActionStatus
  date_due?: string
  proof?: string[]
}

export interface Notification {
  notification_id: number
  user_id: number
  problem_id?: number
  step_id?: number
  message: string
  date_created: string
  is_read: boolean
}

export interface History {
  history_id: number
  problem_id: number
  step_id?: number
  action: string
  performed_by: number
  date_performed: string
}
