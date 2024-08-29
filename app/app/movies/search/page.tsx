// app/movies/search/page.tsx
'use client';

import Search from "@/(components)/Search/Search";
import {useTheme} from "@/(components)/DarkModToggle/ThemeContext";
import MatrixRainEffect from "@/(components)/RainEffect/MatrixRainEffect";

const SearchPage = () => {
  const {theme} = useTheme();
  return (
    <div>
      {theme === 'dark' && <MatrixRainEffect/>}
      <Search />
    </div>
  );
};

export default SearchPage;
