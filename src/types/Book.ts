export type Book = {
  id: number;
  book_name: string;
  author: string;
  book_type: string;
  book_image_url: string;
  rank?: number;
  onClick: () => void
}

export type SearchBook = {
  id: number;
  book_name: string;
  author: string;
  book_type: string;
  book_image: string;
  rank?: number
}

export type MyBook = {
  book_id: number;
  book_name: string;
  book_author: string;
  is_over_due?: boolean;
  over_due_time?: string;
  day?: number;
}

export type RecommandBook = {
  id: number;
  img: string;
  title: string;
  book_date: number;
  publisher: string;
  writer: string;
  description: string;
  is_school: boolean;
}