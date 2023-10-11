import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from "../api";
import { makeImagePath } from "../utils";
import MovieSlider from "../components/MovieSlider";
import MovieModal from "../components/MovieModal";

const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 200vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 20px;
  width: 50%;
`;

const SliderContianer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 250px;
`;

function Home() {
  const { data: nowPlaying, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: popular } = useQuery<IGetMoviesResult>(
    ["movies", "popular"],
    getPopularMovies
  );
  const { data: topRated } = useQuery<IGetMoviesResult>(
    ["movies", "topRated"],
    getTopRatedMovies
  );
  const { data: upcoming } = useQuery<IGetMoviesResult>(
    ["movies", "upcoming"],
    getUpcomingMovies
  );
  const allMovies = [
    ...(nowPlaying?.results || []),
    ...(popular?.results || []),
    ...(topRated?.results || []),
    ...(upcoming?.results || [])
  ];
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState({ title: '', id: '' });
  const onBoxClick = (title: string, movieId: number) => {
    navigate(`/movies/${movieId}`);
    setSelectedMovie({ title, id: movieId.toString() });
  }

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              nowPlaying?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlaying?.results[0].title}</Title>
            <Overview>{nowPlaying?.results[0].overview}</Overview>
          </Banner>
          <SliderContianer>
            {nowPlaying && <MovieSlider result={nowPlaying?.results} title={"Now Playing"} onBoxClick={onBoxClick} />}
            {popular && <MovieSlider result={popular?.results} title={"Popular"} onBoxClick={onBoxClick} />}
            {topRated && <MovieSlider result={topRated?.results} title={"Top Rated"} onBoxClick={onBoxClick} />}
            {upcoming && <MovieSlider result={upcoming?.results} title={"Upcoming"} onBoxClick={onBoxClick} />}
          </SliderContianer>
          {allMovies && <MovieModal result={allMovies} selectedMovie={selectedMovie}/>}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
