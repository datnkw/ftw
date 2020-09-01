import React, { Component } from 'react';
import { array, bool, func, object, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { EditTeacherListingPhotosForm } from '../../forms';
import { ensureOwnListing } from '../../util/data';
import { ListingLink } from '../../components';

import css from '../EditListingPhotosPanel/EditListingPhotosPanel.css';

class EditListingPhotosPanel extends Component {
  render() {
    const {
      className,
      rootClassName,
      errors,
      disabled,
      ready,
      images,
      listing,
      onImageUpload,
      onUpdateImageOrder,
      submitButtonText,
      panelUpdated,
      updateInProgress,
      onChange,
      onSubmit,
      onRemoveImage,
    } = this.props;

    // const dataToTest = [
    //   {
    //     id: {
    //       _sdkType: 'UUID',
    //       uuid: '5f4db207-a523-4491-8bcd-08a7afd52bf3',
    //     },
    //     type: 'image',
    //     attributes: {
    //       variants: {
    //         'landscape-crop': {
    //           height: 267,
    //           width: 400,
    //           url:
    //             'https://sharetribe.imgix.net/5c63f5f3-26d4-4fe9-a861-1963fa1d9023%2F5f4db207-a523-4491-8bcd-08a7afd52bf3?auto=format&crop=edges&fit=crop&h=267&ixlib=java-1.1.1&w=400&s=1499b5a1f1847460e39bf7a5544266f7',
    //           name: 'landscape-crop',
    //         },
    //         'landscape-crop2x': {
    //           height: 533,
    //           width: 800,
    //           url:
    //             'https://sharetribe.imgix.net/5c63f5f3-26d4-4fe9-a861-1963fa1d9023%2F5f4db207-a523-4491-8bcd-08a7afd52bf3?auto=format&crop=edges&fit=crop&h=533&ixlib=java-1.1.1&w=800&s=99e3e1ef80fabd680cd3f0ac38fce2d3',
    //           name: 'landscape-crop2x',
    //         },
    //       },
    //     },
    //   },
    // ];

    const rootClass = rootClassName || css.root;
    const classes = classNames(rootClass, className);
    const currentListing = ensureOwnListing(listing);

    const isPublished =
      currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
    const panelTitle = isPublished ? (
      <FormattedMessage
        id="EditListingPhotosPanel.title"
        values={{ listingTitle: <ListingLink listing={listing} /> }}
      />
    ) : (
      <FormattedMessage id="EditListingPhotosPanel.createListingTitle" />
    );

    return (
      <div className={classes}>
        <h1 className={css.title}>{panelTitle}</h1>
        <EditTeacherListingPhotosForm
          className={css.form}
          disabled={disabled}
          ready={ready}
          fetchErrors={errors}
          initialValues={{ images }}
          //initialValues={{ dataToTest }}
          images={images}
          onImageUpload={onImageUpload}
          onSubmit={values => {
            const { addImage, ...updateValues } = values;
            onSubmit(updateValues);
          }}
          onChange={onChange}
          onUpdateImageOrder={onUpdateImageOrder}
          onRemoveImage={onRemoveImage}
          saveActionMsg={submitButtonText}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
        />
      </div>
    );
  }
}

EditListingPhotosPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  images: [],
  listing: null,
};

EditListingPhotosPanel.propTypes = {
  className: string,
  rootClassName: string,
  errors: object,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  images: array,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  onImageUpload: func.isRequired,
  onUpdateImageOrder: func.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  onRemoveImage: func.isRequired,
};

export default EditListingPhotosPanel;
