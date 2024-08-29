// @modal/movies/[movieId]/loading.tsx
import React from 'react';
import styles from './Loading.module.css';

const Loading: React.FC = () => {
  return (
    <div className={styles.modalOverlay}>
      {/* <div className={styles.loader}></div> */}
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
