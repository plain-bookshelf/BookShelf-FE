export type CollectionStatus =
  | 'AVAILABLE'      // 대출 가능
  | 'ON_LOAN'        // 대출 중
  | 'RESERVED'       // 예약 중
  | 'LOST';          // etc

export interface CollectionItem {
  id: string; // 등록번호
  library: string; // 도서관
  status: '대출중' | '대출가능' | '예약중';
  dueDate?: string; // 반납 예정일 (대출중일 경우)
  callNumber: string; // 청구기호
}

export interface BookDetailData {
  bookId: number;
  title: string;
  coverImage: string;
  author: string;
  publisher: string;
  pubYear?: number;
  summary: string;
  categories: string[];
  registrationId: string;
  releaseDate: string;
  collection: CollectionItem[];
}

export interface Comment {
  id: number | string;
  // comment: number | string;
  user: string;
  text: string;
  date: string;
  profileImg?: string;
  likes: number;
  userId: string;
}