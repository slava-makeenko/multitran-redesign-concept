import type { Entry } from '@/lib/types';

// Учебная статья для концепта: переводы и примеры составлены вручную,
// ники авторов вымышленные. Контент Мультитрана не копировался.
export const approach: Entry = {
  slug: 'approach',
  pair: 'en-ru',
  word: 'approach',
  ipa: 'əˈprəʊtʃ',
  parts: [
    {
      id: 'noun',
      mainSenses: [
        { text: 'подход', gloss: 'к задаче, к человеку' },
        { text: 'метод, способ' },
        { text: 'приближение', gloss: 'во времени, в пространстве' },
        { text: 'подступ, подъезд', gloss: 'путь к месту' },
        { text: 'обращение', gloss: 'с просьбой, предложением' },
        { text: 'заход на посадку', gloss: 'авиа' },
      ],
      groups: [
        {
          subject: 'general',
          items: [
            {
              text: 'подход',
              gloss: 'способ взглянуть на задачу',
              example: {
                source: 'a fresh approach to the problem',
                target: 'свежий подход к задаче',
              },
              author: 'nadezhda.p',
            },
            { text: 'метод; способ', author: 'alex_term' },
            {
              text: 'приближение',
              gloss: 'наступление чего-либо',
              example: {
                source: 'the approach of spring',
                target: 'приближение весны',
              },
              author: 'alex_term',
            },
            {
              text: 'подступ; подход',
              gloss: 'путь к месту',
              example: {
                source: 'all approaches to the village were blocked',
                target: 'все подходы к деревне перекрыли',
              },
              author: 'SkyRunner',
            },
            {
              text: 'подъезд',
              gloss: 'дорога к зданию, мосту',
              author: 'nadezhda.p',
            },
            {
              text: 'обращение',
              gloss: 'с просьбой или предложением',
              example: {
                source: 'to make an approach to the bank',
                target: 'обратиться в банк',
              },
              author: 'vlad.k',
            },
            {
              text: 'попытка сближения',
              gloss: 'с человеком, стороной переговоров',
              example: {
                source: 'his approaches were ignored',
                target: 'его попытки сблизиться остались без ответа',
              },
              author: 'vlad.k',
            },
            {
              text: 'отношение',
              gloss: 'к работе, делу',
              example: {
                source: 'a careless approach to safety',
                target: 'небрежное отношение к безопасности',
              },
              author: 'nadezhda.p',
            },
          ],
        },
        {
          subject: 'aviation',
          items: [
            {
              text: 'заход на посадку',
              example: {
                source: 'the aircraft is on final approach',
                target: 'самолёт на посадочной прямой',
              },
              author: 'SkyRunner',
            },
            { text: 'подход к аэродрому', author: 'SkyRunner' },
            {
              text: 'траектория захода',
              gloss: 'на посадку',
              author: 'ilya_avia',
            },
            { text: 'заход', gloss: 'в составе манёвра', author: 'ilya_avia' },
            { text: 'подлёт', gloss: 'к аэродрому', author: 'ilya_avia' },
          ],
        },
        {
          subject: 'military',
          items: [
            {
              text: 'подступы',
              gloss: 'к городу, позиции',
              example: {
                source: 'the approaches to the city were mined',
                target: 'подступы к городу заминировали',
              },
              author: 'grom_77',
            },
            { text: 'сближение', gloss: 'с противником', author: 'grom_77' },
            { text: 'выдвижение', gloss: 'к рубежу', author: 'grom_77' },
          ],
        },
        {
          subject: 'engineering',
          items: [
            {
              text: 'подвод',
              gloss: 'инструмента к заготовке',
              author: 'tech.ru',
            },
            {
              text: 'подход',
              gloss: 'инструмента к рабочей зоне',
              author: 'tech.ru',
            },
            { text: 'въезд', gloss: 'путь к сооружению', author: 'alex_term' },
          ],
        },
        {
          subject: 'medicine',
          items: [
            {
              text: 'доступ',
              gloss: 'хирургический',
              example: {
                source: 'a lateral approach',
                target: 'боковой доступ',
              },
              author: 'med_irina',
            },
            { text: 'подход', gloss: 'к лечению', author: 'med_irina' },
          ],
        },
        {
          subject: 'golf',
          items: [
            { text: 'подход', gloss: 'удар к грину', author: 'putt.pro' },
            { text: 'удар с подхода', author: 'putt.pro' },
          ],
        },
        {
          subject: 'math',
          items: [
            {
              text: 'приближение',
              gloss: 'аппроксимация',
              author: 'alex_term',
            },
          ],
        },
      ],
    },
    {
      id: 'verb',
      mainSenses: [
        { text: 'приближаться' },
        { text: 'подходить', gloss: 'к месту, к вопросу' },
        { text: 'обращаться', gloss: 'к кому-либо с чем-либо' },
        { text: 'браться за', gloss: 'задачу, дело' },
      ],
      groups: [
        {
          subject: 'general',
          items: [
            {
              text: 'приближаться',
              example: {
                source: 'winter is approaching',
                target: 'приближается зима',
              },
              author: 'alex_term',
            },
            { text: 'подходить', gloss: 'к месту', author: 'alex_term' },
            {
              text: 'обращаться',
              gloss: 'к кому-либо с просьбой, предложением',
              example: {
                source: 'she approached the bank for a loan',
                target: 'она обратилась в банк за кредитом',
              },
              author: 'vlad.k',
            },
            {
              text: 'браться за',
              gloss: 'задачу, дело',
              author: 'nadezhda.p',
            },
            {
              text: 'подходить',
              gloss: 'к вопросу, проблеме',
              example: {
                source: 'to approach the problem from a new angle',
                target: 'подойти к проблеме с новой стороны',
              },
              author: 'nadezhda.p',
            },
          ],
        },
        {
          subject: 'aviation',
          items: [
            { text: 'заходить на посадку', author: 'SkyRunner' },
            { text: 'приближаться к аэродрому', author: 'ilya_avia' },
          ],
        },
        {
          subject: 'military',
          items: [
            { text: 'подходить', gloss: 'к позициям', author: 'grom_77' },
          ],
        },
        {
          subject: 'math',
          items: [
            {
              text: 'стремиться',
              gloss: 'к пределу',
              example: {
                source: 'f(x) approaches zero',
                target: 'f(x) стремится к нулю',
              },
              author: 'alex_term',
            },
          ],
        },
      ],
    },
  ],
  phrases: [
    { source: 'approach road', target: 'подъездная дорога' },
    { source: 'approach lights', target: 'огни приближения' },
    { source: 'landing approach', target: 'заход на посадку' },
    { source: 'approach angle', target: 'угол въезда' },
    { source: 'a new approach to', target: 'новый подход к' },
    { source: 'approach shot', target: 'удар с подхода' },
    { source: 'missed approach', target: 'уход на второй круг' },
    { source: 'step-by-step approach', target: 'пошаговый подход' },
  ],
  forum: [
    { title: '«approach» в научной статье: «подход» или «метод»?', replies: 4 },
    {
      title: 'Missed approach procedure — как принято в документации?',
      replies: 6,
    },
    { title: '«Approach» в маркетинговом тексте', replies: 2 },
  ],
};
