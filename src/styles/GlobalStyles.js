import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
  
  :root {
    --primary-color: #007bff;
    --background-light: #f9f9f9;
    --background-dark: #1e1e1e;
    --text-dark: #333;
    --text-light: #e0e0e0;
    --transition: 0.3s;
    font-family: 'Poppins', sans-serif;
  }

  body {
    margin: 0;
    background: #ffffff;
    color: var(--text-dark);
    transition: background-color var(--transition), color var(--transition);
  }

  @media (prefers-color-scheme: dark) {
    body {
      background: #121212;
      color: var(--text-light);
    }
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color var(--transition);
  }

  a:hover {
    text-decoration: underline;
  }

  #root {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
    position: relative;
  }

  h1 {
    font-size: 3em;
    margin-bottom: 0.5rem;
  }

  .info-message {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    line-height: 1.4;
  }
`;
