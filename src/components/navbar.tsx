import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Github,
    Menu,
    Search,
    ChevronDown,
    HelpCircle,
    PanelLeft,
    Sun,
    Moon
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { useTheme } from "@/hooks/use-theme";

interface NavbarProps {
    scrollToFooter: () => void;
}

export function Navbar({ scrollToFooter }: NavbarProps) {
    const location = useLocation();
    const { theme, setTheme } = useTheme();
    const isLearnPage = location.pathname.startsWith("/learn");

    return (
        <header className="sticky top-0 z-40 bg-background border-b">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src="/accord_logo.png"
                            alt="Accord Project"
                            className="h-6 w-auto dark:invert"
                        />
                        <span className="hidden font-semibold md:inline-block">
              Template Playground
            </span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={scrollToFooter}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Explore
                        </button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="gap-1.5">
                                    Help <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <a
                                        href="https://github.com/accordproject/template-playground/blob/main/README.md"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center"
                                    >
                                        <HelpCircle className="mr-2 h-4 w-4" />
                                        About
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a
                                        href="https://discord.com/invite/Zm99SKhhtA"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center"
                                    >
                                        <PanelLeft className="mr-2 h-4 w-4" />
                                        Community
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>

                    {!isLearnPage && (
                        <Button asChild className="hidden md:inline-flex" size="sm">
                            <Link to="/learn/intro">Learn</Link>
                        </Button>
                    )}


                    href="https://github.com/accordproject/template-playground"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    >
                    <Button variant="ghost" size="icon">
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </Button>
                </a>

                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                </Button>
            </div>
        </div>
</header>
);
}

export default Navbar;