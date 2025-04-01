import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export default function FloatingHelp() {
    const startTour = () => {
        // Logic to start tour would go here
        console.log("Starting tour...");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg"
                onClick={startTour}
            >
                <HelpCircle className="h-6 w-6" />
                <span className="sr-only">Help</span>
            </Button>
        </div>
    );
}