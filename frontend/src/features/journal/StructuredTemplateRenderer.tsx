/**
 * Structured Template Renderer
 * Renders different journal template types with their specific fields
 */

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { JournalTemplate, TemplateField, StructuredEntryData } from '@shared/types/templates';
import { moodOptions } from '@/utils/ReflectionUtils';
import { useTheme } from '@/context/ThemeContext';

interface StructuredTemplateRendererProps {
  template: JournalTemplate;
  data: StructuredEntryData;
  onChange: (data: StructuredEntryData) => void;
}

export const StructuredTemplateRenderer = ({
  template,
  data,
  onChange,
}: StructuredTemplateRendererProps) => {
  const [bulletItems, setBulletItems] = useState<Record<string, string[]>>({});
  const { theme } = useTheme();

  const handleFieldChange = (fieldId: string, value: any) => {
    onChange({
      ...data,
      fields: {
        ...data.fields,
        [fieldId]: value,
      },
    });
  };

  const handleBulletItemAdd = (fieldId: string) => {
    const items = bulletItems[fieldId] || [];
    setBulletItems({
      ...bulletItems,
      [fieldId]: [...items, ''],
    });
  };

  const handleBulletItemChange = (fieldId: string, index: number, value: string) => {
    const items = bulletItems[fieldId] || [];
    items[index] = value;
    setBulletItems({
      ...bulletItems,
      [fieldId]: items,
    });
    handleFieldChange(fieldId, items.filter((item) => item.trim() !== ''));
  };

  const handleBulletItemRemove = (fieldId: string, index: number) => {
    const items = bulletItems[fieldId] || [];
    items.splice(index, 1);
    setBulletItems({
      ...bulletItems,
      [fieldId]: items,
    });
    handleFieldChange(fieldId, items.filter((item) => item.trim() !== ''));
  };

  const renderField = (field: TemplateField) => {
    const value = data.fields[field.id];

    switch (field.type) {
      case 'text':
        return (
          <Input
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            maxLength={field.maxLength}
            required={field.required}
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            }}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            minLength={field.minLength}
            maxLength={field.maxLength}
            required={field.required}
            className="min-h-[120px]"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            }}
          />
        );

      case 'bullet-list':
        const items = bulletItems[field.id] || [''];
        return (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={field.placeholder || 'Enter item...'}
                  value={item}
                  onChange={(e) => handleBulletItemChange(field.id, index, e.target.value)}
                  className="flex-1"
                />
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleBulletItemRemove(field.id, index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleBulletItemAdd(field.id)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value))}
            required={field.required}
          />
        );

      case 'rating':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                1 (Low)
              </span>
              <span className="text-2xl font-bold" style={{ color: theme.colors.primary }}>
                {value || 5}
              </span>
              <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                10 (High)
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[value || 5]}
              onValueChange={(vals) => handleFieldChange(field.id, vals[0])}
              className="w-full"
            />
          </div>
        );

      case 'mood-selector':
        return (
          <Select value={value || 'neutral'} onValueChange={(val) => handleFieldChange(field.id, val)}>
            <SelectTrigger>
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
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
            />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {field.label}
            </label>
          </div>
        );

      case 'time':
        return (
          <Input
            type="time"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );

      default:
        return null;
    }
  };

  // For free-form templates (just a prompt)
  if (!template.fields || template.fields.length === 0) {
    return (
      <div className="space-y-4">
        {template.prompt && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-100/80 to-purple-100/80 backdrop-blur-sm border border-violet-200/50 italic text-violet-800">
            {template.prompt}
          </div>
        )}
        {template.prompts && template.prompts.length > 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-100/80 to-fuchsia-100/80 backdrop-blur-sm border border-purple-200/50 italic text-purple-800">
            {template.prompts[Math.floor(Math.random() * template.prompts.length)]}
          </div>
        )}
        <Textarea
          placeholder="Start writing your thoughts..."
          value={data.fields.content || ''}
          onChange={(e) => handleFieldChange('content', e.target.value)}
          className="min-h-[300px] bg-white/80 backdrop-blur-sm border-2 border-violet-100/60 focus:border-violet-300 focus:ring-violet-200 rounded-xl"
        />
      </div>
    );
  }

  // For structured templates with fields
  const sortedFields = [...template.fields].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {template.prompt && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-violet-100/80 to-purple-100/80 backdrop-blur-sm border border-violet-200/50 italic text-violet-800 mb-4">
          {template.prompt}
        </div>
      )}

      {sortedFields.map((field) => (
        <div
          key={field.id}
          className="bg-white/60 backdrop-blur-sm rounded-xl border-2 border-violet-100/50 overflow-hidden"
        >
          <div className="p-4 space-y-3">
            <Label
              htmlFor={field.id}
              className="text-base font-semibold text-violet-900"
            >
              {field.label}
              {field.required && <span className="ml-1 text-pink-500">*</span>}
            </Label>
            {renderField(field)}
          </div>
        </div>
      ))}
    </div>
  );
};
