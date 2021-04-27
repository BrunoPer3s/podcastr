import { createGlobalStyle, css } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  :root {
    --white: #FFF;

    --gray-100: #E6E8EB;
    --gray-200: #AFB2B1;
    --gray-500: #808080;
    --gray-800: #494D4B;

    --green-500: #04D361;

    --purple-300: #9F75FF;
    --purple-400: #9164FA; 
    --purple-500: #8257E5;
    --purple-800: #6F48C9;

    --headerBg: #FFF;
    --h1: #494D4B;

  }


  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }



  body {
    background-color: var(--gray-50);
  }

  body, input , textarea , button {
    font: 500 1rem Inter, sans-serif;
    color: var(--gray-500)
  }

  h1, h2, h3, h4, h5, h5 {
    font-weight: 600;
    font-family: Lexend, sans-serif;
    color: var(--h1);
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  button, a {
    cursor: pointer;
    background: none;
    border: 0;
    text-decoration: none;
  }

  @media (max-width: 1080px) {
    html {
      font-size: 93.75%;
    }
  }

  @media (max-width: 720px) {
    html {
      font-size: 87.5%;
    }
  }
`;

