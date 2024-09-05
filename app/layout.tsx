"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import styles from './(components)/NowplayMovies/NowPlayingMovies.module.css';
import { getNowPlaying } from "@/_Service/MovieService";
import {
  fetchLikeStatus,
  updateLikeStatus,
  fetchLikeCounts,
} from "@/_Service/LikeService";
import { getPostsByMovieId } from "@/_Service/PostService";
import { useAuth } from "@/(context)/AuthContext";

type Movie = {
  id: string;
  title: string;
  poster_path: string;
  averageRating: number;
  likesCount: number;
  userHasLiked: boolean;
};

type MovieData = {
  id: string;
  title: string;
  poster_path: string;
};

type Post = {
  ratingStar: number;
};

export default function NowPlayingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(0);
  const [loadedImages, setLoadedImages] = useState<number>(0);
  const { memberNo } = useAuth();

  const MOVIES_PER_PAGE = 5;
  const POSTER_WIDTH = 200;
  const POSTER_MARGIN = 20;

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await getNowPlaying();
        const moviesWithDetails = await Promise.all(
          data.map(async (movie: MovieData) => {
            const likedStatus = memberNo
              ? await fetchLikeStatus(Number(memberNo), Number(movie.id))
              : false;
            const likeCount = await fetchLikeCounts(movie.id);
            const posts = await getPostsByMovieId(movie.id);
            const averageRating = calculateAverageRating(posts);
            return {
              ...movie,
              userHasLiked: likedStatus,
              likesCount: likeCount,
              averageRating: averageRating || 0,
            };
          })
        );
        setMovies(moviesWithDetails);
      } catch (error) {
        console.error("영화 정보를 가져오는 중 오류 발생:", error);
      }
    }
    fetchMovies();
  }, [memberNo]);

  // 나머지 컴포넌트 코드...

  const handleLikeClick = async (movieId: string, liked: boolean) => {
    if (!memberNo) {
      console.warn("영화에 좋아요를 하려면 로그인해야 합니다.");
      return;
    }

    try {
      await updateLikeStatus(Number(memberNo), Number(movieId), !liked);
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieId
            ? {
                ...movie,
                userHasLiked: !liked,
                likesCount: movie.likesCount + (liked ? -1 : 1),
              }
            : movie
        )
      );
    } catch (error) {
      console.error("좋아요 상태 업데이트 실패:", error);
    }
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
              className={`${styles.movieItem} ${
                index < MOVIES_PER_PAGE
                  ? loadedImages > index
                    ? styles.loaded
                    : styles.loading
                  : ""
              }`}
            >
              <Link href={`/movies/details/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                  alt={`Poster for ${movie.title}`}
                  className={styles.movieImg}
                  onLoad={handleImageLoad}
                />
              </Link>
              <div className={styles.ratingLikeSection}>
                <div className={styles.averageRating}>
                  <FaStar />{" "}
                  {movie.averageRating && movie.averageRating > 0
                    ? movie.averageRating.toFixed(1)
                    : "0"}
                </div>
                <button
                  className={`${styles.likeButton} ${
                    movie.userHasLiked ? styles.liked : ""
                  }`}
                  onClick={() => handleLikeClick(movie.id, movie.userHasLiked)}
                >
                  {movie.userHasLiked ? <FaHeart /> : <FaRegHeart />}
                  <span className={styles.likesCount}>{movie.likesCount}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleNextClick}
        className={`${styles.navButton} ${
          (page + 1) * MOVIES_PER_PAGE >= movies.length ? styles.hidden : ""
        }`}
        disabled={(page + 1) * MOVIES_PER_PAGE >= movies.length}
      >
        <IoIosArrowDropright />
      </button>
    </div>
  );
}