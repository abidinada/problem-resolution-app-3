"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/components/auth-provider"
import { createProblem, getNotificationsByUserId, markNotificationAsRead } from "@/lib/api"
import { Bell, ClipboardCheck, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function SuperviseurPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [formData, setFormData] = useState({
    nomSuperviseur: user?.nom || "",
    descriptionProbleme: "",
    actionsCorrectices: "",
    fichierPDF: "",
    processusContinue: "Oui",
    risquePersonnel: "Non",
    risqueEquipement: "Non",
    typeNonConformite: [] as string[],
    responsables: [] as string[],
  })

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return
      try {
        const allNotifications = await getNotificationsByUserId(user.user_id)
        setNotifications(allNotifications.filter((n) => n.message.includes("validation")))
      } catch (error) {
        console.error("Erreur lors du chargement des notifications", error)
      }
    }

    loadNotifications()
  }, [user])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const payload = {
      titre: `Probl«˘me superviseur - ${formData.nomSuperviseur}`,
      description: formData.descriptionProbleme,
      date_declaration: new Date().toISOString().split("T")[0],
      declared_by_id: user.user_id,
      status: "Ouvert",
      level: "Ligne",
      photos: [],
    }

    try {
      await createProblem(payload)
      alert("Probl«˘me soumis avec succ«˘s!")
      setFormData({
        ...formData,
        descriptionProbleme: "",
        actionsCorrectices: "",
        fichierPDF: "",
      })
    } catch (error) {
      console.error("Erreur lors de la cr«∏ation du probl«˘me", error)
      alert("Impossible d'enregistrer le probl«˘me pour le moment.")
    }
  }

  const handleMarkAsRead = async (notifId: number) => {
    try {
      await markNotificationAsRead(notifId)
      setNotifications((prev) => prev.map((n) => (n.notification_id === notifId ? { ...n, is_read: true } : n)))
    } catch (error) {
      console.error("Erreur lors de la mise «ˇ jour de la notification", error)
    }
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl p-8 text-white shadow-2xl"
        style={{ background: "linear-gradient(135deg, #5a9e9a 0%, #74b5af 100%)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Dashboard Superviseur</h1>
            <p className="text-xl text-white/95 mt-2">Gestion des probl√®mes au niveau ligne</p>
          </div>
          <div className="flex items-center gap-4 bg-white/20 rounded-xl px-6 py-4">
            <Bell className="h-8 w-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">{unreadCount}</div>
              <div className="text-base opacity-95">Nouveaux probl√®mes TL √† traiter</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="formulaire" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 p-1" style={{ backgroundColor: "#e0f2f1" }}>
          <TabsTrigger
            value="formulaire"
            className="text-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-[#1a4d4a]"
            style={{ color: "#4a7a75" }}
          >
            <ClipboardCheck className="mr-2 h-6 w-6" />
            Formulaire
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="text-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-[#1a4d4a]"
            style={{ color: "#4a7a75" }}
          >
            <Bell className="mr-2 h-6 w-6" />
            Notifications {unreadCount > 0 && <Badge className="ml-2 bg-[#5a9e9a]">{unreadCount}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="formulaire" className="mt-6">
          <Card className="border-4 shadow-2xl" style={{ borderColor: "#5a9e9a" }}>
            <CardHeader
              className="border-b-4"
              style={{ background: "linear-gradient(to right, white, #f0faf9)", borderColor: "#b2d8d4" }}
            >
              <CardTitle className="text-3xl font-bold text-[#1a4d4a]">Formulaire Superviseur</CardTitle>
              <CardDescription className="text-lg text-[#4a7a75]">
                D√©claration et gestion des probl√®mes de ligne
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-10 pb-10 px-8" style={{ backgroundColor: "#fafffe" }}>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="nomSuperviseur" className="text-lg font-bold text-[#1a4d4a]">
                    Nom du superviseur :
                  </Label>
                  <Input
                    id="nomSuperviseur"
                    value={formData.nomSuperviseur}
                    onChange={(e) => setFormData({ ...formData, nomSuperviseur: e.target.value })}
                    placeholder="Nom complet"
                    className="h-14 border-3 text-lg font-medium shadow-sm focus:border-[#4a9089]"
                    style={{ backgroundColor: "white", borderColor: "#b2d8d4", borderWidth: "3px" }}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="descriptionProbleme" className="text-lg font-bold text-[#1a4d4a]">
                    Description du probl√®me :
                  </Label>
                  <Textarea
                    id="descriptionProbleme"
                    value={formData.descriptionProbleme}
                    onChange={(e) => setFormData({ ...formData, descriptionProbleme: e.target.value })}
                    placeholder="D√©cris ici le probl√®me rencontr√©..."
                    rows={6}
                    className="border-3 text-lg font-medium shadow-sm focus:border-[#4a9089]"
                    style={{ backgroundColor: "white", borderColor: "#b2d8d4", borderWidth: "3px" }}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="actionsCorrectices" className="text-lg font-bold text-[#1a4d4a]">
                    Actions correctives :
                  </Label>
                  <Textarea
                    id="actionsCorrectices"
                    value={formData.actionsCorrectices}
                    onChange={(e) => setFormData({ ...formData, actionsCorrectices: e.target.value })}
                    placeholder="Indiquez les actions correctives pr√©vues..."
                    rows={5}
                    className="border-3 text-lg font-medium shadow-sm focus:border-[#4a9089]"
                    style={{ backgroundColor: "white", borderColor: "#b2d8d4", borderWidth: "3px" }}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="fichierPDF" className="text-lg font-bold text-[#1a4d4a]">
                    Joindre un fichier PDF :
                  </Label>
                  <Input
                    id="fichierPDF"
                    type="text"
                    value={formData.fichierPDF}
                    onChange={(e) => setFormData({ ...formData, fichierPDF: e.target.value })}
                    placeholder="Choisir fichier / Aucun fichier choisi"
                    className="h-14 border-3 text-lg font-medium shadow-sm"
                    style={{ backgroundColor: "white", borderColor: "#b2d8d4", borderWidth: "3px" }}
                  />
                </div>

                <div
                  className="space-y-5 rounded-xl border-3 p-6"
                  style={{ backgroundColor: "white", borderColor: "#b2d8d4", borderWidth: "3px" }}
                >
                  <Label className="text-lg font-bold text-[#1a4d4a]">Le processus peut-il continuer ?</Label>
                  <RadioGroup
                    value={formData.processusContinue}
                    onValueChange={(value) => setFormData({ ...formData, processusContinue: value })}
                    className="flex gap-10"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="Oui" id="processus-oui" className="w-5 h-5" />
                      <Label htmlFor="processus-oui" className="font-semibold cursor-pointer text-lg text-[#1a4d4a]">
                        Oui
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="Non" id="processus-non" className="w-5 h-5" />
                      <Label htmlFor="processus-non" className="font-semibold cursor-pointer text-lg text-[#1a4d4a]">
                        Non
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div
                  className="space-y-5 rounded-xl border-3 p-6"
                  style={{ backgroundColor: "white", borderColor: "#b2d8d4", borderWidth: "3px" }}
                >
                  <Label className="text-lg font-bold text-[#1a4d4a]">Risque pour le personnel :</Label>
                  <RadioGroup
                    value={formData.risquePersonnel}
                    onValueChange={(value) => setFormData({ ...formData, risquePersonnel: value })}
                    className="flex gap-10"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="Oui" id="risque-personnel-oui" className="w-5 h-5" />
                      <Label
                        htmlFor="risque-personnel-oui"
                        className="font-semibold cursor-pointer text-lg text-[#1a4d4a]"
                      >
                        Oui
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="Non" id="risque-personnel-non" className="w-5 h-5" />
                      <Label
                        htmlFor="risque-personnel-non"
                        className="font-semibold cursor-pointer text-lg text-[#1a4d4a]"
                      >
                        Non
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div
                  className="space-y-5 rounded-xl border-3 p-6"
                  style={{ backgroundColor: "white", borderColor: "#b2d8d4", borderWidth: "3px" }}
                >
                  <Label className="text-lg font-bold text-[#1a4d4a]">Risque pour les √©quipements :</Label>
                  <RadioGroup
                    value={formData.risqueEquipement}
                    onValueChange={(value) => setFormData({ ...formData, risqueEquipement: value })}
                    className="flex gap-10"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="Oui" id="risque-equipement-oui" className="w-5 h-5" />
                      <Label
                        htmlFor="risque-equipement-oui"
                        className="font-semibold cursor-pointer text-lg text-[#1a4d4a]"
                      >
                        Oui
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="Non" id="risque-equipement-non" className="w-5 h-5" />
                      <Label
                        htmlFor="risque-equipement-non"
                        className="font-semibold cursor-pointer text-lg text-[#1a4d4a]"
                      >
                        Non
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div
                  className="space-y-5 rounded-xl border-3 p-6"
                  style={{ backgroundColor: "white", borderColor: "#b2d8d4", borderWidth: "3px" }}
                >
                  <Label className="text-lg font-bold text-[#1a4d4a]">Type de non-conformit√© :</Label>
                  <div className="grid grid-cols-2 gap-5">
                    {["Produit", "Processus", "Documentation", "Mati√®re premi√®re"].map((type) => (
                      <div key={type} className="flex items-center space-x-3">
                        <Checkbox
                          id={`type-${type}`}
                          checked={formData.typeNonConformite.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                typeNonConformite: [...formData.typeNonConformite, type],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                typeNonConformite: formData.typeNonConformite.filter((t) => t !== type),
                              })
                            }
                          }}
                          className="w-5 h-5"
                        />
                        <Label htmlFor={`type-${type}`} className="font-semibold cursor-pointer text-lg text-[#1a4d4a]">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="space-y-5 rounded-xl border-3 p-6"
                  style={{ backgroundColor: "white", borderColor: "#b2d8d4", borderWidth: "3px" }}
                >
                  <Label className="text-lg font-bold text-[#1a4d4a]">Responsables concern√©s :</Label>
                  <div className="grid grid-cols-2 gap-5">
                    {["Respo Qualit√©", "Respo Lean", "Respo HSE", "Respo Maintenance", "Respo Logistique"].map(
                      (resp) => (
                        <div key={resp} className="flex items-center space-x-3">
                          <Checkbox
                            id={`resp-${resp}`}
                            checked={formData.responsables.includes(resp)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({
                                  ...formData,
                                  responsables: [...formData.responsables, resp],
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  responsables: formData.responsables.filter((r) => r !== resp),
                                })
                              }
                            }}
                            className="w-5 h-5"
                          />
                          <Label
                            htmlFor={`resp-${resp}`}
                            className="font-semibold cursor-pointer text-lg text-[#1a4d4a]"
                          >
                            {resp}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="px-20 h-16 text-xl font-bold shadow-xl hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #4a9089 0%, #5a9e9a 100%)" }}
                  >
                    Soumettre
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="border-2 border-[#2d8a83]/40">
            <CardHeader
              className="border-b border-[#2d8a83]/30"
              style={{ background: "linear-gradient(to right, #ECF8F6, rgba(45, 138, 131, 0.1))" }}
            >
              <CardTitle className="text-xl flex items-center gap-2" style={{ color: "#18534f" }}>
                <AlertCircle className="h-6 w-6" style={{ color: "#226d68" }} />
                Notifications de validation
              </CardTitle>
              <CardDescription className="text-base">
                Demandes de validation des actions imm√©diates par le Responsable
              </CardDescription>
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
