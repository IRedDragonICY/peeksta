import logo from '../assets/logo.png';

export function Header() {
    return (
        <header>
            <img src={logo} alt="Logo" style={{ height: '128px' }} />
            <h1>Peeksta</h1>
            <p className="info-message">
                To download your followers and following data in JSON format, visit{' '}
                <a
                    href="https://accountscenter.instagram.com/info_and_permissions/dyi/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    this link
                </a>.
            </p>
        </header>
    );
}
