import type { Entry } from '@/lib/types';

// Учебная статья для концепта: переводы и примеры составлены вручную,
// ники авторов вымышленные. Контент Мультитрана не копировался.
export const leadTime: Entry = {
  slug: 'lead-time',
  pair: 'en-ru',
  word: 'lead time',
  ipa: 'ˈliːd taɪm',
  parts: [
    {
      id: 'noun',
      mainSenses: [
        { text: 'срок поставки', gloss: 'от заказа до получения' },
        { text: 'время выполнения заказа' },
        { text: 'производственный цикл', gloss: 'от запуска до выпуска' },
        { text: 'время упреждения', gloss: 'техн.' },
        { text: 'время на подготовку' },
      ],
      groups: [
        {
          subject: 'logistics',
          items: [
            {
              text: 'срок поставки',
              example: {
                source: 'the supplier’s lead time is six weeks',
                target: 'срок поставки у поставщика — шесть недель',
              },
              author: 'log_pavel',
            },
            { text: 'время выполнения заказа', author: 'log_pavel' },
            {
              text: 'время доставки',
              gloss: 'от отгрузки до получения',
              author: 'anya.supply',
            },
            {
              text: 'срок пополнения запаса',
              gloss: 'в управлении запасами',
              author: 'anya.supply',
            },
            { text: 'время ожидания поставки', author: 'log_pavel' },
            { text: 'логистический цикл', author: 'anya.supply' },
            {
              text: 'срок закупки',
              gloss: 'от заявки до поступления',
              author: 'log_pavel',
            },
          ],
        },
        {
          subject: 'engineering',
          items: [
            {
              text: 'время упреждения',
              gloss: 'в системах управления',
              author: 'tech_ivan',
            },
            { text: 'опережение', author: 'tech_ivan' },
            {
              text: 'срок изготовления',
              gloss: 'детали, оснастки',
              example: {
                source: 'tooling lead time',
                target: 'срок изготовления оснастки',
              },
              author: 'tech_ivan',
            },
          ],
        },
        {
          subject: 'economics',
          items: [
            {
              text: 'производственный цикл',
              example: {
                source: 'we cut lead time by 30%',
                target: 'мы сократили производственный цикл на 30%',
              },
              author: 'fin_anna',
            },
            {
              text: 'время вывода на рынок',
              gloss: 'от идеи до продаж',
              author: 'fin_anna',
            },
          ],
        },
        {
          subject: 'general',
          items: [
            {
              text: 'время на подготовку',
              example: {
                source: 'we need more lead time before the launch',
                target: 'перед запуском нужно больше времени на подготовку',
              },
              author: 'nadezhda.p',
            },
            { text: 'запас времени', author: 'vlad.k' },
          ],
        },
        {
          subject: 'medicine',
          items: [
            {
              text: 'время опережения',
              gloss: 'насколько раньше скрининг выявляет болезнь',
              author: 'med.irina',
            },
          ],
        },
      ],
    },
  ],
  phrases: [
    { source: 'lead time reduction', target: 'сокращение сроков поставки' },
    { source: 'production lead time', target: 'производственный цикл' },
    { source: 'supplier lead time', target: 'срок поставки поставщика' },
    { source: 'procurement lead time', target: 'срок закупки' },
    { source: 'short lead time', target: 'короткий срок поставки' },
    {
      source: 'lead time bias',
      target: 'систематическая ошибка опережения',
    },
  ],
  forum: [
    { title: 'Lead time и delivery time: в чём разница?', replies: 9 },
    { title: 'Как перевести «lead time» в договоре поставки', replies: 4 },
  ],
};
