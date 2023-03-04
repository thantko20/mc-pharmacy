import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Container, Stack, TextField, Typography } from '@mui/material';
import { useRegister } from '../api/register';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-hot-toast';

const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required.' })
    .email('Please provide a valid email.'),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(8, 'Password must have at least 8 characters.'),
  name: z
    .string({ required_error: 'Name is required.' })
    .min(3, 'Name must have at least 3 characters')
    .max(25, 'Name can only have 25 characters at most.'),
});

type TRegisterFormData = z.infer<typeof registerSchema>;

export const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegister();

  const { loginFn } = useAuth();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<TRegisterFormData> = (data) => {
    registerMutation.mutate(data, {
      onSuccess: (data) => {
        loginFn(data.payload);
        toast.success('Successfully registered.');
        navigate('/');
      },
    });
  };

  return (
    <Container maxWidth='sm'>
      <Stack direction='column'>
        <Typography variant='h4' gutterBottom>
          Register
        </Typography>
        <Stack component='form' onSubmit={handleSubmit(onSubmit)} spacing={4}>
          <TextField
            error={!!errors.name?.message}
            id='name'
            {...register('name')}
            label='Name'
            helperText={errors.name?.message}
            type='text'
          />
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
            loading={registerMutation.isLoading}
          >
            Register
          </LoadingButton>
        </Stack>
      </Stack>
    </Container>
  );
};
