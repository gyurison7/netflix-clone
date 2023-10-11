import styled from "styled-components";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IMovie } from "../api";
import { makeImagePath } from "../utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const H3 = styled.h2`
    font-size: 28px;
    margin: 10px;
`;

const IconLeft = styled.div`
    position: absolute;
    top: 145px;
    left: 10px;
    width: 10px;
    z-index: 2;
`;

const IconRight = styled.div`
    position: absolute;
    top: 145px;
    right: 10px;
    width: 10px;
    z-index: 2;
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

const rowVariants = {
    initial: (decrease: boolean) => ({ x: decrease ? -window.outerWidth + 10 : window.outerWidth - 10 }),
    animate: { x: 0 },
    exit: (decrease: boolean) => ({ x: decrease ? window.outerWidth - 10 : -window.outerWidth + 10 }),
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

interface ISlider {
    result: IMovie[];
    title: string;
    onBoxClick: (title: string, movieId: number) => void;
}

const offset = 6;

function MovieSlider({ result, title, onBoxClick }: ISlider) {
    const [index, setIndex] = useState(0);
    const [exit, setExit] = useState(false); // 빠르게 클릭했을 때 중복 exit되는 현상 방지
    const [decrease, setDecrease] = useState(false);
    const toggleExit = () => setExit((prev) => !prev);
    const slideIndex = (direction: string) => {
        if (result) {
            if (exit) return;
            else setExit(true);
            const totalMovies = result.length;
            const maxIndex = Math.floor(totalMovies / offset);
            if (direction === "decrease") {
                setIndex((prev) => (prev === 0 ? maxIndex - 1 : prev - 1));
                setDecrease(true);
            } else {
                setIndex((prev) => (prev === maxIndex - 1 ? 0 : prev + 1));
                setDecrease(false);
            }
        }
    };

    return (
        <Slider>
            <H3>{title}</H3>
            <AnimatePresence initial={false} onExitComplete={toggleExit} custom={decrease}>
                {" "}
                {/* onExitComplete: exit이 끝났을 때 호출 */}
                <IconLeft onClick={() => slideIndex("decrease")}>
                    <FontAwesomeIcon icon={faChevronLeft} size="2x" color="white" />
                </IconLeft>
                <Row
                    custom={decrease}
                    variants={rowVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={index}
                >
                    {result
                        .slice(offset * index, offset * index + offset)
                        .map((movie) => {
                            return (
                                <Box
                                    layoutId={`${title}-${movie.id}`}
                                    key={`${title}-${movie.id}`}
                                    onClick={() => onBoxClick(title, movie.id)}
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
                            )
                        })}
                </Row>
                <IconRight onClick={() => slideIndex("increase")}>
                    <FontAwesomeIcon icon={faChevronRight} size="2x" color="white" />
                </IconRight>
            </AnimatePresence>
        </Slider>
    )
}

export default MovieSlider;