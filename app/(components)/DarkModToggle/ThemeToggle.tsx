'use client'

import React from 'react';
import styled from 'styled-components';
import { useTheme } from "@/(components)/DarkModToggle/ThemeContext";
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: background-color 0.3s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const IconWrapper = styled.div<{ $theme: 'light' | 'dark' }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: ${props => props.$theme === 'light' ? '#ffd700' : '#ffffff'};
`;

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <ThemeButton onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <IconWrapper $theme={theme}>
                {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
            </IconWrapper>
        </ThemeButton>
    );
};

export default ThemeToggle;