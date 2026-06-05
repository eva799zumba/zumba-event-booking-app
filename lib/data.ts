export interface ZumbaEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  price: number;
  capacity: number;
  registered: number;
  waitlist: number;
  status: "open" | "closed" | "full";
  image: string;
  category: string;
  bankAccount: string;
  bankName: string;
  accountHolder: string;
}

export const events: ZumbaEvent[] = [
  {
    id: "1",
    title: "토요일 모닝 줌바",
    description:
      "주말 아침을 활기차게 시작하세요! 신나는 라틴 음악과 함께하는 모닝 줌바 클래스입니다. 초보자도 쉽게 따라할 수 있는 기본 동작부터 시작합니다.",
    date: "2026-06-14",
    time: "09:00 - 10:30",
    location: "강남 피트니스 센터 3층",
    instructor: "김지현",
    price: 20000,
    capacity: 30,
    registered: 25,
    waitlist: 3,
    status: "open",
    image: "/images/zumba-morning.png",
    category: "기초반",
    bankAccount: "110-123-456789",
    bankName: "신한은행",
    accountHolder: "줌바피트니스",
  },
  {
    id: "2",
    title: "줌바 골드 - 시니어 클래스",
    description:
      "50세 이상을 위한 맞춤형 줌바 클래스입니다. 관절에 무리가 가지 않는 저강도 동작으로 구성되어 있습니다. 건강하게 즐기는 댄스 피트니스!",
    date: "2026-06-16",
    time: "14:00 - 15:00",
    location: "서초문화센터 대강당",
    instructor: "박민수",
    price: 15000,
    capacity: 40,
    registered: 40,
    waitlist: 8,
    status: "full",
    image: "/images/zumba-gold.png",
    category: "시니어",
    bankAccount: "333-222-111000",
    bankName: "국민은행",
    accountHolder: "줌바피트니스",
  },
  {
    id: "3",
    title: "야간 줌바 파티",
    description:
      "퇴근 후 스트레스를 날려버리세요! 클럽 분위기의 조명과 음악으로 즐기는 야간 줌바 파티입니다. 친구와 함께 오시면 더욱 즐거워요!",
    date: "2026-06-20",
    time: "19:30 - 21:00",
    location: "홍대 댄스 스튜디오",
    instructor: "이서연",
    price: 25000,
    capacity: 50,
    registered: 32,
    waitlist: 0,
    status: "open",
    image: "/images/zumba-party.png",
    category: "파티",
    bankAccount: "555-666-777888",
    bankName: "하나은행",
    accountHolder: "줌바피트니스",
  },
  {
    id: "4",
    title: "줌바 토닝 - 근력 강화",
    description:
      "줌바와 근력 운동을 결합한 토닝 클래스입니다. 가벼운 토닝 스틱을 사용하여 팔, 복부, 다리 근육을 강화합니다. 다이어트에 효과적!",
    date: "2026-06-18",
    time: "11:00 - 12:00",
    location: "송파 스포츠 센터",
    instructor: "최윤아",
    price: 22000,
    capacity: 25,
    registered: 25,
    waitlist: 5,
    status: "full",
    image: "/images/zumba-toning.png",
    category: "근력강화",
    bankAccount: "123-456-789012",
    bankName: "우리은행",
    accountHolder: "줌바피트니스",
  },
  {
    id: "5",
    title: "키즈 줌바",
    description:
      "어린이를 위한 신나는 줌바 클래스! 게임과 놀이를 접목한 재미있는 프로그램으로 아이들의 체력과 리듬감을 길러줍니다. 7-12세 대상.",
    date: "2026-06-15",
    time: "15:00 - 16:00",
    location: "잠실 어린이 문화센터",
    instructor: "정하은",
    price: 18000,
    capacity: 20,
    registered: 14,
    waitlist: 0,
    status: "open",
    image: "/images/zumba-kids.png",
    category: "키즈",
    bankAccount: "999-888-777666",
    bankName: "농협",
    accountHolder: "줌바피트니스",
  },
  {
    id: "6",
    title: "아쿠아 줌바 - 수영장 클래스",
    description:
      "물 속에서 즐기는 아쿠아 줌바! 관절에 부담 없이 전신 운동 효과를 얻을 수 있습니다. 수영을 못해도 참여 가능합니다.",
    date: "2026-06-22",
    time: "10:00 - 11:00",
    location: "올림픽 수영장",
    instructor: "강민호",
    price: 30000,
    capacity: 15,
    registered: 15,
    waitlist: 12,
    status: "closed",
    image: "/images/zumba-aqua.png",
    category: "아쿠아",
    bankAccount: "222-333-444555",
    bankName: "기업은행",
    accountHolder: "줌바피트니스",
  },
];
