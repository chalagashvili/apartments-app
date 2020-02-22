import 'test/enzyme-init';
import { mapDispatchToProps } from 'ui/login/LoginFormContainer';

jest.mock('state/auth/actions', () => ({
  sendPostLogin: jest.fn().mockReturnValue('sendPostLogin__result'),
}));

describe('LoginFormContainer', () => {
  describe('mapDispatchToProps', () => {
    const dispatchMock = jest.fn(() => new Promise(resolve => resolve('sendPostLogin__result')));
    let props;
    beforeEach(() => {
      props = mapDispatchToProps(dispatchMock, { history: {}, intl: {} });
    });

    it('maps the "onSubmit" prop a sendPostGroup dispatch', () => {
      expect(props.onSubmit).toBeDefined();
      props.onSubmit();
      expect(dispatchMock).toHaveBeenCalledWith('sendPostLogin__result');
    });
  });
});
