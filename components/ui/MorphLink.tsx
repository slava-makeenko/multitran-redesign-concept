'use client';

import Link from 'next/link';
import { useState, ViewTransition, type ReactNode } from 'react';

import { morphName } from '@/lib/dictionary';

interface Props {
  href: string;
  className?: string;
  lang?: string;
  onClick?: () => void;
  /** Текст, который «перелетит» в заголовок статьи */
  children: ReactNode;
}

// Ссылка на статью, у которой слово при переходе «перелетает» в заголовок.
// Имя для View Transitions ставится только нажатой ссылке: иначе одно
// и то же слово в чипах, подсказках и списках дало бы повторяющиеся имена,
// и браузер отменил бы анимацию.
export function MorphLink({ href, className, lang, onClick, children }: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <Link
      className={className}
      href={href}
      lang={lang}
      onClick={() => {
        setPressed(true);
        onClick?.();
      }}
    >
      <ViewTransition
        name={pressed ? morphName(href) : undefined}
        share="morph"
        default="none"
      >
        <span>{children}</span>
      </ViewTransition>
    </Link>
  );
}
