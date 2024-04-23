import axios from 'axios';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

// Google Geocoding API response type
type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS';
};

// declare google object to avoid typescript error, as google is not a module
declare var google: any;

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  // send this to Google's API
  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${process.env.GOOGLE_API_KEY}`
    )
    .then((response) => {
      if (response.data.status !== 'OK')
        throw new Error('Could not fetch location!');

      const { lat, lng } = response.data.results[0].geometry.location;

      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat, lng },
        zoom: 16,
      });

      new google.maps.Marker({
        position: { lat, lng },
        map,
      });
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener('submit', searchAddressHandler);
