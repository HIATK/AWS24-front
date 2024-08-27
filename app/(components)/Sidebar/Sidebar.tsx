'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CgProfile } from 'react-icons/cg';
import { IoHomeOutline, IoStatsChartOutline } from 'react-icons/io5';
import { BiLink } from 'react-icons/bi';
import { MdLogin, MdLogout } from 'react-icons/md';
import Link from 'next/link';
import { useAuth } from '../../(context)/AuthContext';
import {
    SidebarContainer,
    MenuList,
    MenuItemWrapper,
    MenuLink,
    Icon,
    MenuText,
    HoverText,
    SettingsItemWrapper,
    SearchBarWrapper,
    ThemeToggleWrapper
} from './SidebarStyles';
import ThemeToggle from "@/(components)/DarkModToggle/ThemeToggle";
import { useTheme } from '../DarkModToggle/ThemeContext';
import SearchBar from '@/(components)/SearchBar/SearchBar';
import { logout as logoutService } from '@/_Service/MemberService';

interface MenuItem {
    icon: JSX.Element;
    text: string;
    href: string;
}

const SidebarClient: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { isLoggedIn, logout } = useAuth();
    const { theme } = useTheme();
    const sidebarRef = useRef<HTMLDivElement>(null);

    const menuItems: MenuItem[] = [
        { icon: <CgProfile size={24} />, text: '프로필', href: '/member/profile' },
        { icon: <IoHomeOutline size={24} />, text: '홈으로', href: '/' },
    ];

    const settingsItem: MenuItem = { icon: <MdLogin size={24} />, text: '로그인', href: '/member/login' };
    const settingsItem2: MenuItem = { icon: <MdLogout size={24} />, text: '로그아웃', href: '/member/logout' };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setIsSearchFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        try {
            await logoutService();
            alert('로그아웃 되었습니다');
            logout();
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handleSearchFocus = () => {
        setIsOpen(true);
        setIsSearchFocused(true);
    };

    const handleSearchBlur = () => {
        setIsSearchFocused(false);
    };

    const handleSearch = () => {
        setIsOpen(false);
        setIsSearchFocused(false);
    };

    return (
        <SidebarContainer
            ref={sidebarRef}
            $isOpen={isOpen || isSearchFocused}
            $theme={theme}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => {
                if (!isSearchFocused) {
                    setIsOpen(false);
                }
            }}
        >
            <MenuList>
                <SearchBarWrapper>
                    <SearchBar
                        underlineColor={theme === 'light' ? '#333333' : '#5fbebb'}
                        onFocus={handleSearchFocus}
                        onBlur={handleSearchBlur}
                        onSearch={handleSearch}
                    />
                </SearchBarWrapper>
                {menuItems.map((item, index) => (
                    <MenuItemWrapper key={index} $isOpen={isOpen || isSearchFocused} $theme={theme}>
                        <Link href={item.href}>
                            <MenuLink>
                                <Icon $theme={theme}>{item.icon}</Icon>
                                <MenuText $isOpen={isOpen || isSearchFocused} $theme={theme}>{item.text}</MenuText>
                            </MenuLink>
                        </Link>
                        <HoverText $isOpen={isOpen || isSearchFocused} $theme={theme}>{item.text}</HoverText>
                    </MenuItemWrapper>
                ))}
            </MenuList>
            <ThemeToggleWrapper $isOpen={isOpen || isSearchFocused} $theme={theme}>
                <ThemeToggle />
                <MenuText $isOpen={isOpen || isSearchFocused} $theme={theme}>테마 변경</MenuText>
                <HoverText $isOpen={isOpen || isSearchFocused} $theme={theme}>
                    {theme === 'light' ? '다크모드로 변경' : '라이트모드로 변경'}
                </HoverText>
            </ThemeToggleWrapper>
            <SettingsItemWrapper $isOpen={isOpen || isSearchFocused} $theme={theme}>
                {isLoggedIn ? (
                    <Link href="/logout" onClick={handleLogout}>
                        <MenuLink>
                            <Icon $theme={theme}>{settingsItem2.icon}</Icon>
                            <MenuText $isOpen={isOpen || isSearchFocused} $theme={theme}>{settingsItem2.text}</MenuText>
                        </MenuLink>
                    </Link>
                ) : (
                    <Link href={settingsItem.href}>
                        <MenuLink>
                            <Icon $theme={theme}>{settingsItem.icon}</Icon>
                            <MenuText $isOpen={isOpen || isSearchFocused} $theme={theme}>{settingsItem.text}</MenuText>
                        </MenuLink>
                    </Link>
                )}
                <HoverText $isOpen={isOpen || isSearchFocused} $theme={theme}>{isLoggedIn ? settingsItem2.text : settingsItem.text}</HoverText>
            </SettingsItemWrapper>
        </SidebarContainer>
    );
};

export default SidebarClient;