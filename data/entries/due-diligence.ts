import type { Entry } from '@/lib/types';

// Учебная статья для концепта: переводы и примеры составлены вручную,
// ники авторов вымышленные. Контент Мультитрана не копировался.
export const dueDiligence: Entry = {
  slug: 'due-diligence',
  pair: 'en-ru',
  word: 'due diligence',
  ipa: 'ˌdjuː ˈdɪlɪdʒəns',
  parts: [
    {
      id: 'noun',
      mainSenses: [
        { text: 'комплексная проверка', gloss: 'компании перед сделкой' },
        { text: 'должная осмотрительность', gloss: 'юр.' },
        { text: 'юридическая экспертиза', gloss: 'документов, прав' },
        { text: 'проверка контрагента' },
      ],
      groups: [
        {
          subject: 'law',
          items: [
            {
              text: 'должная осмотрительность',
              example: {
                source: 'the company failed to exercise due diligence',
                target: 'компания не проявила должной осмотрительности',
              },
              author: 'olga_legal',
            },
            {
              text: 'юридическая экспертиза',
              gloss: 'прав на актив',
              author: 'olga_legal',
            },
            { text: 'правовой аудит', author: 'd.morozov' },
            {
              text: 'надлежащая проверка клиента',
              gloss: 'в банковском комплаенсе',
              author: 'd.morozov',
            },
            {
              text: 'разумная осторожность',
              gloss: 'стандарт поведения',
              author: 'olga_legal',
            },
            { text: 'проверка контрагента', author: 'd.morozov' },
          ],
        },
        {
          subject: 'economics',
          items: [
            {
              text: 'комплексная проверка',
              example: {
                source: 'due diligence before the acquisition',
                target: 'комплексная проверка перед покупкой компании',
              },
              author: 'fin_anna',
            },
            { text: 'предынвестиционный анализ', author: 'fin_anna' },
            {
              text: 'проверка финансового состояния',
              gloss: 'компании',
              author: 'fin_anna',
            },
            {
              text: 'дью-дилидженс',
              gloss: 'калька, принята в деловой речи',
              author: 'vlad.k',
            },
            {
              text: 'аудит',
              gloss: 'в широком смысле, перед сделкой',
              author: 'fin_anna',
            },
          ],
        },
        {
          subject: 'general',
          items: [
            {
              text: 'тщательная проверка',
              example: {
                source: 'do your due diligence before buying a used car',
                target: 'тщательно проверьте подержанную машину перед покупкой',
              },
              author: 'nadezhda.p',
            },
            { text: 'разумная предусмотрительность', author: 'vlad.k' },
          ],
        },
      ],
    },
  ],
  phrases: [
    { source: 'legal due diligence', target: 'юридическая проверка' },
    {
      source: 'financial due diligence',
      target: 'финансовая проверка компании',
    },
    { source: 'tax due diligence', target: 'налоговая проверка' },
    {
      source: 'due diligence report',
      target: 'отчёт о комплексной проверке',
    },
    { source: 'to carry out due diligence', target: 'провести проверку' },
    {
      source: 'customer due diligence',
      target: 'надлежащая проверка клиента',
    },
    {
      source: 'vendor due diligence',
      target: 'проверка по заказу продавца',
    },
  ],
  forum: [
    {
      title: '«Due diligence» — переводить или оставить «дью-дилидженс»?',
      replies: 14,
    },
    { title: 'Due diligence и аудит: это одно и то же?', replies: 5 },
  ],
};
