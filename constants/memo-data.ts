export const MEMBERS = ['지현', '진국'] as const;
export const BUCKET_TAGS = ['여행', '맛집', '도전', '취미', '일상'] as const;

export type BucketItem = {
  id: string;
  title: string;
  tag: string;
  note: string;
  done: boolean;
};

export const initialBucketItems: BucketItem[] = [
  { id: 'b1', title: '제주에서 한 달 살아보기', tag: '여행', note: '여행 경비 40% 모았어요', done: false },
  { id: 'b2', title: '둘만의 맛집 지도 만들기', tag: '맛집', note: '가보고 싶은 곳 10곳 중 3곳', done: false },
  { id: 'b3', title: '함께 하프 마라톤 완주하기', tag: '도전', note: '이번 주도 함께 달려요', done: false },
  { id: 'b4', title: '우리의 첫 캠핑 떠나기', tag: '여행', note: '10월 18일 달성', done: true },
];

export type Memo = {
  id: string;
  title: string;
  body: string;
  date: string;
  favorite?: boolean;
};

export const memos: Memo[] = [
  {
    id: 'm1',
    title: '다음 데이트는 여기',
    body: '비 오는 날엔 조용한 책방에 가자. 따뜻한 차도 한 잔 마시고.',
    date: '오늘 오후 2시',
    favorite: true,
  },
  {
    id: 'm2',
    title: '너의 취향 기록',
    body: '덜 단 라테, 창가 자리, 그리고 산책. 하나씩 알아가는 중.',
    date: '어제',
    favorite: true,
  },
  {
    id: 'm3',
    title: '제주 여행 준비',
    body: '숙소 예약하기, 바다 앞 카페 찾기, 필름 카메라 챙기기.',
    date: '11월 2일',
  },
  {
    id: 'm4',
    title: '우리의 작은 약속',
    body: '바쁜 날에도 하루에 한 번은 서로의 안부를 묻기.',
    date: '10월 30일',
  },
];

export type SharedTodo = {
  id: string;
  title: string;
  assignee: string;
  shared: boolean;
  done: boolean;
};

export const initialSharedTodos: SharedTodo[] = [
  { id: 't1', title: '주말 장보기', assignee: '함께', shared: true, done: false },
  { id: 't2', title: '기념일 식당 예약하기', assignee: '함께', shared: true, done: false },
  { id: 't3', title: '우리 집 식물에 물 주기', assignee: '함께', shared: true, done: true },
  { id: 't4', title: '퇴근길에 우유 사 오기', assignee: '진국', shared: false, done: false },
  { id: 't5', title: '여행 사진 정리하기', assignee: '지현', shared: false, done: false },
];
