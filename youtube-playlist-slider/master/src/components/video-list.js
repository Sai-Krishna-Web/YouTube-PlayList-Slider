import React from 'react';
import $ from 'jquery';
const dotdotdot = require('../utils/dotdotdot')($);
import {equalVideoList, youTubeFetch} from '../utils';
import {Popover, OverlayTrigger} from 'react-bootstrap';
import SearchBar from './search-bar';
import Slider from './NetflixSlider';

let is_mounted = false;

class VideoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      master_video_list : this.props.initial_video_list,
      truncated_list : [],
      filtered_video_list : this.props.initial_video_list,
      filter_applied : false,
      fetching_page : false,
      next_page_token : this.props.next_page_token,
      inner_video_list_container_height : this.props.height ? (this.props.small_screen ? 160 : this.props.height - 60) : 160
    }

    this.initDotdotdot = this.initDotdotdot.bind(this);
    this.handleUpdateFilteredVideos = this.handleUpdateFilteredVideos.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  initDotdotdot() {
    this.state.filtered_video_list.forEach(v => {
      $(`#${v.id}`).dotdotdot({
        ellipsis : '...',
        wrap : 'letter',
        height : 35,
        watch : true,
        tolerance : 0,
        callback : (is_trucated) => {
          const list = this.state.truncated_list;
          if(is_mounted) {
            this.setState({truncated_list : is_trucated ? [...list, v.id] : list.filter(e => e != v.id)});
          }
        }
      });
    });
  }

  handleUpdateFilteredVideos(videos, filter_applied) {
    this.state.master_video_list.forEach(v => {$(`#${v.id}`).trigger('destroy')});
    if(is_mounted) {
      this.setState({filtered_video_list : videos, filter_applied}, this.initDotdotdot);
    }
  }

  handleScroll(e) {
    if(!this.state.fetching_page && this.state.next_page_token != null && !this.state.filter_applied) {
      const { scrollHeight, scrollTop } = e.target;
      const { clientHeight } = $('.inner-video-list-container')[0];

      if(scrollHeight - scrollTop < clientHeight + 600) {
        const { api_key, playlist_id } = this.props;
        this.setState({fetching_page : true});
        youTubeFetch(playlist_id, api_key, this.state.next_page_token)
        .then(result => {
          if(is_mounted) {
            const {master_video_list} = this.state;
            master_video_list.forEach(v => {$(`#${v.id}`) ? $(`#${v.id}`).trigger('destroy') : null});
            this.setState({
              next_page_token : result.nextPageToken,
              master_video_list : [...master_video_list, ...result.items],
              filtered_video_list : [...master_video_list, ...result.items],
              fetching_page : false
            }, this.initDotdotdot);
          }
        })
        .catch(e => {console.log('ERROR IN SCROLL HANDLER : ', e)})
      }
    }
  }



  componentDidUpdate(prev_props) {
    if(prev_props.small_screen != this.props.small_screen) {
      this.state.master_video_list.forEach(v => {$(`#${v.id}`).trigger('destroy')});

      if(is_mounted) {
        this.initDotdotdot();
        this.setState({
          inner_video_list_container_height : this.props.small_screen ? 160 : this.props.height - 60
        });
      }
    }
  }

  componentWillUnmount() {
    is_mounted = false;
    $('.inner-video-list-container').off('scroll', this.handleScroll);
  }

  render() {
    const {handleChange, show_thumbnails, current_video_id} = this.props;

    return (
      <div>

        
        <Slider>
                  {this.state.filtered_video_list.map(v => (
                    <Slider.Item movie={v} onClick={() => {handleChange(videoId)}} key={v.id}>item1</Slider.Item>
                  ))}
        </Slider>
        </div>
     
    )
  }
}

export default VideoList;
