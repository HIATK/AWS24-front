import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PostList.module.css";
import { PostDetails } from "@/(types)/types";
import { useAuth } from "@/(context)/AuthContext";
import { deletePost, getPostsByMemberNo } from "@/_Service/PostService";
import Image from "next/image";
import { useRouter } from 'next/navigation';

interface PostListProps {
  posts: PostDetails[];
  setPosts: React.Dispatch<React.SetStateAction<PostDetails[]>>; // 부모 컴포넌트로부터 setPosts 받기
  onDeletePost: () => void;
  closeModal: () => void;
}

const PostList: React.FC<PostListProps> = ({
                                             posts,
                                             setPosts,
                                             onDeletePost,
                                             closeModal
                                           }) => {
  const { memberNo } = useAuth();
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [displayedPosts, setDisplayedPosts] = useState<PostDetails[]>([]);
  const [postIndex, setPostIndex] = useState(5);
  const [profileImages, setProfileImages] = useState<{ [key: number]: string}>({});
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const router = useRouter();

  const handleClick = useCallback(async (post: PostDetails) => {
    console.log('포스트멤버닉'+post.memberNick);
    await closeModal();
    setTimeout(() => {
      router.push(`/member/otherProfile?otherNick=${post.memberNick}`);
    }, 100)
  }, [closeModal]);

    //  특정 회원의 프로필 이미지 가져오기
    const fetchProfileImage = useCallback(async (memberNo : number) => {
      try {
        //  해당 서비스 메서드가 있어야 함
        const imageUrl = await getPostsByMemberNo(memberNo);
        setProfileImages(prev => ({ ...prev, [memberNo]: imageUrl}));
      } catch (error) {
        console.error('프로필 이미지 가져오기 실패', error);
      }
    }, []);

  useEffect(() => {
    const initialPosts = posts.slice(0, postIndex);
    setDisplayedPosts(initialPosts);

      //  포스트의 작성자 번호를 기준으로 프로필 이미지 가져오기
    const memberNum = Array.from(new Set(posts.map(post => post.memberNo)));
    memberNum.forEach(memberNo => fetchProfileImage(memberNo));

  }, [posts, postIndex, fetchProfileImage]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMorePosts();
          }
        },
        { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.current.observe(observerRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [displayedPosts]);

  const loadMorePosts = () => {
    const newPosts = posts.slice(postIndex, postIndex + 5);
    setDisplayedPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setPostIndex((prevIndex) => prevIndex + 5);
  };

  const renderStars = (ratingStar: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
          i <= ratingStar ? (
              <FaStar key={i} className={styles.star} />
          ) : (
              <FaRegStar key={i} className={styles.star} />
          )
      );
    }
    return stars;
  };

  const toggleExpand = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };


  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId);
      const updatedPosts = posts.filter((post) => post.postId !== postId);
      setPosts(updatedPosts);
      onDeletePost();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
      <div className={styles.postsList}>
        <AnimatePresence>
          {displayedPosts.map((post) => (
              <motion.div
                  key={post.postId}
                  className={`${styles.post} ${
                      expandedPost === post.postId ? styles.expanded : ""
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
              >
                <div className={styles.postHeader}>
                  {renderStars(post.ratingStar)}
                </div>
                {/* 프로필 이미지 표시*/}
                <div className={styles.profileImage}>
              <Image
                src={profileImages[post.memberNo] || '/profile/basic.png'} // 기본 이미지 로드
                alt={`Post ${post.postId}의 프로필 이미지`}
                className={styles.profileImage}
                layout="responsive" // 필요에 따라 조정
                width={100}
                height={100}
              />
            </div>
                {/* 추가한 부분 end */}
                <button onClick={() => handleClick(post)} className={styles.postNickButton}>{post.memberNick}</button>
                <div
                    className={`${styles.postContent} ${styles.cursorPointer}`}
                    onClick={() => toggleExpand(post.postId)}
                >
                  {expandedPost === post.postId
                      ? post.postContent
                      : post.postContent
                          ? post.postContent.split("\n")[0]
                          : ""}
                </div>
                <div className={styles.postFooter}>
                  <div>{post.regDate}</div>
                  {memberNo === post.memberNo && (
                      <MdDelete
                          onClick={() => handleDeletePost(post.postId)}
                          className={`${styles.deleteButton} ${styles.cursorPointer}`}
                      />
                  )}
                </div>
              </motion.div>
          ))}
        </AnimatePresence>
        <div ref={observerRef} className={styles.observer} />
      </div>
  );
};

export default PostList;