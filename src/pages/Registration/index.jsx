import React, { useState, useRef } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import styles from './Login.module.scss';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../../axios';


export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {	 
	const formDataWithImage = {
	  ...values,
	  avatarUrl,
	};
	
	const data = await dispatch(fetchRegister(formDataWithImage));
    if (!data.payload) {
      return alert('Не удалось зарегистрироваться!');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  const handleAvatarChange = async(event) => {
	try {	
		const formData = new FormData();
		const file = event.target.files[0];
		formData.append('avatar', file);
		const { data } = await axios.post('/uploadAvatar', formData);
		setAvatarUrl(data.url);
	} catch(err) {
		console.warn(err);
		alert('Ошибка при загрузке файла!');
	}
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <label htmlFor="avatar-input">
          <Avatar sx={{ width: 100, height: 100 }} src={ `http://localhost:4444${avatarUrl}`} />
        </label>
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          hidden
          onChange={handleAvatarChange}
          ref={fileInputRef}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Укажите полное имя' })}
          className={styles.field}
          label="Полное имя"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
			 {...register('email', { required: 'Укажите почту' })}
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Укажите пароль' })}
          className={styles.field}
          label="Пароль"
          fullWidth
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};


