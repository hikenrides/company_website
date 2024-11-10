import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-S9GH9V26L8'); // Replace with your Measurement ID
};

export const logPageView = () => {
  ReactGA.send("pageview");
};
