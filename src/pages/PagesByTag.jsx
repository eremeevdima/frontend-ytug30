import React from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import Typography from '@mui/material/Typography';
import TagIcon from "@mui/icons-material/Tag";
import Box from '@mui/material/Box';

export const PagesByTag = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const { id } = useParams();

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  console.log(posts);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year} ${hours}:${minutes}`;
  }

  const filteredPostsByTag = React.useMemo(() => {
    if (id && id !== 'all') {
      return posts.items.filter((post) => post.tags.includes(id));
    } else {
      return posts.items;
    }
  }, [posts.items, id]);

  const selectedTag = tags.items.find((tag) => tag._id === id);

  return (
    <>
      <Box display="flex" alignItems="center" marginBottom={2}>
        <TagIcon style={{ marginRight: 8 }} />
        <Typography variant="h5">{id}</Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {filteredPostsByTag.map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={formatDate(obj.createdAt)}
                viewsCount={obj.viewsCount}
                commentsCount={obj.comments.length} 
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
        </Grid>
      </Grid>
    </>
  );
};
