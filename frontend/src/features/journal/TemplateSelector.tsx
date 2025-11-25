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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Plus,
} from 'lucide-react';
import type { JournalTemplate, TemplateCategory } from '@shared/types/templates';
import { getAllTemplates, toggleTemplateFavorite } from '@/services/templateService';
import { useToast } from '@/hooks/useToast';

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
        <Button variant="outline" className="gap-2">
          <LayoutTemplate className="w-4 h-4" />
          {currentTemplate ? currentTemplate.name : 'Choose Template'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Choose a Journal Template</DialogTitle>
          <DialogDescription>
            Select a pre-built template or create your own custom structure
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
          <TabsList className="grid grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
            <TabsTrigger value="reflection">Reflection</TabsTrigger>
            <TabsTrigger value="therapy">Therapy</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {loading ? (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  Loading templates...
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  No templates found in this category
                </div>
              ) : (
                filteredTemplates.map((template) => {
                  const Icon = iconMap[template.icon || 'LayoutTemplate'] || LayoutTemplate;
                  const isFavorite = favorites.includes(template.id);
                  const isCurrent = currentTemplateId === template.id;

                  return (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isCurrent ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: template.color || '#e0e7ff' }}
                            >
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              <Badge className={`mt-1 ${categoryColors[template.category]}`}>
                                {template.category}
                              </Badge>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleToggleFavorite(template.id, e)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                              }`}
                            />
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {template.isPrebuilt && (
                            <Badge variant="secondary" className="text-xs">
                              Pre-built
                            </Badge>
                          )}
                          {template.fields && (
                            <Badge variant="outline" className="text-xs">
                              {template.fields.length} fields
                            </Badge>
                          )}
                          {template.recurrence && (
                            <Badge variant="outline" className="text-xs">
                              {template.recurrence.frequency} reminder
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}

              {/* Create Custom Template Card */}
              <Card className="cursor-pointer transition-all hover:shadow-md border-dashed border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">Create Custom Template</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Design your own template with custom fields, prompts, and structure
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
