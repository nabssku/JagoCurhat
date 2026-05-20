"use client";

import React, { useCallback, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Smile, X, AtSign } from "lucide-react";

interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  mentions?: any[];
  compact?: boolean;
  barMode?: boolean;
  actions?: React.ReactNode;
  leftActions?: React.ReactNode;
}

export default function RichEditor({ 
  content, 
  onChange, 
  placeholder = "Tulis cerita hangatmu...",
  mentions = [],
  compact = false,
  barMode = false,
  actions,
  leftActions
}: RichEditorProps) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [suggestionData, setSuggestionData] = useState<{ query: string; items: string[] } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "text-accent font-bold bg-accent/10 px-1 rounded-md",
        },
        suggestion: {
          items: ({ query }) => {
            return mentions
              .filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
              .slice(0, 5);
          },
          render: () => {
            return {
              onStart: (props) => {
                setSuggestionData({ query: props.query, items: props.items });
              },
              onUpdate: (props) => {
                setSuggestionData({ query: props.query, items: props.items });
              },
              onExit: () => {
                setSuggestionData(null);
              },
              onKeyDown: (props) => {
                if (props.event.key === 'Escape') {
                  setSuggestionData(null);
                  return true;
                }
                return false;
              },
            };
          },
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
        attributes: {
            class: `focus:outline-none ${barMode ? 'min-h-[20px] py-1' : (compact ? 'min-h-[60px]' : 'min-h-[120px]')} max-h-[300px] overflow-y-auto prose prose-invert prose-sm max-w-none text-foreground font-medium`,
        }
    }
  });

  const addEmoji = (emojiData: any) => {
    if (editor) {
      editor.chain().focus().insertContent(emojiData.emoji).run();
      setShowEmoji(false);
    }
  };

  const selectMention = (item: string) => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertContent([
            {
                type: 'mention',
                attrs: { id: item, label: item },
            },
            {
                type: 'text',
                text: ' ',
            },
        ])
        .run();
      setSuggestionData(null);
    }
  };

  if (!editor) return null;

  if (barMode) {
    return (
      <div className="relative flex items-center w-full rounded-full bg-zinc-900 border border-border/40 p-1.5 pr-2 shadow-lg shadow-black/20">
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setShowEmoji(!showEmoji)}
            className="p-1.5 rounded-full hover:bg-white/5 text-zinc-400 hover:text-accent transition-all btn-bounce"
          >
            <Smile size={20} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().insertContent("@").run()}
            className="p-1.5 rounded-full hover:bg-white/5 text-zinc-400 hover:text-accent transition-all btn-bounce"
          >
            <AtSign size={18} />
          </button>
          {leftActions}
        </div>

        <div className="flex-1 px-2 overflow-hidden flex items-center">
          <EditorContent 
            editor={editor} 
            className="w-full text-xs" 
          />
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}

        {/* Mention Suggestion UI - Adjusted for Bar Mode */}
        {suggestionData && suggestionData.items.length > 0 && (
          <div className="absolute bottom-full left-10 mb-2 bg-card border border-border rounded-xl shadow-2xl z-[60] overflow-hidden min-w-[140px] animate-in fade-in slide-in-from-bottom-2 duration-200">
            {suggestionData.items.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectMention(item)}
                className="w-full text-left px-4 py-2 text-xs font-bold text-foreground hover:bg-accent hover:text-white transition-colors border-b border-border last:border-0"
              >
                @{item}
              </button>
            ))}
          </div>
        )}

        {showEmoji && (
          <div className="absolute bottom-full left-0 mb-4 z-50">
            <div className="relative">
              <button 
                onClick={() => setShowEmoji(false)}
                className="absolute -top-2 -right-2 p-1 bg-zinc-800 rounded-full z-10 text-white border border-border shadow-lg"
              >
                <X size={12} />
              </button>
              <EmojiPicker 
                theme={Theme.DARK}
                onEmojiClick={addEmoji}
                width={280}
                height={350}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full rounded-2xl bg-zinc-950/40 border border-border overflow-hidden">
      <div className="p-3">
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center justify-between p-2 bg-black/20 border-t border-border/40">
        <div className="flex items-center gap-1">
            <button
               type="button"
               onClick={() => setShowEmoji(!showEmoji)}
               className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-accent transition-all btn-bounce"
            >
                <Smile size={18} />
            </button>
            <button
               type="button"
               onClick={() => editor.chain().focus().insertContent("@").run()}
               className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-accent transition-all btn-bounce"
            >
                <AtSign size={18} />
            </button>
        </div>
      </div>

      {/* Mention Suggestion UI */}
      {suggestionData && suggestionData.items.length > 0 && (
        <div className="absolute top-full left-4 -mt-16 bg-card border border-border rounded-xl shadow-2xl z-[60] overflow-hidden min-w-[140px] animate-in fade-in slide-in-from-bottom-2 duration-200">
           {suggestionData.items.map((item, index) => (
             <button
                key={index}
                type="button"
                onClick={() => selectMention(item)}
                className="w-full text-left px-4 py-2 text-xs font-bold text-foreground hover:bg-accent hover:text-white transition-colors border-b border-border last:border-0"
             >
                @{item}
             </button>
           ))}
        </div>
      )}

      {showEmoji && (
        <div className="absolute bottom-12 left-0 z-50">
            <div className="relative">
                <button 
                  onClick={() => setShowEmoji(false)}
                  className="absolute -top-2 -right-2 p-1 bg-zinc-800 rounded-full z-10 text-white border border-border shadow-lg"
                >
                    <X size={12} />
                </button>
                <EmojiPicker 
                   theme={Theme.DARK}
                   onEmojiClick={addEmoji}
                   width={280}
                   height={350}
                />
            </div>
        </div>
      )}
    </div>
  );
}
