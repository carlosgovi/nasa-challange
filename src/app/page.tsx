"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Box,
  FormControl,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";

import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { Header } from "./components/header";
import { fetchAPI } from "../../service/api";
import { Triangle } from "react-loader-spinner";
import { useLocalStorageArray } from "../../service/hooks";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [cameras, setCameras] = useState([]);
  const [photos, setPhotos]: any = useState([]);
  const [Rovers, setRovers] = useState("curiosity");
  const [cameraSelected, setCameraSelected] = useState("");

  const [items, setItems] = useLocalStorageArray("items");

  const fetchMorePhotos = async () => {
    const nextPage: number = currentPage + 1;
    const newData = await fetchAPI({ page: nextPage, rovers: Rovers });

    setPhotos([...photos, ...newData?.photos]);
    setCurrentPage(nextPage);
  };

  const handleScroll = () => {
    const isNearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

    if (isNearBottom) {
      fetchMorePhotos();
    }
  };
  const handleChangeRovers = (event: SelectChangeEvent) => {
    setRovers(event.target.value as string);
    setCurrentPage(1);
    setCameraSelected("");
  };
  const handleChangeCamera = (event: SelectChangeEvent) => {
    setCameraSelected(event.target.value as string);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAPI({ page: 1, rovers: Rovers });
      setPhotos(data?.photos || []);

      const arrayCamaras =
        data?.photos.map((item: any) => {
          return item.camera.name;
        }) || [];
      const uniqueArray: any = Array.from(new Set(arrayCamaras));
      setCameras(uniqueArray);
      setIsLoading(false);
    };
    fetchData();
  }, [Rovers]);

  return (
    <div>
      <Header />
      <Box sx={{ minWidth: 120, backgroundColor: "white" }}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Rovers</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={Rovers}
            label="Rovers"
            onChange={handleChangeRovers}
          >
            <MenuItem value="curiosity">Curiosity</MenuItem>
            <MenuItem value="opportunity">Opportunity</MenuItem>
            <MenuItem value="spirit">Spirit</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-camaras">Cameras</InputLabel>
          <Select
            labelId="demo-simple-select-camaras"
            id="demo-simple-select-camaras"
            value={"all" === cameraSelected ? "" : cameraSelected}
            label="Cameras"
            onChange={handleChangeCamera}
          >
            {cameras?.map((item: any) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <div>
        {isLoading ? (
          <Triangle
            height="200"
            width="200"
            color="#ffffffb8"
            ariaLabel="triangle-loading"
            wrapperStyle={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "20%",
            }}
            visible={true}
          />
        ) : (
          <ImageList variant="masonry" cols={3} gap={8}>
            {cameraSelected
              ? photos
                  ?.filter((item: any) => item.camera.name === cameraSelected)
                  .map((item: any) => {
                    return (
                      <ImageListItem key={item.id}>
                        <Image
                          src={`${item.img_src}?w=248&fit=crop&auto=format`}
                          alt={item.id}
                          layout="responsive"
                          width={248}
                          height={160}
                        />

                        <ImageListItemBar
                          title={item.rover.name}
                          subtitle={item.camera.full_name}
                          actionIcon={
                            <IconButton
                              sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                              aria-label={`info about ${item.rover.name}`}
                            >
                              <StarOutlineIcon />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    );
                  })
              : photos?.map((item: any) => {
                  return (
                    <ImageListItem key={item.id}>
                      <Image
                        src={`${item.img_src}?w=248&fit=crop&auto=format`}
                        alt={item.id}
                        loading="lazy"
                        layout="responsive"
                        width={248}
                        height={160}
                      />

                      <ImageListItemBar
                        title={item.rover.name}
                        subtitle={item.camera.full_name}
                        actionIcon={
                          <IconButton
                            sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            onClick={() => {
                              setItems([...items, item.id]);
                            }}
                          >
                            {items?.includes(item.id) ? (
                              <StarIcon />
                            ) : (
                              <StarOutlineIcon />
                            )}
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  );
                })}
          </ImageList>
        )}
      </div>
    </div>
  );
}
