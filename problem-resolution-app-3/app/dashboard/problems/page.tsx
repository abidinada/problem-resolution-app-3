"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { getProblems } from "@/lib/api"
import { Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import type { Problem } from "@/lib/types"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProblemsPage() {
  const { user } = useAuth()
  const [problems, setProblems] = useState<Problem[]>([])
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const allProblems = await getProblems()
        setProblems(allProblems)
        setFilteredProblems(allProblems)
      } catch (error) {
        console.error("Erreur lors du chargement des problÇùmes", error)
      }
    }

    loadProblems()
  }, [])

  useEffect(() => {
    let filtered = problems

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter)
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter((p) => p.level === levelFilter)
    }

    setFilteredProblems(filtered)
  }, [searchTerm, statusFilter, levelFilter, problems])

  if (!user) return null

  return (
    <div className="space-y-6">
      <div
        className="flex items-center justify-between rounded-xl p-6 text-white shadow-xl"
        style={{ background: "linear-gradient(135deg, #18534f 0%, #226d68 100%)" }}
      >
        <div>
          <h1 className="text-3xl font-bold">Problèmes</h1>
          <p className="text-white/90 mt-1 text-base">Gestion des problèmes selon la méthodologie 8D</p>
        </div>
        <Link href="/dashboard/problems/new">
          <Button className="h-11 px-6 font-bold shadow-lg" style={{ background: "white", color: "#226d68" }}>
            <Plus className="h-5 w-5 mr-2" />
            Nouveau problème
          </Button>
        </Link>
      </div>

      <Card className="border-2 shadow-lg" style={{ borderColor: "#74b5af" }}>
        <CardHeader style={{ backgroundColor: "#ECF8F6" }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: "#226d68" }} />
              <Input
                placeholder="Rechercher un problème..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 border-2 text-base"
                style={{ borderColor: "#74b5af", backgroundColor: "white" }}
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  className="w-[170px] h-12 border-2"
                  style={{ borderColor: "#74b5af", backgroundColor: "white" }}
                >
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Ouvert">Ouvert</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Clôturé">Clôturé</SelectItem>
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger
                  className="w-[170px] h-12 border-2"
                  style={{ borderColor: "#74b5af", backgroundColor: "white" }}
                >
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="Usine">Usine</SelectItem>
                  <SelectItem value="Ligne">Ligne</SelectItem>
                  <SelectItem value="Atelier">Atelier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {filteredProblems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun problème trouvé</p>
              </div>
            ) : (
              filteredProblems.map((problem) => (
                <Link key={problem.problem_id} href={`/dashboard/problems/${problem.problem_id}`} className="block">
                  <div
                    className="flex items-center justify-between rounded-xl border-2 p-5 hover:shadow-lg transition-all"
                    style={{ borderColor: "#74b5af", backgroundColor: "#ECF8F6" }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-foreground">{problem.titre}</h3>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold`}
                          style={{
                            backgroundColor:
                              problem.status === "Ouvert"
                                ? "#226d68"
                                : problem.status === "En cours"
                                  ? "#f59e0b"
                                  : "#10b981",
                            color:
                              problem.status === "Ouvert" ? "white" : problem.status === "En cours" ? "white" : "white",
                          }}
                        >
                          {problem.status}
                        </span>
                        <span className="text-xs text-muted-foreground border border-border rounded px-2 py-0.5">
                          {problem.level}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{problem.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Déclaré le: {new Date(problem.date_declaration).toLocaleDateString("fr-FR")}</span>
                        {problem.qui && <span>Qui: {problem.qui}</span>}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="font-semibold" style={{ color: "#226d68" }}>
                      Voir détails
                    </Button>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
