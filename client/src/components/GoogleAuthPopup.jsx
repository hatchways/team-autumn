import React from 'react';
import GoogleButton from 'react-google-button';

import DialogPopup from './DialogPopup';

const GoogleButtonDetail = (
  <GoogleButton
    onClick={() => {
      fetch('/gmail_oauth_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.url) {
            window.location.href = res.url;
          } else {
            console.log('No url returned', res);
          }
        })
        .catch((err) => {
          console.log('Bad request', err);
        });
    }}
  />
);

const GoogleAuthPopup = () => (
  <DialogPopup
    actionItem={GoogleButtonDetail}
    title="Authenticate with Google"
    bodyText="Authenticate with Google to access all of Mailsender's features"
    buttonText="Skip"
    ariaLabeledBy="google-auth-button"
    ariaDescribedBy="authenticate with google"
  />
);

export default GoogleAuthPopup;
