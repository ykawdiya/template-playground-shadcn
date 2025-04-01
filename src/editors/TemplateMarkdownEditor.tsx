import React, { useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { configureMonacoEditor } from "@/lib/monaco-config";
import useAppStore from "@/store/store";
import { useTheme } from "@/hooks/use-theme";

export default function TemplateMarkdownEditor() {
    const editorRef = useRef<any>(null);
    const { theme } = useTheme();
    const editorTheme = theme === "dark" ? "templatemark-dark" : "templatemark-light";

    const editorValue = useAppStore((state) => state.editorValue);
    const setEditorValue = useAppStore((state) => state.setEditorValue);
    const setTemplateMarkdown = useAppStore((state) => state.setTemplateMarkdown);

    useEffect(() => {
        if (editorRef.current) {
            const monaco = editorRef.current.getModel().getLanguageId();

            if (monaco) {
                const { configureEditor, setEditorTheme } = configureMonacoEditor();
                configureEditor(editorRef.current, "templatemark", theme === "dark");
                setEditorTheme(theme === "dark");
            }
        }
    }, [theme, editorRef]);

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
        configureMonacoEditor().configureEditor(editor, "templatemark", theme === "dark");
    };

    const handleChange = (value: string | undefined) => {
        if (value !== undefined) {
            setEditorValue(value);
            setTemplateMarkdown(value);
        }
    };

    return (
        <div className="h-full">
            <Editor
                height="100%"
                language="templatemark"
                value={editorValue}
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