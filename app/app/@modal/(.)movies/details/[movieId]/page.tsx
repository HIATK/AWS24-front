import dynamic from 'next/dynamic';
import React from 'react';

// `MovieModal` 컴포넌트를 동적으로 import하고, 로딩 상태를 표시합니다.
const MovieModal = dynamic(() => import('@/@modal/(.)movies/details/[movieId]/MovieModal'), {
  loading: () => <Loading />,
  ssr: false,
});

// 로딩 컴포넌트를 import합니다.
import Loading from './loading';

const MoviePage = ({ params: { movieId } }: { params: { movieId: string } }) => {
  return <MovieModal movieId={movieId} />;
};

export default MoviePage;
