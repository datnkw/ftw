import React from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { findOptionsForSelectFilter } from '../../util/search';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditTeacherListingGeneralForm } from '../../forms';
import config from '../../config';

import css from '../EditListingDescriptionPanel/EditListingDescriptionPanel.css';

const EditTeacherListingGeneralPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { title, publicData } = currentListing.attributes;
  //publicData.isTeacher = true;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditTeacherListingGeneral.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditTeacherListingGeneral.createListingTitle" />
  );

  const teachingHourOptions = findOptionsForSelectFilter('teachTime', config.custom.filters);
  const genderOptions = findOptionsForSelectFilter('gender', config.custom.filters);
  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditTeacherListingGeneralForm
        className={css.form}
        initialValues={{
          title,
          teachingHour: publicData.teachingHour,
          gender: publicData.gender,
          subjects: publicData.subjects,
          levels: publicData.levels,
          isTeacher: publicData.isTeacher,
        }}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { title, teachingHour, gender, subjects, levels } = values;
          const updateValues = {
            title: title.trim(),
            publicData: { teachingHour, gender, subjects, levels, isTeacher: true },
          };

          onSubmit(updateValues);
        }}
        onChange={onChange}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        genderOptions={genderOptions}
        teachingHourOptions={teachingHourOptions}
      />
    </div>
  );
};

EditTeacherListingGeneralPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditTeacherListingGeneralPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditTeacherListingGeneralPanel;
