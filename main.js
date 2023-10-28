function showPhishingBanner() {
    document.body.innerHTML = `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width,initial-scale=1"> <title>Document</title> <style>@import url("https://fonts.googleapis.com/css?family=Comfortaa"); *{box-sizing: border-box;}body, html{margin: 0; padding: 0; height: 100%; overflow: hidden;}body{background-color: #a74006; font-family: sans-serif;}.container{z-index: 1; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; padding: 10px; min-width: 300px;}.container div{display: inline-block;}.container .lock{opacity: 1;}.container h1{font-family: "Comfortaa", cursive; font-size: 100px; text-align: center; color: #eee; font-weight: 100; margin: 0;}.container p{color: #fff;}.lock{transition: 0.5s ease; position: relative; overflow: hidden; opacity: 0;}.lock.generated{transform: scale(0.5); position: absolute; -webkit-animation: 2s move linear; animation: 2s move linear; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;}.lock ::after{content: ""; background: #a74006; opacity: 0.3; display: block; position: absolute; height: 100%; width: 50%; top: 0; left: 0;}.lock .bottom{background: #D68910; height: 40px; width: 60px; display: block; position: relative; margin: 0 auto;}.lock .top{height: 60px; width: 50px; border-radius: 50%; border: 10px solid #fff; display: block; position: relative; top: 30px; margin: 0 auto;}.lock .top::after{padding: 10px; border-radius: 50%;}@-webkit-keyframes move{to{top: 100%;}}@keyframes move{to{top: 100%;}}@media (max-width: 420px){.container{transform: translate(-50%, -50%) scale(0.8);}.lock.generated{transform: scale(0.3);}}</style></head><body> <div class="container"> <h1> <div class="lock"> <div class="top"></div><div class="bottom"></div></div></h1> <h1 style="color: white;font-size: 2em;margin-bottom: 20px;text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); /* Adicionando uma sombra ao texto para melhorar a legibilidade */">Error: Page Blocked Due to Phishing Suspicion</h1><p style="color: white; font-size: 1.2em">This page might be attempting to steal your information.<strong>We strongly advise you to close this tab immediately and refrain from entering any personal data.</strong></p></div><script>const interval=500; function generateLocks(){const lock=document.createElement('div'), position=generatePosition(); lock.innerHTML='<div class="top"></div><div class="bottom"></div>'; lock.style.top=position[0]; lock.style.left=position[1]; lock.classList='lock'; document.body.appendChild(lock); setTimeout(()=>{lock.style.opacity='1'; lock.classList.add('generated');}, 100); setTimeout(()=>{lock.parentElement.removeChild(lock);}, 2000);}function generatePosition(){const x=Math.round((Math.random() * 100) - 10) + '%'; const y=Math.round(Math.random() * 100) + '%'; return [x, y];}setInterval(generateLocks, interval); generateLocks();</script></body></html>`;
}

const domain = window.location.hostname;
const path = window.location.pathname;

// coleta HTML 
const htmlContent = document.documentElement.outerHTML;
const metaTag = htmlContent.includes('http-equiv="Refresh" content="0; URL=https://login.microsoftonline.com');
const phrasesToCheck = [
    "No account? Create one!",
    "Can’t access your account?",
    "Forgotten my password",
    "Sign-in options",
    "Sign in",
    "Can’t access your account?"
];

// valid domains
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

function regexHTML() {
    function inputsVerify() {
        return new Promise(resolve => {
            // Espera 1 segundo antes de executar o código
            setTimeout(() => {
                // Obtenha o HTML da página
                const htmlContent = document.documentElement.outerHTML;
                const inputName = /<input[^>]*\sname=["'](loginfmt|email|mail|login|usuario|user)(\S*)["'][^>]*>/g;
                const inputType = /<input[^>]*\stype=["'](email|password)(\S*)["'][^>]*>/g;
                const hasTypeInputs = inputType.test(htmlContent);
                const hasNameInputs = inputName.test(htmlContent);
                // console.log("Contém inputs de Login (email or password):", hasNameInputs, hasTypeInputs);
                resolve(hasTypeInputs || hasNameInputs); // Resolva a promessa com o resultado
            }, 200); // 1000 milissegundos (1 segundo)
        });
    }

    // verifica no html se tem "Sign in" e se na mesma página tem os inputs "email ou login" and "password ou pwd ou senha"
    const foundPhrase = phrasesToCheck.find(phrase => htmlContent.includes(phrase));

    if (foundPhrase) {
        // console.log("Possível página de login da Microsoft:", foundPhrase);
        inputsVerify().then(inputsFound => {
            if (inputsFound) {
                // console.log("Executando window.stop()");
                window.stop();
                showPhishingBanner();
            }
        });
    }
}

// Verifica se há um endereço IP na tag <base>
function VerificaTagBase() {
    const baseTagRegex = /<base[^>]+href="https?:\/\/([\d.]+)"/;
    const baseTagMatch = htmlContent.match(baseTagRegex);

    function isIPAddress(str) {
        const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/; // RegEx for IPv4
        return ipPattern.test(str);
    }

    // Verifica se há um endereço IP na tag <base> // Se for bloqueiaaa
    if (baseTagMatch) {
        const ipAddress = baseTagMatch[1];
        if (isIPAddress(ipAddress)) {
            window.stop();
            showPhishingBanner();
        }
    }
}

const isValidPathOrMeta = path.includes("common/oauth") || metaTag;
const isDomainValid = validDomains.includes(domain);
// console.log("debug 0");

function checkAndHandlePhishing() {
    if (isValidPathOrMeta || !isValidPathOrMeta || metaTag) {
        if (!isDomainValid || VerificaTagBase()) { // Verifica se o domínio está na lista dos domínios válidos e/ou verifica se a tag <base> é um IP  
            if (regexHTML()) { // verifica se path contém common/oauth ou se o HTML contém a meta tag do office login
                window.stop();
                showPhishingBanner(); // Se for bloquear na página
            }
        }
    }
}

// Verifica periodicamente a presença de elementos de phishing a cada 1 segundo
setInterval(checkAndHandlePhishing, 1000);