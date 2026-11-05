import type { Tone } from './theme';

export const COVER_PHOTO_URI = 'https://framerusercontent.com/images/CCoboAdc6y3Cv1T8CjixRefc.png';

export const couple = {
  names: '재희와 민준',
  tagline: '언제나 너와 함께',
  startDate: new Date(2023, 5, 21),
  anniversary: { label: '우리의 기념일', date: new Date(2026, 10, 20) },
};

export type TodoItem = {
  id: string;
  title: string;
  assignee: string;
  done: boolean;
};

export const initialTodos: TodoItem[] = [
  { id: '1', title: '함께 장보기', assignee: '함께', done: false },
  { id: '2', title: '기념일 저녁 식사 예약하기', assignee: '민준', done: false },
  { id: '3', title: '우리 집 식물에 물 주기', assignee: '재희', done: true },
];

export type CalendarEvent = { title: string; tone: Tone };

export type CalendarDay = {
  events?: CalendarEvent[];
  photo?: string;
};

export const calendarDays: Record<string, CalendarDay> = {
  '2026-11-01': { photo: COVER_PHOTO_URI },
  '2026-11-04': { events: [{ title: '장보기', tone: 'green' }] },
  '2026-11-07': {
    events: [
      { title: '영화 데이트', tone: 'accent' },
      { title: '빨래', tone: 'blue' },
    ],
    photo: COVER_PHOTO_URI,
  },
  '2026-11-12': { events: [{ title: '민준 회식', tone: 'blue' }] },
  '2026-11-14': {
    events: [
      { title: '캠핑', tone: 'green' },
      { title: '바베큐', tone: 'accent' },
      { title: '사진 정리', tone: 'blue' },
    ],
    photo: COVER_PHOTO_URI,
  },
  '2026-11-20': { events: [{ title: '기념일', tone: 'accent' }] },
  '2026-11-22': { photo: COVER_PHOTO_URI },
  '2026-11-27': { events: [{ title: '재희 생일', tone: 'accent' }] },
};
