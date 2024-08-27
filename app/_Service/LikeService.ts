import axios from 'axios';

export const fetchLikeStatus = async (memberNo: number, movieId: number) => {
    try {
        const response = await axios.get('/api/likes/status', {
            params: {
                memberNo,
                movieId,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching like status:", error);
        throw error;
    }
};

export const fetchLikeCounts = async (movieId: number) => {
    try {
        const response = await axios.get('/api/likes/likesMovie', {
            params: {
                movieId: movieId
            }
        });
        return response.data;
    } catch (error) {
        console.error("like 가져오기 from 영화 실패");
        throw error;
    }
};


export const updateLikeStatus = async (memberNo: number, movieId: number, liked: boolean) => {
    try {
        await axios.post('/api/likes/update', {
            memberNo,
            movieId,
            liked,
        });
    } catch (error) {
        console.error("Error updating like status:", error);
        throw error;
    }
};

