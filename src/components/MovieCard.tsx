import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  IconButton,
} from "@mui/material";
import { TMDB_IMAGE_URL } from "../utils/constant";
import { MovieIF } from "models/Movie";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

interface MovieCardProps extends MovieIF {
  isInWatchlist?: boolean;
  onToggleWatchlist: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  poster_path,
  release_date,
  vote_average,
  media_type,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (media_type === "movie") navigate(`/movie/${id}`);
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        transition: "transform 0.3s, box-shadow 0.3s",
        position: "relative",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        },
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          component="img"
          height="500"
          image={`${TMDB_IMAGE_URL}${poster_path}`}
          alt={title}
          loading="lazy"
        />
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            {title}
          </Typography>
          {release_date && (
            <Typography variant="body2" color="text.secondary">
              Year: {new Date(release_date).getFullYear()}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Rating: {vote_average}
          </Typography>
        </CardContent>
      </CardActionArea>
      <IconButton
        sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleWatchlist();
        }}
      >
        {isInWatchlist ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
      </IconButton>
      
    </Card>
  );
};

export default MovieCard;
