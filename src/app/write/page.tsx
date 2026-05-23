'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, ChevronDown, X, Plus, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { MoodLevel, Category, Quote } from '@/lib/types';
import RewardModal from '@/components/RewardModal';
import MarkdownPreview from '@/components/MarkdownPreview';

const DRAFT_KEY = 'awakening-draft';
const SAVE_DELAY = 1500; // debounce 1.5s

interface Draft {
  content: string;
  mood: MoodLevel;
  category: Category;
  tags: string[];
}

const CATEGORIES: Category[] = ['认知觉醒', '多巴胺管理', '财富心态', '元认知', '冥想与专注', '其他'];
const MOOD_LABELS: Record<MoodLevel, string> = {
  1: '低落',
  2: '疲惫',
  3: '平静',
  4: '充实',
  5: '高涨',
};

function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.content?.trim()) return parsed;
    return null;
  } catch {
    return null;
  }
}

function saveDraft(draft: Draft) {
  try {
    if (draft.content.trim()) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } else {
      localStorage.removeItem(DRAFT_KEY);
    }
  } catch { /* quota exceeded, ignore */ }
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export default function WritePage() {
  const router = useRouter();

  const restored = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');

  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodLevel>(3);
  const [category, setCategory] = useState<Category>('元认知');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [prompts, setPrompts] = useState<{ id: string; text: string }[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptSelector, setShowPromptSelector] = useState(false);

  const [saving, setSaving] = useState(false);
  const [showReward, setShowReward] = useState<Quote | null>(null);
  const [saveError, setSaveError] = useState('');
  const [draftRestored, setDraftRestored] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Restore draft on mount
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const draft = loadDraft();
    if (draft) {
      setContent(draft.content);
      setMood(draft.mood);
      setCategory(draft.category);
      setTags(draft.tags);
      setDraftRestored(true);
    }
  }, []);

  // Debounced auto-save to localStorage
  const debouncedSave = useCallback((draft: Draft) => {
    const key = JSON.stringify(draft);
    if (key === lastSavedRef.current) return;
    lastSavedRef.current = key;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveDraft(draft), SAVE_DELAY);
  }, []);

  // Trigger auto-save on state changes
  useEffect(() => {
    if (!restored.current) return;
    debouncedSave({ content, mood, category, tags });
  }, [content, mood, category, tags, debouncedSave]);

  // Warn before leaving with unsaved content
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (content.trim()) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [content]);

  // Fetch prompts
  useEffect(() => {
    fetch('/api/prompts')
      .then(res => res.json())
      .then(data => {
        setPrompts(data);
        if (data.length > 0) setSelectedPrompt(data[0].text);
      })
      .catch(() => {
        setPrompts([{ id: 'default', text: '今天我觉察到了什么？' }]);
        setSelectedPrompt('今天我觉察到了什么？');
      });
  }, []);

  const wordCount = content.replace(/\s/g, '').length;
  const canSave = content.trim().length > 0;

  const handleSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    setSaveError('');

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          mood,
          category,
          tags,
          prompt: selectedPrompt || customPrompt,
        }),
      });

      if (res.ok) {
        clearDraft();
        const data = await res.json();
        if (data.reward) {
          setShowReward(data.reward);
        } else {
          router.push('/');
          router.refresh();
        }
      } else {
        const err = await res.json();
        setSaveError(err.error || '保存失败，请重试');
      }
    } catch {
      setSaveError('网络连接失败，内容已自动保存到本地');
    } finally {
      setSaving(false);
    }
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="max-w-reading mx-auto space-y-6">
      {/* Top toolbar */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-ink-muted dark:text-[#9A9A9E] hover:text-ink dark:hover:text-[#E8E6E3] transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">返回</span>
        </Link>

        <div className="flex items-center gap-3">
          {draftRestored && content && (
            <span className="text-xs text-sage-500">已恢复草稿</span>
          )}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${showPreview ? 'bg-sage-100 dark:bg-sage-500/20 text-sage-500' : 'text-ink-light hover:text-ink-muted'}`}
            title={showPreview ? '关闭预览' : '预览'}
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <span className="text-xs text-ink-light">{wordCount} 字</span>
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="
              flex items-center gap-2 px-5 py-2.5
              bg-sage-500 hover:bg-sage-600 dark:bg-sage-400 dark:hover:bg-sage-300
              text-white dark:text-deep-900
              rounded-xl text-sm font-medium
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200
            "
          >
            <Save size={16} />
            <span>{saving ? '保存中...' : '发布记录'}</span>
          </button>
        </div>
      </div>

      {/* Error message */}
      {saveError && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-3 text-sm text-red-600 dark:text-red-400">
          {saveError}
        </div>
      )}

      {/* Gentle encouragement */}
      <p className="text-xs text-ink-light dark:text-[#6B6B70] text-center">
        ✍️ 哪怕只写一句，也是觉醒。
      </p>

      {/* Prompt selector */}
      <div className="relative">
        <button
          onClick={() => setShowPromptSelector(!showPromptSelector)}
          className="flex items-center gap-2 text-sm text-ink-muted dark:text-[#9A9A9E] hover:text-sage-500 dark:hover:text-sage-400 transition-colors"
        >
          <span>引导问题:</span>
          <span className="text-ink dark:text-[#E8E6E3] italic">
            「{customPrompt || selectedPrompt || '选择引导问题'}」
          </span>
          <ChevronDown size={14} className={showPromptSelector ? 'rotate-180' : ''} />
        </button>

        {showPromptSelector && (
          <div className="absolute top-8 left-0 z-20 bg-white dark:bg-deep-800 border border-warm-200 dark:border-deep-700 rounded-xl shadow-lg p-2 w-80 animate-float-in">
            {prompts.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPrompt(p.text);
                  setCustomPrompt('');
                  setShowPromptSelector(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm hover:bg-warm-100 dark:hover:bg-deep-700 transition-colors"
              >
                {p.text}
              </button>
            ))}
            <div className="border-t border-warm-200 dark:border-deep-700 mt-2 pt-2 px-2">
              <input
                type="text"
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder="自定义引导问题..."
                className="w-full px-3 py-2 rounded-lg text-sm bg-warm-50 dark:bg-deep-700 border border-warm-200 dark:border-deep-600 focus:outline-none focus:border-sage-400"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setSelectedPrompt('');
                    setShowPromptSelector(false);
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Immersive writing area */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="开始书写你的觉察...哪怕只有一句话。"
        className="
          w-full min-h-[50vh] resize-none
          bg-transparent
          text-body-lg text-ink dark:text-[#E8E6E3]
          placeholder:text-ink-light dark:placeholder:text-[#6B6B70]
          leading-[1.8]
          focus:outline-none
          font-body
        "
        autoFocus
        aria-label="日记内容编辑区"
      />

      {/* Markdown preview */}
      {showPreview && (
        <div className="bg-white dark:bg-deep-800 rounded-2xl p-5 sm:p-6 border border-warm-200 dark:border-deep-700">
          <p className="text-xs text-ink-light mb-3">预览</p>
          <MarkdownPreview content={content} />
        </div>
      )}

      {/* Metadata section */}
      <div className="space-y-4 pb-8">
        {/* Mood selector */}
        <div>
          <label className="text-xs text-ink-muted dark:text-[#9A9A9E] mb-2 block">情绪状态</label>
          <div className="flex items-center gap-3">
            {([1, 2, 3, 4, 5] as MoodLevel[]).map(level => (
              <button
                key={level}
                onClick={() => setMood(level)}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm
                  transition-all duration-200
                  ${mood === level
                    ? 'bg-sage-500 text-white scale-110 shadow-md'
                    : 'bg-warm-200 dark:bg-deep-700 text-ink-muted hover:bg-warm-300 dark:hover:bg-deep-600'
                  }
                `}
                aria-label={`情绪 ${level} - ${MOOD_LABELS[level]}`}
              >
                {level}
              </button>
            ))}
            <span className="text-sm text-ink-muted ml-2">{MOOD_LABELS[mood]}</span>
          </div>
        </div>

        {/* Category selector */}
        <div>
          <label className="text-xs text-ink-muted dark:text-[#9A9A9E] mb-2 block">分类</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium
                  transition-all duration-200
                  ${category === cat
                    ? 'bg-sage-500 text-white'
                    : 'bg-warm-200 dark:bg-deep-700 text-ink-muted hover:bg-warm-300 dark:hover:bg-deep-600'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tags input */}
        <div>
          <label className="text-xs text-ink-muted dark:text-[#9A9A9E] mb-2 block">标签（最多5个）</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-sage-50 dark:bg-sage-500/10 text-sage-600 dark:text-sage-400"
              >
                {tag}
                <button onClick={() => removeTag(tag)} aria-label={`移除标签${tag}`}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              placeholder="输入标签后回车"
              className="px-3 py-1.5 rounded-lg text-sm bg-warm-50 dark:bg-deep-700 border border-warm-200 dark:border-deep-600 focus:outline-none focus:border-sage-400 w-40"
            />
            <button
              onClick={() => addTag(tagInput)}
              className="p-1.5 rounded-lg bg-warm-200 dark:bg-deep-700 hover:bg-warm-300 dark:hover:bg-deep-600"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Reward modal */}
      {showReward && (
        <RewardModal
          quote={showReward}
          onClose={() => {
            setShowReward(null);
            router.push('/');
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
