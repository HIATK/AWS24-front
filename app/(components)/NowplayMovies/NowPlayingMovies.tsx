import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import styles from './NowPlayingMovies.module.css';
import { getNowPlaying } from "@/_Service/MovieService";
import {
  fetchLikeStatus,
  updateLikeStatus,
  fetchLikeCounts,
} from "@/_Service/LikeService";
import { getPostsByMovieId } from "@/_Service/PostService";
import { useAuth } from "@/(context)/AuthContext";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";

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
  // Add other properties that come from getNowPlaying() if needed
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
              ? await fetchLikeStatus(memberNo, movie.id)
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
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, [memberNo]);

  // Rest of the component code...
}