import React from 'react';
import YouTubePlaylist from './YouTubePlaylist'


import './styles.scss';

const App = () => {
  return (
    <YouTubePlaylist
      width={'85%'}
      height={'400'}
      api_key='AIzaSyDdA6xqqZiqD85me7hwxE496xaWuy1fwis'
      playlist_id='PL9S6xGsoqIBU2V6AZYGlJwZRAFJ3YDreb'
      show_thumbnails
    />
  )
}

export default App;
