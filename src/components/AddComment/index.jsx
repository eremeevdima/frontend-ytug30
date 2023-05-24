import React from "react";
import { useSelector } from "react-redux";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export const Index = ({ onSubmit }) => {
	const [comment, setComment] = React.useState("");
 
	const handleInputChange = (event) => {
	  setComment(event.target.value);
	};
 
	const handleSubmit = (event) => {
	  event.preventDefault();
	  if (comment.trim() === "") {
		 return;
	  }
	  onSubmit(comment);
	  setComment("");
	};
 
	return (
	  <form onSubmit={handleSubmit} className={styles.root}>
		 <div className={styles.form}>
			<TextField
			  label="Написать комментарий"
			  variant="outlined"
			  maxRows={10}
			  multiline
			  fullWidth
			  value={comment}
			  onChange={handleInputChange}
			/>
			<Button variant="contained" type="submit">
			  Отправить
			</Button>
		 </div>
	  </form>
	);
 };
 