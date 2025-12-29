"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { getProblems } from "@/lib/api"
import { useEffect, useState } from "react"
import type { Problem } from "@/lib/types"
import { BarChart3, TrendingUp, Clock, AlertTriangle } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  Legend,
} from "recharts"

const COLORS = {
  primary: "#226d68",
  secondary: "#2d8a83",
  accent: "#3da89f",
  warning: "#f59e0b",
  success: "#10b981",
  danger: "#ef4444",
  purple: "#8b5cf6",
}

const CATEGORY_COLORS = [
  "#226d68", // Teal primary
  "#3da89f", // Teal accent
  "#2d8a83", // Teal secondary
  "#f59e0b", // Orange
  "#8b5cf6", // Purple
]

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [problems, setProblems] = useState<Problem[]>([])
  const [selectedUsine, setSelectedUsine] = useState("all")
  const [selectedAtelier, setSelectedAtelier] = useState("all")
  const [selectedLigne, setSelectedLigne] = useState("all")

  const monthlyData = [
    { month: "Jan", count: 4 },
    { month: "Fév", count: 5 },
    { month: "Mar", count: 3 },
    { month: "Avr", count: 6 },
    { month: "May", count: 2 },
    { month: "Jun", count: 7 },
    { month: "Jul", count: 4 },
    { month: "Aoû", count: 5 },
    { month: "Sep", count: 6 },
    { month: "Oct", count: 5 },
    { month: "Nov", count: 8 },
    { month: "Déc", count: 3 },
  ]

  const categoryData = [
    { name: "Qualité produit", value: 35, count: 7 },
    { name: "Fluctuation client", value: 25, count: 5 },
    { name: "Maintenance", value: 20, count: 4 },
    { name: "Qualité fournisseur", value: 15, count: 3 },
    { name: "Sécurité", value: 5, count: 1 },
  ]

  const performanceData = [
    { line: "Ligne 1", problems: 12, resolved: 10 },
    { line: "Ligne 2", problems: 15, resolved: 13 },
    { line: "Ligne 3", problems: 8, resolved: 7 },
    { line: "Magasin", problems: 6, resolved: 5 },
  ]

  const resolutionRate = [
    { day: "S1", rate: 65 },
    { day: "S2", rate: 70 },
    { day: "S3", rate: 68 },
    { day: "S4", rate: 75 },
    { day: "S5", rate: 82 },
    { day: "S6", rate: 85 },
  ]

  const principalCauses = [
    { cause: "Paramètre machine", percentage: "35%", occurrences: 7 },
    { cause: "Matière première", percentage: "27%", occurrences: 5 },
    { cause: "Formation opérateur", percentage: "19%", occurrences: 4 },
    { cause: "Outillage usé", percentage: "12%", occurrences: 2 },
    { cause: "Autre", percentage: "7%", occurrences: 1 },
  ]

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const allProblems = await getProblems()
        setProblems(allProblems)
      } catch (error) {
        console.error("Erreur lors du chargement des problÇùmes", error)
      }
    }

    fetchProblems()
  }, [])

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="gradient-card rounded-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-10 w-10" />
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-white/90 mt-1">Tableau de bord des indicateurs de performance</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Toutes les usines</label>
          <Select value={selectedUsine} onValueChange={setSelectedUsine}>
            <SelectTrigger className="h-11 bg-card border-primary/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les usines</SelectItem>
              <SelectItem value="usine1">Usine 1</SelectItem>
              <SelectItem value="usine2">Usine 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Tous les ateliers</label>
          <Select value={selectedAtelier} onValueChange={setSelectedAtelier}>
            <SelectTrigger className="h-11 bg-card border-primary/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les ateliers</SelectItem>
              <SelectItem value="atelier1">Atelier A</SelectItem>
              <SelectItem value="atelier2">Atelier B</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Toutes les lignes</label>
          <Select value={selectedLigne} onValueChange={setSelectedLigne}>
            <SelectTrigger className="h-11 bg-card border-primary/30">
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

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-primary bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Problèmes ouverts</p>
                <p className="text-4xl font-bold text-primary mt-2">9</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent bg-gradient-to-br from-card to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sans date de clôture</p>
                <p className="text-4xl font-bold text-accent mt-2">9</p>
              </div>
              <Clock className="h-10 w-10 text-accent opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#f59e0b] bg-gradient-to-br from-card to-orange-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aucun pilote affecté</p>
                <p className="text-4xl font-bold text-[#f59e0b] mt-2">12</p>
              </div>
              <TrendingUp className="h-10 w-10 text-[#f59e0b] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#8b5cf6] bg-gradient-to-br from-card to-purple-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Temps de fermeture moyen</p>
                <p className="text-4xl font-bold text-[#8b5cf6] mt-2">40</p>
              </div>
              <BarChart3 className="h-10 w-10 text-[#8b5cf6] opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader className="bg-card/50">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tendance mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d2a" />
                <XAxis dataKey="month" stroke="#9ca8a4" />
                <YAxis stroke="#9ca8a4" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#121716",
                    border: "1px solid #226d68",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="bg-card/50">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Répartition par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#121716",
                    border: "1px solid #226d68",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="bg-card/50">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#8b5cf6]" />
            Taux de résolution (6 dernières semaines)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={resolutionRate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d2a" />
              <XAxis dataKey="day" stroke="#9ca8a4" />
              <YAxis stroke="#9ca8a4" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#121716",
                  border: "1px solid #226d68",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#3da89f"
                strokeWidth={3}
                dot={{ fill: "#226d68", r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader className="bg-card/50">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#10b981]" />
            Performance par ligne
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d2a" />
              <XAxis type="number" stroke="#9ca8a4" />
              <YAxis dataKey="line" type="category" stroke="#9ca8a4" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#121716",
                  border: "1px solid #226d68",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="problems" fill="#ef4444" name="Problèmes" radius={[0, 8, 8, 0]} />
              <Bar dataKey="resolved" fill="#10b981" name="Résolus" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader className="bg-card/50">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#f59e0b]" />
            Analyse Pareto - Causes principales
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {principalCauses.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.cause}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{item.occurrences} occurrences</span>
                    <span className="font-bold text-primary">{item.percentage}</span>
                  </div>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: item.percentage,
                      background: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
