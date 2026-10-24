'use client';

import { useSyncExternalStore } from 'react';

import { SpeakerIcon } from '@/components/ui/icons';

import styles from './entry.module.css';

function subscribe(callback: () => void) {
  if (!('speechSynthesis' in window)) return () => {};
  window.speechSynthesis.addEventListener('voiceschanged', callback);
  return () =>
    window.speechSynthesis.removeEventListener('voiceschanged', callback);
}

/** Имя подходящего голоса браузера или пустая строка, если его нет */
function pickVoiceName(lang: string): string {
  if (!('speechSynthesis' in window)) return '';
  const voice = window.speechSynthesis
    .getVoices()
    .find(item => item.lang.toLowerCase().startsWith(lang));
  return voice?.name ?? '';
}

interface Props {
  text: string;
  lang: string;
}

// Произношение голосом браузера: своих аудиофайлов в концепте нет.
// Без подходящего голоса кнопка невидима, но место за ней сохранено,
// чтобы строка с транскрипцией не прыгала.
export function PronounceButton({ text, lang }: Props) {
  const voiceName = useSyncExternalStore(
    subscribe,
    () => pickVoiceName(lang),
    () => '',
  );

  const speak = () => {
    const voice = window.speechSynthesis
      .getVoices()
      .find(item => item.name === voiceName);
    if (!voice) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      className={styles.audio}
      aria-label={`Произношение слова ${text}`}
      disabled={!voiceName}
      style={{ visibility: voiceName ? 'visible' : 'hidden' }}
      onClick={speak}
    >
      <SpeakerIcon size={20} />
    </button>
  );
}
