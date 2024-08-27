// components/Modal/PostForm/PostForm.tsx
import React, { useState, useEffect } from "react";
import styles from "./PostForm.module.css";
import RatingStars from "@/(components)/Modal/RatingStar/RatingStars";
import { regPost, getPostsByMovieId, getAverageRatingByMovieId } from "@/_Service/PostService";
import { useAuth } from "@/(context)/AuthContext";
import { PostDetails } from "@/(types)/types";

interface PostFormProps {
  movieId: number;
  setPosts: React.Dispatch<React.SetStateAction<PostDetails[]>>;
  setAverageRating: React.Dispatch<React.SetStateAction<number>>;
}

const PostForm: React.FC<PostFormProps> = ({ movieId, setPosts, setAverageRating }) => {
  const { memberNick } = useAuth();
  const [postContent, setPostContent] = useState("");
  const [postRating, setPostRating] = useState(0);
  const [postHoverRating, setPostHoverRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [ratingError, setErrorMsg] = useState("");
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  useEffect(() => {
    if (!postContent) {
      setShowRating(false);
    }
  }, [postContent]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let cleanedContent = postContent.replace(/^\s+|\s+$/g, '').replace(/\r?\n|\r/g, ' ');
    if (cleanedContent === '') {
      setErrorMsg("글이 비어있습니다");
      return;
    }
    if (postRating === 0 && postContent) {
      setErrorMsg("별점을 선택하세요");
      return;
    }
    setErrorMsg("");
    if (memberNick === null) {
      alert('로그인이 필요합니다');
      return;
    }
    try {
      await regPost(cleanedContent, postRating, movieId, memberNick);
      const fetchedPosts = await getPostsByMovieId(movieId);
      setPosts(fetchedPosts);
      const averageRating = await getAverageRatingByMovieId(movieId);
      setAverageRating(averageRating || 0);
      setPostContent("");
      setPostRating(0);
      setShowRating(false);
      setIsTextareaFocused(false);

      // CustomEvent 디스패치
      const event = new CustomEvent('refreshMovies');
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Post submission error:", error);
    }
  };

  return (
    <form onSubmit={handlePostSubmit} className={styles.form}>
      <label className={styles.label}>
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className={`${styles.textarea} ${isTextareaFocused ? styles.expandedTextarea : ''}`}
          onFocus={() => {
            setShowRating(true);
            setIsTextareaFocused(true);
          }}
          onBlur={() => {
            if (!postContent) {
              setIsTextareaFocused(false);
              setShowRating(false);
            }
          }}
        />
      </label>
      {showRating && (
        <div className={styles.ratingAndButton}>
          <RatingStars
            rating={postRating}
            hoverRating={postHoverRating}
            onHover={setPostHoverRating}
            onClick={setPostRating}
          />
          {ratingError && <div className={styles.ratingError}>{ratingError}</div>}
          <div className={styles.buttonContainer}>
            <button type='submit' className={styles.button}>
              게시
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default PostForm;
