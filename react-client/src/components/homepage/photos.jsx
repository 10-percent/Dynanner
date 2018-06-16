import Gallery from 'react-photo-gallery';
import React from 'react';
import Axios from 'axios';
import { defaultCipherList } from 'constants';

export default class PhotoGallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      photos: ''
    }
  }
  componentWillMount() {
    Axios.get('/api/getImages')
      .then((response) => {
        this.setState({ photos: response.data }, () => {
          console.log(this.state, 'this is state of index');
        });
      })
      .catch((error) => {
        console.error('error getting current user', error);
      });
  }
  render() {
    console.log(this.state);
    // const PHOTO_SET = this.state.photos.map((photo) => {
    //   photo.width = 1;
    //   photo.heigth = 1;
    //   return photo;
    // })
    const PHOTO_SET = [{
      src: 'https://lh3.googleusercontent.com/photos-library/AJZSZuyvoJv3CsUUyu0lFAiW6TTXAR5zoF7dwVzGmNJkzGaQ8GTNZnI76NrC27pDl1BqJH6GDu0Qz4OWRlZ6AXNoqSDnLMZAu_wgT4MDsW1O6-NZ0O3HC5BFeYkCyhdXZwMurN60tYHR7EAO2pMlKMWoXGoy6cd8eLLvCT5plxaNzijhJ5HvkVY8M2zaXv7OdoqVqns3ASgzIaER3ANA1drlFT2-azf7Sa-kcwI8nWrJCvC8yGYEnSzzgOAbzcUeh72XJvbdobceTLw_d-XOmEHNeI6TEtp__0Be6fCojKuU07oZOm12-iHsUFoHSnddJQXRo2nh57LdBPrY8Y6LX25JQiJvanKFnbSmhMwB0uyu_xmynu8aeBaXaUgvTpob8kHmS9_RRvFCTP1xb03YayKfEIgnH-iNPdMS65k86ECcIUmNcHsAcxwQHTHURxZMF9TI2apgZKMy3dFzydbxqfowtxMoeE32Uw4pgCPmqpo86qDBJeuxZdvNBf3rxy3NFj7T7Dnv9C_YI1tvVjK27NvOk95DGmhfU1VyVyGAnaEqLT4pdJT9yUeZUoCESlQB3Q7UyTj07QmcT30egvGCvad0kYeGZbrjpWQVVMNznxlnUeYrQ4gNfRvUDgEZTF6dgP989EroSkmgmbVbYpQ82XyTR4rvFa6y-H0qMl9g2q6gjfh5E7QlMc9YoiMHL-jSqUXUgFG2iNWwo8baaMZ-2_qzSVL-3EPyOkYPd0Kd2vY-aOv8AoQA1ps-n3NCwKgEsMrqVQRFdgLL1wG08A_fUvUHA63DnnyOVCv6PkJJ9symNwXGqPLPXGPCvnPm2yf8HZpqO_5RxV9ncu6OG0QrCQ',
      width: 1,
      heigth: 1
    }]
    const gall = <Gallery photos={this.state.photos} />
    return (
      <div>
      {Array.isArray(this.state.photos) ? (gall) : 'There are on past photos to show...'}
      </div>
    );
  }
}
