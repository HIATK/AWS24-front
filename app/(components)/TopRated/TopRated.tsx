// components/TopRatedMovies/TopRatedMovies.tsx
'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import styles from "@/(components)/TopRated/TopRated.module.css";
import { getTopRated, getMovieByMovieId } from "@/_Service/MovieService";

type Movie = {
  id: string;
  title: string;
  poster_path: string;
};

export default function TopRatedMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(0);
  const [loadedImages, setLoadedImages] = useState<number>(0);

  const MOVIES_PER_PAGE = 5;
  const POSTER_WIDTH = 200;
  const POSTER_MARGIN = 20;

  const fetchMovies = async () => {
    try {
      const movieIds = await getTopRated();
      const movieDetails: Movie[] = [];

      for (const id of movieIds) {
        const details = await getMovieByMovieId(id);
        movieDetails.push(details);
      }
      setMovies(movieDetails);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();

    const handleRefreshMovies = () => {
      fetchMovies();
    };

    window.addEventListener('refreshMovies', handleRefreshMovies);

    return () => {
      window.removeEventListener('refreshMovies', handleRefreshMovies);
    };
  }, []);

  const handlePrevClick = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextClick = () => {
    setPage((prevPage) => {
      const maxPage = Math.ceil(movies.length / MOVIES_PER_PAGE) - 1;
      return Math.min(prevPage + 1, maxPage);
    });
  };

  const translateX = -page * (POSTER_WIDTH + POSTER_MARGIN * 2) * MOVIES_PER_PAGE;

  const handleImageLoad = () => {
    setLoadedImages((prevCount) => prevCount + 1);
  };

  return (
    <div className={styles.container}>
      <button
        onClick={handlePrevClick}
        className={`${styles.navButton} ${page === 0 ? styles.hidden : ""}`}
        disabled={page === 0}
      >
        <IoIosArrowDropleft />
      </button>
      <div className={styles.sliderWrapper}>
        <div
          className={styles.movieItems}
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className={`${styles.movieItem} ${index < MOVIES_PER_PAGE ? (loadedImages > index ? styles.loaded : styles.loading) : ''}`}
            >
              <Link href={`/movies/details/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                  alt={`Poster for ${movie.title}`}
                  className={`${styles.movieImg}`}
                  onLoad={handleImageLoad}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleNextClick}
        className={`${styles.navButton} ${(page + 1) * MOVIES_PER_PAGE >= movies.length ? styles.hidden : ""}`}
        disabled={(page + 1) * MOVIES_PER_PAGE >= movies.length}
      >
        <IoIosArrowDropright />
      </button>
    </div>
  );
}
