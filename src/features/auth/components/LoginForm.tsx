import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useLogin } from '../api/login';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required.' })
    .email('Please provide a valid email.'),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(8, 'Password must have at least 8 characters.'),
});

export type TLoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const { loginFn } = useAuth();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<TLoginFormData> = (data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        loginFn(data.payload);
        navigate('/');
      },
    });
  };

  return (
    <Container maxWidth='sm'>
      <Stack direction='column'>
        <Typography variant='h4' gutterBottom>
          Login
        </Typography>
        <Stack component='form' onSubmit={handleSubmit(onSubmit)} spacing={4}>
          <TextField
            error={!!errors.email?.message}
            id='email'
            {...register('email')}
            label='Email'
            helperText={errors.email?.message}
            type='email'
          />
          <TextField
            error={!!errors.password?.message}
            id='password'
            {...register('password')}
            label='Password'
            helperText={errors.password?.message}
            type='password'
          />
          <LoadingButton
            type='submit'
            sx={{
              alignSelf: 'flex-end',
            }}
            variant='contained'
            size='large'
            loading={loginMutation.isLoading}
          >
            Login
          </LoadingButton>
        </Stack>
      </Stack>
    </Container>
  );
};
