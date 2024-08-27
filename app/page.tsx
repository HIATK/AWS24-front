// app/page.tsx
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
    const {theme} = useTheme();
    return (
        <div className={styles.pageContainer}>
            {theme === 'dark' ? <MatrixRainEffect/> : <RainEffect/>}
            <div className={styles.content}>
                <div className={styles.background}/>
                <div className={styles.logoContainer}>
                    <img src="/logo.png" alt="Logo" className={styles.logo}/>
                </div>
                <div className={styles.indexText}>Now Playing</div>
                <NowPlayingMovies />
                <div className={styles.indexText}>Top Rated</div>
                <TopRatedMovies />
                <div className={styles.indexText}>Top Liked</div>
                <TopLikedMovies />
            </div>
        </div>
    );
}