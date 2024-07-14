import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from './Typography';
import TextField from './TextField';
import Snackbar from './Snackbar';
import Button from './Button';
import axios from 'axios';

function ProductCTA() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/subscribe', { email });
      if (response.data.success) {
        setOpen(true);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('An error occurred while subscribing.');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container component="section" sx={{ mt: 10, display: 'flex' }}>
      <Grid container>
        <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              bgcolor: 'warning.main',
              py: { xs: 6, md: 8 },
              px: { xs: 2, md: 3 },
            }}
          >
            <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
              <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2.5rem' } }}>
                Receive offers
              </Typography>
              <Typography variant="h5" sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>
                Learn more about Hikenrides
              </Typography>
              <TextField
                noBorder
                placeholder="Your email"
                variant="standard"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: '100%', mt: { xs: 2, md: 3 }, mb: { xs: 1.5, md: 2 }, fontSize: { xs: '0.875rem', md: '1rem' } }}
              />
              <Button
                type="submit"
                color="primary"
                variant="contained"
                sx={{ width: '100%', fontSize: { xs: '0.875rem', md: '1rem' }, py: { xs: 1.5, md: 2 } }}
              >
                Keep me updated
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: { md: 'block', xs: 'none' }, position: 'relative' }}
        >
          <Box
            component="img"
            src="/images/commute.jpg"
            alt="call to action"
            sx={{
              position: 'absolute',
              top: { xs: -20, md: -28 },
              left: { xs: -20, md: -28 },
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: { xs: 300, md: 600 },
            }}
          />
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        closeFunc={handleClose}
        message="We will make sure that you don't miss anything."
      />
    </Container>
  );
}

export default ProductCTA;

