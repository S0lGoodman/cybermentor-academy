import { FC, useEffect, useState } from 'react';
import {
  MDXEditor as BaseMDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

interface MDXEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
}

export const MDXEditor: FC<MDXEditorProps> = ({ value = '', onChange, onBlur, name }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full min-h-[200px] border rounded-md bg-muted animate-pulse" />
    );
  }

  return (
    <BaseMDXEditor
      markdown={value}
      onChange={onChange}
      onBlur={onBlur}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <BlockTypeSelect />
              <CreateLink />
            </>
          ),
        }),
      ]}
      className="w-full min-h-[200px] border rounded-md prose prose-sm max-w-none dark:prose-invert"
    />
  );
}; 