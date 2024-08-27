import dynamic from 'next/dynamic';

// `MovieModal` 컴포넌트를 동적으로 import합니다.
const MovieModal = dynamic(() => import('@/@modal/(.)movies/details/[movieId]/MovieModal'), { ssr: false });

export default function MoviePage({ params: { movieId } }: { params: { movieId: string } }) {
  return <MovieModal movieId={movieId} />;
}
