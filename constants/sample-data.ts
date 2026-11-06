import type { Tone } from './theme';

export const COVER_PHOTO_URI = 'https://framerusercontent.com/images/CCoboAdc6y3Cv1T8CjixRefc.png';

export const couple = {
  names: '지현과 진국',
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
  { id: '2', title: '기념일 저녁 식사 예약하기', assignee: '진국', done: false },
  { id: '3', title: '우리 집 식물에 물 주기', assignee: '지현', done: true },
];

export type CalendarEvent = {
  id: string;
  title: string;
  tone: Tone;
  /** 24-hour "HH:mm"; omitted for all-day events. */
  time?: string;
  endTime?: string;
  /** Date keys of the first and last day, only for events spanning several days. */
  span?: { start: string; end: string };
  memo?: string;
};

export type CalendarDay = {
  events?: CalendarEvent[];
  photo?: string;
};

export const calendarDays: Record<string, CalendarDay> = {
  '2026-11-01': { photo: COVER_PHOTO_URI },
  '2026-11-04': { events: [{ id: 'e1', title: '장보기', tone: 'green', time: '18:30' }] },
  '2026-11-06': {
    events: [
      {
        id: 'e2',
        title: '점심 같이 먹기',
        tone: 'green',
        time: '12:30',
        endTime: '13:30',
        memo: '회사 앞 파스타집',
      },
      { id: 'e3', title: '퇴근 후 산책', tone: 'blue', time: '20:00', endTime: '21:00' },
    ],
  },
  '2026-11-07': {
    events: [
      { id: 'e4', title: '영화 데이트', tone: 'accent', time: '15:00' },
      { id: 'e5', title: '빨래', tone: 'blue' },
    ],
    photo: COVER_PHOTO_URI,
  },
  '2026-11-12': { events: [{ id: 'e6', title: '진국 회식', tone: 'blue', time: '19:00' }] },
  '2026-11-14': {
    events: [
      { id: 'e7', title: '캠핑', tone: 'green', time: '10:00' },
      { id: 'e8', title: '바베큐', tone: 'accent', time: '18:00' },
      { id: 'e9', title: '사진 정리', tone: 'blue' },
    ],
    photo: COVER_PHOTO_URI,
  },
  '2026-11-20': { events: [{ id: 'e10', title: '기념일', tone: 'accent' }] },
  '2026-11-22': { photo: COVER_PHOTO_URI },
  '2026-11-27': { events: [{ id: 'e11', title: '지현 생일', tone: 'accent' }] },
};
