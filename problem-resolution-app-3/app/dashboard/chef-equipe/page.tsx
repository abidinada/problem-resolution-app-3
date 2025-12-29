"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { createProblem, getNotificationsByUserId, markNotificationAsRead } from "@/lib/api"
import { Upload, FileVideo, X, Bell, ClipboardCheck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function ChefEquipePage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [formData, setFormData] = useState({
    dateSignalement: new Date().toISOString().split("T")[0],
    numeroPoste: "",
    idOperateur: "",
    descriptionProbleme: "",
    methodeDetection: "",
    quantiteImpactee: "",
    importanceProbleme: "",
  })

  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; type: string; preview: string }>>([])

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return
      try {
        const allNotifications = await getNotificationsByUserId(user.user_id)
        setNotifications(allNotifications)
      } catch (error) {
        console.error("Erreur lors du chargement des notifications", error)
      }
    }

    loadNotifications()
  }, [user])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type.startsWith("image/") ? "image" : "video",
            preview: reader.result as string,
          },
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const payload: Parameters<typeof createProblem>[0] = {
      titre: `Probl��me poste ${formData.numeroPoste}`,
      description: formData.descriptionProbleme,
      date_declaration: formData.dateSignalement,
      declared_by_id: user.user_id,
      status: "Ouvert",
      level: "Atelier",
      qui: `OpǸrateur ${formData.idOperateur}`,
      quoi: formData.descriptionProbleme,
      ou: `Poste ${formData.numeroPoste}`,
      quand: formData.dateSignalement,
      comment: formData.methodeDetection,
      combien: formData.quantiteImpactee,
      pourquoi: formData.importanceProbleme,
      photos: uploadedFiles.map((f) => f.preview),
    }

    try {
      await createProblem(payload)
      alert("Probl��me signalǸ avec succ��s!")
      setFormData({
        dateSignalement: new Date().toISOString().split("T")[0],
        numeroPoste: "",
        idOperateur: "",
        descriptionProbleme: "",
        methodeDetection: "",
        quantiteImpactee: "",
        importanceProbleme: "",
      })
      setUploadedFiles([])
    } catch (error) {
      console.error("Erreur lors de la crǸation du probl��me", error)
      alert("Impossible d'enregistrer le probl��me pour le moment.")
    }
  }

  const handleMarkAsRead = async (notifId: number) => {
    try {
      await markNotificationAsRead(notifId)
      setNotifications((prev) => prev.map((n) => (n.notification_id === notifId ? { ...n, is_read: true } : n)))
    } catch (error) {
      console.error("Erreur lors de la mise �� jour de la notification", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="gradient-card rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interface Chef d'Équipe</h1>
            <p className="text-white/90 mt-1">Signalement et réponse aux problèmes</p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2">
            <Bell className="h-6 w-6" />
            <div className="text-right">
              <div className="text-2xl font-bold">{unreadCount}</div>
              <div className="text-sm opacity-90">Nouveaux</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="formulaire" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="formulaire" className="text-base">
            <ClipboardCheck className="mr-2 h-5 w-5" />
            Formulaire
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-base">
            <Bell className="mr-2 h-5 w-5" />
            Notifications {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="formulaire" className="mt-6">
          <Card className="border-2 border-primary/30">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/20">
              <CardTitle className="text-xl text-primary">Formulaire de signalement et réponse aux problèmes</CardTitle>
              <CardDescription className="text-base">
                Déclarez les problèmes détectés au niveau poste de travail
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dateSignalement" className="text-base font-semibold">
                      Signalement de Problème - Date
                    </Label>
                    <Input
                      id="dateSignalement"
                      type="date"
                      value={formData.dateSignalement}
                      onChange={(e) => setFormData({ ...formData, dateSignalement: e.target.value })}
                      className="h-12 border-2 border-primary/30 bg-card"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numeroPoste" className="text-base font-semibold">
                      Numéro du poste de travail
                    </Label>
                    <Input
                      id="numeroPoste"
                      value={formData.numeroPoste}
                      onChange={(e) => setFormData({ ...formData, numeroPoste: e.target.value })}
                      placeholder="Ex: PT-001"
                      className="h-12 border-2 border-primary/30 bg-card"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idOperateur" className="text-base font-semibold">
                    ID de l'opérateur
                  </Label>
                  <Input
                    id="idOperateur"
                    value={formData.idOperateur}
                    onChange={(e) => setFormData({ ...formData, idOperateur: e.target.value })}
                    placeholder="Ex: OP-123"
                    className="h-12 border-2 border-primary/30 bg-card"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionProbleme" className="text-base font-semibold">
                    Description du problème
                  </Label>
                  <Textarea
                    id="descriptionProbleme"
                    value={formData.descriptionProbleme}
                    onChange={(e) => setFormData({ ...formData, descriptionProbleme: e.target.value })}
                    placeholder="Expliquer clairement l'anomalie observée..."
                    rows={5}
                    className="border-2 border-primary/30 bg-card"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="methodeDetection" className="text-base font-semibold">
                    Méthode de détection
                  </Label>
                  <Input
                    id="methodeDetection"
                    value={formData.methodeDetection}
                    onChange={(e) => setFormData({ ...formData, methodeDetection: e.target.value })}
                    placeholder="Contrôle visuel, mesure, alerte machine, opérateur..."
                    className="h-12 border-2 border-primary/30 bg-card"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="quantiteImpactee" className="text-base font-semibold">
                      Quantité impactée
                    </Label>
                    <Input
                      id="quantiteImpactee"
                      value={formData.quantiteImpactee}
                      onChange={(e) => setFormData({ ...formData, quantiteImpactee: e.target.value })}
                      placeholder="Nombre de pièces/unités"
                      className="h-12 border-2 border-primary/30 bg-card"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="importanceProbleme" className="text-base font-semibold">
                    Importance du problème
                  </Label>
                  <Textarea
                    id="importanceProbleme"
                    value={formData.importanceProbleme}
                    onChange={(e) => setFormData({ ...formData, importanceProbleme: e.target.value })}
                    placeholder="Pourquoi ce problème est critique : impact qualité, sécurité, production..."
                    rows={4}
                    className="border-2 border-primary/30 bg-card"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Pièces jointes (photos/vidéos)</Label>
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 hover:border-primary/50 transition-colors bg-card/50">
                    <input
                      type="file"
                      id="fileUpload"
                      className="hidden"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="fileUpload" className="flex flex-col items-center justify-center cursor-pointer">
                      <Upload className="h-12 w-12 text-primary mb-3" />
                      <p className="text-base font-medium text-foreground">Cliquez pour ajouter des fichiers</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Photos ou vidéos du problème (JPEG, PNG, MP4, etc.)
                      </p>
                    </label>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="border-2 border-primary/30 rounded-lg overflow-hidden bg-card">
                            {file.type === "image" ? (
                              <img
                                src={file.preview || "/placeholder.svg"}
                                alt={file.name}
                                className="w-full h-32 object-cover"
                              />
                            ) : (
                              <div className="w-full h-32 flex items-center justify-center">
                                <FileVideo className="h-12 w-12 text-primary" />
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-center pt-6">
                  <Button type="submit" size="lg" className="px-16 h-14 text-lg gradient-card hover:opacity-90">
                    Soumettre le problème
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="border-2 border-accent/30">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10 border-b border-accent/20">
              <CardTitle className="text-xl text-accent">Notifications des Opérateurs</CardTitle>
              <CardDescription className="text-base">Problèmes signalés nécessitant votre attention</CardDescription>
            </CardHeader>
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
                      className={`${notif.is_read ? "opacity-60" : "border-2 border-accent"}`}
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
                              className="gradient-card"
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

