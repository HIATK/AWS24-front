'use client';

import React, { createContext, useState, useContext, useEffect, useCallback, PropsWithChildren } from 'react';
import axios from 'axios';
import { checkAuth as checkAuthService, refreshAccessToken as refreshAccessTokenService } from '@/_Service/MemberService';

interface AuthContextType {
  isLoggedIn: boolean;
  memberNo: number | null;
  memberNick: string | null;
  checkAuth: () => Promise<void>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setMemberNick: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberNick, setMemberNick] = useState<string | null>(null);
  const [memberNo, setMemberNo] = useState<number | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      await refreshAccessTokenService();
      return true;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      return false;
    }
  }, []);

  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      const data = await checkAuthService();
      setIsLoggedIn(data.roles && (data.roles.includes('MEMBER') || data.roles.includes('GUEST')));
      setMemberNo(data.memberNo);
      setMemberNick(data.memberNick);
      setCheckedAuth(true);
      console.log("체크어쓰 200, 사용자 닉네임 : " + data.memberNick);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          console.log("체크어쓰 401");
          setIsLoggedIn(false);
          setMemberNo(null);
          setMemberNick(null);
        } else if (error.response && error.response.status === 403) {
          console.log("체크어쓰 403");
          const retryCheckAuth = await refreshAccessToken();
          if (retryCheckAuth) {
            await checkAuth();
          }
        } else {
          setIsLoggedIn(false);
          setMemberNo(null);
          setMemberNick(null);
          console.log("체크어쓰 에러");
        }
      } else {
        console.error('Failed to check auth:', error);
        setIsLoggedIn(false);
        setMemberNo(null);
        setMemberNick(null);
        console.log("체크어쓰 캐치에러");
      }
      setCheckedAuth(false); // 인증 체크 실패 시 상태 초기화
    }
  }, [refreshAccessToken]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setMemberNo(null);
    setMemberNick(null);
    setCheckedAuth(false); // 로그아웃 시 상태 초기화
  }, []);

  useEffect(() => {
    const authenticate = async () => {
      if (!checkedAuth) {
        console.log("리프레시토큰 요청 실행")
        const refreshResult = await refreshAccessToken();
        if (refreshResult) {
          await checkAuth();
        }
      }
    };
    authenticate();
  }, [checkedAuth, refreshAccessToken, checkAuth]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, memberNick, memberNo, checkAuth, setIsLoggedIn, setMemberNick, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
