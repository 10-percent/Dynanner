import Gallery from 'react-photo-gallery';
import React from 'react';
import { defaultCipherList } from 'constants';

export default class PhotoGallery extends React.Component {
  render(props) {
    return (
      <Gallery photos={PHOTO_SET} />
    );
  }
}
