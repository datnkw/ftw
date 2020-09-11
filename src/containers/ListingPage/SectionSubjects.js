import React from 'react';
import { FormattedMessage, injectIntl } from '../../util/reactIntl';
import { PropertyGroupWithSubAttribute } from '../../components';
import { getFieldLevelName } from '../../util/subjectLevelHelper';
import css from './ListingPage.css';

const SectionSubjects = props => {
  const { options, publicData, type, intl } = props;
  if (!publicData) {
    return null;
  }

  console.log('sectionSubjects');

  const optionsMappingLabel = options.map(op => ({
    ...op,
    label: intl.formatMessage({ id: op.label }),
  }));

  const selectedOptions = publicData && publicData[type] ? publicData[type] : [];

  const subSelectedOptions = () => {
    console.log('get in subSelectedOption');

    if (!(publicData && publicData[type])) {
      console.log('return null');
      return null;
    }

    console.log('publicData in SectionSubject: ', publicData);

    const subjects = publicData[type];

    const result = {};

    subjects.forEach(el => {
      const fieldLevelName = getFieldLevelName(el);
      console.log('fieldLevelName: ', fieldLevelName);
      result[el] = publicData[fieldLevelName];
    });

    console.log('result: ', result);

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
    </div>
  );
};

export default injectIntl(SectionSubjects);
