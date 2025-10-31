import LoginForm from '../components/LoginForm.jsx'
import { useTranslation } from 'react-i18next';
import { Row, Col, Card, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <div className="h-100 d-flex flex-column">
      <Nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <Link className="navbar-brand" to="/">
            {t('mainHeader.hexletChat')}
          </Link>
        </div>
      </Nav>
      <Row className="flex-grow-1 justify-content-center align-items-center">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center mb-3 mb-md-0">
                <img
                  src="https://frontend-chat-ru.hexlet.app/assets/avatar-DIE1AEpS.jpg"
                  alt={t('loginPage.header')}
                  className="rounded-circle img-fluid"
                  style={{ maxWidth: '200px' }}
                />
              </Col>
              <Col xs={12} md={6}>
                <LoginForm />
              </Col>
            </Card.Body>
            <Card.Footer className="p-4 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <span>{t('loginPage.noSignUpWithLink')} </span>
                <Link to="/signup">{t('loginPage.submit')}</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;