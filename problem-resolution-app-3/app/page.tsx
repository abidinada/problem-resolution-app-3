"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { user, login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = login(email, password)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Email ou mot de passe incorrect")
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #74b5af 0%, #5a9e9a 50%, #226d68 100%)" }}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div
            className="mx-auto h-20 w-20 rounded-2xl flex items-center justify-center mb-4 shadow-2xl"
            style={{ background: "white" }}
          >
            <span className="text-3xl font-bold" style={{ color: "#226d68" }}>
              8D
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">8D Problem Solver</h1>
          <p className="text-white/90 text-lg">Résolution de problèmes industriels</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader
            className="space-y-1 pb-4"
            style={{ background: "linear-gradient(135deg, #ECF8F6 0%, #ffffff 100%)" }}
          >
            <CardTitle className="text-2xl text-center" style={{ color: "#18534f" }}>
              Connexion
            </CardTitle>
            <CardDescription className="text-center text-base">Connectez-vous à votre compte</CardDescription>
          </CardHeader>
          <CardContent className="pt-6" style={{ backgroundColor: "#ffffff" }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold" style={{ color: "#18534f" }}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@usine.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-2 text-base"
                  style={{ borderColor: "#74b5af", backgroundColor: "#ECF8F6" }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold" style={{ color: "#18534f" }}>
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-2 text-base"
                  style={{ borderColor: "#74b5af", backgroundColor: "#ECF8F6" }}
                  required
                />
              </div>

              {error && (
                <div
                  className="flex items-center gap-2 rounded-lg p-4 text-sm border-2"
                  style={{ backgroundColor: "#fef2f2", borderColor: "#ef4444", color: "#dc2626" }}
                >
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all"
                style={{ background: "linear-gradient(135deg, #18534f 0%, #226d68 100%)" }}
              >
                Se connecter
              </Button>
            </form>

            <div
              className="mt-6 rounded-xl p-5 border-2"
              style={{ backgroundColor: "#ECF8F6", borderColor: "#74b5af" }}
            >
              <p className="text-sm font-bold mb-3" style={{ color: "#18534f" }}>
                Comptes de démonstration :
              </p>
              <ul className="space-y-1.5 text-sm" style={{ color: "#226d68" }}>
                <li>
                  <span className="font-semibold">Manager:</span> ahmed.benali@usine.com
                </li>
                <li>
                  <span className="font-semibold">Responsable:</span> fatima.zahra@usine.com
                </li>
                <li>
                  <span className="font-semibold">Superviseur:</span> mohamed.alami@usine.com
                </li>
                <li>
                  <span className="font-semibold">Chef d'équipe:</span> rachid.idrissi@usine.com
                </li>
                <li>
                  <span className="font-semibold">Opérateur:</span> karim.tazi@usine.com
                </li>
                <li className="pt-2 font-bold" style={{ color: "#18534f" }}>
                  Mot de passe: password123
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
