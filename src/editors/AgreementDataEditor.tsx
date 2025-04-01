import React, { useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import useAppStore from "@/store/store";
import { useTheme } from "@/hooks/use-theme";

export default function AgreementDataEditor() {
    const editorRef = useRef<any>(null);
    const { theme } = useTheme();
    const editorTheme = theme === "dark" ? "json-dark" : "json-light";

    const editorAgreementData = useAppStore((state) => state.editorAgreementData);
    const setEditorAgreementData = useAppStore((state) => state.setEditorAgreementData);
    const setData = useAppStore((state) => state.setData);

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    };

    const handleChange = async (value: string | undefined) => {
        if (value !== undefined) {
            setEditorAgreementData(value);
            try {
                // Validate JSON by attempting to parse it
                JSON.parse(value);
                await setData(value);
            } catch (error) {
                // If JSON is invalid, don't update the application state
                // In a more complete implementation, you might want to show validation errors
                console.error("Invalid JSON:", error);
            }
        }
    };

    return (
        <div className="h-full">
            <Editor
                height="100%"
                language="json"
                value={editorAgreementData}
                onChange={handleChange}
                onMount={handleEditorDidMount}
                theme={editorTheme}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    formatOnPaste: true,
                    fontFamily: "'Cascadia Code', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
                    fontLigatures: true,
                }}
            />
        </div>
    );
}