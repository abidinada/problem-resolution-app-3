import type { User, Problem, Team, Step8D, Action, Notification } from "./types"
import { STORAGE_KEYS } from "./mock-data"

// User operations
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return userStr ? JSON.parse(userStr) : null
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS)
  return usersStr ? JSON.parse(usersStr) : []
}

export function saveUsers(users: User[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

// Problem operations
export function getProblems(): Problem[] {
  if (typeof window === "undefined") return []
  const problemsStr = localStorage.getItem(STORAGE_KEYS.PROBLEMS)
  return problemsStr ? JSON.parse(problemsStr) : []
}

export function saveProblems(problems: Problem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(problems))
}

export function getProblemById(id: number): Problem | undefined {
  return getProblems().find((p) => p.problem_id === id)
}

export function addProblem(problem: Problem) {
  const problems = getProblems()
  problems.push(problem)
  saveProblems(problems)
}

export function updateProblem(id: number, updates: Partial<Problem>) {
  const problems = getProblems()
  const index = problems.findIndex((p) => p.problem_id === id)
  if (index !== -1) {
    problems[index] = { ...problems[index], ...updates }
    saveProblems(problems)
  }
}

// Team operations
export function getTeams(): Team[] {
  if (typeof window === "undefined") return []
  const teamsStr = localStorage.getItem(STORAGE_KEYS.TEAMS)
  return teamsStr ? JSON.parse(teamsStr) : []
}

export function saveTeams(teams: Team[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams))
}

// Step operations
export function getSteps(): Step8D[] {
  if (typeof window === "undefined") return []
  const stepsStr = localStorage.getItem(STORAGE_KEYS.STEPS)
  return stepsStr ? JSON.parse(stepsStr) : []
}

export function saveSteps(steps: Step8D[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.STEPS, JSON.stringify(steps))
}

export function getStepsByProblemId(problemId: number): Step8D[] {
  return getSteps().filter((s) => s.problem_id === problemId)
}

export function addStep(step: Step8D) {
  const steps = getSteps()
  steps.push(step)
  saveSteps(steps)
}

export function updateStep(id: number, updates: Partial<Step8D>) {
  const steps = getSteps()
  const index = steps.findIndex((s) => s.step_id === id)
  if (index !== -1) {
    steps[index] = { ...steps[index], ...updates }
    saveSteps(steps)
  }
}

// Action operations
export function getActions(): Action[] {
  if (typeof window === "undefined") return []
  const actionsStr = localStorage.getItem(STORAGE_KEYS.ACTIONS)
  return actionsStr ? JSON.parse(actionsStr) : []
}

export function saveActions(actions: Action[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions))
}

export function getActionsByStepId(stepId: number): Action[] {
  return getActions().filter((a) => a.step_id === stepId)
}

export function addAction(action: Action) {
  const actions = getActions()
  actions.push(action)
  saveActions(actions)
}

export function updateAction(id: number, updates: Partial<Action>) {
  const actions = getActions()
  const index = actions.findIndex((a) => a.action_id === id)
  if (index !== -1) {
    actions[index] = { ...actions[index], ...updates }
    saveActions(actions)
  }
}

// Notification operations
export function getNotifications(): Notification[] {
  if (typeof window === "undefined") return []
  const notificationsStr = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
  return notificationsStr ? JSON.parse(notificationsStr) : []
}

export function saveNotifications(notifications: Notification[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))
}

export function getNotificationsByUserId(userId: number): Notification[] {
  return getNotifications().filter((n) => n.user_id === userId)
}

export function markNotificationAsRead(id: number) {
  const notifications = getNotifications()
  const index = notifications.findIndex((n) => n.notification_id === id)
  if (index !== -1) {
    notifications[index].is_read = true
    saveNotifications(notifications)
  }
}

export function addNotification(notification: Notification) {
  const notifications = getNotifications()
  notifications.push(notification)
  saveNotifications(notifications)
}
