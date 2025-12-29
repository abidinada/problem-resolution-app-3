"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Upload, Bell, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getNotificationsByUserId, markNotificationAsRead } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

export default function ResponsableFormPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [formData, setFormData] = useState({
    causesRacines: "",
    diagrammePareto: null as File | null,
    diagrammeIshikawa: null as File | null,
    actionsCorrectives: "",
  })

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return
      try {
        const allNotifications = await getNotificationsByUserId(user.user_id)
        setNotifications(allNotifications.filter((n) => n.message.includes("Manager")))
      } catch (error) {
        console.error("Erreur lors du chargement des notifications", error)
      }
    }

    loadNotifications()
  }, [user])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleFileChange = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Analyse validée avec succès!")
    setFormData({
      causesRacines: "",
      diagrammePareto: null,
      diagrammeIshikawa: null,
      actionsCorrectives: "",
    })
  }

  const handleMarkAsRead = async (notifId: number) => {
    try {
      await markNotificationAsRead(notifId)
      setNotifications((prev) => prev.map((n) => (n.notification_id === notifId ? { ...n, is_read: true } : n)))
    } catch (error) {
      console.error("Erreur lors de la mise Çÿ jour de la notification", error)
    }
  }

  if (!user || user.role !== "Responsable") {
    return <div>Accès réservé aux Responsables</div>
  }

  return (
    <div className="space-y-6">
      <div className="gradient-card rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hello Mr Responsable 👋</h1>
            <p className="text-white/90 mt-1">Analyse du problème & actions correctives</p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2">
            <Bell className="h-6 w-6" />
            <div className="text-right">
              <div className="text-2xl font-bold">{unreadCount}</div>
              <div className="text-sm opacity-90">Confirmations</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="formulaire" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="formulaire" className="text-base">
            <CheckCircle className="mr-2 h-5 w-5" />
            Formulaire
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-base">
            <Bell className="mr-2 h-5 w-5" />
            Notifications {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="formulaire" className="mt-6">
          <Card className="border-2 border-[#226d68]/40 shadow-lg">
            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="causesRacines" className="text-lg font-bold" style={{ color: "#18534f" }}>
                    Analyse des causes racines
                  </Label>
                  <Textarea
                    id="causesRacines"
                    placeholder="Décrivez ici les causes principales du problème..."
                    value={formData.causesRacines}
                    onChange={(e) => setFormData((prev) => ({ ...prev, causesRacines: e.target.value }))}
                    className="min-h-[140px] resize-none border-2 border-[#226d68]/40 focus:border-[#226d68] text-base"
                    style={{ backgroundColor: "#ECF8F6" }}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="pareto" className="text-lg font-bold" style={{ color: "#18534f" }}>
                    Diagramme de Pareto
                  </Label>
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center hover:border-[#226d68] transition-colors cursor-pointer"
                    style={{ borderColor: "#226d68", backgroundColor: "#ECF8F6" }}
                  >
                    <Input
                      id="pareto"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange("diagrammePareto", e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="pareto" className="cursor-pointer flex flex-col items-center gap-3">
                      <Upload className="h-12 w-12" style={{ color: "#226d68" }} />
                      <span className="text-base font-medium" style={{ color: "#18534f" }}>
                        {formData.diagrammePareto ? formData.diagrammePareto.name : "Choisir un fichier"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formData.diagrammePareto ? "" : "Aucun fichier choisi"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="ishikawa" className="text-lg font-bold" style={{ color: "#18534f" }}>
                    Diagramme d'Ishikawa
                  </Label>
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center hover:border-[#226d68] transition-colors cursor-pointer"
                    style={{ borderColor: "#226d68", backgroundColor: "#ECF8F6" }}
                  >
                    <Input
                      id="ishikawa"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange("diagrammeIshikawa", e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="ishikawa" className="cursor-pointer flex flex-col items-center gap-3">
                      <Upload className="h-12 w-12" style={{ color: "#226d68" }} />
                      <span className="text-base font-medium" style={{ color: "#18534f" }}>
                        {formData.diagrammeIshikawa ? formData.diagrammeIshikawa.name : "Choisir un fichier"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formData.diagrammeIshikawa ? "" : "Aucun fichier choisi"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="actionsCorrectives" className="text-lg font-bold" style={{ color: "#18534f" }}>
                    Actions correctives
                  </Label>
                  <Textarea
                    id="actionsCorrectives"
                    placeholder="Définissez les actions correctives à mettre en place..."
                    value={formData.actionsCorrectives}
                    onChange={(e) => setFormData((prev) => ({ ...prev, actionsCorrectives: e.target.value }))}
                    className="min-h-[140px] resize-none border-2 border-[#226d68]/40 focus:border-[#226d68] text-base"
                    style={{ backgroundColor: "#ECF8F6" }}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-7 text-lg font-bold"
                  style={{ background: "linear-gradient(135deg, #18534f 0%, #226d68 100%)" }}
                >
                  Valider l'analyse
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="border-2 border-[#2d8a83]/40">
            <CardContent className="pt-6">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 mx-auto text-muted-foreground opacity-30 mb-4" />
                  <p className="text-lg text-muted-foreground">Aucune notification pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <Card
                      key={notif.notification_id}
                      className={`${notif.is_read ? "opacity-60" : "border-2"}`}
                      style={{ borderColor: notif.is_read ? undefined : "#226d68" }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-base font-medium text-foreground">{notif.message}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(notif.date_created).toLocaleString("fr-FR")}
                            </p>
                          </div>
                          {!notif.is_read && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkAsRead(notif.notification_id)}
                              style={{ background: "linear-gradient(135deg, #18534f 0%, #226d68 100%)" }}
                            >
                              Marquer comme lu
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
