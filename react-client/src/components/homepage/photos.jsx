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
      const photoList = response.data.map((photo) => {
      photo['width'] = 1;
      photo['heigth'] = 1;
      return photo;
    })
        this.setState({ photos: photoList }, () => {
          console.log(this.state, 'this is state of index');
        });
      })
      .catch((error) => {
        console.error('error getting current user', error);
      });
  }
  render() {
    console.log(this.state);
    // const PHOTO_SET = 
    const gall = <Gallery photos={this.state.photos} />
    return (
      <div>
      {Array.isArray(this.state.photos) ? (gall) : 'There are on past photos to show...'}
      </div>
    );
  }
}
