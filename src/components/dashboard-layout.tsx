
"use client"

import React, { useState, useMemo, useEffect } from 'react';
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
  X,
  FileText,
  CreditCard,
  Code2,
  Zap,
  Activity
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
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SupportChatbot } from '@/components/support-chatbot';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'KYC Engine', icon: ShieldCheck, href: '/dashboard/kyc' },
  { label: 'Biometric AI', icon: Zap, href: '/dashboard/liveness' },
  { label: 'Attendance', icon: ScanFace, href: '/dashboard/attendance' },
  { label: 'Developer Hub', icon: Code2, href: '/dashboard/developer' },
  { label: 'Activity Logs', icon: ClipboardList, href: '/dashboard/logs' },
  { label: 'Pricing', icon: CreditCard, href: '/dashboard/pricing' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/');
  };

  const filteredNav = useMemo(() => {
    if (!searchQuery) return navItems;
    return navItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const initials = user?.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="flex min-h-screen bg-background text-foreground font-body">
      <aside className="w-64 border-r bg-card hidden md:flex flex-col shadow-sm">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2 font-black text-2xl text-primary tracking-tighter">
            <ShieldCheck className="w-9 h-9" />
            <span>AfriVerify</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  isActive ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start font-bold text-muted-foreground" size="sm">
              <Settings className="w-4 h-4 mr-3" /> Settings
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start font-bold text-destructive hover:bg-destructive/10" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-3" /> Log out
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-20 border-b bg-card flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary"><Activity className="w-5 h-5" /></div>
            <div className="hidden lg:block">
              <h2 className="font-black text-sm uppercase tracking-wider">{navItems.find(i => i.href === pathname)?.label || 'System Dashboard'}</h2>
              <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">AfriVerify Trust Platform</p>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-8 hidden lg:block">
            <Button variant="outline" className="w-full justify-start text-muted-foreground bg-muted/30 border-none h-11 px-5 rounded-xl group hover:bg-muted/50 transition-all" onClick={() => setIsSearchOpen(true)}>
              <Search className="w-4 h-4 mr-3 group-hover:text-primary transition-colors" />
              <span className="font-medium">Search system intelligence...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-lg border bg-background px-2 font-mono text-[10px] font-black text-muted-foreground opacity-100 shadow-sm">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </Button>
          </div>
          
          <div className="flex items-center gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border bg-muted/20">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-4 py-2">Appearance</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme("light")} className="gap-3 px-4 py-2 cursor-pointer font-bold">
                  <Sun className="w-4 h-4 text-amber-500" /> Light Mode
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-3 px-4 py-2 cursor-pointer font-bold">
                  <Moon className="w-4 h-4 text-primary" /> Dark Mode
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-12 w-12 rounded-2xl ring-4 ring-primary/5 p-0 overflow-hidden shadow-lg hover:scale-105 transition-all">
                  <Avatar className="h-12 w-12 border-2 border-white">
                    <AvatarImage src={user?.photoURL || ''} />
                    <AvatarFallback className="bg-primary text-white font-black">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-2xl p-2" align="end" forceMount>
                <DropdownMenuLabel className="p-4 bg-muted/30 rounded-xl mb-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black leading-none">{user?.displayName || 'Authorized User'}</p>
                    <p className="text-[10px] leading-none text-muted-foreground font-bold tracking-wider uppercase mt-1">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="rounded-xl h-11 px-4 cursor-pointer font-bold">
                  <Settings className="mr-3 h-4 w-4" /> System Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive h-11 px-4 cursor-pointer font-bold" onClick={handleLogout}>
                  <LogOut className="mr-3 h-4 w-4" /> Terminate Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>

      <SupportChatbot />

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>System Search</DialogTitle>
            <DialogDescription>Navigate the Trust Platform intelligence.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center border-b px-6 h-16 bg-muted/10">
            <Search className="mr-3 h-5 w-5 shrink-0 text-primary" />
            <input
              className="flex h-full w-full bg-transparent py-3 text-lg font-bold outline-none placeholder:text-muted-foreground"
              placeholder="Search sections, records, or API keys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={() => setSearchQuery("")}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="max-h-[450px] overflow-y-auto p-3 space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-4 py-2">Folders & Modules</p>
              {filteredNav.map((item) => (
                <Button key={item.href} variant="ghost" className="w-full justify-start h-12 text-sm font-bold px-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-all group" onClick={() => { setIsSearchOpen(false); router.push(item.href); }}>
                  <item.icon className="mr-4 h-5 w-5 text-muted-foreground group-hover:text-primary" /> {item.label}
                  <ChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
