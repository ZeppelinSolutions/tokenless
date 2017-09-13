import React from 'react';
import {GIPHY_API_KEY} from "../../constants";

class RandomGifComponent extends React.PureComponent {

  constructor() {
    super();

    this.injectGif = this.injectGif.bind(this);
  }

  componentDidMount() {
    this.injectGif();
  }

  injectGif() {

    // Select a tag.
    let tag = this.props.tag;
    if(!tag) {
      const tags = [
        'computers', 'patience', "8bit", 'relax', 'coffee', 'whatever', 'omg',
        'waiting', 'bored', 'boring', 'kitten', 'owl', 'slow', 'wow'
      ];
      const idx = Math.floor(Math.random() * tags.length);
      tag = tags[idx];
    }
    console.log('giphy tag:', tag);

    // Make url request.
    const self = this;
    const request = new XMLHttpRequest();
    request.open('GET', 'https://api.giphy.com/v1/gifs/random?api_key=' + GIPHY_API_KEY + '&tag=' + tag, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        const data = JSON.parse(request.responseText).data;
        self.imgUrl = data.image_url;
        self.forceUpdate();
      }
      else {
        console.log('reached giphy, but API returned an error', request.status);
      }
    };

    request.onerror = function() {
      console.log('connection error');
    };

    request.send();
  }

  render() {
    return (
      <div className="container">
        <div className="row text-center">
          <img
            alt=""
            src={this.imgUrl}
            title=""
            style={{maxWidth: "100%", height: "auto"}}
          >
          </img>
        </div>
      </div>
    );
  }
}

export default RandomGifComponent;