"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { getProblemById, getStepsByProblemId, getUsers, updateProblem, initializeSteps } from "@/lib/api"
import type { Problem, Step8D, User } from "@/lib/types"
import { ArrowLeft, Users, Calendar, MapPin, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const STEP_8D_TITLES = [
  { number: 1, title: "D1 - Constituer l'équipe", description: "Former l'équipe multidisciplinaire" },
  { number: 2, title: "D2 - Décrire le problème", description: "Utiliser QQOQCCP pour décrire" },
  { number: 3, title: "D3 - Actions de containment", description: "Protéger le client immédiatement" },
  { number: 4, title: "D4 - Identifier les causes racines", description: "5 Pourquoi, Ishikawa, Pareto" },
  { number: 5, title: "D5 - Actions correctives permanentes", description: "Choisir et vérifier les solutions" },
  { number: 6, title: "D6 - Mettre en œuvre", description: "Déployer les actions correctives" },
  { number: 7, title: "D7 - Prévenir la récurrence", description: "Standardiser et documenter" },
  { number: 8, title: "D8 - Féliciter l'équipe", description: "Reconnaître et capitaliser" },
]

export default function ProblemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [steps, setSteps] = useState<Step8D[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const loadData = async () => {
      if (!params.id) return
      try {
        const [problemData, stepsData, usersData] = await Promise.all([
          getProblemById(Number(params.id)),
          getStepsByProblemId(Number(params.id)),
          getUsers(),
        ])
        setProblem(problemData)
        setSteps(stepsData)
        setUsers(usersData)
      } catch (error) {
        console.error("Erreur lors du chargement des données du problème", error)
      }
    }

    loadData()
  }, [params.id])

  const getUserById = (userId: number) => {
    return users.find((u) => u.user_id === userId)
  }

  const getStepStatus = (stepNumber: number) => {
    const step = steps.find((s) => s.step_number === stepNumber)
    return step?.status || "Non commencé"
  }

  const handleInitializeSteps = async () => {
    if (!problem || !user) return

    try {
      const createdSteps = await initializeSteps(problem.problem_id)
      setSteps(createdSteps)
      const updatedProblem = await updateProblem(problem.problem_id, { status: "En cours" })
      setProblem(updatedProblem)
    } catch (error) {
      console.error("Erreur lors de l'initialisation des 8D", error)
      alert("Impossible d'initialiser les �tapes pour le moment.")
    }
  }

  if (!problem || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Problème non trouvé</p>
          <Link href="/dashboard/problems">
            <Button className="mt-4">Retour aux problèmes</Button>
          </Link>
        </div>
      </div>
    )
  }

  const declaredBy = getUserById(problem.declared_by)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/problems">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-foreground">{problem.titre}</h1>
            <Badge
              className={
                problem.status === "Ouvert"
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : problem.status === "En cours"
                    ? "bg-accent/10 text-accent hover:bg-accent/20"
                    : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
              }
            >
              {problem.status}
            </Badge>
            <Badge variant="outline">{problem.level}</Badge>
          </div>
          <p className="text-muted-foreground">
            Déclaré par {declaredBy?.nom} le {new Date(problem.date_declaration).toLocaleDateString("fr-FR")}
          </p>
        </div>
        {problem.status === "Ouvert" && steps.length === 0 && (
          <Button onClick={handleInitializeSteps}>Démarrer la résolution 8D</Button>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="8d">Démarche 8D</TabsTrigger>
          <TabsTrigger value="qqoqccp">QQOQCCP</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description du problème</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{problem.description}</p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Date de déclaration</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(problem.date_declaration).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Niveau</p>
                    <p className="text-sm text-muted-foreground">{problem.level}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Déclaré par</p>
                    <p className="text-sm text-muted-foreground">
                      {declaredBy?.nom} - {declaredBy?.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progression</CardTitle>
              </CardHeader>
              <CardContent>
                {steps.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">La démarche 8D n'a pas encore été démarrée</p>
                    <Button onClick={handleInitializeSteps} className="mt-4">
                      Démarrer maintenant
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {STEP_8D_TITLES.map((stepInfo) => {
                      const status = getStepStatus(stepInfo.number)
                      return (
                        <div key={stepInfo.number} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                          {status === "Terminé" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : status === "En cours" ? (
                            <Clock className="h-5 w-5 text-accent" />
                          ) : (
                            <XCircle className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{stepInfo.title}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {status}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="8d" className="space-y-4">
          {steps.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">La démarche 8D n'a pas encore été initialisée</p>
                <Button onClick={handleInitializeSteps}>Initialiser les 8 disciplines</Button>
              </CardContent>
            </Card>
          ) : (
            STEP_8D_TITLES.map((stepInfo) => {
              const step = steps.find((s) => s.step_number === stepInfo.number)
              return (
                <Card key={stepInfo.number}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3">
                          {stepInfo.title}
                          {step && (
                            <Badge
                              className={
                                step.status === "Terminé"
                                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                  : step.status === "En cours"
                                    ? "bg-accent/10 text-accent hover:bg-accent/20"
                                    : "bg-muted text-muted-foreground"
                              }
                            >
                              {step.status}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{stepInfo.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {step ? (
                      <div className="space-y-4">
                        <p className="text-sm text-foreground">{step.description}</p>
                        {step.assigned_to && (
                          <div className="text-sm text-muted-foreground">
                            Responsable: {getUserById(step.assigned_to)?.nom}
                          </div>
                        )}
                        {step.date_start && (
                          <div className="text-sm text-muted-foreground">
                            Début: {new Date(step.date_start).toLocaleDateString("fr-FR")}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Cette étape n'a pas encore été initialisée</p>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="qqoqccp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse QQOQCCP</CardTitle>
              <CardDescription>Qui, Quoi, Où, Quand, Comment, Combien, Pourquoi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-primary">Qui ?</h3>
                  <p className="text-sm text-foreground">{problem.qui || "Non renseigné"}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-primary">Quoi ?</h3>
                  <p className="text-sm text-foreground">{problem.quoi || "Non renseigné"}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-primary">Où ?</h3>
                  <p className="text-sm text-foreground">{problem.ou || "Non renseigné"}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-primary">Quand ?</h3>
                  <p className="text-sm text-foreground">{problem.quand || "Non renseigné"}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-primary">Comment ?</h3>
                  <p className="text-sm text-foreground">{problem.comment || "Non renseigné"}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-primary">Combien ?</h3>
                  <p className="text-sm text-foreground">{problem.combien || "Non renseigné"}</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <h3 className="text-sm font-medium text-primary">Pourquoi ?</h3>
                  <p className="text-sm text-foreground">{problem.pourquoi || "Non renseigné"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
