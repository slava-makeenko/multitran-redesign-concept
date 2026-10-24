import type { Entry } from '@/lib/types';

// Учебная статья для концепта: переводы и примеры составлены вручную,
// ники авторов вымышленные. Контент Мультитрана не копировался.
// Русско-английская: адрес латиницей, чтобы ссылки не превращались в %D0%B7…
export const zakhodNaPosadku: Entry = {
  slug: 'zakhod-na-posadku',
  pair: 'ru-en',
  word: 'заход на посадку',
  parts: [
    {
      id: 'noun',
      mainSenses: [
        { text: 'approach', gloss: 'общий термин' },
        { text: 'landing approach' },
        { text: 'final approach', gloss: 'конечный этап захода' },
        { text: 'approach to land' },
      ],
      groups: [
        {
          subject: 'aviation',
          items: [
            {
              text: 'approach',
              example: {
                source: 'самолёт выполняет заход на посадку',
                target: 'the aircraft is on approach',
              },
              author: 'SkyRunner',
            },
            { text: 'landing approach', author: 'SkyRunner' },
            {
              text: 'final approach',
              gloss: 'последний участок перед касанием',
              example: {
                source:
                  'экипаж стабилизировал самолёт на конечном этапе захода',
                target: 'the crew stabilised the aircraft on final approach',
              },
              author: 'ilya_avia',
            },
            { text: 'approach to land', author: 'ilya_avia' },
            {
              text: 'instrument approach',
              gloss: 'по приборам',
              author: 'ilya_avia',
            },
            {
              text: 'visual approach',
              gloss: 'визуальный',
              author: 'SkyRunner',
            },
            {
              text: 'circling approach',
              gloss: 'с маневрированием над аэродромом',
              author: 'ilya_avia',
            },
          ],
        },
        {
          subject: 'military',
          items: [
            {
              text: 'carrier approach',
              gloss: 'на палубу авианосца',
              example: {
                source: 'ночной заход на посадку на авианосец',
                target: 'a night carrier approach',
              },
              author: 'mil_trans',
            },
            {
              text: 'recovery approach',
              gloss: 'при возвращении на корабль или аэродром',
              author: 'mil_trans',
            },
          ],
        },
        {
          subject: 'general',
          items: [
            {
              text: 'approach',
              gloss: 'без уточнения этапа',
              author: 'nadezhda.p',
            },
          ],
        },
      ],
    },
  ],
  phrases: [
    {
      source: 'заход на посадку по приборам',
      target: 'instrument approach',
    },
    { source: 'прямой заход на посадку', target: 'straight-in approach' },
    { source: 'визуальный заход на посадку', target: 'visual approach' },
    { source: 'точный заход на посадку', target: 'precision approach' },
    { source: 'неточный заход на посадку', target: 'non-precision approach' },
    { source: 'прерванный заход на посадку', target: 'missed approach' },
    { source: 'схема захода на посадку', target: 'approach procedure' },
  ],
  forum: [
    { title: '«Заход на посадку» и «снижение»: где граница?', replies: 7 },
  ],
};
