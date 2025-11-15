import { Link } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import { useTranslation, Trans } from 'react-i18next'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <div className="h-100 d-flex flex-column">
      <Nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <Link className="navbar-brand" to="/">
            {t('mainHeader.hexletChat')}
          </Link>
        </div>
      </Nav>
      <div className="not-found-page h-100 d-flex flex-column align-items-center justify-content-center">
        <img
          src="https://frontend-chat-ru.hexlet.app/assets/404-D_FLHmTM.svg"
          alt={t('notFoundPage.altText')}
          className="img-fluid h-25 mb-3"
        />
        <h1>{t('notFoundPage.title')}</h1>
        <p>
          <Trans i18nKey="notFoundPage.toMainPage">
            <Link to="/login">{t('loginPage.header')}</Link>
          </Trans>
        </p>
      </div>
    </div>
  )
}

export default NotFoundPage
