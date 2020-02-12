import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { history } from 'app-init/router';
import store from 'state/store';
import 'app-init/locale';
import App from 'ui/app/App';
import IntlProviderContainer from 'ui/locale/IntlProviderContainer';
import 'sass/index.scss';
import 'antd/dist/antd.css';

import * as serviceWorker from './serviceWorker';

export default ReactDOM.render(
  <Provider store={store}>
    <IntlProviderContainer>
      <Router history={history}>
        <App />
      </Router>
    </IntlProviderContainer>
  </Provider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
