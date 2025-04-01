import * as monaco from 'monaco-editor';

export function configureMonacoEditor() {
    // Configuration for TemplateMark language
    function configureEditor(editor: any, language: string, isDarkTheme: boolean) {
        if (!editor) return;

        // Define TemplateMark language if it doesn't exist yet
        if (language === 'templatemark' && !monaco.languages.getLanguages().some(lang => lang.id === 'templatemark')) {
            monaco.languages.register({ id: 'templatemark' });

            monaco.languages.setMonarchTokensProvider('templatemark', {
                tokenizer: {
                    root: [
                        // Variable expressions like {{variable}}
                        [/\{\{([^}]*)\}\}/, 'variable'],
                        // Code blocks like {{% code %}}
                        [/\{\{%([^%]*?)%\}\}/, 'code-block'],
                        // Markdown headings
                        [/^(#{1,6})\s+.*$/, 'heading'],
                        // Emphasis
                        [/\*\*([^*]*)\*\*/, 'strong'],
                        [/\*([^*]*)\*/, 'emphasis'],
                        // Lists
                        [/^[\s]*[-+*][\s]+.*$/, 'list'],
                        [/^[\s]*\d+\.[\s]+.*$/, 'list-numbered'],
                        // Links
                        [/\[([^\]]*)\]\(([^)]*)\)/, 'link'],
                        // Block quotes
                        [/^>[\s].*$/, 'quote'],
                        // Code blocks
                        [/```[\s\S]*?```/, 'code'],
                        [/`[^`]*`/, 'code']
                    ]
                }
            });
        }

        // Define themes for the editor
        setEditorTheme(isDarkTheme);
    }

    // Set editor theme based on light/dark mode
    function setEditorTheme(isDarkTheme: boolean) {
        // Light theme
        monaco.editor.defineTheme('templatemark-light', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'variable', foreground: '0000FF', fontStyle: 'bold' },
                { token: 'code-block', foreground: '008800', fontStyle: 'bold' },
                { token: 'heading', foreground: '000080', fontStyle: 'bold' },
                { token: 'strong', foreground: '000000', fontStyle: 'bold' },
                { token: 'emphasis', foreground: '000000', fontStyle: 'italic' },
                { token: 'list', foreground: '000000' },
                { token: 'list-numbered', foreground: '000000' },
                { token: 'link', foreground: '0000FF', fontStyle: 'underline' },
                { token: 'quote', foreground: '7A7A7A' },
                { token: 'code', foreground: '008800' }
            ],
            colors: {}
        });

        // Dark theme
        monaco.editor.defineTheme('templatemark-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'variable', foreground: '6A9AFF', fontStyle: 'bold' },
                { token: 'code-block', foreground: '6FCF6F', fontStyle: 'bold' },
                { token: 'heading', foreground: 'C792EA', fontStyle: 'bold' },
                { token: 'strong', foreground: 'FFFFFF', fontStyle: 'bold' },
                { token: 'emphasis', foreground: 'FFFFFF', fontStyle: 'italic' },
                { token: 'list', foreground: 'FFFFFF' },
                { token: 'list-numbered', foreground: 'FFFFFF' },
                { token: 'link', foreground: '6A9AFF', fontStyle: 'underline' },
                { token: 'quote', foreground: 'ABABAB' },
                { token: 'code', foreground: '6FCF6F' }
            ],
            colors: {}
        });

        // Also define themes for JSON and Concerto
        monaco.editor.defineTheme('json-light', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {}
        });

        monaco.editor.defineTheme('json-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {}
        });

        monaco.editor.defineTheme('concerto-light', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {}
        });

        monaco.editor.defineTheme('concerto-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {}
        });

        // Actually use the isDarkTheme parameter to set the current theme
        const currentTheme = isDarkTheme ? 'templatemark-dark' : 'templatemark-light';
        monaco.editor.setTheme(currentTheme);
    }

    return { configureEditor, setEditorTheme };
}