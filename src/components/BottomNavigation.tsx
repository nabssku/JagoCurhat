"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, Bell, User } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

export default function BottomNavigation() {
  const pathname = usePathname();
  const { accent } = useTheme();

  // Hide navigation on auth/onboarding routes
  const hideRoutes = ["/login", "/register", "/onboarding"];
  if (hideRoutes.includes(pathname)) return null;

  const navigationItems = [
    { name: "Beranda", icon: Home, path: "/" },
    { name: "Jelajah", icon: Search, path: "/explore" },
    { name: "Curhat", icon: PlusCircle, path: "/create", isMainAction: true },
    { name: "Notif", icon: Bell, path: "/notifications" },
    { name: "Profil", icon: User, path: "/profile" },
  ];

  return (
    <div className="w-full border-t border-border bg-card/85 backdrop-blur-lg px-4 pb-safe-bottom pt-2 select-none z-40">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          if (item.isMainAction) {
            return (
              <Link key={item.path} href={item.path} className="relative -top-4 flex flex-col items-center tap-highlight-none">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/25 border-4 border-background text-accent-foreground btn-bounce"
                >
                  <Icon size={26} className="stroke-[2.5]" />
                </motion.div>
                <span className="text-[10px] font-semibold text-text-muted mt-1">
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center py-1 px-3 rounded-xl tap-highlight-none relative"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  color: isActive ? "var(--accent)" : "var(--text-muted)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center justify-center p-1"
              >
                <Icon size={22} className={isActive ? "stroke-[2.5]" : "stroke-[2]"} />
              </motion.div>

              <span
                className={`text-[10px] mt-0.5 transition-colors duration-200 ${
                  isActive ? "text-accent font-semibold" : "text-text-muted font-medium"
                }`}
              >
                {item.name}
              </span>

              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
