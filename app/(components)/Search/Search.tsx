'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { MovieDetails } from '@/(types)/types';
import styles from './Search.module.css';
import Link from 'next/link';
import RainEffect from "@/(components)/RainEffect/RainEffect";

const Search = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchTerm = searchParams.get('keyword') || '';
  const [initialSearchTerm, setInitialSearchTerm] = useState(searchTerm); // 초기 검색어 상태 저장
  const [results, setResults] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const prevSearchTermRef = useRef<string | null>(null);
  const initialFetchRef = useRef<boolean>(false);

  const fetchResults = async (searchTerm: string, page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/movies/search?keyword=${encodeURIComponent(searchTerm)}&page=${page}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setResults(prevResults => [...prevResults, ...data]);
          setHasMore(data.length > 0);
        } else {
          console.error('Unexpected response format:', data);
          setHasMore(false);
        }
      } else {
        console.error('검색 결과를 가져오는 데 실패했습니다');
      }
    } catch (error) {
      console.error('검색 결과를 가져오는 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = useCallback(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
    fetchResults(searchTerm, 1);
  }, [searchTerm]);

  useEffect(() => {
    const currentURL = window.location.href;
    const expectedURL = `http://localhost:3000/movies/search?keyword=${encodeURIComponent(searchTerm)}`;

    if (currentURL === expectedURL && (prevSearchTermRef.current !== searchTerm || !initialFetchRef.current)) {
      resetSearch();
      prevSearchTermRef.current = searchTerm;
      initialFetchRef.current = true;
    }
  }, [searchTerm, resetSearch, pathname]);

  useEffect(() => {
    if (page > 1) {
      fetchResults(searchTerm, page);
    }
  }, [page]);

  const lastPosterElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (lastPosterElementRef.current) {
      observer.current.observe(lastPosterElementRef.current);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    // pathname이 /movies/search 일 때만 초기 검색어 설정
    if (pathname === '/movies/search') {
      setInitialSearchTerm(searchTerm);
    }
  }, [pathname, searchTerm]);

  return (
    <div className={styles.main}>
      <div className={styles.description}>
        <div className={styles.searchText}>Search results for "{initialSearchTerm}" </div>
      </div>
      <div className={styles.posterSection}>
        <div className={styles["movie-items"]}>
          {results.map((movie, index) => {
            if (results.length === index + 1) {
              return (
                <div key={movie.id} className={styles["movie-item"]} ref={lastPosterElementRef}>
                  <Link href={`/movies/details/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                      alt={`Poster for ${movie.title}`}
                      className={styles["movie-img"]}
                    />
                  </Link>
                </div>
              );
            } else {
              return (
                <div key={movie.id} className={styles["movie-item"]}>
                  <Link href={`/movies/details/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                      alt={`Poster for ${movie.title}`}
                      className={styles["movie-img"]}
                    />
                  </Link>
                </div>
              );
            }
          })}
        </div>
        <div className={styles.searchText}>{loading && <p>Loading...</p>}</div>
        <div className={styles.searchText}>{!hasMore && <p>No more results</p>}</div>
      </div>
    </div>
  );
};

export default Search;
