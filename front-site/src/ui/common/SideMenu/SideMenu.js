import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Layout, Menu, Icon } from 'antd';
import { clientRoutes, realtorRoutes, adminRoutes } from 'utils/const';

const { Sider } = Layout;

class SideMenu extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    const { auth, intl, currentRoute } = this.props;
    let routes = [];
    routes = clientRoutes;
    // return;
    // switch (auth.role) {
    //   case 'client':
    //     routes = clientRoutes;
    //     break;
    //   case 'realtor':
    //     routes = realtorRoutes;
    //     break;
    //   case 'admin':
    //     routes = adminRoutes;
    //     break;
    //   default:
    //     console.error('DID NOT HAVE TO COME HERE...', auth);
    //     routes = clientRoutes;
    //     break;
    // }
    return (

      <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
        <div className="logo">Logo</div>
        <Menu theme="dark" defaultSelectedKeys={[currentRoute]} mode="inline">
          {
            routes.map(route => (
              <Menu.Item key={route.path}>
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
};

SideMenu.defaultProps = {
  auth: {
    authenticated: false,
    role: 'client',
  },
};

export default injectIntl(SideMenu);
