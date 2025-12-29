"use client"

import { Bell, LogOut, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { getNotificationsByUserId } from "@/lib/storage"
import { useState, useEffect } from "react"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      const notifications = getNotificationsByUserId(user.user_id)
      const unread = notifications.filter((n) => !n.is_read).length
      setUnreadCount(unread)
    }
  }, [user])

  if (!user) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border gradient-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl font-bold text-white">8D</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">8D Problem Solver</h1>
              <p className="text-xs text-white/70">Résolution de problèmes industriels</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive border-0">
                {unreadCount}
              </Badge>
            )}
          </Button>

          <div className="flex items-center gap-3 border-l border-white/20 pl-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user.nom}</p>
              <p className="text-xs text-white/70">{user.role}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-white" />
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={logout} className="text-white hover:bg-white/10">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}