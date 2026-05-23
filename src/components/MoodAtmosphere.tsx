'use client';

import { useEffect } from 'react';
import { MoodLevel } from '@/lib/types';

interface Props {
  mood: MoodLevel | null;
}

const moodAccents: Record<MoodLevel, string> = {
  1: '#6B7B8D', // cool gray-blue for low mood
  2: '#7B8D9A', // muted blue-gray
  3: '#5B9A8B', // default sage
  4: '#7BA87F', // verdant green
  5: '#D4A84B', // warm gold
};

export default function MoodAtmosphere({ mood }: Props) {
  useEffect(() => {
    if (!mood) return;
    const accent = moodAccents[mood];
    if (accent) {
      document.documentElement.style.setProperty('--atmo-accent', accent);
    }
    return () => {
      document.documentElement.style.removeProperty('--atmo-accent');
    };
  }, [mood]);

  return null; // invisible, just sets CSS vars
}
