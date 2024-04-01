import React from 'react';
import { i18n } from 'src/i18n';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import Breadcrumb from 'src/view/shared/Breadcrumb';
import PageTitle from 'src/view/shared/styles/PageTitle';
import './app.css';
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

        <div className="app__company">
          <div className="company__item">
          <i className="fa-solid fa-building item__company"></i>
            <span className='company__text'>Company </span>
          </div>
          <div className="company__item">
          <i className="fa-solid fa-file-contract item__company"></i>
            <span className='company__text'> T&C </span>
          </div>
          <div className="company__item">
          <i className="fa-solid fa-question item__company"></i>
            <span className='company__text'> FAQs </span>
          </div>
          <div className="company__item">
          <i className="fa-solid fa-mobile item__company"></i>
            <span className='company__text'> Logo </span>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}

export default company;
