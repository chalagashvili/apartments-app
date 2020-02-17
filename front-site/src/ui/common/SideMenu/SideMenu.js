import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Layout, Menu, Icon } from 'antd';
import { clientRoutes, realtorRoutes, adminRoutes, ClientOnly, RealtorOnly, AdminOnly } from 'utils/const';
import { ROUTE_LOGOUT } from 'app-init/router';

const { Sider } = Layout;

class SideMenu extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    const {
      auth, intl, currentRoute, history,
    } = this.props;
    if (!auth || !auth.authenticated) return null;
    let routes = [];
    routes = clientRoutes;
    switch (auth.role) {
      case ClientOnly:
        routes = clientRoutes;
        break;
      case RealtorOnly:
        routes = realtorRoutes;
        break;
      case AdminOnly:
        routes = adminRoutes;
        break;
      default:
        routes = [];
        // eslint-disable-next-line no-console
        console.error('You shall not pass... (with Gendalf\'s voice)');
        history.push(ROUTE_LOGOUT);
        break;
    }
    return (
      <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
        <div className="logo">Logo</div>
        <Menu theme="dark" defaultSelectedKeys={[currentRoute]} mode="inline">
          {
            routes.map(route => (
              <Menu.Item key={route.path} onClick={() => history.push(route.path)}>
                <Icon type={route.icon} />
                <span>
                  {intl.formatMessage({ id: `menu.${route.id}` })}
                </span>
              </Menu.Item>
            ))
          }
        </Menu>
      </Sider>
    );
  }
}

SideMenu.propTypes = {
  auth: PropTypes.shape({
    authenticated: PropTypes.bool,
    role: PropTypes.string,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  currentRoute: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

SideMenu.defaultProps = {
  auth: {
    authenticated: false,
    role: 'client',
  },
};

export default injectIntl(SideMenu);
