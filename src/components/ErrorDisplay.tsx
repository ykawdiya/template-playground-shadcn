import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import useAppStore from "@/store/store";

export default function ErrorDisplay() {
    const error = useAppStore((state) => state.error);

    if (!error) return null;

    // Extract error location if available
    const matchLine = error.match(/Line (\d+)/i);
    const matchColumn = error.match(/column (\d+)/i);
    const line = matchLine ? parseInt(matchLine[1], 10) : undefined;
    const column = matchColumn ? parseInt(matchColumn[1], 10) : undefined;

    // Cleanup error message for display
    let cleanError = error
        .replace(/^c:/, '')
        .replace(/^Error:/, '')
        .trim();

    // Truncate if too long
    if (cleanError.length > 120) {
        cleanError = cleanError.substring(0, 117) + '...';
    }

    return (
        <Alert variant="destructive" className="w-full sm:w-auto max-w-2xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex flex-col">
                <span>{cleanError}</span>
                {(line || column) && (
                    <span className="text-xs mt-1">
                        {line && `Line ${line}`} {column && `Column ${column}`}
                    </span>
                )}
            </AlertDescription>
        </Alert>
    );
}