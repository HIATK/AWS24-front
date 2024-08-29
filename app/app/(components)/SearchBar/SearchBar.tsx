'use client'

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './SearchBar.module.css';
import { useTheme } from '@/(components)/DarkModToggle/ThemeContext';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
    underlineColor?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    onSearch?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ underlineColor = '#ffffff', onFocus, onBlur, onSearch }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const hiddenButtonRef = useRef<HTMLButtonElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            setSearchTerm('');
            if (onFocus) onFocus();
        } else {
            if (onBlur) onBlur();
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (hiddenButtonRef.current) {
            hiddenButtonRef.current.click();
        }
        if (onSearch) onSearch();
    };

    const handleInputFocus = () => {
        if (onFocus) onFocus();
    };

    const handleInputBlur = () => {
        if (onBlur) onBlur();
    };

    return (
        <div className={`${styles.searchContainer} ${isExpanded ? styles.expanded : ''}`}>
            <button type="button" onClick={handleToggle} className={styles.searchButton}>
                <FaSearch className={`${styles.searchIcon} ${styles[theme]}`} size={24} />
            </button>
            <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder=""
                    className={styles.searchInput}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
                <div className={styles.underline} style={{ backgroundColor: underlineColor }}></div>
            </form>
            <Link href={`/movies/search?keyword=${encodeURIComponent(searchTerm)}`} passHref>
                <button ref={hiddenButtonRef} style={{ display: 'none' }}>Search</button>
            </Link>
        </div>
    );
};

export default SearchBar;