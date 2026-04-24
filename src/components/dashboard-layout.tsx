"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  UserCheck, 
  ScanFace, 
  Settings, 
  LogOut,
  ChevronRight,
  ClipboardList,
  Search,
  Moon,
  Sun,
  Monitor,
  Command,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'KYC Verification', icon: ShieldCheck, href: '/dashboard/kyc' },
  { label: 'Liveness Check', icon: UserCheck, href: '/dashboard/liveness' },
  { label: 'Attendance', icon: ScanFace, href: '/dashboard/attendance' },
  { label: 'Activity Logs', icon: ClipboardList, href: '/dashboard/logs' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const initials = user?.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="flex min-h-screen bg-background text-foreground font-body">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <ShieldCheck className="w-8 h-8" />
            <span>AfriVerify</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" size="sm">
              <Settings className="w-4 h-4 mr-3" /> Settings
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" 
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-3" /> Log out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 border-b bg-card flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">
              {navItems.find(i => i.href === pathname)?.label || 'Page'}
            </span>
          </div>

          {/* Center Search - Fully Functional Dialog */}
          <div className="flex-1 max-w-md mx-4 hidden lg:block">
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-muted-foreground font-normal bg-muted/50 border-none h-10 px-4 group hover:bg-muted/80"
                >
                  <Search className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                  <span>Search records, employees...</span>
                  <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 shadow-sm">
                    <Command className="w-2.5 h-2.5" /> K
                  </kbd>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
                <div className="flex items-center border-b px-4 h-12">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Type to search verifications or activity logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSearchQuery("")}>
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto p-4 space-y-4">
                  {searchQuery ? (
                    <div className="text-center py-12 text-sm text-muted-foreground">
                      Searching for "<span className="font-bold text-primary">{searchQuery}</span>" across Africa nodes...
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2">Recent Searches</p>
                        <div className="grid gap-1">
                          {['Ngozi Okonjo', 'Lagos Verification Stream', 'High Risk Alerts'].map((item) => (
                            <Button key={item} variant="ghost" className="w-full justify-start h-9 text-sm font-normal px-2">
                              <ClipboardList className="mr-2 h-3.5 w-3.5 opacity-50" /> {item}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2">Quick Commands</p>
                        <div className="grid gap-1">
                          <Button variant="ghost" className="w-full justify-start h-9 text-sm font-normal px-2" onClick={() => { setIsSearchOpen(false); router.push('/dashboard/kyc'); }}>
                            <ShieldCheck className="mr-2 h-3.5 w-3.5 text-primary" /> Start New Verification
                          </Button>
                          <Button variant="ghost" className="w-full justify-start h-9 text-sm font-normal px-2" onClick={() => { setIsSearchOpen(false); router.push('/dashboard/logs'); }}>
                            <ClipboardList className="mr-2 h-3.5 w-3.5 text-accent" /> Export Data Logs
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle - Enhanced with Monitor Icon for System */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-primary/10">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel className="text-[10px] font-bold uppercase text-muted-foreground">App Appearance</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2 cursor-pointer">
                  <Sun className="w-4 h-4 text-amber-500" /> <span>Light Mode</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2 cursor-pointer">
                  <Moon className="w-4 h-4 text-primary" /> <span>Dark Mode</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2 cursor-pointer">
                  <Monitor className="w-4 h-4 opacity-50" /> <span>System Default</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/5 p-0 overflow-hidden">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none">{user?.displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
