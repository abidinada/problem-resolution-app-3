"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { getTeams, createTeam, deleteTeam, getUsers } from "@/lib/api"
import type { Team, User } from "@/lib/types"
import { Plus, UsersIcon, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TeamsPage() {
  const { user } = useAuth()
  const [teams, setTeams] = useState<Team[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTeam, setNewTeam] = useState({
    nom_equipe: "",
    members: [] as number[],
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedTeams, fetchedUsers] = await Promise.all([getTeams(), getUsers()])
        setTeams(fetchedTeams)
        setUsers(fetchedUsers)
      } catch (error) {
        console.error("Erreur lors du chargement des données des équipes", error)
      }
    }

    loadData()
  }, [])

  const handleCreateTeam = async () => {
    if (!user || !newTeam.nom_equipe) return

    try {
      const createdTeam = await createTeam({
        nom_equipe: newTeam.nom_equipe,
        date_creation: new Date().toISOString().split("T")[0],
        created_by_id: user.user_id,
      })

      setTeams((prev) => [...prev, createdTeam])
      setIsDialogOpen(false)
      setNewTeam({ nom_equipe: "", members: [] })
    } catch (error) {
      console.error("Erreur lors de la création de l'équipe", error)
      alert("Impossible de créer l'équipe.")
    }
  }

  const handleDeleteTeam = async (teamId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette équipe?")) {
      try {
        await deleteTeam(teamId)
        setTeams((prev) => prev.filter((t) => t.team_id !== teamId))
      } catch (error) {
        console.error("Erreur lors de la suppression de l'équipe", error)
        alert("Impossible de supprimer l'équipe pour le moment.")
      }
    }
  }

  if (!user) return null

  const canManageTeams = ["Manager", "Responsable", "Superviseur"].includes(user.role)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Équipes</h1>
          <p className="text-muted-foreground mt-1">Créez et gérez les équipes 8D pour la résolution de problèmes</p>
        </div>
        {canManageTeams && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle équipe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une nouvelle équipe 8D</DialogTitle>
                <DialogDescription>Définissez le nom et les membres de l'équipe</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Nom de l'équipe</Label>
                  <Input
                    id="team-name"
                    value={newTeam.nom_equipe}
                    onChange={(e) => setNewTeam({ ...newTeam, nom_equipe: e.target.value })}
                    placeholder="Ex: Équipe 8D - Ligne A"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Membres de l'équipe</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner des membres" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.user_id} value={u.user_id.toString()}>
                          {u.nom} - {u.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateTeam} disabled={!newTeam.nom_equipe}>
                  Créer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => {
          const creator = users.find((u) => u.user_id === team.created_by)
          return (
            <Card key={team.team_id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{team.nom_equipe}</CardTitle>
                  </div>
                  {canManageTeams && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTeam(team.team_id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <CardDescription>Créée le {new Date(team.date_creation).toLocaleDateString("fr-FR")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Créée par:</span> {creator?.nom || "Inconnu"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Rôle:</span> {creator?.role || "N/A"}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {teams.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune équipe créée</p>
              {canManageTeams && <p className="text-sm text-muted-foreground mt-2">Créez votre première équipe 8D</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
