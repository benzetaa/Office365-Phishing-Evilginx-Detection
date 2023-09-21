const domain = window.location.hostname;
const path = window.location.pathname;
const htmlContent = document.documentElement.outerHTML;

const faviconLink = document.querySelector(
  'link[rel="shortcut icon"][href="https://aadcdn.msftauth.net/shared/1.0/content/images/"]'
);

const metaTag = htmlContent.includes(
  'http-equiv="Refresh" content="0; URL=https://login.microsoftonline.com'
);

function showPhishingBanner() {
    document.body.innerHTML = `
        <div style="
        position: fixed; /* Usando fixed para que o aviso cubra a tela inteira, independentemente da rolagem */
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Arial, sans-serif;
        z-index: 10000; /* Um z-index muito alto para garantir que esteja acima de outros conteúdos */
        ">
        <div style="
            text-align: center;
            background-color: #e53935;
            padding: 40px;
            border-radius: 20px;
            max-width: 90%; /* Adicionando um max-width para melhorar a legibilidade em telas grandes */
            box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.2); /* Adicionando um leve box-shadow para dar profundidade */
        ">
            <h1 style="
            color: white;
            font-size: 2em;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); /* Adicionando uma sombra ao texto para melhorar a legibilidade */
            ">
            Error: Page Blocked Due to Phishing Suspicion
            </h1>
            <p style="color: white; font-size: 1.2em">
                This page might be attempting to steal your information.
                <strong>We strongly advise you to close this tab immediately and refrain from entering any personal data.</strong>
            </p>
        </div>
        </div>
    `;
}

// Lista de domínios de login válidos da Microsoft
const validDomains = [
    "login.microsoftonline.com",
    "login.live.com",
    "login.windows.net",
    "login.partner.microsoftonline.cn",
    "login.microsoftonline.de",
    "login-us.microsoftonline.com"
];

// Verifica se o conteúdo HTML ou o domínio é um dos domínios válidos da Microsoft
if (validDomains.some(validDomain => htmlContent.includes(validDomain))) {

    // Verifica se o caminho inclui "common/oauth2" ou se a metatag está presente
    const isValidPathOrMeta = path.includes("common/oauth2") || metaTag;

    if (isValidPathOrMeta) {
        // Verifica se o domínio termina com "microsoftonline.com"
        if (domain.endsWith("microsoftonline.com")) {
            console.log("No phishing - domínio ou metatag válidos");
        } else {
            // O domínio não é da Microsoft. Bloqueia e exibe aviso de phishing
            window.stop();
            showPhishingBanner();
        }
    } else {
        // Outras verificações podem ser feitas aqui, se necessário
        console.log("Mais verificações podem ser necessárias");
    }
}