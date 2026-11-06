import { COVER_PHOTO_URI } from './sample-data';

export const BAKERY_PHOTO_URI = 'https://framerusercontent.com/images/XzGKQtwVsJlNQRjFQqslUxSOd64.jpg';

export const CURRENT_USER = '지현';

export type StoryHighlight = { id: string; label: string; photo: string };

export const highlights: StoryHighlight[] = [
  { id: 'h1', label: '이번 달', photo: BAKERY_PHOTO_URI },
  { id: 'h2', label: '제주도 여행', photo: COVER_PHOTO_URI },
  { id: 'h3', label: '백일 기념', photo: COVER_PHOTO_URI },
  { id: 'h4', label: '우리의 주말', photo: BAKERY_PHOTO_URI },
  { id: 'h5', label: '작은 행복', photo: COVER_PHOTO_URI },
];

export type StoryComment = { id: string; author: string; text: string };

export type StoryPost = {
  id: string;
  author: string;
  avatar: string;
  place: string;
  when: string;
  photos: string[];
  caption: string;
  comments: StoryComment[];
};

export const initialPosts: StoryPost[] = [
  {
    id: 'p1',
    author: '지현',
    avatar: COVER_PHOTO_URI,
    place: '성수동 카페',
    when: '어제',
    photos: [BAKERY_PHOTO_URI, COVER_PHOTO_URI],
    caption: '갓 구운 빵 냄새에 이끌려 들어간 곳. 특별한 계획 없이 걸어도 너와 함께라면 언제나 좋은 하루.',
    comments: [{ id: 'c1', author: '진국', text: '다음엔 꼭 또 가자!' }],
  },
  {
    id: 'p2',
    author: '진국',
    avatar: COVER_PHOTO_URI,
    place: '제주 바닷가',
    when: '11월 2일',
    photos: [COVER_PHOTO_URI, BAKERY_PHOTO_URI],
    caption: '바다를 보며 나란히 앉아 있던 오후. 아무 말 없이도 충분했던 우리만의 시간.',
    comments: [{ id: 'c2', author: '지현', text: '이 순간이 제일 좋았어.' }],
  },
];
