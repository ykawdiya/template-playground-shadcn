import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { debounce } from "ts-debounce";
import { ModelManager } from "@accordproject/concerto-core";
import { TemplateMarkInterpreter } from "@accordproject/template-engine";
import { TemplateMarkTransformer } from "@accordproject/markdown-template";
import { transform } from "@accordproject/markdown-transform";
import { SAMPLES, Sample } from "../samples";
import * as playground from "../samples/playground";
import { compress, decompress } from "../utils/compression/compression";

// Enhanced state with undo/redo history
interface AppState {
    templateMarkdown: string;
    editorValue: string;
    templateHistory: { past: string[], future: string[] };

    modelCto: string;
    editorModelCto: string;
    modelHistory: { past: string[], future: string[] };

    data: string;
    editorAgreementData: string;
    dataHistory: { past: string[], future: string[] };

    agreementHtml: string; // Keep as string, we'll ensure it's never undefined
    error?: string;
    samples: Array<Sample>;
    sampleName: string;
    backgroundColor: string;
    textColor: string;

    // Methods
    setTemplateMarkdown: (template: string) => Promise<void>;
    setEditorValue: (value: string) => void;
    undoTemplate: () => void;
    redoTemplate: () => void;

    setModelCto: (model: string) => Promise<void>;
    setEditorModelCto: (value: string) => void;
    undoModel: () => void;
    redoModel: () => void;

    setData: (data: string) => Promise<void>;
    setEditorAgreementData: (value: string) => void;
    undoData: () => void;
    redoData: () => void;

    rebuild: () => Promise<void>;
    init: () => Promise<void>;
    loadSample: (name: string) => Promise<void>;
    generateShareableLink: () => string;
    loadFromLink: (compressedData: string) => Promise<void>;
    toggleDarkMode: () => void;
}

export interface DecompressedData {
    templateMarkdown: string;
    modelCto: string;
    data: string;
    agreementHtml: string;
}

const rebuildDeBounce = debounce(rebuild, 500);

async function rebuild(template: string, model: string, dataString: string) {
    const modelManager = new ModelManager({ strict: true });
    modelManager.addCTOModel(model, undefined, true);
    await modelManager.updateExternalModels();
    const engine = new TemplateMarkInterpreter(modelManager, {});
    const templateMarkTransformer = new TemplateMarkTransformer();
    const templateMarkDom = templateMarkTransformer.fromMarkdownTemplate(
        { content: template },
        modelManager,
        "contract",
        { verbose: false }
    );
    const data = JSON.parse(dataString);
    const ciceroMark = await engine.generate(templateMarkDom, data);
    return await transform(
        ciceroMark.toJSON(),
        "ciceromark_parsed",
        ["html"],
        {},
        { verbose: false }
    );
}

const useAppStore = create<AppState>()(
    immer(
        devtools((set, get) => ({
            backgroundColor: '#ffffff',
            textColor: '#121212',
            sampleName: playground.NAME,
            templateMarkdown: playground.TEMPLATE,
            editorValue: playground.TEMPLATE,
            templateHistory: { past: [], future: [] },

            modelCto: playground.MODEL,
            editorModelCto: playground.MODEL,
            modelHistory: { past: [], future: [] },

            data: JSON.stringify(playground.DATA, null, 2),
            editorAgreementData: JSON.stringify(playground.DATA, null, 2),
            dataHistory: { past: [], future: [] },

            agreementHtml: "", // Initialize with empty string
            error: undefined,
            samples: SAMPLES,

            init: async () => {
                const params = new URLSearchParams(window.location.search);
                const compressedData = params.get("data");
                if (compressedData) {
                    await get().loadFromLink(compressedData);
                } else {
                    await get().rebuild();
                }
            },

            loadSample: async (name: string) => {
                const sample = SAMPLES.find((s) => s.NAME === name);
                if (sample) {
                    set((state) => {
                        state.sampleName = sample.NAME;
                        state.agreementHtml = ""; // Set to empty string instead of undefined
                        state.error = undefined;
                        state.templateMarkdown = sample.TEMPLATE;
                        state.editorValue = sample.TEMPLATE;
                        state.templateHistory = { past: [], future: [] };
                        state.modelCto = sample.MODEL;
                        state.editorModelCto = sample.MODEL;
                        state.modelHistory = { past: [], future: [] };
                        state.data = JSON.stringify(sample.DATA, null, 2);
                        state.editorAgreementData = JSON.stringify(sample.DATA, null, 2);
                        state.dataHistory = { past: [], future: [] };
                    });
                    await get().rebuild();
                }
            },

            rebuild: async () => {
                const { templateMarkdown, modelCto, data } = get();
                try {
                    const result = await rebuildDeBounce(templateMarkdown, modelCto, data);
                    set((state) => {
                        state.agreementHtml = result || ""; // Ensure it's never undefined
                        state.error = undefined;
                    });
                } catch (error: any) {
                    set((state) => { state.error = formatError(error) });
                }
            },

            // Template methods with undo/redo
            setTemplateMarkdown: async (template: string) => {
                set((state) => {
                    // Save current state to history
                    state.templateHistory.past.push(state.templateMarkdown);
                    state.templateHistory.future = [];

                    // Update state
                    state.templateMarkdown = template;
                });

                const { modelCto, data } = get();
                try {
                    const result = await rebuildDeBounce(template, modelCto, data);
                    set((state) => {
                        state.agreementHtml = result || ""; // Ensure it's never undefined
                        state.error = undefined;
                    });
                } catch (error: any) {
                    set((state) => { state.error = formatError(error) });
                }
            },

            setEditorValue: (value: string) => {
                set((state) => { state.editorValue = value });
            },

            undoTemplate: () => {
                const { templateHistory } = get();

                if (templateHistory.past.length === 0) return;

                const previous = templateHistory.past[templateHistory.past.length - 1];

                set((state) => {
                    // Move current state to future
                    state.templateHistory.future.unshift(state.templateMarkdown);

                    // Remove last item from past
                    state.templateHistory.past.pop();

                    // Set to previous state
                    state.templateMarkdown = previous;
                    state.editorValue = previous;
                });

                // Rebuild with new state
                get().rebuild();
            },

            redoTemplate: () => {
                const { templateHistory } = get();

                if (templateHistory.future.length === 0) return;

                const next = templateHistory.future[0];

                set((state) => {
                    // Move current state to past
                    state.templateHistory.past.push(state.templateMarkdown);

                    // Remove first item from future
                    state.templateHistory.future.shift();

                    // Set to next state
                    state.templateMarkdown = next;
                    state.editorValue = next;
                });

                // Rebuild with new state
                get().rebuild();
            },

            // Model methods with undo/redo
            setModelCto: async (model: string) => {
                set((state) => {
                    // Save current state to history
                    state.modelHistory.past.push(state.modelCto);
                    state.modelHistory.future = [];

                    // Update state
                    state.modelCto = model;
                });

                const { templateMarkdown, data } = get();
                try {
                    const result = await rebuildDeBounce(templateMarkdown, model, data);
                    set((state) => {
                        state.agreementHtml = result || ""; // Ensure it's never undefined
                        state.error = undefined;
                    });
                } catch (error: any) {
                    set((state) => { state.error = formatError(error) });
                }
            },

            setEditorModelCto: (value: string) => {
                set((state) => { state.editorModelCto = value });
            },

            undoModel: () => {
                const { modelHistory } = get();

                if (modelHistory.past.length === 0) return;

                const previous = modelHistory.past[modelHistory.past.length - 1];

                set((state) => {
                    // Move current state to future
                    state.modelHistory.future.unshift(state.modelCto);

                    // Remove last item from past
                    state.modelHistory.past.pop();

                    // Set to previous state
                    state.modelCto = previous;
                    state.editorModelCto = previous;
                });

                // Rebuild with new state
                get().rebuild();
            },

            redoModel: () => {
                const { modelHistory } = get();

                if (modelHistory.future.length === 0) return;

                const next = modelHistory.future[0];

                set((state) => {
                    // Move current state to past
                    state.modelHistory.past.push(state.modelCto);

                    // Remove first item from future
                    state.modelHistory.future.shift();

                    // Set to next state
                    state.modelCto = next;
                    state.editorModelCto = next;
                });

                // Rebuild with new state
                get().rebuild();
            },

            // Data methods with undo/redo
            setData: async (data: string) => {
                set((state) => {
                    // Save current state to history
                    state.dataHistory.past.push(state.data);
                    state.dataHistory.future = [];

                    // Update state
                    state.data = data;
                });

                try {
                    const result = await rebuildDeBounce(
                        get().templateMarkdown,
                        get().modelCto,
                        data
                    );
                    set((state) => {
                        state.agreementHtml = result || ""; // Ensure it's never undefined
                        state.error = undefined;
                    });
                } catch (error: any) {
                    set((state) => { state.error = formatError(error) });
                }
            },

            setEditorAgreementData: (value: string) => {
                set((state) => { state.editorAgreementData = value });
            },

            undoData: () => {
                const { dataHistory } = get();

                if (dataHistory.past.length === 0) return;

                const previous = dataHistory.past[dataHistory.past.length - 1];

                set((state) => {
                    // Move current state to future
                    state.dataHistory.future.unshift(state.data);

                    // Remove last item from past
                    state.dataHistory.past.pop();

                    // Set to previous state
                    state.data = previous;
                    state.editorAgreementData = previous;
                });

                // Rebuild with new state
                get().rebuild();
            },

            redoData: () => {
                const { dataHistory } = get();

                if (dataHistory.future.length === 0) return;

                const next = dataHistory.future[0];

                set((state) => {
                    // Move current state to past
                    state.dataHistory.past.push(state.data);

                    // Remove first item from future
                    state.dataHistory.future.shift();

                    // Set to next state
                    state.data = next;
                    state.editorAgreementData = next;
                });

                // Rebuild with new state
                get().rebuild();
            },

            // Other methods
            generateShareableLink: () => {
                const state = get();
                const compressedData = compress({
                    templateMarkdown: state.templateMarkdown,
                    modelCto: state.modelCto,
                    data: state.data,
                    agreementHtml: state.agreementHtml,
                });
                return `${window.location.origin}?data=${compressedData}`;
            },

            loadFromLink: async (compressedData: string) => {
                try {
                    const decompressedData = decompress(compressedData);
                    const { modelCto, data, agreementHtml } = decompressedData;
                    const templateMd = decompressedData.templateMarkdown; // Renamed to avoid the unused variable warning

                    if (!templateMd || !modelCto || !data) {
                        throw new Error("Invalid share link data");
                    }
                    set((state) => {
                        state.templateMarkdown = templateMd;
                        state.editorValue = templateMd;
                        state.templateHistory = { past: [], future: [] };

                        state.modelCto = modelCto;
                        state.editorModelCto = modelCto;
                        state.modelHistory = { past: [], future: [] };

                        state.data = data;
                        state.editorAgreementData = data;
                        state.dataHistory = { past: [], future: [] };

                        state.agreementHtml = agreementHtml || ""; // Ensure it's never undefined
                        state.error = undefined;
                    });
                    await get().rebuild();
                } catch (error) {
                    set((state) => {
                        state.error = "Failed to load shared content: " + (error instanceof Error ? error.message : "Unknown error");
                    });
                }
            },

            toggleDarkMode: () => {
                set((state) => {
                    const isDark = state.backgroundColor === '#121212';
                    state.backgroundColor = isDark ? '#ffffff' : '#121212';
                    state.textColor = isDark ? '#121212' : '#ffffff';
                });
            },
        }))
    )
);

export default useAppStore;

function formatError(error: any): string {
    console.error(error);
    if (typeof error === "string") return error;
    if (Array.isArray(error)) return error.map((e) => formatError(e)).join("\n");
    if (error.code) {
        const sub = error.errors ? formatError(error.errors) : "";
        const msg = error.renderedMessage || "";
        return `Error: ${error.code} ${sub} ${msg}`;
    }
    return error.toString();
}