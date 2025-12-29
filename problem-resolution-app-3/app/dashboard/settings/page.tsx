"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export default function SettingsPage() {
  const { user } = useAuth()

  if (!user || user.role !== "Manager") {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Accès non autorisé</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground mt-1">Configuration système et gestion des utilisateurs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Fonctionnalité en cours de développement</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
