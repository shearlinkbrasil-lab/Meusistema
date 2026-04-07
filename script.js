// PASSO FUNDAMENTAL: Cole o longo código que o Google gerou para você dentro das aspas abaixo!
const API_KEY = "AIzaSyBcUO-aQkdX7z6L6rImkp0nPh1ACoN5oGM";

document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatarIcon = sender === 'user' ? 'ph-user' : 'ph-robot';

        // Converte as quebras de linha em <br> para a formatação ficar bonita
        const formattedText = text.replace(/\n/g, '<br>');

        messageDiv.innerHTML = `
            <div class="avatar"><i class="ph ${avatarIcon}"></i></div>
            <div class="bubble">${formattedText}</div>
        `;

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
        const systemPrompt = "Você é o especialista chefe de ovinocultura da empresa Shearlink Brasil. Você ajuda produtores com manejo sanitário, análise do clima para ovinos, e orientações profissionais sobre esquila de ovinos. Responda sempre de forma respeitosa, objetiva e baseada em dados técnicos agrícolas reais. Nunca fuja do tema da ovinocultura e esquila.";

        try {
            if (API_KEY === "COLE_AQUI_O_SEU_CODIGO_DO_GOOGLE" || API_KEY === "") {
                throw new Error("Chave da API não configurada.");
            }

            // Exige paciência do servidor do Gemini - Integração via Fetch direto!
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemPrompt }] },
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
