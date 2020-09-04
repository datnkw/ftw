import React from 'react';
import { FormattedMessage, injectIntl } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.css';

const SectionListingAttribute = props => {
  const { options, publicData, type, intl } = props;
  if (!publicData) {
    return null;
  }

  const optionsMappingLabel = options.map(op => ({
    ...op,
    label: intl.formatMessage({ id: op.label }),
  }));

  const selectedOptions = publicData && publicData[type] ? publicData[type] : [];

  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id={`ListingPage.${type}Title`} />
      </h2>
      <PropertyGroup
        id={`ListingPage.${type}`}
        options={optionsMappingLabel}
        selectedOptions={selectedOptions}
        twoColumns={true}
      />
    </div>
  );
};

export default injectIntl(SectionListingAttribute);
