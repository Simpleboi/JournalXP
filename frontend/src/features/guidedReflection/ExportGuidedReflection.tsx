import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/useToast";
import { GuidedPath, UserPathProgress, UserStepResponse } from "@shared/types/guidedReflection";
import {
  Download,
  FileText,
  FileCode,
  Loader2,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExportGuidedReflectionProps {
  path: GuidedPath;
  progress: UserPathProgress;
  responsesWithTitles: Array<UserStepResponse & { stepTitle: string; stepType: string }>;
}

type ExportFormat = "text" | "markdown" | "json";

export function ExportGuidedReflection({
  path,
  progress,
  responsesWithTitles
}: ExportGuidedReflectionProps) {
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("markdown");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const completedDate = progress?.completedAt
    ? new Date(progress.completedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const handleExport = async () => {
    if (responsesWithTitles.length === 0) {
      showToast({
        title: "No Responses",
        description: "There are no responses to export",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      let content = "";
      let filename = "";
      let mimeType = "";
      const safePathTitle = path.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      switch (exportFormat) {
        case "text":
          content = exportAsText();
          filename = `reflection-${safePathTitle}-${new Date().toISOString().split("T")[0]}.txt`;
          mimeType = "text/plain";
          break;

        case "markdown":
          content = exportAsMarkdown();
          filename = `reflection-${safePathTitle}-${new Date().toISOString().split("T")[0]}.md`;
          mimeType = "text/markdown";
          break;

        case "json":
          content = exportAsJSON();
          filename = `reflection-${safePathTitle}-${new Date().toISOString().split("T")[0]}.json`;
          mimeType = "application/json";
          break;

        default:
          throw new Error("Invalid export format");
      }

      // Create blob and download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast({
        title: "Export Successful",
        description: `Exported your reflection as ${exportFormat.toUpperCase()}`,
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
      showToast({
        title: "Export Failed",
        description: "Failed to export reflection",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsText = (): string => {
    let content = "GUIDED REFLECTION\n";
    content += "=".repeat(50) + "\n\n";

    content += `${path.title}\n`;
    content += "-".repeat(50) + "\n\n";

    if (includeMetadata) {
      content += `Category: ${path.category}\n`;
      if (completedDate) {
        content += `Completed: ${completedDate}\n`;
      }
      content += `Total Responses: ${responsesWithTitles.length}\n\n`;
      content += "=".repeat(50) + "\n\n";
    }

    responsesWithTitles.forEach((response, index) => {
      const label = response.stepType === 'summary' ? 'Final Thoughts' : `Prompt ${index + 1}`;
      content += `${label}: ${response.stepTitle}\n`;
      content += "-".repeat(50) + "\n\n";

      if (includeTimestamps && response.timestamp) {
        content += `Written: ${new Date(response.timestamp).toLocaleString()}\n\n`;
      }

      content += `${response.response}\n\n`;
      content += "=".repeat(50) + "\n\n";
    });

    return content;
  };

  const exportAsMarkdown = (): string => {
    let content = `# ${path.title}\n\n`;

    if (includeMetadata) {
      content += `**Category:** ${path.category}  \n`;
      if (completedDate) {
        content += `**Completed:** ${completedDate}  \n`;
      }
      content += `**Responses:** ${responsesWithTitles.length}\n\n`;
      content += "---\n\n";
    }

    if (path.tagline) {
      content += `*${path.tagline}*\n\n`;
    }

    responsesWithTitles.forEach((response, index) => {
      const label = response.stepType === 'summary' ? 'Final Thoughts' : `Prompt ${index + 1}`;
      content += `## ${label}: ${response.stepTitle}\n\n`;

      if (includeTimestamps && response.timestamp) {
        content += `*Written: ${new Date(response.timestamp).toLocaleString()}*\n\n`;
      }

      content += `${response.response}\n\n`;
      content += "---\n\n";
    });

    content += `\n*Exported from JournalXP Guided Reflections*\n`;

    return content;
  };

  const exportAsJSON = (): string => {
    const exportData: Record<string, unknown> = {
      exportDate: new Date().toISOString(),
      path: {
        id: path.id,
        title: path.title,
        category: path.category,
        tagline: path.tagline,
      },
      completedAt: progress.completedAt,
      responses: responsesWithTitles.map((response, index) => {
        const entry: Record<string, unknown> = {
          stepId: response.stepId,
          stepTitle: response.stepTitle,
          stepType: response.stepType,
          promptNumber: response.stepType === 'summary' ? null : index + 1,
          response: response.response,
        };

        if (includeTimestamps && response.timestamp) {
          entry.timestamp = response.timestamp;
        }

        return entry;
      }),
    };

    return JSON.stringify(exportData, null, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label="Export reflection responses"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Export Reflection</DialogTitle>
          <DialogDescription>
            Download your responses from "{path.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
              <SelectTrigger aria-label="Select export format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Plain Text (.txt)
                  </div>
                </SelectItem>
                <SelectItem value="markdown">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    Markdown (.md)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    JSON (.json)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {exportFormat === "text" && "Simple plain text format, easy to read"}
              {exportFormat === "markdown" && "Formatted text with headers, great for notes apps"}
              {exportFormat === "json" && "Structured data format for backup"}
            </p>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <Label>Include in Export</Label>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="metadata"
                checked={includeMetadata}
                onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)}
                aria-label="Include metadata"
              />
              <label
                htmlFor="metadata"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Metadata (category, completion date)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="timestamps"
                checked={includeTimestamps}
                onCheckedChange={(checked) => setIncludeTimestamps(checked as boolean)}
                aria-label="Include timestamps"
              />
              <label
                htmlFor="timestamps"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                🕐 Response timestamps
              </label>
            </div>
          </div>

          {/* Stats */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Responses to export:</span>
                <Badge variant="secondary" className="text-base">
                  {responsesWithTitles.length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            className="w-full"
            disabled={isExporting || responsesWithTitles.length === 0}
            aria-label="Start export"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Reflection
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your data will be downloaded to your device. No data is sent to any server.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
