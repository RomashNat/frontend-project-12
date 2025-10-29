import LoginForm from '../components/LoginForm.jsx'
import { Container, Row, Col, Card } from 'react-bootstrap'

const LoginPage = () => (
  <Container fluid className="h-100">
    <Row className="justify-content-center align-content-center h-100">
      <Col xs={12} md={8} xxl={6} className="h-100 d-flex">
       <Card className="shadow-sm">
          <Card.Body className="row p-5">
            <Col xs={12} md={6} className="d-flex align-items-center justify-content-center mb-3 mb-md-0">
              <img src="https://frontend-chat-ru.hexlet.app/assets/avatar-DIE1AEpS.jpg" alt="Войти" className="rounded-circle img-fluid" />
            </Col>
            <Col xs={12} md={6}>
              <LoginForm />
            </Col>
          </Card.Body>
          <Card.Footer className="p-4 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <span>Нет аккаунта? </span>
              <a href="#">Регистрация</a>
            </div>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  </Container>
)

export default LoginPage