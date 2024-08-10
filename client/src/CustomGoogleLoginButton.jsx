import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const CustomGoogleLoginButton = ({ onSuccess, onFailure }) => {
  return (
    <Box sx={{ justifyContent: 'center', width: '100' }}>
      <GoogleLogin
        onSuccess={onSuccess}
        onFailure={onFailure}
        render={renderProps => (
          <Button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              backgroundColor: '#4285F4',
              color: '#fff',
              fontSize: 16,
              height: 40,
              '&:hover': {
                backgroundColor: '#357ae8',
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              alt="Google logo"
              style={{ marginRight: 8, height: 20 }}
            />
            Sign in with Google
          </Button>
        )}
      />
    </Box>
  );
};

export default CustomGoogleLoginButton;
