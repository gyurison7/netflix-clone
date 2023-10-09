import { useQuery } from "react-query";
import { IGetMoviesResult, IgetMovieDetail, getMovieDetail, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

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
  font-size: 28px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div) <{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  height: 200px;
  color: black;
  font-size: 28px;
  cursor:pointer;

  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${props => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    font-size: 18px;
    color: white;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;

const MovieDetail = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  background-color:${props => props.theme.black.lighter};
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
`;

const DetailImg = styled.div<{ bgPhoto: string }>`
  width: 100%;
  height: 400px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
`;

const DetailTitle = styled.h3`
  color:${props => props.theme.white.lighter};
  padding: 10px;
  font-size: 36px;
  position: relative;
  top: -60px;
`;

const DetailOverview = styled.p`
  color:${props => props.theme.white.lighter};
  top: -60px;
  padding: 10px;
`;
const rowVariants = {
  initial: { x: window.outerWidth - 10 },
  animate: { x: 0 },
  exit: { x: -window.outerWidth + 10 },
};

const baxVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -30,
    transition: { type: "tween", delay: 0.5, duration: 0.3 }
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { type: "tween", delay: 0.5, duration: 0.3 }
  },
}
const offset = 6;

const mainMovieIndex = 16;

function Home() {
  const navigate = useNavigate();
  const movieDetailMatch = useMatch("/movies/:id");
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: movieDetail } = useQuery<IgetMovieDetail>(
    ["movieDetail", movieDetailMatch?.params.id],
    () => getMovieDetail(movieDetailMatch?.params.id || "")
  );
  console.log(movieDetail);
  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState(false); // 빠르게 클릭했을 때 중복 exit되는 현상 방지
  const increaseIndex = () => {
    if (data) {
      if (exit) return;
      else setExit(true);
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset);
      setIndex((prev) => (prev === maxIndex - 1 ? 0 : prev + 1));
    }
  };
  const toggleExit = () => setExit((prev) => !prev);
  const onBoxClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  }
  const onOverlayClick = () => {
    navigate("/");
  }
  const clickedMovie = movieDetailMatch?.params.id &&
    data?.results.find(movie => String(movie.id) === movieDetailMatch?.params.id || "");

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(
              data?.results[mainMovieIndex].backdrop_path || ""
            )}
          >
            <Title>{data?.results[mainMovieIndex].title}</Title>
            <Overview>{data?.results[mainMovieIndex].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleExit}>
              {" "}
              {/* onExitComplete: exit이 끝났을 때 호출 */}
              <Row
                variants={rowVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id.toString()}
                      key={movie.id}
                      onClick={() => onBoxClick(movie.id)}
                      variants={baxVariants}
                      initial="initial"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.poster_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {movieDetailMatch &&
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <MovieDetail
                  layoutId={movieDetailMatch.params.id}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie &&
                    <>
                      <DetailImg bgPhoto={makeImagePath(clickedMovie.backdrop_path)} />
                      <DetailTitle>{clickedMovie.title}</DetailTitle>
                      <DetailOverview>{clickedMovie.overview}</DetailOverview>
                    </>
                  }
                </MovieDetail>
              </>
            }
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
