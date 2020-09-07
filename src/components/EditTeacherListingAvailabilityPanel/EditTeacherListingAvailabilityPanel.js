import React, { useState } from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import { compose } from 'redux';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingAvailabilityForm, EditAllSeatForm } from '../../forms';

import css from '../EditListingAvailabilityPanel/EditListingAvailabilityPanel.css';

const EditTeacherListingAvailabilityPanel = props => {
  const [updateAllSeatInProgess, setUpdateAllSeatInProgess] = useState(false);

  const {
    className,
    rootClassName,
    listing,
    availability,
    disabled,
    ready,
    onSubmit,
    onSubmitCustomAvailabilityPlan,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
    intl,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;

  const customAvailabilityPlan = seats => ({
    type: 'availability-plan/day',
    entries: [
      { dayOfWeek: 'mon', seats },
      { dayOfWeek: 'tue', seats },
      { dayOfWeek: 'wed', seats },
      { dayOfWeek: 'thu', seats },
      { dayOfWeek: 'fri', seats },
      { dayOfWeek: 'sat', seats },
      { dayOfWeek: 'sun', seats },
    ],
  });

  const availabilityPlan = currentListing.attributes.availabilityPlan || customAvailabilityPlan(0);
  return (
    <div className={classes}>
      <h1 className={css.title}>
        {isPublished ? (
          <FormattedMessage
            id="EditListingAvailabilityPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} /> }}
          />
        ) : (
          <FormattedMessage id="EditListingAvailabilityPanel.createListingTitle" />
        )}
      </h1>
      <EditAllSeatForm
        saveActionMsg={intl.formatMessage({ id: 'EditAllSeatForm.submitButtonText' })}
        updateInProgress={updateAllSeatInProgess}
        initialValues={{
          allSeat: availabilityPlan.entries[0].seats,
        }}
        onSubmit={values => {
          setUpdateAllSeatInProgess(true);
          onSubmitCustomAvailabilityPlan({
            availabilityPlan: customAvailabilityPlan(parseInt(values.allSeat)),
          }).then(() => {
            this.setState({
              updateAllSeatInProgess: false,
            });
          });
        }}
      />
      <EditListingAvailabilityForm
        isTeacher={true}
        className={css.form}
        listingId={currentListing.id}
        initialValues={{ availabilityPlan }}
        availability={availability}
        availabilityPlan={availabilityPlan}
        onSubmit={() => {
          // We save the default availability plan
          // I.e. this listing is available every night.
          // Exceptions are handled with live edit through a calendar,
          // which is visible on this panel.
          onSubmit({ availabilityPlan });
        }}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateError={errors.updateListingError}
        updateInProgress={updateInProgress}
      />
    </div>
  );
};

EditTeacherListingAvailabilityPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditTeacherListingAvailabilityPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  availability: shape({
    calendar: object.isRequired,
    onFetchAvailabilityExceptions: func.isRequired,
    onCreateAvailabilityException: func.isRequired,
    onDeleteAvailabilityException: func.isRequired,
  }).isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default compose(injectIntl)(EditTeacherListingAvailabilityPanel);
