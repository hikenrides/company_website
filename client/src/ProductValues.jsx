import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from './Typography'; // Ensure this path is correct
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion'; // Import Framer Motion
import { useMediaQuery, useTheme } from '@mui/material'; // For responsive adjustments

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 4,
};

const cardVariants = {
  hover: { scale: 1.05, boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)' },
  initial: { scale: 1, boxShadow: 'none' },
};

function ProductValues() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Detect small screens

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        py: isSmallScreen ? 5 : 10,
      }}
    >
      {/* Section Heading */}
      <h2 className="text-2xl md:text-4xl font-bold text-gray-700 dark:text-white">
        Why Ride With Us?
      </h2>

      <Container sx={{ mt: 8, display: 'flex', position: 'relative' }}>
        <Grid container spacing={isSmallScreen ? 3 : 5}>
          {/* Card 1 */}
          <Grid item xs={12} md={4}>
            <motion.div
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: isSmallScreen ? 3 : 5,
                  borderRadius: 5,
                  background: 'linear-gradient(to right, #4CAF50, #81C784)',
                }}
              >
                <Box sx={item}>
                  <Box
                    component="img"
                    src="/images/productValues3.svg"
                    alt="clock"
                    sx={{ height: isSmallScreen ? 50 : 70 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 2,
                      color: 'white',
                      fontFamily: 'Playfair Display',
                      fontStyle: 'italic',
                      fontSize: isSmallScreen ? '1rem' : '1.25rem',
                    }}
                  >
                    Save Money.
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      textAlign: 'center',
                      mt: 2,
                      fontFamily: 'Roboto',
                      fontSize: isSmallScreen ? '0.875rem' : '1.125rem',
                    }}
                  >
                    Start saving on fuel, parking, and maintenance costs while contributing to a greener planet.
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Card 2 */}
          <Grid item xs={12} md={4}>
            <motion.div
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: isSmallScreen ? 3 : 5,
                  borderRadius: 5,
                  background: 'linear-gradient(to right, #1E88E5, #64B5F6)',
                }}
              >
                <Box sx={item}>
                  <Box
                    component="img"
                    src="/images/productValues1.svg"
                    alt="suitcase"
                    sx={{ height: isSmallScreen ? 50 : 70 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 2,
                      color: 'white',
                      fontFamily: 'Playfair Display',
                      fontStyle: 'italic',
                      fontSize: isSmallScreen ? '1rem' : '1.25rem',
                    }}
                  >
                    Drive.
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      textAlign: 'center',
                      mt: 2,
                      fontFamily: 'Roboto',
                      fontSize: isSmallScreen ? '0.875rem' : '1.125rem',
                    }}
                  >
                    Stick to your schedule! Embark on your journey as planned and turn those empty seats into opportunities for new connections.
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Card 3 */}
          <Grid item xs={12} md={4}>
            <motion.div
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: isSmallScreen ? 3 : 5,
                  borderRadius: 5,
                  background: 'linear-gradient(to right, #FF7043, #FF8A65)',
                }}
              >
                <Box sx={item}>
                  <Box
                    component="img"
                    src="/images/productValues2.svg"
                    alt="graph"
                    sx={{ height: isSmallScreen ? 50 : 70 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 2,
                      color: 'white',
                      fontFamily: 'Playfair Display',
                      fontStyle: 'italic',
                      fontSize: isSmallScreen ? '1rem' : '1.25rem',
                    }}
                  >
                    New Experiences.
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      textAlign: 'center',
                      mt: 2,
                      fontFamily: 'Roboto',
                      fontSize: isSmallScreen ? '0.875rem' : '1.125rem',
                    }}
                  >
                    Experience the joy of travel by sharing your ride with diverse and interesting people. Join us and make every commute an adventure!
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProductValues;
