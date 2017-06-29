import React from 'react';
import { getPosts, getPostsNext, getPostsByCategory } from '../actions/posts';
import PostItem from './Posts/Item';
import { connect, store } from 'react-redux';
import InfiniteScroll from './Scroller/infinityScroll';
import PropTypes from 'prop-types';
import { getStore } from '../store/configureStore';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      hasMore: true,
      offset: null
    };

    this.store = getStore();
    this.outputUpdate();
  }

  outputUpdate() {
    this.unsubscribe = this.store.subscribe(() => {
      this.resetPosts(this.store.getState().search.value);
    });
  }

  componentDidMount() {
    this.resetPosts();
  }

  resetPosts(searchValue) {
    this.setState({posts: [], offset: null});

    if (!searchValue) {
      this.setPostsNext();
    } else {
      this.setPostsByCategory(searchValue);
    }
  }

  setPostsByCategory(searchValue) {
    let _this = this;
    getPostsByCategory(searchValue).then((response) => {
      _this.setState({posts: response.results, offset: response.offset});
    });
  }

  setPostsNext() {
    let _this = this;
    getPostsNext().then((response) => {
      _this.setState({posts: response.results, offset: response.offset});
    });
  }

  fetchData() {
    if (this.props.search.value) {
      this.fetchPostsByCategory();
    } else {
      this.fetchPostsNext();
    }
  }

  fetchPostsByCategory() {
    let _this = this;
    let search = this.props.search.value;
    getPostsByCategory(search, this.state.offset).then((response) => {
      this.state.posts.pop();
      let newPosts = this.state.posts.concat(response.results);
      if (response.results.lenght < 20) {
        _this.setState({posts: newPosts, offset: response.offset, hasMore: false});
      } else {
        _this.setState({posts: newPosts, offset: response.offset});
      }
    });
  }

  fetchPostsNext() {
    let _this = this;
    getPostsNext(this.state.offset).then((response) => {
      this.state.posts.pop();
      let newPosts = this.state.posts.concat(response.results);
      if (response.results.lenght < 20) {
        _this.setState({posts: newPosts, offset: response.offset, hasMore: false});
      } else {
        _this.setState({posts: newPosts, offset: response.offset});
      }
    });
  }

  refresh() {
    console.log("refresh");
  }

  render() {
    let items = [];
    let _this = this;

    this.state.posts.map((post, index) => {
      items.push(<PostItem item={post} items={_this.state.posts} index={index}/>);
    });

    return (
      <div className="container" id="all-posts">
        <InfiniteScroll
          refreshFunction={this.refresh}
          next={this.fetchData.bind(this)}
          hasMore={this.state.hasMore}
          loader={<div className='loading-block'><br /><h4>Loading...</h4></div>}
          endMessage={
            <p style={{textAlign: 'center'}}>
              <b>Yay! You have seen it all</b>
            </p>
          }>
          {items}
        </InfiniteScroll>
      </div>
    );
  }
}

Home.propTypes = {
  search: PropTypes.object.isRequired
};

Home.contextTypes = {
  store: React.PropTypes.object
};

const mapStateToProps = (state, props) => {
  return {
    localization: state.localization,
    search: state.search
  };
};

export default connect(mapStateToProps)(Home);
