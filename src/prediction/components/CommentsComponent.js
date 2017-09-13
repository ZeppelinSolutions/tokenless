import React from 'react';
import ReactDisqusComments from 'react-disqus-comments';
import {PATH_PREDICTION, SITE_URL} from "../../constants";

class CommentsComponent extends React.Component {

  shouldComponentUpdate(nextProps) {
    return false;
  }

  render() {
    return (
      <div>
        <ReactDisqusComments
          shortname="tokenless"
          identifier={this.props.address}
          title="Prediction discussion"
          url={SITE_URL + PATH_PREDICTION + '/' + this.props.address}
          category_id=""
          onNewComment={() => {}}/>
      </div>
    );
  }
}

export default CommentsComponent;
