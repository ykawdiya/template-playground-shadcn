import React, { useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import useAppStore from "@/store/store";
import { useTheme } from "@/hooks/use-theme";

export default function TemplateModelEditor() {
    const editorRef = useRef<any>(null);
    const { theme } = useTheme();
    const editorTheme = theme === "dark" ? "concerto-dark" : "concerto-light";

    const editorModelCto = useAppStore((state) => state.editorModelCto);
    const setEditorModelCto = useAppStore((state) => state.setEditorModelCto);
    const setModelCto = useAppStore((state) => state.setModelCto);

    // Configure Monaco editor for Concerto syntax
    useEffect(() => {
        if (!editorRef.current) return;

        // This would ideally call a monaco configuration utility similar to the one used in TemplateMarkdownEditor
        // For now, we're going with a basic editor setup
    }, [theme, editorRef]);

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    };

    const handleChange = async (value: string | undefined) => {
        if (value !== undefined) {
            setEditorModelCto(value);
            await setModelCto(value);
        }
    };

    return (
        <div className="h-full">
            <Editor
                height="100%"
                language="typescript" // Use typescript as a fallback
                value={editorModelCto}
                onChange={handleChange}
                onMount={handleEditorDidMount}
                theme={editorTheme}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontFamily: "'Cascadia Code', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
                    fontLigatures: true,
                }}
            />
        </div>
    );
}