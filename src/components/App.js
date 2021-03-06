import React from 'react';
import Header from './Header';
import MobileNavigationComponent from './MobileNavigationComponent';
import FooterComponent from './FooterComponent';

const App = ({ children }) => (
  <div className="g-wrap">
    <div className="outer-bg">
      <div className="g-wrapper">
        <div className="g-wrapper_i">
          <Header />
          <div className="g-main">
            {children || 'Welcome to React Starterify'}
          </div>
        </div>
      </div>
    </div>
    <MobileNavigationComponent />
    <div className="pm"></div>
    <FooterComponent />
  </div>
);

App.propTypes = { 
  children: React.PropTypes.object 
};

export default App;
