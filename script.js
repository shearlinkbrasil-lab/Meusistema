// PASSO FUNDAMENTAL: Cole o longo código que o Google gerou para você dentro das aspas abaixo!
const API_KEY = "AIzaSyBcUO-aQkdX7z6L6rImkp0nPh1ACoN5oGM";

// --- NOVAS FUNÇÕES: IA Climática ---
async function getUserLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({ lat: -29.78, lon: -55.79, name: "Alegrete-RS (Região Sede)" });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve({ 
                    lat: pos.coords.latitude, 
                    lon: pos.coords.longitude,
                    name: "Localização Atual do Produtor" 
                });
            },
            (err) => {
                console.warn("Permissão de localização negada ou indisponível. Fixando em Alegrete.", err);
                resolve({ lat: -29.78, lon: -55.79, name: "Alegrete-RS (Região Sede)" });
            },
            { timeout: 7000 }
        );
    });
}

async function getRealTimeWeather() {
    const coords = await getUserLocation();
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=America%2FSao_Paulo&forecast_days=7`;
        const res = await fetch(url);
        const data = await res.json();
        
        // --- ATIVAR O DASHBOARD VISUAL (NOVA UI) ---
        const uiLoc = document.getElementById('dash-location');
        const uiTemp = document.getElementById('dash-temp');
        const uiRain = document.getElementById('dash-rain');
        const uiWind = document.getElementById('dash-wind');
        
        if (uiLoc) uiLoc.innerText = coords.name;
        if (uiTemp) uiTemp.innerText = `${data.daily.temperature_2m_max[0]}°C`;
        if (uiRain) uiRain.innerText = `${data.daily.precipitation_probability_max[0]}%`;
        if (uiWind) uiWind.innerText = `${data.daily.wind_speed_10m_max[0]} km/h`;
        // ------------------------------------------

        let report = `\n\n[DADOS METEOROLÓGICOS REAIS OBRIGATÓRIOS]\nCruze os dados climáticos a seguir (previsão oficial) com a base de conhecimento de ovinocultura e as regras de esquila para basear rigorosamente sua decisão:\n`;
        report += `🗺️ Região Analisada: ${coords.name}\nPrevisão para os próximos 5 dias:\n`;
        
        for(let i = 0; i < 5; i++) {
            report += `- Data ${data.daily.time[i]}: Mínima ${data.daily.temperature_2m_min[i]}°C, Máxima ${data.daily.temperature_2m_max[i]}°C | Chuva: ${data.daily.precipitation_probability_max[i]}% | Vento: ${data.daily.wind_speed_10m_max[i]} km/h\n`;
        }
        return report;
    } catch(e) {
        console.error("Erro ao buscar clima via Open-Meteo", e);
        return ""; 
    }
}
// -------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Função que adiciona uma nova mensagem à tela
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatarIcon = sender === 'user' ? 'ph-user' : 'ph-robot';

        // Converte as quebras de linha em <br> para a formatação ficar bonita
        const formattedText = text.replace(/\n/g, '<br>');

        let innerContent = `
            <div class="avatar"><i class="ph ${avatarIcon}"></i></div>
            <div class="bubble">
                ${formattedText}
        `;

        // Se a mensagem for da IA e não for a de carregamento, nós adicionamos o Botão Verde do WhatsApp!
        if (sender === 'ai' && !text.includes("Analizando dados")) {
            // O texto é linkado de forma segura pra abrir direto no Whatsapp Web / Mobile do cara
            const zapText = encodeURIComponent(`*Relatório Shearlink Consultoria Agro:*\n\n${text}`);
            innerContent += `
                <br>
                <a href="https://api.whatsapp.com/send?text=${zapText}" target="_blank" class="whatsapp-export-btn">
                    <i class="ph ph-whatsapp-logo"></i> Repassar ao Produtor no WhatsApp
                </a>
            `;
        }
        innerContent += `</div>`;
        messageDiv.innerHTML = innerContent;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleSend() {
        const text = inputField.value.trim();
        if (!text) return;

        // 1. Mostra a mensagem do usuário
        addMessage(text, 'user');
        inputField.value = '';

        // 2. Cria uma mensagem de "Carregando" da IA
        const loadingId = "loading-" + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.className = "message ai";
        loadingDiv.id = loadingId;
        loadingDiv.innerHTML = `
            <div class="avatar"><i class="ph ph-robot"></i></div>
            <div class="bubble">Analizando dados da ovinocultura e formulando resposta...</div>
        `;
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Regra de comportamento da nossa IA (Consultor)
        let systemPrompt = "Você é o especialista chefe de ovinocultura da empresa Shearlink Brasil. Você ajuda produtores com manejo sanitário, análise do clima para ovinos, e orientações profissionais sobre esquila de ovinos. Responda sempre de forma respeitosa, objetiva e baseada em dados técnicos agrícolas reais. Nunca fuja do tema da ovinocultura e esquila.";
        
        // Se a variável knowledgeBase existir no arquivo knowledge.js, nós a adicionamos na memória da IA!
        if (typeof knowledgeBase !== 'undefined') {
            systemPrompt += "\n\nBASE DE CONHECIMENTO OBRIGATÓRIA A SEGUIR:\n" + knowledgeBase;
        }

        // Puxa o clima real do momento baseado na Geolocalização e injeta no Cérebro da IA silenciosamente
        const weatherContext = await getRealTimeWeather();
        systemPrompt += weatherContext;

        try {
            if (API_KEY === "COLE_AQUI_O_SEU_CODIGO_DO_GOOGLE" || API_KEY === "") {
                throw new Error("Chave da API não configurada.");
            }

            // Exige paciência do servidor do Gemini - Integração via Fetch direto!
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ role: "user", parts: [{ text: text }] }]
                })
            });

            const data = await response.json();

            // Remove a mensagem de aviso "carregando"
            document.getElementById(loadingId).remove();

            if (data.error) {
                addMessage("⚠️ Erro retornado pelo Google: " + data.error.message, 'ai');
                return;
            }

            // Pega a resposta de sucesso e adiciona
            const respostaIA = data.candidates[0].content.parts[0].text;
            addMessage(respostaIA, 'ai');

        } catch (error) {
            document.getElementById(loadingId).remove();
            console.error(error);
            addMessage("⚠️ Ops! Parece que você esqueceu de colocar a sua Chave da API no código, ou estamos sem internet. Vá na linha 2 do arquivo script.js e cole a chave lá!", 'ai');
        }
    }

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
