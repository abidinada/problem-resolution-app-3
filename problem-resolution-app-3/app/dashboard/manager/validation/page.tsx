"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { getProblems, updateProblem, getStepsByProblemId } from "@/lib/api"
import type { Problem, Step8D } from "@/lib/types"
import { CheckCircle, XCircle, Eye } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function ManagerValidationPage() {
  const { user } = useAuth()
  const [problems, setProblems] = useState<Problem[]>([])
  const [stepsByProblem, setStepsByProblem] = useState<Record<number, Step8D[]>>({})

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const allProblems = await getProblems()
        const inProgress = allProblems.filter((p) => p.status === "En cours")
        setProblems(inProgress)

        const stepsEntries = await Promise.all(
          inProgress.map(async (problem) => {
            try {
              const steps = await getStepsByProblemId(problem.problem_id)
              return [problem.problem_id, steps] as const
            } catch (error) {
              console.error("Impossible de charger les Ç¸tapes pour le problÇùme", problem.problem_id, error)
              return [problem.problem_id, [] as Step8D[]] as const
            }
          }),
        )
        setStepsByProblem(Object.fromEntries(stepsEntries))
      } catch (error) {
        console.error("Erreur lors du chargement des problÇùmes", error)
      }
    }

    loadProblems()
  }, [])

  const handleValidate = async (problemId: number) => {
    try {
      const steps = await getStepsByProblemId(problemId)
      setStepsByProblem((prev) => ({ ...prev, [problemId]: steps }))
      const allStepsCompleted = steps.every((s) => s.status === "TerminǸ")

      if (allStepsCompleted) {
        await updateProblem(problemId, { status: "Cl��turǸ" })
        setProblems((prev) => prev.filter((p) => p.problem_id !== problemId))
        alert("Rapport 8D validǸ et cl��turǸ avec succ��s!")
      } else {
        alert("Toutes les Ǹtapes 8D doivent �tre complǸtǸes avant validation")
      }
    } catch (error) {
      console.error("Erreur lors de la validation du rapport", error)
      alert("Impossible de valider ce rapport pour le moment.")
    }
  }

  const handleReject = async (problemId: number) => {
    if (confirm("�tes-vous sǫr de vouloir rejeter ce rapport 8D?")) {
      try {
        await updateProblem(problemId, { status: "Ouvert" })
        setProblems((prev) => prev.filter((p) => p.problem_id !== problemId))
        alert("Rapport 8D renvoyǸ pour rǸvision")
      } catch (error) {
        console.error("Erreur lors du rejet du rapport", error)
        alert("Impossible de rejeter ce rapport pour le moment.")
      }
    }
  }

  if (!user || user.role !== "Manager") {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Accès réservé aux Managers</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Validation des Rapports 8D</h1>
        <p className="text-muted-foreground mt-1">Validez ou rejetez les rapports 8D complétés</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rapports 8D en attente de validation</CardTitle>
          <CardDescription>Vérifiez et validez les démarches 8D avant clôture définitive</CardDescription>
        </CardHeader>
        <CardContent>
          {problems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun rapport en attente de validation</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary/10 border-b border-border">
                    <th className="p-3 text-left text-sm font-semibold text-foreground">ID</th>
                    <th className="p-3 text-left text-sm font-semibold text-foreground">Titre</th>
                    <th className="p-3 text-left text-sm font-semibold text-foreground">Niveau</th>
                    <th className="p-3 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="p-3 text-left text-sm font-semibold text-foreground">Statut</th>
                    <th className="p-3 text-left text-sm font-semibold text-foreground">Progression</th>
                    <th className="p-3 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem) => {
                    const steps = stepsByProblem[problem.problem_id] || []
                    const completedSteps = steps.filter((s) => s.status === "TerminǸ").length
                    const totalSteps = 8
                    const progressPercentage = (completedSteps / totalSteps) * 100

                    return (
                      <tr key={problem.problem_id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-3 text-sm font-medium">#{problem.problem_id}</td>
                        <td className="p-3 text-sm">{problem.titre}</td>
                        <td className="p-3 text-sm">
                          <Badge variant="outline">{problem.level}</Badge>
                        </td>
                        <td className="p-3 text-sm">
                          {new Date(problem.date_declaration).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="p-3 text-sm">
                          <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                            {problem.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">
                              {completedSteps}/{totalSteps} étapes
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/problems/${problem.problem_id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Voir
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleValidate(problem.problem_id)}
                              disabled={completedSteps < totalSteps}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Valider
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(problem.problem_id)}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Rejeter
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
