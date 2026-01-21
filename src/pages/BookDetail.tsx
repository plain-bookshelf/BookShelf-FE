import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookInfoSection from '../components/bookDetail/bookInfoSection';
import CollectionTable from '../components/bookDetail/collectionTable';
import * as S from '../components/bookDetail/style';
import type { BookDetailData } from '../types/bookTypes';
import ReviewSection from '../components/comment/ReviewSection';
import { getBookDetail } from '../api/bookDetail';
import { requestBookRental } from '../api/bookApi';
import { getAccessToken } from '../utils/tokenService';
import { reserveBook } from '../api/bookApi';

/** 서버 진실 기반 상세 페이지 */
export default function BookDetail() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<BookDetailData | null>(null);
  const [activeTab, setActiveTab] = useState<'collection' | 'review'>('collection');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 중복요청 방지 플래그 */
  const fetchingRef = useRef(false);

  /** 상세 재조회: UI는 항상 서버 응답으로만 갱신 */
  const refetchDetail = useCallback(async () => {
    if (!bookId || fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const data = await getBookDetail(bookId);
      console.debug('[DETAIL] mapped:', data);
      setBook(data);
      setError(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === 'NO_TOKEN' || msg === 'UNAUTHORIZED') {
        alert('로그인 후 이용 가능한 서비스입니다.');
        navigate('/login');
        return;
      }
      setError(msg === 'NOT_FOUND' ? '존재하지 않는 도서입니다.' : '도서 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      fetchingRef.current = false;
    }
  }, [bookId, navigate]);

  /** 초기 로딩 */
  useEffect(() => {
    if (!bookId) {
      setError('잘못된 접근입니다.');
      setIsLoading(false);
      return;
    }
    (async () => {
      await refetchDetail();
      setIsLoading(false);
    })();
  }, [bookId, refetchDetail]);

  /** 뒤로가기(BFCache) 복원 시 재조회 */
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) refetchDetail();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [refetchDetail]);

  /** 탭 포커스 복귀 시 재조회 */
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden) refetchDetail();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refetchDetail]);

  /** 대출 액션: 로컬 낙관적 업데이트 금지, 성공/실패 모두 서버 재조회 */
  const handleAction = async (action: 'loan' | 'reserve', itemId: string): Promise<void> => {
    if (!book || actionLoading) return;

    const token = getAccessToken();
    if (!token) {
      alert('로그인 후 이용 가능한 서비스입니다.');
      navigate('/login');
      return;
    }

    if (!itemId?.trim()) {
      alert('등록번호가 올바르지 않습니다.');
      return;
    }

    try {
      setActionLoading(true);
      if (action === 'loan') {
        const res = await requestBookRental(itemId);
        await refetchDetail();
        alert(res.message || '성공적으로 대출되었습니다.');
      }
      else if (action === 'reserve') {
        const res = await reserveBook(itemId);
        await refetchDetail();
        alert(res.message || '성공적으로 예약되었습니다.');
      }
    } catch (e: unknown) {
      await refetchDetail().catch(() => {});
      alert(e instanceof Error ? e.message : '요청 처리 중 오류가 발생했습니다.');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) return <div>도서 정보를 불러오는 중입니다...</div>;
  if (error || !book) return <div>{error ?? '도서 정보를 찾을 수 없습니다.'}</div>;

  return (
    <S.DetailPageWrapper>
      <BookInfoSection book={book} />
      <S.Divider />

      <S.TabContainer>
        <S.DetailTabs>
          <S.TabButton $isActive={activeTab === 'collection'} onClick={() => setActiveTab('collection')}>
            소장정보
          </S.TabButton>
          <S.TabButton $isActive={activeTab === 'review'} onClick={() => setActiveTab('review')}>
            리뷰
          </S.TabButton>
        </S.DetailTabs>
      </S.TabContainer>

      {activeTab === 'collection' && (
        <CollectionTable
          items={book.collection}
          onAction={handleAction}
          actionLoading={actionLoading}
        />
      )}

      {activeTab === 'review' && (
        <ReviewSection
          bookId={book.bookId}
          book={book}
          setBook={setBook}
        />
      )}
    </S.DetailPageWrapper>
  );
}