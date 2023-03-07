import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TMedicine } from '@/features/medicines/types';
import { useCart } from '@/features/orders/components/CartProvider';

export const MedicineCard = ({ medicine }: { medicine: TMedicine }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <Card elevation={4}>
      <CardActionArea onClick={() => navigate(`/medicines/${medicine._id}`)}>
        <CardMedia
          sx={{ height: 140 }}
          image={medicine.pictureUrls[0]}
          title={medicine.name}
        />
        <CardContent>
          <Typography
            noWrap
            variant='h5'
            sx={{
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {medicine.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Typography fontWeight={600}>
          {medicine.price.toLocaleString()} MMK
        </Typography>
        <Button
          size='small'
          variant='contained'
          sx={{
            ml: '1rem',
          }}
          onClick={() => addToCart({ ...medicine })}
        >
          Add To Cart
        </Button>
      </CardActions>
    </Card>
  );
};
