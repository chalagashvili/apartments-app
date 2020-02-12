import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import { FormattedMessage } from 'react-intl';
import { history, ROUTE_HOME } from 'app-init/router';
import LanguageSelectContainer from 'ui/common/LanguageSelect/LanguageSelectContainer';

const HorizontalMenu = ({ menuItems, currentRoute, auth: {authenticated} }) => (
  <React.Fragment>
    {!authenticated && <LanguageSelectContainer />}
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={[currentRoute]}
      style={{ lineHeight: '64px' }}
    >
      {
        menuItems.map(item => (
          <Menu.Item
            key={item.path}
            onClick={() => history.push(item.path)}
          >
            <FormattedMessage id={`menu.${item.id}`} />
          </Menu.Item>
        ))
      }
    </Menu>
  </React.Fragment>
);

HorizontalMenu.propTypes = {
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    path: PropTypes.string,
  })),
  currentRoute: PropTypes.string,
  auth: PropTypes.shape({
    authenticated: PropTypes.bool,
  })
};

HorizontalMenu.defaultProps = {
  menuItems: [
    {
      id: 'home',
      path: ROUTE_HOME,
    },
  ],
  currentRoute: 'home',
  auth: {
    authenticated: false,
  }
};

export default HorizontalMenu;
