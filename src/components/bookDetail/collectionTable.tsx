import React, { useState } from 'react';
import * as S from './style';
import type { CollectionItem } from '../../types/bookTypes';

interface CollectionTableProps {
  items: CollectionItem[];
  onAction: (action: 'loan' | 'reserve', itemId: string) => Promise<void> | void;
  actionLoading?: boolean;
}

const CollectionTable: React.FC<CollectionTableProps> = ({ items, onAction }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleClick = async (action: 'loan' | 'reserve', id: string) => {
    if (loadingId) return;
    setLoadingId(id);
    try {
      await onAction(action, id);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <S.CollectionContainer>
      <S.LibraryTable>
        <S.TableHead>
          <tr>
            <th>도서관</th>
            <th>등록번호</th>
            <th>상태</th>
            <th>청구기호/반납예정일</th>
            <th>도서대출</th>
            <th>도서예약</th>
          </tr>
        </S.TableHead>
        <S.TableBody>
          {items.map((item) => {
            const isLoaned = item.status === '대출중';
            const isLoanable = item.status === '대출가능';
            // const isLoaned = item.status === true;
            // const isLoanable = item.status === false;
            const isLoading = loadingId === item.id;

            const loanType: 'primary' | 'secondary' | 'disabled' =
              isLoanable && !isLoading ? 'primary' : 'disabled';
            const reserveType: 'primary' | 'secondary' | 'disabled' =
              isLoaned && !isLoading ? 'secondary' : 'disabled';
            
            return (
              <tr key={item.id}>
                <td>{item.library}</td>
                <td>{item.id}</td>
                <S.StatusCell $status={item.status}>
                  {item.status}
                </S.StatusCell>
                <td>{isLoaned ? item.dueDate : item.callNumber}</td>
                <td>
                  <S.ActionButton
                    $type={loanType}
                    disabled={!isLoanable || isLoading}
                    onClick={() =>
                      isLoanable && !isLoading && handleClick('loan', item.id)
                    }
                  >
                    {isLoading && loadingId === item.id
                      ? '대출 중...'
                      : '대출하기'}
                  </S.ActionButton>
                </td>
                <td>
                  <S.ActionButton
                    $type={reserveType}
                    disabled={!isLoaned || isLoading}
                    onClick={() => isLoaned && !isLoading && handleClick('reserve', item.id)}>
                    {isLoading && loadingId === item.id ? '예약 중...' : '대출예약'}
                  </S.ActionButton>
                </td>
              </tr>
            );
          })}
        </S.TableBody>
      </S.LibraryTable>
    </S.CollectionContainer>
  );
};

export default CollectionTable;