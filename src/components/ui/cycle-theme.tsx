import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { useState, useEffect } from "react";

export function CycleTheme() {
    const { theme, setTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "system">("system");

    useEffect(() => {
        setCurrentTheme(theme);
    }, [theme]);

    const handleCycleTheme = () => {
        // Cycle through themes: light -> dark -> system -> light
        if (currentTheme === "light") {
            setTheme("dark");
        } else if (currentTheme === "dark") {
            setTheme("system");
        } else {
            setTheme("light");
        }
    };

    return (
        <Button variant="ghost" size="icon" onClick={handleCycleTheme} title={`Current theme: ${currentTheme}`}>
            {currentTheme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
            {currentTheme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
            {currentTheme === "system" && <Laptop className="h-[1.2rem] w-[1.2rem]" />}
            <span className="sr-only">Cycle theme</span>
        </Button>
    );
}