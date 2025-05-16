export const TMDB_CONFIG = {
    BASE_URL : 'https://api.themoviedb.org/3',
    API_KEY : process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers : {
        accept:'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}


// discover/movie
// export const fetchMovies = async ({ query} : {query : string}) => {
//     const endpoint = query
//         ?`${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
//         :`${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

//     const response = await fetch(endpoint,{
//         method:'GET',
//         headers: TMDB_CONFIG.headers
//     })

//     if (!response.ok){
//         // @ts-ignore
//         throw new Error('Failed to fetch movies',response.statusText);
//     }

//     const data = await response.json()
//     return data.results;
// }


// export const fetchMovies = async ({ query }: { query?: string }) => {
//     // Increase the number of results by fetching multiple pages (if API allows)
//     const page = 10; // You can try increasing this if the API allows
//     const includeAdult = false; // Filter out adult content
//     const language = 'en-US'; // Set preferred language
    
//     const endpoint = query
//       ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=${includeAdult}&language=${language}`
//       : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}&total_pages=2&&include_adult=${includeAdult}&language=${language}`;
  
//     const response = await fetch(endpoint, {
//       method: 'GET',
//       headers: TMDB_CONFIG.headers,
//     });
  
//     if (!response.ok) {
//       throw new Error(`Failed to fetch movies: ${response.statusText}`);
//     }
  
//     const data = await response.json();
//     return data.results; // Returns all fetched movies
//   };

export const fetchMovies = async ({
    query,
    page = 1, // Add page parameter
  }: {
    query?: string;
    page?: number;
  }) => {
    const endpoint = query
      ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
      : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
  
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: TMDB_CONFIG.headers,
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }
  
    const data = await response.json();
    return {
      results: data.results,
      totalPages: data.total_pages, // Return total pages for pagination control
      currentPage: data.page,
    };
  };    

export const fetchMoviesDetails = async (movieID: string): Promise<MovieDetails> => {
    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieID}?api_key=${TMDB_CONFIG.API_KEY}`,{
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        });

        if (!response.ok){
            throw new Error('Failed to fetch Movie Details');
        }

        const data = await response.json();

        return data;
        
    }catch (error) {
        console.log(error);
        throw error;
    }

}

// const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer abc.wwe.wwf'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));