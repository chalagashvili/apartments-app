import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import MenuContainer from 'ui/menu/MenuContainer';

const { Header, Content, Footer } = Layout;


const InternalPage = ({ className, children, menuItems }) => (
  <Layout className={['layout', 'InternalPage', className].join(' ').trim()}>
    <Header>
      <div className="logo" />
      
      <MenuContainer menuItems={menuItems} />
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
);

InternalPage.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  menuItems: PropTypes.arrayOf(PropTypes.shape({})),
};

InternalPage.defaultProps = {
  children: null,
  className: '',
  menuItems: undefined,
};

export default InternalPage;

