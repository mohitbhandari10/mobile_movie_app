import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Link } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";
import { useCallback, useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();

  const {
    data : trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies)



  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allMovies, setAllMovies] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);



  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch:fetchMoviesData,
  // } = useFetch(() => fetchMovies({ query: "" }));
} = useFetch(() => fetchMovies({ query: "", page },[page]));



  useEffect(() => {
    if (movies) {
      // setAllMovies(prev => [...prev, ...movies.results]);
      setAllMovies(prev => page === 1 ? movies.results : [...prev, ...movies.results]);

      setTotalPages(movies.totalPages);
    }
  }, [movies]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);
  
  



  // const loadMoreMovies = () => {
  //   if (page < totalPages && !isLoadingMore) {
  //     setIsLoadingMore(true);
  //     setPage(prev => prev + 1);
  //     fetchMoviesData().finally(() => setIsLoadingMore(false));
  //   }
  // };

  const loadMoreMovies = async () => {
    if (page < totalPages && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
      try {
        await fetchMoviesData(); // This should trigger a refetch
      } finally {
        setIsLoadingMore(false);
      }
    }
  };
  
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#ffffff" />
      </View>
    );
  };

  if (moviesLoading && page === 1) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (moviesError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white">Error loading movies</Text>
      </View>
    );
  }


  // console.log("hello 1")
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 m-20 mb-5 mx-auto" />
        {moviesLoading || trendingLoading? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError? (
          <Text>Error: {moviesError?.message || trendingError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a movie"
            />
            {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
              </View>
            )}
            <>
              
              <FlatList 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className="w-4"/>}
                    className='mb-4 mt-3'
                    data={trendingMovies} 
                    renderItem={({item,index})=>(
                        <TrendingCard movie={item} index={index}/>
                        ) }
                    keyExtractor={(item) => item.movie_id.toString()}
                    >
                          

              </FlatList>

              <Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies</Text>


              <FlatList 
                data={allMovies}
                renderItem={({item}) => (
                    // <Text className="text-white text-sm">{item.title}</Text>
                    <MovieCard
                    {...item} 
                    />
                )}
                
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent:'flex-start',
                  gap:20,
                  paddingRight: 5,
                  marginBottom:10,
                }} 
                className="mt-2 pd-32" 
                scrollEnabled = {false}
                onEndReached={loadMoreMovies}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
