import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Eye,
    Code,
    Maximize2,
    Copy,
    Download,
    Loader2
} from "lucide-react";
import useAppStore from "@/store/store";

interface PreviewComponentProps {
    loading?: boolean;
}

export function PreviewComponent({ loading = false }: PreviewComponentProps) {
    const [mode, setMode] = useState<"preview" | "source">("preview");
    const agreementHtml = useAppStore((state) => state.agreementHtml);
    const backgroundColor = useAppStore((state) => state.backgroundColor);
    const textColor = useAppStore((state) => state.textColor);

    const copyHtml = () => {
        if (agreementHtml && navigator.clipboard) {
            navigator.clipboard.writeText(agreementHtml)
                .then(() => {
                    // You could add a toast notification here
                    console.log("HTML copied to clipboard");
                })
                .catch(err => {
                    console.error("Failed to copy HTML: ", err);
                });
        }
    };

    const downloadHtml = () => {
        if (agreementHtml && typeof window !== 'undefined') {
            const blob = new Blob([agreementHtml], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "agreement.html";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <Card className="h-full rounded-none border-0 shadow-none">
            <CardHeader className="px-4 py-2 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium">Preview Output</CardTitle>
                <div className="flex items-center gap-1">
                    <div className="flex border rounded-md overflow-hidden mr-2">
                        <Button
                            variant={mode === "preview" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setMode("preview")}
                            className="rounded-none h-8 px-3"
                        >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                        </Button>
                        <Button
                            variant={mode === "source" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setMode("source")}
                            className="rounded-none h-8 px-3"
                        >
                            <Code className="h-4 w-4 mr-1" />
                            HTML
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={copyHtml}
                        title="Copy HTML"
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={downloadHtml}
                        title="Download HTML"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Fullscreen"
                        // Open in a dialog
                    >
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                            <p className="text-muted-foreground">Processing template...</p>
                        </div>
                    </div>
                ) : mode === "preview" ? (
                    <div
                        className="p-6 prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: agreementHtml || "" }}
                        style={{
                            color: textColor,
                            backgroundColor: backgroundColor,
                            height: "100%",
                            overflow: "auto"
                        }}
                    />
                ) : (
                    <pre className="p-6 text-sm font-mono bg-muted/30 overflow-auto h-full whitespace-pre-wrap">
                        {agreementHtml || ""}
                    </pre>
                )}
            </CardContent>
        </Card>
    );
}