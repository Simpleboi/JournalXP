/**
 * Templated Journal Component
 * Journal with template support for structured entries
 */

import { useState, useEffect } from 'react';
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { JournalProps, JournalEntry } from './JournalEntry';
import { moodOptions } from '@/utils/ReflectionUtils';
import { useToast } from '@/hooks/useToast';
import { useUserData } from '@/context/UserDataContext';
import type { UserClient } from '@shared/types/user';
import { saveJournalEntry, getJournalEntries } from '@/services/JournalService';
import { TemplateSelector } from './TemplateSelector';
import { StructuredTemplateRenderer } from './StructuredTemplateRenderer';
import { trackTemplateUsage } from '@/services/templateService';
import type { JournalTemplate, StructuredEntryData } from '@shared/types/templates';

interface SubmitJournalOptions {
  user: any;
  userData: UserClient;
  templateId: string;
  structuredData: StructuredEntryData;
  mood: string;
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  setStructuredData: (data: StructuredEntryData) => void;
  refreshUserData: () => Promise<void>;
  showToast: (config: { title: string; description?: string }) => void;
  onSubmit: (entry: { templateId: string; structuredData: any; mood: string }) => void;
}

export const TemplatedJournal = ({ onSubmit = () => {}, setEntries }: JournalProps) => {
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<JournalTemplate | null>(null);
  const [structuredData, setStructuredData] = useState<StructuredEntryData>({
    templateId: '',
    fields: {},
  });
  const [mood, setMood] = useState('neutral');
  const { showToast } = useToast();
  const { userData, refreshUserData } = useUserData();

  // Fetch Entries from API on mount
  useEffect(() => {
    if (!user) return;

    const fetchEntries = async () => {
      try {
        const fetchedEntries = await getJournalEntries();
        setEntries(fetchedEntries);
        console.log('Successfully imported Entries');
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      }
    };

    fetchEntries();
  }, [user]);

  // Update structured data when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setStructuredData({
        templateId: selectedTemplate.id,
        fields: {},
      });
    }
  }, [selectedTemplate]);

  const handleTemplateSelect = (template: JournalTemplate) => {
    setSelectedTemplate(template);
  };

  const handleNewPrompt = () => {
    if (selectedTemplate?.prompts && selectedTemplate.prompts.length > 1) {
      // Force re-render with new random prompt
      const newTemplate = { ...selectedTemplate };
      setSelectedTemplate(null);
      setTimeout(() => setSelectedTemplate(newTemplate), 0);
    }
  };

  const convertStructuredDataToContent = (data: StructuredEntryData, template: JournalTemplate): string => {
    if (!template.fields || template.fields.length === 0) {
      // For simple templates, just return the content field
      return data.fields.content || '';
    }

    // For structured templates, create a formatted text representation
    let content = `# ${template.name}\n\n`;

    const sortedFields = [...template.fields].sort((a, b) => a.order - b.order);

    for (const field of sortedFields) {
      const value = data.fields[field.id];
      if (value !== undefined && value !== null && value !== '') {
        content += `**${field.label}:**\n`;

        if (Array.isArray(value)) {
          // Bullet list
          value.forEach((item) => {
            if (item.trim()) {
              content += `- ${item}\n`;
            }
          });
        } else if (typeof value === 'object') {
          content += `${JSON.stringify(value)}\n`;
        } else {
          content += `${value}\n`;
        }

        content += '\n';
      }
    }

    return content;
  };

  const handleSubmitJournalEntry = async ({
    user,
    userData,
    templateId,
    structuredData,
    mood,
    setEntries,
    setStructuredData,
    refreshUserData,
    showToast,
    onSubmit,
  }: SubmitJournalOptions) => {
    if (!user || !selectedTemplate) return;

    // Validate required fields
    if (selectedTemplate.fields) {
      const requiredFields = selectedTemplate.fields.filter((f) => f.required);
      const missingFields = requiredFields.filter(
        (f) => !structuredData.fields[f.id] || structuredData.fields[f.id] === ''
      );

      if (missingFields.length > 0) {
        showToast({
          title: 'Missing Required Fields',
          description: `Please fill in: ${missingFields.map((f) => f.label).join(', ')}`,
        });
        return;
      }
    } else {
      // For simple templates, check content field
      if (!structuredData.fields.content || !structuredData.fields.content.trim()) {
        showToast({
          title: 'Empty Entry',
          description: 'Please write something before saving.',
        });
        return;
      }
    }

    try {
      // Convert structured data to content string for storage
      const content = convertStructuredDataToContent(structuredData, selectedTemplate);

      // Save journal entry via API
      const response: any = await saveJournalEntry({
        type: selectedTemplate.structureType,
        content,
        mood,
        isFavorite: false,
        templateId: selectedTemplate.id,
        structuredData: structuredData.fields,
      });

      // Track template usage
      await trackTemplateUsage(selectedTemplate.id);

      // Add to local state
      const savedEntry = response.entry || response;
      setEntries((prev) => [savedEntry, ...prev]);

      // Reset the Entry Field
      setStructuredData({
        templateId: selectedTemplate.id,
        fields: {},
      });

      onSubmit({
        templateId,
        structuredData,
        mood,
      });

      // Show achievement notifications if any
      if (response.achievementsUnlocked && response.achievementsUnlocked.length > 0) {
        response.achievementsUnlocked.forEach((achievement: any) => {
          showToast({
            title: `🏆 Achievement Unlocked: ${achievement.title}`,
            description: `+${achievement.points} points! ${achievement.description}`,
          });
        });
      }

      // Show the toast of the user gaining points
      showToast({
        title: '+30 Points!',
        description: `Your "${selectedTemplate.name}" entry was saved successfully!`,
      });

      await refreshUserData();
    } catch (error) {
      console.error('Error saving journal entry:', error);
      showToast({
        title: 'Error',
        description: 'Failed to save journal entry. Please try again.',
      });
    }
  };

  const hasContent = () => {
    if (!selectedTemplate) return false;

    if (selectedTemplate.fields && selectedTemplate.fields.length > 0) {
      // Check if any field has content
      return Object.values(structuredData.fields).some((value) => {
        if (Array.isArray(value)) {
          return value.some((item) => item && item.trim && item.trim() !== '');
        }
        return value !== undefined && value !== null && value !== '';
      });
    } else {
      // For simple templates, check content field
      return structuredData.fields.content && structuredData.fields.content.trim() !== '';
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto bg-white shadow-md mt-4 mb-8">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl sm:text-xl text-indigo-700 text-center sm:text-left">
              Journal with Templates
            </CardTitle>
            <CardDescription className="text-indigo-500 text-center sm:text-left p-2 sm:p-0">
              Use structured templates for guided journaling
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1 bg-indigo-100 text-indigo-700">
              <Star className="w-4 h-4 mr-1" /> +30 points per entry
            </Badge>
            <TemplateSelector
              onSelectTemplate={handleTemplateSelect}
              currentTemplateId={selectedTemplate?.id}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {!selectedTemplate ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-4">Choose a template to get started</p>
            <p className="text-sm">
              Templates help you structure your thoughts with guided prompts and formats
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Template Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{selectedTemplate.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedTemplate.description}</p>
              </div>
              {selectedTemplate.prompts && selectedTemplate.prompts.length > 1 && (
                <Button variant="outline" size="sm" onClick={handleNewPrompt} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  New Prompt
                </Button>
              )}
            </div>

            {/* Template Renderer */}
            <StructuredTemplateRenderer
              template={selectedTemplate}
              data={structuredData}
              onChange={setStructuredData}
            />

            {/* Mood Selector */}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">
                How are you feeling right now?
              </p>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your mood" />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-64 overflow-y-auto">
                  {moodOptions.map((mood) => (
                    <SelectItem key={mood.value} value={mood.value}>
                      {mood.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between border-t pt-4 bg-gradient-to-r from-indigo-50 to-purple-50">
        <p className="text-xs text-gray-500 italic">
          Your journal entries are private and only visible to you.
        </p>
        <Button
          onClick={() =>
            handleSubmitJournalEntry({
              user,
              userData: userData!,
              templateId: selectedTemplate?.id || '',
              structuredData,
              mood,
              setEntries,
              setStructuredData,
              refreshUserData,
              showToast,
              onSubmit,
            })
          }
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={!selectedTemplate || !hasContent()}
        >
          Save Entry & Earn Points
        </Button>
      </CardFooter>
    </Card>
  );
};
