import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import styles from './RatingStars.module.css';

interface RatingStarsProps {
    rating: number;
    hoverRating: number;
    onHover: (rating: number) => void;
    onClick: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, hoverRating, onHover, onClick }) => {
    const renderStars = () => {
        const stars = [];
        const effectiveRating = hoverRating || rating;
        for (let i = 1; i <= 5; i++) {
            if (effectiveRating >= i) {
                stars.push(
                    <FaStar
                        key={i}
                        className={`${styles.star} ${styles.starFilled}`}
                        onMouseEnter={() => onHover(i)}
                        onMouseLeave={() => onHover(0)}
                        onMouseDown={(e) => e.preventDefault()} // 포커스 유지
                        onClick={() => onClick(i)}
                    />
                );
            } else if (effectiveRating >= i - 0.5) {
                stars.push(
                    <FaStarHalfAlt
                        key={i}
                        className={`${styles.star} ${styles.starHalf}`}
                        onMouseEnter={() => onHover(i - 0.5)}
                        onMouseLeave={() => onHover(0)}
                        onMouseDown={(e) => e.preventDefault()} // 포커스 유지
                        onClick={() => onClick(i - 0.5)}
                    />
                );
            } else {
                stars.push(
                    <FaRegStar
                        key={i}
                        className={styles.star}
                        onMouseEnter={() => onHover(i)}
                        onMouseLeave={() => onHover(0)}
                        onMouseDown={(e) => e.preventDefault()} // 포커스 유지
                        onClick={() => onClick(i)}
                    />
                );
            }
        }
        return stars;
    };

    return (
        <div className={styles.starRating} onMouseDown={(e) => e.preventDefault()}> {/* 포커스 유지 */}
            {renderStars()}
        </div>
    );
};

export default RatingStars;
