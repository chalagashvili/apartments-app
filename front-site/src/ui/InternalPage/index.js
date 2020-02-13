import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import MenuContainer from 'ui/common/Menu/MenuContainer';
import SideMenuContainer from 'ui/common/SideMenu/SideMenuContainer';

const { Header, Content, Footer } = Layout;


const InternalPage = ({ className, children }) => (
  <Layout style={{ minHeight: '100vh' }}>
    <SideMenuContainer />
    <Layout className={['layout', 'InternalPage', className].join(' ').trim()}>
      <Header>
        <MenuContainer />
      </Header>
      <Content className="InternalPage__content">
        {children}
      </Content>
      <Footer
        className="footer"
        style={{ textAlign: 'center' }}
      >Toptal Assignment ©2020 Created by Irakli Chalagashvili
      </Footer>
    </Layout>
  </Layout>
);

InternalPage.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

InternalPage.defaultProps = {
  children: null,
  className: '',
};

export default InternalPage;

