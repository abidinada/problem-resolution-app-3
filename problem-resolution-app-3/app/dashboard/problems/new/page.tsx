"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { createProblem } from "@/lib/api"
import type { ProblemLevel } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewProblemPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    level: "Atelier" as ProblemLevel,
    qui: "",
    quoi: "",
    ou: "",
    quand: "",
    comment: "",
    combien: "",
    pourquoi: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const payload = {
      titre: formData.titre,
      description: formData.description,
      date_declaration: new Date().toISOString().split("T")[0],
      declared_by_id: user.user_id,
      status: "Ouvert",
      level: formData.level,
      qui: formData.qui,
      quoi: formData.quoi,
      ou: formData.ou,
      quand: formData.quand,
      comment: formData.comment,
      combien: formData.combien,
      pourquoi: formData.pourquoi,
      photos: [] as string[],
    }

    try {
      await createProblem(payload)
      router.push("/dashboard/problems")
    } catch (error) {
      console.error("Failed to create problem on backend:", error)
      alert("Impossible de crÃ©er le problÃ¨me pour le moment.")
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/problems">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nouveau problème</h1>
          <p className="text-muted-foreground mt-1">Déclarez un nouveau problème selon la méthode QQOQCCP</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>Décrivez le problème de manière concise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titre">Titre du problème *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Ex: Défaut de peinture sur pièces finies"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez le problème en détail..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Niveau *</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value as ProblemLevel })}
              >
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Usine">Usine</SelectItem>
                  <SelectItem value="Ligne">Ligne</SelectItem>
                  <SelectItem value="Atelier">Atelier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyse QQOQCCP</CardTitle>
            <CardDescription>Qui, Quoi, Où, Quand, Comment, Combien, Pourquoi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="qui">Qui ?</Label>
                <Input
                  id="qui"
                  value={formData.qui}
                  onChange={(e) => setFormData({ ...formData, qui: e.target.value })}
                  placeholder="Qui est concerné ?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quoi">Quoi ?</Label>
                <Input
                  id="quoi"
                  value={formData.quoi}
                  onChange={(e) => setFormData({ ...formData, quoi: e.target.value })}
                  placeholder="De quoi s'agit-il ?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ou">Où ?</Label>
                <Input
                  id="ou"
                  value={formData.ou}
                  onChange={(e) => setFormData({ ...formData, ou: e.target.value })}
                  placeholder="Où cela se produit-il ?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quand">Quand ?</Label>
                <Input
                  id="quand"
                  value={formData.quand}
                  onChange={(e) => setFormData({ ...formData, quand: e.target.value })}
                  placeholder="Quand cela arrive-t-il ?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comment ?</Label>
                <Input
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Comment cela se manifeste ?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="combien">Combien ?</Label>
                <Input
                  id="combien"
                  value={formData.combien}
                  onChange={(e) => setFormData({ ...formData, combien: e.target.value })}
                  placeholder="Combien d'occurrences ?"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pourquoi">Pourquoi ?</Label>
              <Textarea
                id="pourquoi"
                value={formData.pourquoi}
                onChange={(e) => setFormData({ ...formData, pourquoi: e.target.value })}
                placeholder="Pourquoi cela se produit-il ?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/dashboard/problems">
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
          <Button type="submit">Créer le problème</Button>
        </div>
      </form>
    </div>
  )
}
