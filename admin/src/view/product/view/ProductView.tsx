import React from 'react';
import Spinner from 'src/view/shared/Spinner';
import ViewWrapper from 'src/view/shared/styles/ViewWrapper';
import { i18n } from 'src/i18n';
import TextViewItem from 'src/view/shared/view/TextViewItem';
import VipViewItem from 'src/view/vip/view/VipViewItem';

function CouponsView(props) {
  const { record, loading } = props;



  if (loading || !record) {
    return <Spinner />;
  }

  return (
    <ViewWrapper>
      <VipViewItem  label={i18n('entities.product.fields.vip')}
    value={record.vip} />

    
      <TextViewItem
        label={i18n('entities.prodcut.fields.title')}
        value={record.title}
      />

      <TextViewItem
        label={i18n('entities.prodcut.fields.codeName')}
        value={record.amount}
      />

      <TextViewItem
        label={i18n('entities.prodcut.fields.discount')}
        value={record.commission}
      />

  

      
    </ViewWrapper>
  );
}

export default CouponsView;
