import RegistrationForm from '../components/RegistrationForm.jsx'
import { Row, Col, Card, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const RegistrationPage = () => {
    const { t } = useTranslation();
    
    return (
        <div className="h-100 d-flex flex-column">
            <Nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
                <div className="container">
                    <Link className="navbar-brand" to="/login">
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
                                    src="https://frontend-chat-ru.hexlet.app/assets/avatar_1-D7Cot-zE.jpg"
                                    alt={t('signup.header')}
                                    className="rounded-circle img-fluid"
                                    style={{ maxWidth: '200px' }}
                                />
                            </Col>
                            <RegistrationForm />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default RegistrationPage;