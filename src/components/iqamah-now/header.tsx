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

interface HeaderProps {
  isRamadan: boolean;
  onRamadanToggle: (isRamadan: boolean) => void;
}

export default function Header({ isRamadan, onRamadanToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      <h1 className="text-xl font-bold tracking-tight text-primary sm:text-2xl">IqamahNow</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch id="ramadan-mode" checked={isRamadan} onCheckedChange={onRamadanToggle} />
          <Label htmlFor="ramadan-mode" className="flex items-center gap-1 text-sm">
            {isRamadan ? <Moon className="h-4 w-4 text-accent" /> : <Sun className="h-4 w-4" />}
            <span>Ramadan Mode</span>
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
