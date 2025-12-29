"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export default function ReportsPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Rapports</h1>
        <p className="text-muted-foreground mt-1">Rapports et documentation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rapports 8D</CardTitle>
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
