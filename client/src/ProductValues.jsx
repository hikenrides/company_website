import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from './Typography'; // Ensure this path is correct
import Box from '@mui/material/Box';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

function ProductValues() {
  return (
    <Box
      component="section"
      sx={{ display: 'flex', overflow: 'hidden' }}
    >
      <Container sx={{ mt: 15, mb: 10, display: 'flex', position: 'relative' }}>
        <Box
          component="img"
          src="/images/productCurvyLines.png"
          alt="curvy lines"
          sx={{ pointerEvents: 'none', position: 'absolute', top: -180 }}
        />
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src="/images/productValues1.svg"
                alt="suitcase"
                sx={{ height: 55 }}
              />
              <Typography variant="h6" sx={{ mb: 2 , color: 'white', fontFamily: 'Playfair Display', fontStyle: 'italic' }}>
                Drive.
              </Typography>
              <Typography variant="h5" sx={{ color: 'white', fontFamily: 'Roboto' }}>
                {
                  'Stick to your schedule! Embark on your journey as planned and turn those empty'
                }
                {
                  ', seats into opportunities for new connections.'
                }
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src="/images/productValues2.svg"
                alt="graph"
                sx={{ height: 55 }}
              />
              <Typography variant="h6" sx={{ mb: 2 , color: 'white', fontFamily: 'Playfair Display', fontStyle: 'italic' }}>
                New experiences.
              </Typography>
              <Typography variant="h5" sx={{ color: 'white', fontFamily: 'Roboto' }}>
                {
                  'Experience the joy of travel by sharing your ride with diverse and interesting people. '
                }
                {'Join us and make every commute an adventure!'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src="/images/productValues3.svg"
                alt="clock"
                sx={{ height: 55 }}
              />
              <Typography variant="h6" sx={{ mb: 2 , color: 'white', fontFamily: 'Playfair Display', fontStyle: 'italic'}}>
                Save Money.
              </Typography>
              <Typography variant="h5" sx={{ color: 'white', fontFamily: 'Roboto' }}>
                {'Start saving on fuel, parking, and maintenance'}
                {' costs while contributing to a greener planet.'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProductValues;
