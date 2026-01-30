/**
 * Template Selector Component
 * Allows users to browse and select journal templates
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutTemplate,
  Star,
  Clock,
  Heart,
  Brain,
  List,
  Smile,
  Target,
  Wind,
  Users,
  Sunrise,
  Moon,
} from 'lucide-react';
import type { JournalTemplate, TemplateCategory } from '@shared/types/templates';
import { getAllTemplates, toggleTemplateFavorite } from '@/services/templateService';
import { useToast } from '@/hooks/useToast';
import { motion } from 'framer-motion';

interface TemplateSelectorProps {
  onSelectTemplate: (template: JournalTemplate) => void;
  currentTemplateId?: string;
}

// Icon mapping for templates
const iconMap: Record<string, React.ComponentType<any>> = {
  Sunrise,
  Moon,
  Clock,
  Heart,
  Brain,
  List,
  Smile,
  Target,
  Wind,
  Users,
  LayoutTemplate,
};

const categoryColors: Record<TemplateCategory, string> = {
  wellness: 'bg-green-100 text-green-800',
  productivity: 'bg-blue-100 text-blue-800',
  gratitude: 'bg-pink-100 text-pink-800',
  reflection: 'bg-purple-100 text-purple-800',
  therapy: 'bg-indigo-100 text-indigo-800',
  custom: 'bg-gray-100 text-gray-800',
};

export const TemplateSelector = ({ onSelectTemplate, currentTemplateId }: TemplateSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<JournalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | TemplateCategory>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await getAllTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      showToast({
        title: 'Error',
        description: 'Failed to load templates',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await toggleTemplateFavorite(templateId);
      if (result.isFavorite) {
        setFavorites([...favorites, templateId]);
      } else {
        setFavorites(favorites.filter((id) => id !== templateId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleSelectTemplate = (template: JournalTemplate) => {
    onSelectTemplate(template);
    setOpen(false);
    showToast({
      title: 'Template Selected',
      description: `Using "${template.name}" template`,
    });
  };

  const filteredTemplates = templates.filter((template) => {
    if (selectedCategory === 'all') return true;
    return template.category === selectedCategory;
  });

  const currentTemplate = templates.find((t) => t.id === currentTemplateId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 rounded-xl border-2 border-violet-200/60 hover:bg-violet-50 hover:border-violet-300"
        >
          <LayoutTemplate className="w-4 h-4 text-violet-600" />
          {currentTemplate ? currentTemplate.name : 'Choose Template'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-white/95 backdrop-blur-md border-2 border-violet-100/50 rounded-2xl sm:rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md">
              <LayoutTemplate className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Choose a Journal Template
              </DialogTitle>
              <DialogDescription className="text-violet-600/80">
                Select a pre-built template to structure your journal entry
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
          <TabsList className="grid grid-cols-4 sm:grid-cols-6 bg-violet-50/50 backdrop-blur-sm p-1 rounded-xl border border-violet-100/50">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-violet-700 text-xs sm:text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="wellness" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-violet-700 text-xs sm:text-sm">
              Wellness
            </TabsTrigger>
            <TabsTrigger value="productivity" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-violet-700 text-xs sm:text-sm hidden sm:flex">
              Productivity
            </TabsTrigger>
            <TabsTrigger value="gratitude" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-violet-700 text-xs sm:text-sm">
              Gratitude
            </TabsTrigger>
            <TabsTrigger value="reflection" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-violet-700 text-xs sm:text-sm hidden sm:flex">
              Reflection
            </TabsTrigger>
            <TabsTrigger value="therapy" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-violet-700 text-xs sm:text-sm hidden sm:flex">
              Therapy
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
              {loading ? (
                <div className="col-span-2 text-center py-8 text-violet-600/70">
                  Loading templates...
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-violet-600/70">
                  No templates found in this category
                </div>
              ) : (
                filteredTemplates.map((template) => {
                  const Icon = iconMap[template.icon || 'LayoutTemplate'] || LayoutTemplate;
                  const isFavorite = favorites.includes(template.id);
                  const isCurrent = currentTemplateId === template.id;

                  return (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`cursor-pointer bg-white/70 backdrop-blur-sm rounded-xl border-2 p-4 transition-all ${
                        isCurrent
                          ? 'border-violet-400 shadow-md shadow-violet-100'
                          : 'border-violet-100/60 hover:border-violet-200 hover:shadow-md'
                      }`}
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2 rounded-xl shadow-sm"
                            style={{ backgroundColor: template.color || '#8b5cf6' }}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{template.name}</h3>
                            <Badge className="mt-1 text-xs bg-violet-100/80 text-violet-700 rounded-md">
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleToggleFavorite(template.id, e)}
                          className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                        >
                          <Star
                            className={`w-5 h-5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                          />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {template.isPrebuilt && (
                          <Badge variant="secondary" className="text-xs bg-violet-50 text-violet-600 rounded-md">
                            Pre-built
                          </Badge>
                        )}
                        {template.fields && (
                          <Badge variant="outline" className="text-xs border-violet-200 text-violet-600 rounded-md">
                            {template.fields.length} fields
                          </Badge>
                        )}
                        {template.recurrence && (
                          <Badge variant="outline" className="text-xs border-violet-200 text-violet-600 rounded-md">
                            {template.recurrence.frequency} reminder
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}

            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
