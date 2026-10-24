import type { Entry } from '@/lib/types';

// Учебная статья для концепта: переводы и примеры составлены вручную,
// ники авторов вымышленные. Контент Мультитрана не копировался.
export const approval: Entry = {
  slug: 'approval',
  pair: 'en-ru',
  word: 'approval',
  ipa: 'əˈpruːvəl',
  parts: [
    {
      id: 'noun',
      mainSenses: [
        { text: 'одобрение', gloss: 'согласие, положительная оценка' },
        { text: 'утверждение', gloss: 'плана, бюджета, документа' },
        { text: 'согласование', gloss: 'с руководством, ведомством' },
        { text: 'разрешение', gloss: 'регулятора' },
        { text: 'санкция', gloss: 'официальное согласие' },
      ],
      groups: [
        {
          subject: 'general',
          items: [
            {
              text: 'одобрение',
              gloss: 'положительная оценка',
              example: {
                source: 'the plan met with general approval',
                target: 'план встретил всеобщее одобрение',
              },
              author: 'nadezhda.p',
            },
            {
              text: 'согласие',
              example: {
                source: 'with the approval of the parents',
                target: 'с согласия родителей',
              },
              author: 'vlad.k',
            },
            {
              text: 'утверждение',
              gloss: 'решения, плана',
              author: 'alex_term',
            },
            {
              text: 'похвала; признание',
              example: {
                source: 'she nodded in approval',
                target: 'она одобрительно кивнула',
              },
              author: 'nadezhda.p',
            },
            {
              text: 'поддержка',
              gloss: 'избирателей, общества',
              example: {
                source: 'the government’s approval is falling',
                target: 'поддержка правительства снижается',
              },
              author: 'vlad.k',
            },
            { text: 'визирование', gloss: 'документа', author: 'alex_term' },
            {
              text: 'санкция',
              gloss: 'официальное разрешение',
              author: 'olga_legal',
            },
          ],
        },
        {
          subject: 'law',
          items: [
            {
              text: 'одобрение',
              gloss: 'сделки органом управления',
              example: {
                source: 'the transaction requires shareholder approval',
                target: 'сделка требует одобрения акционеров',
              },
              author: 'olga_legal',
            },
            {
              text: 'разрешение',
              gloss: 'государственного органа',
              author: 'olga_legal',
            },
            {
              text: 'согласие',
              gloss: 'на сделку, на обработку данных',
              author: 'd.morozov',
            },
            { text: 'санкция', gloss: 'суда, прокурора', author: 'd.morozov' },
          ],
        },
        {
          subject: 'economics',
          items: [
            {
              text: 'утверждение',
              gloss: 'бюджета, расходов',
              example: {
                source: 'budget approval is due in March',
                target: 'бюджет утвердят в марте',
              },
              author: 'fin_anna',
            },
            { text: 'акцепт', gloss: 'счёта, документа', author: 'fin_anna' },
            {
              text: 'одобрение кредита',
              example: {
                source: 'loan approval takes three days',
                target: 'кредит одобряют за три дня',
              },
              author: 'fin_anna',
            },
          ],
        },
        {
          subject: 'medicine',
          items: [
            {
              text: 'одобрение',
              gloss: 'препарата регулятором',
              example: {
                source: 'the drug received regulatory approval',
                target: 'препарат одобрил регулятор',
              },
              author: 'med.irina',
            },
            {
              text: 'регистрация',
              gloss: 'лекарственного средства',
              author: 'med.irina',
            },
          ],
        },
        {
          subject: 'engineering',
          items: [
            {
              text: 'утверждение типа',
              gloss: 'сертификация серийного изделия',
              example: {
                source: 'type approval of vehicles',
                target: 'утверждение типа транспортных средств',
              },
              author: 'tech_ivan',
            },
            {
              text: 'приёмка',
              gloss: 'работ, оборудования',
              author: 'tech_ivan',
            },
          ],
        },
        {
          subject: 'aviation',
          items: [
            {
              text: 'одобрение',
              gloss: 'организации по ТО, изменения конструкции',
              author: 'SkyRunner',
            },
          ],
        },
      ],
    },
  ],
  phrases: [
    { source: 'approval process', target: 'процедура согласования' },
    { source: 'subject to approval', target: 'при условии утверждения' },
    { source: 'regulatory approval', target: 'разрешение регулятора' },
    { source: 'type approval', target: 'утверждение типа' },
    { source: 'approval rating', target: 'рейтинг одобрения' },
    { source: 'final approval', target: 'окончательное утверждение' },
    { source: 'on approval', target: 'на пробу (о товаре)' },
  ],
  forum: [
    { title: '«approval» в договоре: «согласие» или «одобрение»?', replies: 6 },
    { title: 'Approval workflow в документации к ИТ-системе', replies: 3 },
  ],
};
