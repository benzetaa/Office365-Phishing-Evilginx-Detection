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

const domain = window.location.hostname;
const path = window.location.pathname;
const htmlContent = document.documentElement.outerHTML;

const metaTag = htmlContent.includes(
  'http-equiv="Refresh" content="0; URL=https://login.microsoftonline.com'
);

function isIPAddress(str) {
    const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/; // RegEx para IP IPv4
    return ipPattern.test(str);
} 

const validDomains = [
    "login.microsoftonline.com",
    "login.live.com",
    "login.windows.net",
    "onedrive.live.com",
    "signup.live.com",
    "login.partner.microsoftonline.cn",
    "login.microsoftonline.de",
    "login-us.microsoftonline.com"
];

const isValidPathOrMeta = path.includes("common/oauth2") || metaTag;

if (isIPAddress(domain)) {
    window.stop();
    showPhishingBanner();
} else if (!validDomains.includes(domain)) {
    if (isValidPathOrMeta) {
        if (!validDomains.some(validDomain => domain.endsWith(validDomain))) {
            window.stop();
            showPhishingBanner();
        }
    }
} 
