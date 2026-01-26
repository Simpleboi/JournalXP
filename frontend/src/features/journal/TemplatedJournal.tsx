/**
 * Templated Journal Component
 * Journal with template support for structured entries
 */

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, RefreshCw, LayoutTemplate, Sparkles } from 'lucide-react';
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
import { motion } from 'framer-motion';

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
  onSubmit: (entry: { type: string; content: string; mood: string }) => void;
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
        type: selectedTemplate.structureType,
        content,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto mt-4 mb-8"
    >
      {/* Glass morphism container */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border-2 border-white/50 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-violet-50/80 to-purple-50/80 backdrop-blur-sm border-b border-violet-100/50">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.div
                className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200/50"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <LayoutTemplate className="h-6 w-6 text-white" />
              </motion.div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Journal with Templates
                </h2>
                <p className="text-sm text-violet-600/80">
                  Use structured templates for guided journaling
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              <Badge className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200/60 rounded-lg">
                <Star className="w-4 h-4 mr-1 fill-amber-500 text-amber-500" /> +30 points
              </Badge>
              <TemplateSelector
                onSelectTemplate={handleTemplateSelect}
                currentTemplateId={selectedTemplate?.id}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {!selectedTemplate ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-violet-500" />
              </motion.div>
              <p className="text-lg font-medium text-gray-700 mb-2">Choose a template to get started</p>
              <p className="text-sm text-gray-500">
                Templates help you structure your thoughts with guided prompts and formats
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Template Header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50/50 to-purple-50/50 backdrop-blur-sm rounded-xl border border-violet-100/50"
              >
                <div>
                  <h3 className="text-lg font-semibold text-violet-900">{selectedTemplate.name}</h3>
                  <p className="text-sm text-violet-600/80 mt-1">{selectedTemplate.description}</p>
                </div>
                {selectedTemplate.prompts && selectedTemplate.prompts.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNewPrompt}
                    className="gap-2 rounded-xl border-2 border-violet-200/60 hover:bg-violet-50 hover:border-violet-300"
                  >
                    <RefreshCw className="w-4 h-4" />
                    New Prompt
                  </Button>
                )}
              </motion.div>

              {/* Template Renderer */}
              <StructuredTemplateRenderer
                template={selectedTemplate}
                data={structuredData}
                onChange={setStructuredData}
              />

              {/* Mood Selector */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 p-4 bg-gradient-to-r from-violet-50/50 to-purple-50/50 backdrop-blur-sm rounded-xl border border-violet-100/50"
              >
                <p className="text-sm font-medium text-violet-800 mb-3">
                  How are you feeling right now?
                </p>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border-2 border-violet-100/60 rounded-xl focus:border-violet-300">
                    <SelectValue placeholder="Select your mood" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-64 overflow-y-auto rounded-xl border-2 border-violet-100/60">
                    {moodOptions.map((mood) => (
                      <SelectItem key={mood.value} value={mood.value}>
                        {mood.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 sm:p-6 border-t border-violet-100/50 bg-white/60 backdrop-blur-sm">
          <p className="text-xs text-violet-600/70 italic">
            Your journal entries are private and only visible to you.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-xl shadow-md shadow-violet-200/50 px-6"
              disabled={!selectedTemplate || !hasContent()}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Save Entry & Earn Points
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
