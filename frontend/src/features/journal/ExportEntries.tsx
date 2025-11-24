import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/useToast";
import { JournalEntry } from "./JournalEntry";
import {
  Download,
  FileText,
  FileCode,
  Loader2,
  Calendar,
  Tag,
  Heart,
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

interface ExportEntriesProps {
  entries: JournalEntry[];
}

type ExportFormat = "text" | "markdown" | "json" | "csv";

export function ExportEntries({ entries }: ExportEntriesProps) {
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("markdown");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTags, setIncludeTags] = useState(true);
  const [includeMood, setIncludeMood] = useState(true);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const filteredEntries = onlyFavorites
    ? entries.filter((entry) => entry.isFavorite)
    : entries;

  const handleExport = async () => {
    if (filteredEntries.length === 0) {
      showToast({
        title: "No Entries",
        description: "There are no entries to export",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      let content = "";
      let filename = "";
      let mimeType = "";

      switch (exportFormat) {
        case "text":
          content = exportAsText();
          filename = `journal-export-${new Date().toISOString().split("T")[0]}.txt`;
          mimeType = "text/plain";
          break;

        case "markdown":
          content = exportAsMarkdown();
          filename = `journal-export-${new Date().toISOString().split("T")[0]}.md`;
          mimeType = "text/markdown";
          break;

        case "json":
          content = exportAsJSON();
          filename = `journal-export-${new Date().toISOString().split("T")[0]}.json`;
          mimeType = "application/json";
          break;

        case "csv":
          content = exportAsCSV();
          filename = `journal-export-${new Date().toISOString().split("T")[0]}.csv`;
          mimeType = "text/csv";
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
        description: `Exported ${filteredEntries.length} ${
          filteredEntries.length === 1 ? "entry" : "entries"
        } as ${exportFormat.toUpperCase()}`,
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
      showToast({
        title: "Export Failed",
        description: "Failed to export journal entries",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsText = (): string => {
    let content = "JOURNAL EXPORT\n";
    content += "=".repeat(50) + "\n\n";

    if (includeMetadata) {
      content += `Export Date: ${new Date().toLocaleString()}\n`;
      content += `Total Entries: ${filteredEntries.length}\n\n`;
      content += "=".repeat(50) + "\n\n";
    }

    filteredEntries.forEach((entry, index) => {
      content += `Entry ${index + 1}\n`;
      content += "-".repeat(50) + "\n\n";

      if (includeMetadata) {
        content += `Date: ${new Date(entry.createdAt).toLocaleString()}\n`;
        content += `Type: ${entry.type || "Free Writing"}\n`;
      }

      if (includeMood && entry.mood) {
        content += `Mood: ${entry.mood}\n`;
      }

      if (includeTags && entry.tags && entry.tags.length > 0) {
        content += `Tags: ${entry.tags.join(", ")}\n`;
      }

      if (entry.isFavorite) {
        content += `★ Favorite\n`;
      }

      if (includeMetadata || includeMood || includeTags || entry.isFavorite) {
        content += "\n";
      }

      content += `${entry.content}\n\n`;
      content += "=".repeat(50) + "\n\n";
    });

    return content;
  };

  const exportAsMarkdown = (): string => {
    let content = "# Journal Export\n\n";

    if (includeMetadata) {
      content += `**Export Date:** ${new Date().toLocaleString()}  \n`;
      content += `**Total Entries:** ${filteredEntries.length}\n\n`;
      content += "---\n\n";
    }

    filteredEntries.forEach((entry, index) => {
      content += `## Entry ${index + 1}\n\n`;

      if (includeMetadata) {
        content += `**Date:** ${new Date(entry.createdAt).toLocaleString()}  \n`;
        content += `**Type:** ${entry.type || "Free Writing"}  \n`;
      }

      if (includeMood && entry.mood) {
        content += `**Mood:** ${entry.mood}  \n`;
      }

      if (includeTags && entry.tags && entry.tags.length > 0) {
        content += `**Tags:** ${entry.tags.map((tag) => `\`${tag}\``).join(", ")}  \n`;
      }

      if (entry.isFavorite) {
        content += `⭐ **Favorite**  \n`;
      }

      content += "\n";
      content += `${entry.content}\n\n`;
      content += "---\n\n";
    });

    return content;
  };

  const exportAsJSON = (): string => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalEntries: filteredEntries.length,
      entries: filteredEntries.map((entry) => {
        const exportEntry: any = {
          id: entry.id,
          content: entry.content,
          createdAt: entry.createdAt,
        };

        if (includeMetadata) {
          exportEntry.type = entry.type || "Free Writing";
          exportEntry.wordCount = entry.wordCount;
        }

        if (includeMood && entry.mood) {
          exportEntry.mood = entry.mood;
        }

        if (includeTags && entry.tags) {
          exportEntry.tags = entry.tags;
        }

        if (entry.isFavorite) {
          exportEntry.isFavorite = true;
        }

        return exportEntry;
      }),
    };

    return JSON.stringify(exportData, null, 2);
  };

  const exportAsCSV = (): string => {
    const headers = ["Date", "Content"];

    if (includeMetadata) {
      headers.push("Type", "Word Count");
    }

    if (includeMood) {
      headers.push("Mood");
    }

    if (includeTags) {
      headers.push("Tags");
    }

    headers.push("Favorite");

    let csv = headers.join(",") + "\n";

    filteredEntries.forEach((entry) => {
      const row: string[] = [
        `"${new Date(entry.createdAt).toLocaleString()}"`,
        `"${entry.content.replace(/"/g, '""')}"`,
      ];

      if (includeMetadata) {
        row.push(`"${entry.type || "Free Writing"}"`);
        row.push(`${entry.wordCount || 0}`);
      }

      if (includeMood) {
        row.push(`"${entry.mood || ""}"`);
      }

      if (includeTags) {
        row.push(`"${entry.tags?.join("; ") || ""}"`);
      }

      row.push(entry.isFavorite ? "Yes" : "No");

      csv += row.join(",") + "\n";
    });

    return csv;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" aria-label="Export journal entries">
          <Download className="h-4 w-4 mr-2" />
          Export Entries
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Export Journal Entries</DialogTitle>
          <DialogDescription>
            Choose your export format and customize what to include
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
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CSV (.csv)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {exportFormat === "text" && "Simple plain text format, easy to read"}
              {exportFormat === "markdown" && "Formatted text with headers and emphasis"}
              {exportFormat === "json" && "Structured data format for backup and analysis"}
              {exportFormat === "csv" && "Spreadsheet-compatible format"}
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
                Metadata (dates, type, word count)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="tags"
                checked={includeTags}
                onCheckedChange={(checked) => setIncludeTags(checked as boolean)}
                aria-label="Include tags"
              />
              <label
                htmlFor="tags"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <Tag className="h-4 w-4" />
                Tags
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="mood"
                checked={includeMood}
                onCheckedChange={(checked) => setIncludeMood(checked as boolean)}
                aria-label="Include mood"
              />
              <label
                htmlFor="mood"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                😊 Mood
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="favorites"
                checked={onlyFavorites}
                onCheckedChange={(checked) => setOnlyFavorites(checked as boolean)}
                aria-label="Export only favorites"
              />
              <label
                htmlFor="favorites"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Only Favorites
              </label>
            </div>
          </div>

          {/* Stats */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Entries to export:</span>
                <Badge variant="secondary" className="text-base">
                  {filteredEntries.length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            className="w-full"
            disabled={isExporting || filteredEntries.length === 0}
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
                Export {filteredEntries.length} {filteredEntries.length === 1 ? "Entry" : "Entries"}
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
