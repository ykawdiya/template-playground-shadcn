import { useEffect, useState } from "react";
import { Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer"; // Fixed casing
import { EditorLayout } from "@/components/editor-layout";
import { EditorTabs } from "@/components/editor-tabs";
import { PreviewComponent } from "@/components/preview-component";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share2, Loader2 } from "lucide-react";
import useAppStore from "@/store/store";
import LearnPage from "@/pages/LearnNow";
import FloatingHelp from "@/components/FloatingHelp";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  // Store state
  const init = useAppStore((state) => state.init);
  const loadFromLink = useAppStore((state) => state.loadFromLink);
  const loadSample = useAppStore((state) => state.loadSample);
  const samples = useAppStore((state) => state.samples);
  const sampleName = useAppStore((state) => state.sampleName);
  const generateShareableLink = useAppStore((state) => state.generateShareableLink);
  const error = useAppStore((state) => state.error);

  // Handle initialization
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        const compressedData = searchParams.get("data");

        if (compressedData) {
          await loadFromLink(compressedData);
          if (window.location.pathname !== "/") {
            navigate("/", { replace: true });
          }
        } else {
          await init();
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [init, loadFromLink, searchParams, navigate]);

  // Handle template selection
  const handleTemplateChange = async (value: string) => {
    try {
      setLoading(true);
      await loadSample(value);
    } catch (error) {
      console.error("Failed to load sample:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle share button click
  const handleShare = () => {
    try {
      const link = generateShareableLink();
      navigator.clipboard.writeText(link);
      // Add toast notification here
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  // Helper function for footer scroll
  const scrollToFooter = () => {
    document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
        <ThemeProvider>
          <div className="h-screen w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-lg font-medium">Loading Template Playground...</p>
            </div>
          </div>
        </ThemeProvider>
    );
  }

  return (
      <ThemeProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar scrollToFooter={scrollToFooter} />
          <main className="flex-1 container py-6">
            <Routes>
              <Route
                  path="/"
                  element={
                    <>
                      {/* Header controls */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Select value={sampleName} onValueChange={handleTemplateChange}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                            <SelectContent>
                              {samples.map((sample) => (
                                  <SelectItem key={sample.NAME} value={sample.NAME}>
                                    {sample.NAME}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={handleShare}
                              className="gap-1.5"
                          >
                            <Share2 className="h-4 w-4" />
                            Share
                          </Button>
                        </div>
                        {error && <ErrorDisplay />}
                      </div>

                      {/* Editor layout */}
                      <EditorLayout
                          leftPane={<EditorTabs />}
                          rightPane={<PreviewComponent loading={loading} />}
                      />
                    </>
                  }
              />
              <Route path="/learn/*" element={<LearnPage />} />
            </Routes>
          </main>
          <Footer />
          <FloatingHelp />
        </div>
      </ThemeProvider>
  );
}