import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FaMale, FaFemale } from 'react-icons/fa';

import css from './ListingPage.css';

const SectionGender = props => {
  const { publicData } = props;

  const gender = publicData.gender;

  return (
    <div className={css.sectionGender}>
      <h2 className={css.genderTitle}>
        <FormattedMessage id="ListingPage.genderTitle" />
      </h2>
      <p className={css.gender}>
        {gender === 'male' ? <FaMale /> : <FaFemale />}
        {gender}
      </p>
    </div>
  );
};

SectionGender.propTypes = {
  publicData: shape({
    gender: string,
  }).isRequired,
};

export default SectionGender;
