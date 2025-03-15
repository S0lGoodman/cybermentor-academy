import { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Textarea } from './textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export const MarkdownEditor: FC<MarkdownEditorProps> = ({ value = '', onChange, onBlur }) => {
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as 'write' | 'preview')} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="write" className="mt-0">
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          className="min-h-[200px] font-mono"
          placeholder="Use markdown to format your content..."
        />
      </TabsContent>
      <TabsContent value="preview" className="mt-0">
        <div className="min-h-[200px] p-4 border rounded-md prose prose-sm max-w-none dark:prose-invert">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground">Nothing to preview</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}; 