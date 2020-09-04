import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import css from './ListingPage.css';

const SectionTeachingHour = props => {
  const { publicData } = props;

  const teachingHour = publicData.teachingHour;

  return (
    <div className={css.sectionTeachingHour}>
      <h2 className={css.teachingHourTitle}>
        <FormattedMessage id="ListingPage.teachingHourTitle" />
      </h2>
      <p className={css.teachingHour}>
        <FormattedMessage id="ListingPage.teachingHourFulltime" />
      </p>
    </div>
  );
};

SectionTeachingHour.propTypes = {
  publicData: shape({
    teachingHour: string,
  }).isRequired,
};

export default SectionTeachingHour;
