import styled from "styled-components";
import { useQuery } from "react-query";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { IMovie, IgetMovieDetail, getMovieDetail } from "../api";
import { makeImagePath } from "../utils";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;

const Modal = styled(motion.div)`
  position: absolute;
  width: 50vw;
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
  width: 65%;
  color: ${props => props.theme.white.lighter};
  font-size: 36px;
  padding: 10px;
  position: relative;
  top: -60px;
  left: 335px;
`;

const DetailPoster = styled.div<{ bgPhoto: string }>`
  width: 300px;
  height: 450px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  position: fixed;
  top: 360px;
  margin-left: 30px;
`;

const DetailContainer = styled.div`
    width: 65%;
    padding: 10px;
    position: relative;
    top: -60px; 
    left: 335px;
`;

const Info = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-bottom: 10px;
    font-weight: 600;
`;

interface IModal {
    result: IMovie[];
    selectedMovie: {title: string, id: string};
}

function MovieModal({ result, selectedMovie }: IModal) {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const { id } = useParams();
    const movieDetailMatch = useMatch("/movies/:id");
    const { data: detail } = useQuery<IgetMovieDetail>(
        ["movieDetail", id], () => getMovieDetail(id || "")
    );
    const onOverlayClick = () => {
        navigate("/");
    }
    const clickedMovie = movieDetailMatch?.params.id &&
        result.find(movie => String(movie.id) === movieDetailMatch?.params.id || "");
    console.log(detail);
    return (
        <AnimatePresence>
            {movieDetailMatch &&
                <>
                    <Overlay
                        onClick={onOverlayClick}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <Modal
                        layoutId={`${selectedMovie.title}-${selectedMovie.id}`}
                        style={{ top: scrollY.get() + 100 }}
                    >
                        {clickedMovie &&
                            <>
                                <DetailImg bgPhoto={makeImagePath(clickedMovie.backdrop_path)} />
                                <DetailTitle>{clickedMovie.title}</DetailTitle>
                                <DetailPoster bgPhoto={makeImagePath(clickedMovie.poster_path)} />
                                <DetailContainer>
                                    <Info>
                                        <span>{detail?.release_date}</span>
                                        <span>⭐{detail?.vote_average?.toFixed(2)}</span>
                                        <span>{detail?.genres?.map(g => g.name).join(", ")}</span>
                                    </Info>
                                    <div>
                                        <p>{detail?.overview}</p>
                                    </div>
                                </DetailContainer>
                            </>
                        }
                    </Modal>
                </>
            }
        </AnimatePresence>



    );
}

export default MovieModal;