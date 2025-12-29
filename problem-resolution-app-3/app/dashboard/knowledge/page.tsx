"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export default function KnowledgePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Base de connaissances</h1>
        <p className="text-muted-foreground mt-1">Historique et solutions des problèmes résolus</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problèmes résolus</CardTitle>
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
