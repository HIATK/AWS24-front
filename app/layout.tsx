import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { AuthProvider } from "./(context)/AuthContext";
import React, {useEffect} from "react";
import {ThemeProvider} from "@/(components)/DarkModToggle/ThemeContext";
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] });

const Sidebar = dynamic(() => import('./(components)/Sidebar/Sidebar'), { ssr: false });

export const metadata: Metadata = {
  title: "MovieProject",
  description: "Movie",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {

    useEffect(() => {
        const adElement = document.getElementById("ad-container");
        const handleScroll = () => {
            if (adElement) {
                adElement.style.top = `${window.scrollY + 20}px`; // 스크롤에 따라 광고 위치 변경
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
      <html lang="ko">

      <body>
      <ThemeProvider>
          <AuthProvider>
              <Sidebar/>
              {children}
              {modal}
              <div id="modal-root"></div>
          </AuthProvider>
      </ThemeProvider>

      <div
          id="ad-container"
          style={{
              position: "fixed",   // 화면에 고정
              right: "20px",       // 오른쪽에 위치
              top: "20px",         // 위쪽에서 약간 떨어진 위치
              width: "160px",      // 광고 너비
              height: "600px",     // 광고 높이
          }}
      >
          <ins
              className="kakao_ad_area"
              style={{display: "none"}}
              data-ad-unit="DAN-DzZI3sPmCg6gwdzj"
              data-ad-width="160"
              data-ad-height="600"
          ></ins>
          <Script
              src="//t1.daumcdn.net/kas/static/ba.min.js"
              strategy="beforeInteractive"
              async
          />
      </div>
      </body>
      </html>
    );
}
