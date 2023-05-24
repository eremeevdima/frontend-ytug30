import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.auth.data);
	const { posts, tags } = useSelector((state) => state.posts);
	const [selectedTab, setSelectedTab] = React.useState(0);

	const isPostsLoading = posts.status === 'loading';
	const isTagsLoading = tags.status === 'loading';

	React.useEffect(() => {
		dispatch(fetchPosts());
		dispatch(fetchTags());
	}, []);

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
	 
	 const sortByPopularity = (postA, postB) => {
		return postB.viewsCount - postA.viewsCount;
	 };
  
	 const sortByDate = (postA, postB) => {
		return new Date(postB.createdAt) - new Date(postA.createdAt);
	 };
  
	 const filteredPosts = React.useMemo(() => {
		if (selectedTab === 0) {
		  return isPostsLoading ? [] : posts.items.slice().sort(sortByDate);
		} else if (selectedTab === 1) {
		  return isPostsLoading ? [] : posts.items.slice().sort(sortByPopularity);
		} else {
		  return [];
		}
	 }, [selectedTab, isPostsLoading, posts.items]);

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {filteredPosts.map((obj, index) => 
				isPostsLoading ? (<Post key={index} isLoading={true} />)
				: (<Post 
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
              user={obj.user}
              createdAt={formatDate(obj.createdAt)}
              viewsCount={obj.viewsCount}
              commentsCount={obj.comments.length} 
              tags={obj.tags}
              isEditable={userData?._id === obj.user._id}
            />)
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
        </Grid>
      </Grid>
    </>
  );
};
