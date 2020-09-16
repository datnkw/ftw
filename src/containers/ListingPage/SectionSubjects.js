import React from 'react';
import { FormattedMessage, injectIntl } from '../../util/reactIntl';
import { PropertyGroupWithSubAttribute, PropertyGroup } from '../../components';
import { getFieldLevelName } from '../../util/subjectLevelHelper';
import css from './ListingPage.css';

const SectionSubjects = props => {
  const { options, publicData, type, intl } = props;
  if (!publicData) {
    return null;
  }

  const optionsMappingLabel = options.map(op => ({
    ...op,
    label: intl.formatMessage({ id: op.label }),
  }));

  const selectedOptions = publicData && publicData[type] ? publicData[type] : [];

  const subSelectedOptions = () => {
    if (!(publicData && publicData[type])) {
      return null;
    }

    const subjects = publicData[type];

    const result = {};

    subjects.forEach(el => {
      const fieldLevelName = getFieldLevelName(el);
      result[el] = publicData[fieldLevelName];
    });

    return result;
  };

  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id={`ListingPage.${type}Title`} />
      </h2>
      <PropertyGroupWithSubAttribute
        id={`ListingPage.${type}`}
        options={optionsMappingLabel}
        selectedOptions={selectedOptions}
        subSelectedOptions={subSelectedOptions()}
      />
      {/* <PropertyGroups
        id={`ListingPage.${type}`}
        options={optionsMappingLabel}
        selectedOptions={selectedOptions}
        twoColumns={true}
      /> */}
    </div>
  );
};

export default injectIntl(SectionSubjects);
