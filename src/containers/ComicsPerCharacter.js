import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import ComicCard from "../components/ComicCard";
import Loader from "../components/Loader";

const ComicsPerCharacter = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const id = params.characterId;

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://marv-back.herokuapp.com/comics/${id}`
      );
      setData(response.data.data.results[0]);
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  console.log(data);
  return isLoading ? (
    <>
      <Loader />
    </>
  ) : (
    <div className="comic-per-character-container">
      <ComicCard data={data} />
      {/* {data &&
        data.map((comic, index) => {
          return <ComicCard key={index} data={comic} />;
        })} */}
    </div>
  );
};

export default ComicsPerCharacter;
