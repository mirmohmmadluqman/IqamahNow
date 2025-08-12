'use client';

import { Moon, Sun, User, Github, Twitter, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import LiveClock from './live-clock';

interface HeaderProps {
  isRamadan: boolean;
  onRamadanToggle: (isRamadan: boolean) => void;
}

const Logo = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <path d="M4 22h16" />
      <path d="M12 4a5 5 0 0 1 5 5v5H7v-5a5 5 0 0 1 5-5z" />
      <path d="M8 18h8" />
      <path d="M12 14v4" />
      <path d="M18 9.5V9a6 6 0 0 0-12 0v.5" />
    </svg>
  );

export default function Header({ isRamadan, onRamadanToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
         <Logo />
        <h1 className="text-xl font-bold tracking-tight text-primary sm:text-2xl">IqamahNow</h1>
      </div>
      <LiveClock />
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch id="ramadan-mode" checked={isRamadan} onCheckedChange={onRamadanToggle} />
          <Label htmlFor="ramadan-mode" className="flex items-center gap-1 text-sm">
            {isRamadan ? <Moon className="h-4 w-4 text-accent" /> : <Sun className="h-4 w-4" />}
            <span className="hidden sm:inline">Ramadan Mode</span>
          </Label>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
              <User className="h-4 w-4" />
              <span className="sr-only">Developer Info</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <a href="https://mirmohmmadluqman.netlify.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer">
                <Globe className="h-4 w-4" />
                <span>Portfolio</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="https://github.com/mirmohmmadluqman" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="https://x.com/mirmohmadluqman" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer">
                <Twitter className="h-4 w-4" />
                <span>Twitter / X</span>
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
