export type DeadlineType =
  | 'Подача документов'
  | 'Подача оригинала'
  | 'Платное обучение'
  | 'Дополнительный набор'
  | 'Общежитие';

export type Deadline = {
  id: string;
  university: string;
  city: string;
  type: DeadlineType;
  date: string;
  description: string;
};

export const DEADLINES: Deadline[] = [
  {
    id: 'hse-budget-2027',
    university: 'НИУ ВШЭ',
    city: 'Москва',
    type: 'Подача документов',
    date: '2027-07-20',
    description: 'Последний день подачи заявления и документов на бюджет.',
  },
  {
    id: 'itmo-budget-2027',
    university: 'Университет ИТМО',
    city: 'Санкт-Петербург',
    type: 'Подача документов',
    date: '2027-07-24',
    description: 'Завершение приёма заявлений на основные программы.',
  },
  {
    id: 'mipt-original-2027',
    university: 'МФТИ',
    city: 'Долгопрудный',
    type: 'Подача оригинала',
    date: '2027-08-03',
    description: 'Рекомендуемый срок подтверждения поступления оригиналом.',
  },
  {
    id: 'mipt-dorm-2027',
    university: 'МФТИ',
    city: 'Долгопрудный',
    type: 'Общежитие',
    date: '2027-08-01',
    description: 'Рекомендуемый срок подачи заявления на общежитие.',
  },
  {
    id: 'mephi-additional-2027',
    university: 'НИЯУ МИФИ',
    city: 'Москва',
    type: 'Дополнительный набор',
    date: '2027-08-10',
    description: 'Окончание дополнительного набора при наличии мест.',
  },
  {
    id: 'bmstu-budget-2027',
    university: 'МГТУ им. Н.Э. Баумана',
    city: 'Москва',
    type: 'Подача документов',
    date: '2027-07-23',
    description: 'Последний день подачи документов на бюджет.',
  },
  {
    id: 'spbu-dorm-2027',
    university: 'СПбГУ',
    city: 'Санкт-Петербург',
    type: 'Общежитие',
    date: '2027-08-05',
    description: 'Срок подачи заявления на заселение в общежитие.',
  },
  {
    id: 'spbu-paid-2027',
    university: 'СПбГУ',
    city: 'Санкт-Петербург',
    type: 'Платное обучение',
    date: '2027-08-20',
    description: 'Последний день заключения договора на платное обучение.',
  },
  {
    id: 'msu-original-2027',
    university: 'МГУ им. М.В. Ломоносова',
    city: 'Москва',
    type: 'Подача оригинала',
    date: '2027-08-05',
    description: 'Срок подачи оригинала документа об образовании.',
  },
  {
    id: 'urfu-budget-2027',
    university: 'УрФУ',
    city: 'Екатеринбург',
    type: 'Подача документов',
    date: '2027-07-25',
    description: 'Последний день подачи заявления на бюджетные места.',
  },
];
