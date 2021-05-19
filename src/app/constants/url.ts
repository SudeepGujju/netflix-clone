const API_KEY = "0fe9b7ad2cf8dba677c72e3f1e67fdfc";

const image_base_url = "https://image.tmdb.org/t/p/original/";
const base_url = "https://api.themoviedb.org/3";

const request = {
    fetchTrending : `/trending/all/week?api_key=${API_KEY}&language=en-US&page=2`,
    fetchNetflixOriginals : `/discover/tv?api_key=${API_KEY}&with-networks=213`,
    fetchTopRated : `/movie/top_rated?api_key=${API_KEY}&language=en-US&page=2`,
    fetchActionMovies : `/discover/movie?api_key=${API_KEY}&with_genres=28`,
    fetchComedyMovies : `/discover/movie?api_key=${API_KEY}&with_genres=35`,
    fetchHorrorMovies : `/discover/movie?api_key=${API_KEY}&with_genres=27`,
    fetchRomanceMovies : `/discover/movie?api_key=${API_KEY}&with_genres=10749&page=2`,
    fetchDocumentaries : `/discover/movie?api_key=${API_KEY}&with_genres=99&page=2`,
    fetchMoviesGenres : `/genre/movie/list?api_key=${API_KEY}&language=en-US`,
    fetchTvGenres : `/genre/tv/list?api_key=${API_KEY}&language=en-US`
};

export { base_url, image_base_url, request };
