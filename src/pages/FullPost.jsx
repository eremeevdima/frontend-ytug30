import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { fetchRemovePost } from "../redux/slices/posts";
import { useDispatch } from "react-redux";
import { fetchAuthMe } from "../redux/slices/auth";
import { selectIsAuth } from "../redux/slices/auth";

export const FullPost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState([]);
  const isAuth = useSelector((state) => selectIsAuth(state));
  const currentUser = useSelector((state) => state.auth.data);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);
  
  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении статьи");
      });
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${day < 10 ? "0" + day : day}.${
      month < 10 ? "0" + month : month
    }.${year} ${hours}:${minutes}`;
  }

  const addComment = (comment) => {
	const newComment = {
	  fullName: currentUser.fullName,
	  avatarUrl: currentUser.avatarUrl,
	  text: comment,
	};
 
	axios
	  .post(`/posts/${id}`, newComment)
	  .then((res) => {
		 const updatedComments = [...comments, res.data.comment];
		 setComments(updatedComments);
	  })
	  .catch((err) => {
		 console.log(err);
		 alert("Ошибка при добавлении комментария");
	  });
 };

  const handleDeletePost = () => {
    dispatch(fetchRemovePost(data._id));
  };

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `${process.env.REACT_APP_API_URL}${data.imageUrl}` : ""}
        user={data.user}
        createdAt={formatDate(data.createdAt)}
        viewsCount={data.viewsCount}
        commentsCount={[...data.comments, ...comments].length }
        tags={data.tags}
        isFullPost
        isDeletable={false}
        onDelete={handleDeletePost}
      >
        <ReactMarkdown children={data.text} />
      </Post>

		<CommentsBlock
        items={[...data.comments, ...comments].map((comment) => ({
			user: {
			  fullName: comment.fullName,
			  avatarUrl: comment.avatarUrl 
			},
			text: comment.text,
		 }))}
		 isLoading={false}
	  >
      
		<Index onSubmit={addComment} />
      </CommentsBlock>
    </>
  );
};
