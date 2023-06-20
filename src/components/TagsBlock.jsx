import React, { useState, useEffect } from "react";
import axios from "axios";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import { SideBlock } from "./SideBlock";
import styles from "./SideBlock/SideBlock.module.scss";
import TextField from "@mui/material/TextField";

export const TagsBlock = ({ isLoading = true }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/tags`);
        setAllTags(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTags();
  }, []);

  const filterTags = () => {
	let uniqueTags = [];
 
	if (isLoading) {
	  return [...Array(8)];
	} else {
	  allTags.forEach((name) => {
		 const lowercaseName = name.toLowerCase();
		 if (!uniqueTags.includes(lowercaseName)) {
			uniqueTags.push(lowercaseName);
		 }
	  });
 
	  return uniqueTags.filter((name) =>
		 name.includes(searchQuery.toLowerCase())
	  );
	}
 };

  return (
    <SideBlock>
      <div style={{ display: "flex", alignItems: "center", padding: "10px", width: "100%" }}>
        <TextField
          label="Поиск по тегам"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          maxRows={10}
          multiline
          fullWidth
        />
      </div>
      <div className={styles.container}>
          {filterTags().map((name, i) => (
            <a
              style={{ textDecoration: "none", color: "black" }}
              href={`/tags/${name}`}
              key={i}
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? <Skeleton width={100} /> : <ListItemText primary={name} />}
              </ListItemButton>
            </a>
          ))}
      </div>
    </SideBlock>
  );
};
