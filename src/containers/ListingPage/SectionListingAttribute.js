import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.css';

const SectionListingAttribute = props => {
  const { options, publicData, type } = props;
  if (!publicData) {
    return null;
  }

  const selectedOptions = publicData && publicData[type] ? publicData[type] : [];

  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id={`ListingPage.${type}Title`} />
      </h2>
      <PropertyGroup
        id={`ListingPage.${type}`}
        options={options}
        selectedOptions={selectedOptions}
        twoColumns={true}
      />
    </div>
  );
};

export default SectionListingAttribute;
