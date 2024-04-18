import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { i18n } from 'src/i18n';
import actions from 'src/modules/user/form/userFormActions';
import DatePickerFormItem from 'src/view/shared/form/items/DatePickerFormItem';
import SelectFormItem from 'src/view/shared/form/items/SelectFormItem';
import FormWrapper from 'src/view/shared/styles/FormWrapper';
import ButtonIcon from 'src/view/shared/ButtonIcon';
import * as yup from 'yup';
import yupFormSchemas from 'src/modules/shared/yup/yupFormSchemas';
import userEnumerators from 'src/modules/user/userEnumerators';
import { yupResolver } from '@hookform/resolvers/yup';
import userSecteur from 'src/modules/user/userSecteur';
import userEtat from 'src/modules/user/userEtat';
import InputFormItem from 'src/view/shared/form/items/InputFormItem';
import moment from 'moment';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CouponsAutocompleteFormItem from 'src/coupons/autocomplete/CouponsAutocompleteFormItem';
import SwitchFormItem from 'src/view/shared/form/items/SwitchFormItem';
import ImagesFormItem from 'src/view/shared/form/items/ImagesFormItem';
import Storage from 'src/security/storage';
import FilesFormItem from 'src/view/shared/form/items/FilesFormItem';
import VipAutocompleteFormItem from 'src/view/vip/autocomplete/VipAutocompleteFormItem';
import ProductAutocompleteFormItem from 'src/view/product/autocomplete/ProductAutocompleteFormItem';

const schema = yup.object().shape({
  roles: yupFormSchemas.stringArray(
    i18n('user.fields.roles'),
    {
      min: 1,
    },
  ),
  phoneNumber: yupFormSchemas.string(i18n('phoneNumber'), {
    max: 24,
  }),

  adresse: yupFormSchemas.string(i18n('adresse'), {
    required: false,
  }),
  fullName: yupFormSchemas.string(i18n('fullName'), {
    required: false,
  }),

  balance: yupFormSchemas.string(i18n('balance'), {
    required: false,
  }),

  product: yupFormSchemas.relationToOne(i18n('prodcut'), {
  
  }),
  status: yupFormSchemas.enumerator(
    i18n('user.fields.status'),
    {
      options: userEnumerators.status,
    },
  ),
});

function UserEditForm(props) {
  const dispatch = useDispatch();
  // const [initialValues] = useState(() => props.user || {});
  const [initialValues] = useState(() => {
    const record = props.user || {};

    return {
      roles: record.roles[0],
      phoneNumber: record.phoneNumber,
      passportNumber: record.passportNumber,
      fullName: record.fullName,
      firstName: record.firstName,
      lastName: record.lastName,
      country: record.country,
      balance: record.balance,
      state: record.state,
      passportPhoto: record.passportPhoto || [],
      vip: record.vip || [],
      status: record.status,
      product :record.product || []
    };
  });

  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: initialValues,
  });

  const onSubmit = (values) => {
    const data = {
      id: props.user.id,
      ...values,
    };
    delete data.email;


    dispatch(actions.doUpdate(data));
  };

  const onReset = () => {
    Object.keys(initialValues).forEach((key) => {
      form.setValue(key, initialValues[key]);
    });
  };

  return (
    <FormWrapper>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Row
            style={{
              paddingBottom: '10px',
              display: 'grid',
            }}
          >
            {/* <Row>
              <Col sm={4}>
                <div className="col-lg-7 col-md-8 col-12">
                  <SwitchFormItem
                    name="payee"
                    label={i18n(
                      'entities.category.fields.isFeature',
                    )}
                  />
                </div>
              </Col>
            </Row> */}

           
            <Col sm={4}>
              <div className="form-group">
                <label
                  className="col-form-label"
                  htmlFor="email"
                >
                  {i18n('user.fields.email')}
                </label>
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  id="email"
                  name="email"
                  value={props.user.email}
                />
              </div>
            </Col>
            <Col sm={4}>
              <SelectFormItem
                name="roles"
                label={i18n('user.fields.roles')}
                required={true}
                options={userEnumerators.roles.map(
                  (value) => ({
                    value,
                    label: i18n(`${value}`),
                  }),
                )}
              />
            </Col>
            <Col sm={4}>
              <SelectFormItem
                name="status"
                label={i18n('user.fields.status')}
                options={userEnumerators.status.map(
                  (value) => ({
                    value,
                    label: i18n(`user.status.${value}`),
                  }),
                )}
              />
            </Col>

       
          </Row>
          <Row>
            <Col sm={4}>
              <InputFormItem
                name="balance"
                label={i18n('user.fields.balance')}
                required={true}
              />
            </Col>
          </Row>
          <Row>
          <Col sm={4}>
              <VipAutocompleteFormItem
                name="vip"
                label={i18n('entities.product.fields.vip')}
                required={true}
                showCreate={!props.modal}
              />
            </Col>
          </Row>
          <Row>
            <ImagesFormItem
              name="passportPhoto"
              label={i18n('user.fields.passportphoto')}
              storage={Storage.values.galleryPhotos}
              max={2}
            />
          </Row>

          {/* <Row>
            <FilesFormItem
              name="passportDocument"
              label={i18n('user.fields.visadocument')}
              storage={Storage.values.donsAttachements}
              max={1}
            />
          </Row> */}
          <Row>
            <Col sm={4}>
              <InputFormItem
                name="fullName"
                label={i18n('user.fields.fullName')}
                required={true}
              />
            </Col>
          </Row>

          <Row>
            <Col sm={4}>
              <InputFormItem
                name="phoneNumber"
                label={i18n('user.fields.phoneNumber')}
                required={true}
              />
            </Col>
          </Row>

          <Row>
            <Col sm={4}>
              <InputFormItem
                name="country"
                label={i18n('user.fields.country')}
                required={true}
              />
            </Col>
          </Row>




          <Row>
            <Col sm={4}>

              <ProductAutocompleteFormItem 
                name="product"
                label={i18n(
                  'user.fields.product',
                )}
               />


            </Col>
          </Row>

          <div className="form-buttons">
            <button
              className="btn btn-primary"
              disabled={props.saveLoading}
              type="button"
              onClick={form.handleSubmit(onSubmit)}
            >
              <ButtonIcon
                loading={props.saveLoading}
                iconClass="far fa-save"
              />
              &nbsp;
              {i18n('common.save')}
            </button>

            <button
              className="btn btn-light"
              disabled={props.saveLoading}
              onClick={onReset}
              type="button"
            >
              <i className="fas fa-undo"></i>
              {i18n('common.reset')}
            </button>

            {props.onCancel ? (
              <button
                className="btn btn-light"
                disabled={props.saveLoading}
                onClick={() => props.onCancel()}
                type="button"
              >
                <i className="fas fa-times"></i>
                {i18n('common.cancel')}
              </button>
            ) : null}
          </div>
        </form>
      </FormProvider>
    </FormWrapper>
  );
}

export default UserEditForm;
