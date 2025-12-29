import type { Action, History, Notification, Problem, Step8D, Team, User } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

type ApiUser = {
  id: number
  nom: string
  role: User["role"]
  service: string
  competence: string
  email: string
  username?: string
  password?: string
}

type ApiProblem = {
  id: number
  titre: string
  description: string
  date_declaration: string
  declared_by?: ApiUser
  declared_by_id?: number
  team?: number | null
  team_id?: number | null
  status: Problem["status"]
  level: Problem["level"]
  qui?: string | null
  quoi?: string | null
  ou?: string | null
  quand?: string | null
  comment?: string | null
  combien?: string | null
  pourquoi?: string | null
  photos?: string[] | null
}

type ApiStep = {
  id: number
  problem: number
  problem_id?: number
  step_number: number
  description: string
  assigned_to?: ApiUser | null
  assigned_to_id?: number | null
  date_start?: string | null
  date_end?: string | null
  status: Step8D["status"]
  proof?: string[] | null
}

type ApiAction = {
  id: number
  step: number
  step_id?: number
  description: string
  assigned_to?: ApiUser | null
  assigned_to_id?: number | null
  status: Action["status"]
  date_due?: string | null
  proof?: string[] | null
}

type ApiNotification = {
  id: number
  user?: ApiUser
  user_id?: number
  problem?: number | null
  problem_id?: number | null
  step?: number | null
  step_id?: number | null
  message: string
  date_created: string
  is_read: boolean
}

type ApiTeam = {
  id: number
  nom_equipe: string
  date_creation: string
  created_by?: ApiUser
  created_by_id?: number
}

type ApiHistory = {
  id: number
  problem: number
  step?: number | null
  action: string
  performed_by?: ApiUser
  performed_by_id?: number
  date_performed: string
}

type PaginatedResponse<T> = {
  count?: number
  next?: string | null
  previous?: string | null
  results: T
}

function normalizeApiResponse<T>(data: unknown): T {
  if (data && typeof data === "object" && "results" in data) {
    return (data as PaginatedResponse<T>).results
  }
  return data as T
}

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`
  const config: RequestInit = {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  }

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body)
  }

  const response = await fetch(url, config)
  const text = await response.text()
  const contentType = response.headers.get("content-type") || ""

  let parsedData: unknown = null
  if (text) {
    if (contentType.includes("application/json")) {
      try {
        parsedData = JSON.parse(text)
      } catch (error) {
        throw new Error("Réponse JSON invalide reçue de l'API")
      }
    } else if (!response.ok) {
      parsedData = text
    } else {
      throw new Error("Réponse inattendue du serveur (non-JSON).")
    }
  }

  const data = normalizeApiResponse<T>(parsedData)

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : (data as { error?: string; message?: string })?.error ||
          (data as { error?: string; message?: string })?.message ||
          "API request failed"
    throw new Error(message)
  }

  return data
}

const mapUser = (user: ApiUser): User => ({
  user_id: user.id,
  nom: user.nom,
  role: user.role,
  service: user.service,
  competence: user.competence,
  email: user.email,
  password: user.password ?? "",
})

const mapProblem = (problem: ApiProblem): Problem => ({
  problem_id: problem.id,
  titre: problem.titre,
  description: problem.description,
  date_declaration: problem.date_declaration,
  declared_by: problem.declared_by?.id ?? problem.declared_by_id ?? 0,
  team_id: problem.team ?? problem.team_id ?? undefined,
  status: problem.status,
  level: problem.level,
  qui: problem.qui ?? undefined,
  quoi: problem.quoi ?? undefined,
  ou: problem.ou ?? undefined,
  quand: problem.quand ?? undefined,
  comment: problem.comment ?? undefined,
  combien: problem.combien ?? undefined,
  pourquoi: problem.pourquoi ?? undefined,
  photos: problem.photos ?? [],
})

const mapStep = (step: ApiStep): Step8D => ({
  step_id: step.id,
  problem_id: step.problem ?? step.problem_id ?? 0,
  step_number: step.step_number,
  description: step.description,
  assigned_to: step.assigned_to?.id ?? step.assigned_to_id ?? undefined,
  date_start: step.date_start ?? undefined,
  date_end: step.date_end ?? undefined,
  status: step.status,
  proof: step.proof ?? [],
})

const mapAction = (action: ApiAction): Action => ({
  action_id: action.id,
  step_id: action.step ?? action.step_id ?? 0,
  description: action.description,
  assigned_to: action.assigned_to?.id ?? action.assigned_to_id ?? undefined,
  status: action.status,
  date_due: action.date_due ?? undefined,
  proof: action.proof ?? [],
})

const mapNotification = (notification: ApiNotification): Notification => ({
  notification_id: notification.id,
  user_id: notification.user?.id ?? notification.user_id ?? 0,
  problem_id: notification.problem ?? notification.problem_id ?? undefined,
  step_id: notification.step ?? notification.step_id ?? undefined,
  message: notification.message,
  date_created: notification.date_created,
  is_read: notification.is_read,
})

const mapTeam = (team: ApiTeam): Team => ({
  team_id: team.id,
  nom_equipe: team.nom_equipe,
  date_creation: team.date_creation,
  created_by: team.created_by?.id ?? team.created_by_id ?? 0,
})

const mapHistory = (history: ApiHistory): History => ({
  history_id: history.id,
  problem_id: history.problem,
  step_id: history.step ?? undefined,
  action: history.action,
  performed_by: history.performed_by?.id ?? history.performed_by_id ?? 0,
  date_performed: history.date_performed,
})

// Authentication
export async function login(email: string, password: string): Promise<User> {
  const result = await apiCall<{ user: ApiUser }>("/login/", {
    method: "POST",
    body: { email, password },
  })
  return mapUser(result.user)
}

// Users
export async function getUsers(): Promise<User[]> {
  const data = await apiCall<ApiUser[]>("/users/")
  return data.map(mapUser)
}

export async function getUserById(id: number): Promise<User> {
  const data = await apiCall<ApiUser>(`/users/${id}/`)
  return mapUser(data)
}

export async function createUser(userData: Partial<ApiUser> & { password: string }): Promise<User> {
  const data = await apiCall<ApiUser>("/users/", {
    method: "POST",
    body: userData,
  })
  return mapUser(data)
}

// Problems
export async function getProblems(): Promise<Problem[]> {
  const data = await apiCall<ApiProblem[]>("/problems/")
  return data.map(mapProblem)
}

export async function getProblemById(id: number): Promise<Problem> {
  const data = await apiCall<ApiProblem>(`/problems/${id}/`)
  return mapProblem(data)
}

export async function createProblem(
  problemData: Partial<Problem> & { declared_by_id: number; team_id?: number | null },
): Promise<Problem> {
  const data = await apiCall<ApiProblem>("/problems/", {
    method: "POST",
    body: {
      ...problemData,
      team_id: problemData.team_id ?? null,
    },
  })
  return mapProblem(data)
}

export async function updateProblem(
  id: number,
  updates: Partial<Problem> & { declared_by_id?: number; team_id?: number | null },
): Promise<Problem> {
  const data = await apiCall<ApiProblem>(`/problems/${id}/`, {
    method: "PATCH",
    body: {
      ...updates,
      team_id: updates.team_id ?? null,
    },
  })
  return mapProblem(data)
}

export async function deleteProblem(id: number): Promise<void> {
  await apiCall(`/problems/${id}/`, { method: "DELETE" })
}

export async function getProblemSteps(problemId: number): Promise<Step8D[]> {
  const data = await apiCall<ApiStep[]>(`/problems/${problemId}/steps/`)
  return data.map(mapStep)
}

export async function updateProblemStatus(
  problemId: number,
  status: Problem["status"],
  performedById?: number,
): Promise<Problem> {
  const data = await apiCall<ApiProblem>(`/problems/${problemId}/update_status/`, {
    method: "PATCH",
    body: { status, performed_by_id: performedById },
  })
  return mapProblem(data)
}

// Teams
export async function getTeams(): Promise<Team[]> {
  const data = await apiCall<ApiTeam[]>("/teams/")
  return data.map(mapTeam)
}

export async function getTeamById(id: number): Promise<Team> {
  const data = await apiCall<ApiTeam>(`/teams/${id}/`)
  return mapTeam(data)
}

export async function createTeam(teamData: { nom_equipe: string; date_creation: string; created_by_id?: number }) {
  const data = await apiCall<ApiTeam>("/teams/", {
    method: "POST",
    body: teamData,
  })
  return mapTeam(data)
}

export async function deleteTeam(teamId: number): Promise<void> {
  await apiCall(`/teams/${teamId}/`, { method: "DELETE" })
}

export async function addTeamMember(teamId: number, userId: number, roleInTeam = "Membre") {
  return apiCall(`/teams/${teamId}/add_member/`, {
    method: "POST",
    body: { user_id: userId, role_in_team: roleInTeam },
  })
}

export async function removeTeamMember(teamId: number, userId: number) {
  return apiCall(`/teams/${teamId}/remove_member/`, {
    method: "DELETE",
    body: { user_id: userId },
  })
}

// Steps 8D
export async function getSteps(): Promise<Step8D[]> {
  const data = await apiCall<ApiStep[]>("/steps/")
  return data.map(mapStep)
}

export async function getStepById(id: number): Promise<Step8D> {
  const data = await apiCall<ApiStep>(`/steps/${id}/`)
  return mapStep(data)
}

export async function getStepsByProblemId(problemId: number): Promise<Step8D[]> {
  const data = await apiCall<ApiStep[]>(`/problems/${problemId}/steps/`)
  return data.map(mapStep)
}

export async function createStep(stepData: {
  problem_id: number
  step_number: number
  description: string
  assigned_to_id?: number | null
  date_start?: string | null
  date_end?: string | null
  status?: Step8D["status"]
  proof?: string[]
}): Promise<Step8D> {
  const data = await apiCall<ApiStep>("/steps/", {
    method: "POST",
    body: stepData,
  })
  return mapStep(data)
}

export async function updateStep(
  id: number,
  updates: Partial<Step8D> & { assigned_to_id?: number | null; problem_id?: number },
): Promise<Step8D> {
  const data = await apiCall<ApiStep>(`/steps/${id}/`, {
    method: "PATCH",
    body: updates,
  })
  return mapStep(data)
}

export async function initializeSteps(problemId: number): Promise<Step8D[]> {
  const data = await apiCall<ApiStep[]>("/steps/initialize_steps/", {
    method: "POST",
    body: { problem_id: problemId },
  })
  return data.map(mapStep)
}

export async function getStepActions(stepId: number): Promise<Action[]> {
  const data = await apiCall<ApiAction[]>(`/steps/${stepId}/actions/`)
  return data.map(mapAction)
}

export async function updateStepStatus(
  stepId: number,
  status: Step8D["status"],
  performedById?: number,
): Promise<Step8D> {
  const data = await apiCall<ApiStep>(`/steps/${stepId}/update_status/`, {
    method: "PATCH",
    body: { status, performed_by_id: performedById },
  })
  return mapStep(data)
}

// Actions
export async function getActions(): Promise<Action[]> {
  const data = await apiCall<ApiAction[]>("/actions/")
  return data.map(mapAction)
}

export async function getActionById(id: number): Promise<Action> {
  const data = await apiCall<ApiAction>(`/actions/${id}/`)
  return mapAction(data)
}

export async function getActionsByStepId(stepId: number): Promise<Action[]> {
  const data = await apiCall<ApiAction[]>(`/steps/${stepId}/actions/`)
  return data.map(mapAction)
}

export async function createAction(actionData: {
  step_id: number
  description: string
  assigned_to_id?: number | null
  status?: Action["status"]
  date_due?: string | null
  proof?: string[]
}): Promise<Action> {
  const data = await apiCall<ApiAction>("/actions/", {
    method: "POST",
    body: actionData,
  })
  return mapAction(data)
}

export async function updateAction(
  id: number,
  updates: Partial<Action> & { assigned_to_id?: number | null; step_id?: number },
): Promise<Action> {
  const data = await apiCall<ApiAction>(`/actions/${id}/`, {
    method: "PATCH",
    body: updates,
  })
  return mapAction(data)
}

export async function updateActionStatus(
  actionId: number,
  status: Action["status"],
  performedById?: number,
): Promise<Action> {
  const data = await apiCall<ApiAction>(`/actions/${actionId}/update_status/`, {
    method: "PATCH",
    body: { status, performed_by_id: performedById },
  })
  return mapAction(data)
}

// Notifications
export async function getNotifications(): Promise<Notification[]> {
  const data = await apiCall<ApiNotification[]>("/notifications/")
  return data.map(mapNotification)
}

export async function getNotificationsByUserId(userId: number): Promise<Notification[]> {
  const data = await apiCall<ApiNotification[]>(`/notifications/by_user/?user_id=${userId}`)
  return data.map(mapNotification)
}

export async function createNotification(notificationData: {
  user_id: number
  message: string
  problem_id?: number | null
  step_id?: number | null
}): Promise<Notification> {
  const data = await apiCall<ApiNotification>("/notifications/", {
    method: "POST",
    body: {
      ...notificationData,
      problem_id: notificationData.problem_id ?? null,
      step_id: notificationData.step_id ?? null,
    },
  })
  return mapNotification(data)
}

export async function markNotificationAsRead(notificationId: number): Promise<Notification> {
  const data = await apiCall<ApiNotification>(`/notifications/${notificationId}/mark_read/`, {
    method: "PATCH",
  })
  return mapNotification(data)
}

export async function markAllNotificationsAsRead(userId: number) {
  return apiCall("/notifications/mark_all_read/", {
    method: "PATCH",
    body: { user_id: userId },
  })
}

// History
export async function getHistory(): Promise<History[]> {
  const data = await apiCall<ApiHistory[]>("/history/")
  return data.map(mapHistory)
}

export async function getHistoryByProblemId(problemId: number): Promise<History[]> {
  const data = await apiCall<ApiHistory[]>(`/history/by_problem/?problem_id=${problemId}`)
  return data.map(mapHistory)
}
