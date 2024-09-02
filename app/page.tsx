'use client'
import React from 'react';
import NowPlayingMovies from "./(components)/NowplayMovies/NowPlayingMovies";
import styles from "./page.module.css";
import {useTheme} from "@/(components)/DarkModToggle/ThemeContext";
import MatrixRainEffect from "@/(components)/RainEffect/MatrixRainEffect";
import TopLikedMovies from '@/(components)/TopLiked/TopLiked';
import TopRatedMovies from '@/(components)/TopRated/TopRated';
import RainEffect from "@/(components)/RainEffect/RainEffect";

export default function Index() {
    const {theme} = useTheme(); // 현재 테마(예: 'dark', 'light')를 가져옴
    return (
        <div className={styles.pageContainer}>
            {/* 테마에 따라 MatrixRainEffect 또는 RainEffect를 표시 */}
            {theme === 'dark' ? <MatrixRainEffect/> : <RainEffect/>}
            <div className={styles.content}>
                <div className={styles.background}/>
                <div className={styles.logoContainer}>
                    {/* 로고 이미지를 표시 */}
                    <img src="/logo.png" alt="Logo" className={styles.logo}/>
                </div>
                <div className={styles.indexText}>Now Playing</div>
                <NowPlayingMovies /> {/* 현재 상영 중인 영화 목록을 표시 */}
                <div className={styles.indexText}>Top Rated</div>
                <TopRatedMovies /> {/* 최고 평점을 받은 영화 목록을 표시 */}
                <div className={styles.indexText}>Top Liked</div>
                <TopLikedMovies /> {/* 가장 많은 좋아요를 받은 영화 목록을 표시 */}
            </div>
        </div>
    );
}