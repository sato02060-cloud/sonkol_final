import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Video.css";
import { API_KEY } from "../API_KAY/api";

const Video = ({ videoId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadVideos = async () => {
      setLoading(true);
      setVideos([]);

      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${videoId}/videos`,
          {
            params: {
              api_key: API_KEY,
              language: "en-US",
            },
          },
        );

        let results = response.data.results || [];

        if (!results.length) {
          const fallback = await axios.get(
            `https://api.themoviedb.org/3/movie/${videoId}/videos`,
            {
              params: {
                api_key: API_KEY,
                language: "ru-RU",
              },
            },
          );

          results = fallback.data.results || [];
        }

        const youtube = results
          .filter((video) => video.site === "YouTube" && video.key)
          .sort((a, b) => {
            const score = (video) =>
              video.type === "Trailer" && video.official
                ? 0
                : video.type === "Trailer"
                  ? 1
                  : video.type === "Teaser"
                    ? 2
                    : 3;

            return score(a) - score(b);
          });

        if (active) setVideos(youtube.slice(0, 3));
      } catch (error) {
        console.error("Trailer error:", error.response?.data || error.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadVideos();

    return () => {
      active = false;
    };
  }, [videoId]);

  if (loading)
    return <div className="video container">Трейлер жүктөлүүдө...</div>;

  if (!videos.length) return null;

  return (
    <div className="video container">
      {videos.map((video) => (
        <div className="video-item" key={video.id}>
          <iframe
            src={`https://www.youtube.com/embed/${video.key}`}
            title={video.name || "Трейлер"}
            allowFullScreen
          />
          <a
            href={`https://www.youtube.com/watch?v=${video.key}`}
            target="_blank"
            rel="noreferrer"
          >
            YouTube'дан көрүү
          </a>
        </div>
      ))}
    </div>
  );
};

export default Video;
