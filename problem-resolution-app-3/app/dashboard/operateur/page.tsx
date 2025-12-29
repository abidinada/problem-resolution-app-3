"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { createNotification, getUsers } from "@/lib/api"
import type { User } from "@/lib/types"
import { AlertCircle, Send, CheckCircle } from "lucide-react"

export default function OperateurPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    numeroPoste: "",
    descriptionProbleme: "",
    urgence: "Moyen",
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await getUsers()
        setUsers(fetchedUsers)
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs", error)
      }
    }

    loadUsers()
  }, [])

  const handleNotify = async () => {
    if (!user) return
    if (!formData.numeroPoste || !formData.descriptionProbleme) {
      alert("Veuillez remplir tous les champs requis")
      return
    }

    const teamLeaders = users.filter((u) => u.role === "Chef d'Ǹquipe")

    try {
      await Promise.all(
        teamLeaders.map((tl) =>
          createNotification({
            user_id: tl.user_id,
            message: `Probl��me signalǸ au poste ${formData.numeroPoste} par ${user.nom} - Urgence: ${formData.urgence} - ${formData.descriptionProbleme.substring(0, 50)}...`,
            problem_id: null,
            step_id: null,
          }),
        ),
      )
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification", error)
      alert("Impossible d'envoyer la notification pour l'instant.")
      return
    }

    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)

    setFormData({
      numeroPoste: "",
      descriptionProbleme: "",
      urgence: "Moyen",
    })
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to bottom, #f0faf9 0%, #e0f2f1 100%)" }}>
      <div className="max-w-4xl mx-auto space-y-8 p-6">
        <div
          className="bg-teal-pattern rounded-2xl p-10 text-white text-center shadow-2xl"
          style={{ background: "linear-gradient(135deg, #5a9e9a 0%, #74b5af 100%)" }}
        >
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h1 className="text-5xl font-bold mb-3">Interface Opérateur</h1>
          <p className="text-2xl text-white/95">Signaler un problème à votre Team Leader</p>
        </div>

        {showSuccess && (
          <Card className="border-4 border-green-500 bg-green-50 animate-in fade-in slide-in-from-top-5 shadow-lg">
            <CardContent className="py-6">
              <div className="flex items-center gap-4 text-green-600">
                <CheckCircle className="h-8 w-8" />
                <p className="font-bold text-xl">Signalement envoyé avec succès au Team Leader!</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-4 shadow-2xl" style={{ borderColor: "#5a9e9a" }}>
          <CardContent className="pt-12 pb-12 px-10">
            <div className="space-y-10">
              <div className="space-y-4">
                <Label htmlFor="numeroPoste" className="text-xl font-bold text-[#1a4d4a]">
                  Numéro du poste de travail <span className="text-red-500 text-2xl">*</span>
                </Label>
                <Input
                  id="numeroPoste"
                  value={formData.numeroPoste}
                  onChange={(e) => setFormData({ ...formData, numeroPoste: e.target.value })}
                  placeholder="Ex: PT-001, Ligne A - Poste 3"
                  className="h-16 text-lg font-medium border-4 focus:border-[#4a9089] shadow-sm"
                  style={{ backgroundColor: "white", borderColor: "#b2d8d4" }}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="descriptionProbleme" className="text-xl font-bold text-[#1a4d4a]">
                  Description du problème <span className="text-red-500 text-2xl">*</span>
                </Label>
                <Textarea
                  id="descriptionProbleme"
                  value={formData.descriptionProbleme}
                  onChange={(e) => setFormData({ ...formData, descriptionProbleme: e.target.value })}
                  placeholder="Décrivez le problème observé : défaut qualité, panne machine, manque de pièces..."
                  rows={8}
                  className="resize-none text-lg font-medium border-4 focus:border-[#4a9089] shadow-sm"
                  style={{ backgroundColor: "white", borderColor: "#b2d8d4" }}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="urgence" className="text-xl font-bold text-[#1a4d4a]">
                  Niveau d'urgence <span className="text-red-500 text-2xl">*</span>
                </Label>
                <Select
                  value={formData.urgence}
                  onValueChange={(value) => setFormData({ ...formData, urgence: value })}
                >
                  <SelectTrigger
                    className="h-16 text-lg font-medium border-4 shadow-sm"
                    style={{ backgroundColor: "white", borderColor: "#b2d8d4" }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Faible" className="text-lg py-3">
                      Faible - Peut attendre
                    </SelectItem>
                    <SelectItem value="Moyen" className="text-lg py-3">
                      Moyen - À traiter bientôt
                    </SelectItem>
                    <SelectItem value="Élevé" className="text-lg py-3">
                      Élevé - Urgent
                    </SelectItem>
                    <SelectItem value="Critique" className="text-lg py-3">
                      Critique - Arrêt production
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-6">
                <Button
                  onClick={handleNotify}
                  size="lg"
                  className="w-full h-20 text-2xl font-bold hover:opacity-90 transition-all shadow-xl"
                  style={{ background: "linear-gradient(135deg, #4a9089 0%, #5a9e9a 100%)" }}
                >
                  <Send className="mr-4 h-8 w-8" />
                  Notifier le Team Leader
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 shadow-lg" style={{ borderColor: "#74b5af", backgroundColor: "#f0faf9" }}>
          <CardContent className="py-8">
            <div className="flex items-start gap-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#5a9e9a" }}
              >
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-3">
                <p className="font-bold text-2xl text-[#1a4d4a]">Information importante</p>
                <p className="text-lg text-[#4a7a75] leading-relaxed">
                  Une fois votre signalement envoyé, votre Team Leader sera immédiatement notifié et viendra inspecter
                  le poste pour remplir le formulaire détaillé et lancer la démarche 8D si nécessaire.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
