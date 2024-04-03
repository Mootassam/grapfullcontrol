import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { i18n } from 'src/i18n'
import ContentWrapper from 'src/view/layout/styles/ContentWrapper'
import Breadcrumb from 'src/view/shared/Breadcrumb'
import PageTitle from 'src/view/shared/styles/PageTitle';
import { EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ButtonIcon from 'src/view/shared/ButtonIcon';
function Tc() {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );
 
const onEditorStateChange =(editorState) =>{ 
  setEditorState(editorState)
}
  return (
    <>
    
    <Breadcrumb
        items={[
          [i18n('dashboard.menu'), '/'],
          [i18n('company.menu'),'/company'],
          [i18n('company.TC')],
        ]}
      />

      <ContentWrapper>
      <Container fluid={true}>
          <Row>
            <Col xs={9}>
        <PageTitle>{i18n('company.TC')}</PageTitle>
        </Col>
            <Col md="auto">
            <button
              className="btn  btn-primary "
              disabled={false}
              type="button"
              style={{width:250}}
              // onClick={form.handleSubmit(onSubmit)}
            >
              <ButtonIcon
                loading={false}
                iconClass="far fa-save"
              /> &nbsp;

              {i18n('common.save')}
            </button>
        </Col>
          </Row>

   
          <Editor
  editorState={editorState}
  toolbarClassName="toolbarClassName"
  wrapperClassName="wrapperClassName"
  editorClassName="editorClassName"
  onEditorStateChange={onEditorStateChange}
/>
 
          </Container>
      </ContentWrapper>
    
    
    
    </>
  )
}

export default Tc