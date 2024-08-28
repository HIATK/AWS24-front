// app/movies/search/page.tsx
'use client';

import Search from "@/(components)/Search/Search";
import {useTheme} from "@/(components)/DarkModToggle/ThemeContext";
import MatrixRainEffect from "@/(components)/RainEffect/MatrixRainEffect";
import {Suspense} from "react";

const SearchPage = () => {
  const {theme} = useTheme();
  return (
      <Suspense fallback={<div>Loading...</div>}>

      {theme === 'dark' && <MatrixRainEffect/>}
      <Search />
      </Suspense>

  );
};

export default SearchPage;
