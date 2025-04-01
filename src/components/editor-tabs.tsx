import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Undo, Redo, FileCode, Database, FileJson } from "lucide-react";
import useAppStore from "@/store/store";
import TemplateMarkdownEditor from "@/editors/TemplateMarkdownEditor";
import TemplateModelEditor from "@/editors/TemplateModelEditor";
import AgreementDataEditor from "@/editors/AgreementDataEditor";

export function EditorTabs() {
    const [activeTab, setActiveTab] = React.useState("templateMark");

    // Get undo/redo functions from each editor's state
    const undoTemplate = useAppStore((state) => state.undoTemplate);
    const redoTemplate = useAppStore((state) => state.redoTemplate);
    const undoModel = useAppStore((state) => state.undoModel);
    const redoModel = useAppStore((state) => state.redoModel);
    const undoData = useAppStore((state) => state.undoData);
    const redoData = useAppStore((state) => state.redoData);

    const handleUndo = () => {
        if (activeTab === "templateMark") undoTemplate();
        else if (activeTab === "model") undoModel();
        else if (activeTab === "data") undoData();
    };

    const handleRedo = () => {
        if (activeTab === "templateMark") redoTemplate();
        else if (activeTab === "model") redoModel();
        else if (activeTab === "data") redoData();
    };

    return (
        <Card className="flex flex-col h-full border-0 shadow-none rounded-none">
            <CardHeader className="px-4 py-2 border-b">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="templateMark" className="flex items-center gap-1.5">
                            <FileCode className="h-4 w-4" />
                            TemplateMark
                        </TabsTrigger>
                        <TabsTrigger value="model" className="flex items-center gap-1.5">
                            <Database className="h-4 w-4" />
                            Concerto Model
                        </TabsTrigger>
                        <TabsTrigger value="data" className="flex items-center gap-1.5">
                            <FileJson className="h-4 w-4" />
                            Preview Data
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="h-full">
                    <div className="flex justify-end items-center px-4 py-2 border-b">
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleUndo}
                                title="Undo"
                                className="h-8 w-8"
                            >
                                <Undo className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleRedo}
                                title="Redo"
                                className="h-8 w-8"
                            >
                                <Redo className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="relative h-[calc(100%-3rem)]">
                        {activeTab === "templateMark" && <TemplateMarkdownEditor />}
                        {activeTab === "model" && <TemplateModelEditor />}
                        {activeTab === "data" && <AgreementDataEditor />}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}