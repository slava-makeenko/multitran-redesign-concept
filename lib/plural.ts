/** Русское склонение по числу: plural(3, ['перевод', 'перевода', 'переводов']) → 'перевода' */
export function plural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return forms[1];
  }
  return forms[2];
}

/** То же с числом впереди: count(3, [...]) → '3 перевода' */
export function count(n: number, forms: [string, string, string]): string {
  return `${n} ${plural(n, forms)}`;
}

export const TRANSLATION_FORMS: [string, string, string] = [
  'перевод',
  'перевода',
  'переводов',
];
export const SUBJECT_FORMS: [string, string, string] = [
  'тематика',
  'тематики',
  'тематик',
];
export const PHRASE_FORMS: [string, string, string] = [
  'фраза',
  'фразы',
  'фраз',
];
export const DISCUSSION_FORMS: [string, string, string] = [
  'обсуждение',
  'обсуждения',
  'обсуждений',
];

/** Предложный падеж после «в»: «в 1 тематике», «в 7 тематиках» */
export function inSubjects(n: number): string {
  return `в ${n} ${n % 10 === 1 && n % 100 !== 11 ? 'тематике' : 'тематиках'}`;
}
export const SUGGESTION_FORMS: [string, string, string] = [
  'подсказка',
  'подсказки',
  'подсказок',
];
export const MATCH_FORMS: [string, string, string] = [
  'совпадение',
  'совпадения',
  'совпадений',
];
