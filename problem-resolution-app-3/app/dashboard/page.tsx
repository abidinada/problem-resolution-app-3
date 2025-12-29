"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { getProblems } from "@/lib/api"
import { useEffect, useState } from "react"
import type { Problem } from "@/lib/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Label } from "@/components/ui/label"

export default function DashboardPage() {
  const { user } = useAuth()
  const [problems, setProblems] = useState<Problem[]>([])
  const [selectedUsine, setSelectedUsine] = useState("all")
  const [selectedAtelier, setSelectedAtelier] = useState("all")
  const [selectedLigne, setSelectedLigne] = useState("all")

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const allProblems = await getProblems()
        setProblems(allProblems)
      } catch (error) {
        console.error("Impossible de rÇ¸cupÇ¸rer les problÇùmes depuis l'API", error)
      }
    }

    fetchProblems()
  }, [])

  const problemesOuverts = problems.filter((p) => p.status === "Ouvert").length
  const sansDateCloture = problems.filter((p) => p.status !== "Clôturé").length
  const aucunPiloteAffecte = problems.filter((p) => !p.team_id).length
  const tempsFermetureMoyen = 40 // Valeur fictive pour l'instant

  const chartData = [
    { name: "Jan", value: 4 },
    { name: "Fév", value: 5 },
    { name: "Mar", value: 3 },
    { name: "Apr", value: 6 },
    { name: "May", value: 2 },
    { name: "Jun", value: 7 },
    { name: "Jul", value: 4 },
    { name: "Aug", value: 5 },
    { name: "Sep", value: 6 },
    { name: "Oct", value: 5 },
    { name: "Nov", value: 8 },
    { name: "Déc", value: 3 },
  ]

  if (!user) return null

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-8 text-white shadow-xl"
        style={{ background: "linear-gradient(135deg, #18534f 0%, #226d68 50%, #2d8a83 100%)" }}
      >
        <h1 className="text-4xl font-bold mb-2">Dashboard Résolution de Problèmes</h1>
        <p className="text-white/90 text-lg">Vue d'ensemble des indicateurs de performance</p>
      </div>

      <Card className="border-2 shadow-lg" style={{ borderColor: "#74b5af", backgroundColor: "#ECF8F6" }}>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="text-sm font-bold mb-2 block" style={{ color: "#18534f" }}>
                Toutes les usines
              </Label>
              <Select value={selectedUsine} onValueChange={setSelectedUsine}>
                <SelectTrigger className="h-12 border-2" style={{ borderColor: "#74b5af", backgroundColor: "white" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les usines</SelectItem>
                  <SelectItem value="usine1">Usine 1</SelectItem>
                  <SelectItem value="usine2">Usine 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label className="text-sm font-bold mb-2 block" style={{ color: "#18534f" }}>
                Tous les ateliers
              </Label>
              <Select value={selectedAtelier} onValueChange={setSelectedAtelier}>
                <SelectTrigger className="h-12 border-2" style={{ borderColor: "#74b5af", backgroundColor: "white" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les ateliers</SelectItem>
                  <SelectItem value="atelier1">Atelier 1</SelectItem>
                  <SelectItem value="atelier2">Atelier 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label className="text-sm font-bold mb-2 block" style={{ color: "#18534f" }}>
                Toutes les lignes
              </Label>
              <Select value={selectedLigne} onValueChange={setSelectedLigne}>
                <SelectTrigger className="h-12 border-2" style={{ borderColor: "#74b5af", backgroundColor: "white" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les lignes</SelectItem>
                  <SelectItem value="ligne1">Ligne 1</SelectItem>
                  <SelectItem value="ligne2">Ligne 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-4">
        <Card
          className="border-l-8 shadow-lg hover:shadow-xl transition-shadow"
          style={{ borderLeftColor: "#226d68", backgroundColor: "white" }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold" style={{ color: "#18534f" }}>
              Problèmes ouverts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold" style={{ color: "#226d68" }}>
              {problemesOuverts}
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-l-8 shadow-lg hover:shadow-xl transition-shadow"
          style={{ borderLeftColor: "#2d8a83", backgroundColor: "white" }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold" style={{ color: "#18534f" }}>
              Sans date de clôture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold" style={{ color: "#2d8a83" }}>
              {sansDateCloture}
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-l-8 shadow-lg hover:shadow-xl transition-shadow"
          style={{ borderLeftColor: "#f59e0b", backgroundColor: "white" }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold" style={{ color: "#18534f" }}>
              Aucun pilote affecté
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold" style={{ color: "#f59e0b" }}>
              {aucunPiloteAffecte}
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-l-8 shadow-lg hover:shadow-xl transition-shadow"
          style={{ borderLeftColor: "#8b5cf6", backgroundColor: "white" }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold" style={{ color: "#18534f" }}>
              Temps de fermeture moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold" style={{ color: "#8b5cf6" }}>
              {tempsFermetureMoyen}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-lg" style={{ borderColor: "#74b5af" }}>
        <CardHeader style={{ background: "linear-gradient(135deg, #ECF8F6 0%, #ffffff 100%)" }}>
          <CardTitle className="text-xl font-bold" style={{ color: "#18534f" }}>
            Évolution mensuelle des problèmes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="name" stroke="#4b5563" />
              <YAxis stroke="#4b5563" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "2px solid #74b5af",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="value" fill="#226d68" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
