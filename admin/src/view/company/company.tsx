import React from 'react';
import { i18n } from 'src/i18n';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import Breadcrumb from 'src/view/shared/Breadcrumb';
import PageTitle from 'src/view/shared/styles/PageTitle';

function company() {
  return (
    <div>
      <Breadcrumb
        items={[
          [i18n('dashboard.menu'), '/'],
          [i18n('entities.coupons.menu'), '/company'],
        ]}
      />
      <ContentWrapper>
        <PageTitle>
          {i18n('entities.coupons.importer.title')}
        </PageTitle>

        <div>
          <div>Company</div>
          <div>T&C</div>
          <div>FAQs</div>
          <div>Logo</div>
        </div>
      </ContentWrapper>
    </div>
  );
}

export default company;
