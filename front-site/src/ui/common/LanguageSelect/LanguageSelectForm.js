import React from 'react';
import PropTypes from 'prop-types';

import en from 'ui/common/LanguageSelect/en.svg';
import hr from 'ui/common/LanguageSelect/hr.svg';

const LanguageSelect = ({ language, setLanguage }) => (
  <div className="LanguageSelect">
    <span
      className="LanguageSelect__button"
      role="button"
      tabIndex={0}
      onClick={() => setLanguage('en')}
      onKeyDown={() => setLanguage('en')}
    >
      <img
        src={en}

        className={`LanguageSelect__icon ${language === 'en' && 'LanguageSelect__icon--active'}`}
        alt="english icon"
      />
    </span>
    <span
      className="LanguageSelect__button"
      role="button"
      tabIndex={-1}
      onClick={() => setLanguage('hr')}
      onKeyDown={() => setLanguage('hr')}
    >
      <img
        src={hr}

        className={`LanguageSelect__icon ${language === 'hr' && 'LanguageSelect__icon--active'}`}
        alt="croation icon"
      />
    </span>
  </div>
);

LanguageSelect.propTypes = {
  language: PropTypes.string.isRequired,
  setLanguage: PropTypes.func.isRequired,
};

export default LanguageSelect;
