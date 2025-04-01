import React from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface EditorLayoutProps {
    leftPane: React.ReactNode;
    rightPane: React.ReactNode;
    defaultLeftWidth?: number;
    minLeftWidth?: number;
    minRightWidth?: number;
}

export function EditorLayout({
                                 leftPane,
                                 rightPane,
                                 defaultLeftWidth = 65,
                                 minLeftWidth = 30,
                                 minRightWidth = 30,
                             }: EditorLayoutProps) {
    const [leftSize, setLeftSize] = useLocalStorage("editor-left-size", defaultLeftWidth);
    const [rightSize, setRightSize] = useLocalStorage("editor-right-size", 100 - defaultLeftWidth);

    const onLayout = (sizes: number[]) => {
        if (sizes.length >= 2) {
            setLeftSize(sizes[0]);
            setRightSize(sizes[1]);
        }
    };

    return (
        <ResizablePanelGroup
            direction="horizontal"
            onLayout={onLayout}
            className="h-[calc(100vh-10rem)] rounded-lg border"
        >
            <ResizablePanel
                defaultSize={leftSize}
                minSize={minLeftWidth}
                className="transition-all duration-200"
            >
                {leftPane}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
                defaultSize={rightSize}
                minSize={minRightWidth}
                className="transition-all duration-200"
            >
                {rightPane}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}