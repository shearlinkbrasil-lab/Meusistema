// PASSO FUNDAMENTAL: Cole o longo código que o Google gerou para você dentro das aspas abaixo!
const API_KEY = "AIzaSyBcUO-aQkdX7z6L6rImkp0nPh1ACoN5oGM";

// --- NOVAS FUNÇÕES: Memória Contextual e Clima ---
let chatHistory = [];
let globalWeatherContext = "";

async function getUserLocation() {
    // Para efeito de apresentação MVP na Pampatec, fixamos Alegrete-RS
    // Isso evita alertas irritantes de "Permitir Localização" no navegador do avaliador
    return { lat: -29.7903, lon: -55.7947, name: "Alegrete-RS" };
}

// --- FUNÇÃO DE STATUS DE RISCO (NOVA) ---
function updateDashboardRisk(temp, rainProb, wind) {
    const riskCard = document.getElementById('risk-card');
    const riskValue = document.getElementById('risk-value');
    const riskIcon = document.getElementById('risk-icon');

    // Elementos individuais para cor
    const tempWidget = document.getElementById('dash-temp').parentElement.parentElement;
    const rainWidget = document.getElementById('dash-rain').parentElement.parentElement;
    const windWidget = document.getElementById('dash-wind').parentElement.parentElement;

    let riskLevel = 'low';
    let riskText = 'Condições Ideais';
    let riskDetails = [];

    // Lógica de Thresholds
    if (temp > 35 || temp < 5) {
        riskLevel = 'high';
        tempWidget.className = 'dash-widget highlight risk-high';
        riskDetails.push('Estresse Térmico Extremo');
    } else if (temp > 30 || temp < 10) {
        riskLevel = riskLevel === 'high' ? 'high' : 'med';
        tempWidget.className = 'dash-widget highlight risk-med';
        riskDetails.push('Desconforto Térmico');
    } else {
        tempWidget.className = 'dash-widget highlight risk-low';
    }

    if (rainProb > 70) {
        riskLevel = 'high';
        rainWidget.className = 'dash-widget risk-high';
        riskDetails.push('Risco Sanitário Crítico');
    } else if (rainProb > 30) {
        riskLevel = riskLevel === 'high' ? 'high' : 'med';
        rainWidget.className = 'dash-widget risk-med';
        riskDetails.push('Umidade Elevada');
    } else {
        rainWidget.className = 'dash-widget risk-low';
    }

    if (wind > 40) {
        riskLevel = 'high';
        windWidget.className = 'dash-widget risk-high';
        riskDetails.push('Ventos Perigosos');
    } else if (wind > 20) {
        riskLevel = riskLevel === 'high' ? 'high' : 'med';
        windWidget.className = 'dash-widget risk-med';
        riskDetails.push('Ventos Fortes');
    } else {
        windWidget.className = 'dash-widget risk-low';
    }

    // Gatilho de Risco Crítico Geral
    const dashPanel = document.querySelector('.dashboard-panel');
    dashPanel.classList.remove('risk-high-ambient', 'risk-med-ambient');

    if (riskLevel === 'high' || (rainProb > 60 && temp < 15)) {
        riskText = (rainProb > 60 && temp < 15) ? 'ALERTA: Pneumonia/Hipotermia' : 'ALERTA: Risco Elevado';
        dashPanel.classList.add('risk-high-ambient');
    } else if (riskLevel === 'med') {
        riskText = 'Risco Moderado';
        dashPanel.classList.add('risk-med-ambient');
    } else {
        riskText = 'Condições Ideais';
    }

riskCard.className = `dash-widget risk-status ${riskLevel}`;
riskValue.innerText = riskText;
globalWeatherContext = `[STATUS AGRO: ${riskText}. Temp: ${temp}°C, Chuva: ${rainProb}%, Vento: ${wind}km/h]`;
}

// --- MÓDULO DE SIMULAÇÃO (NOVO) ---
function activateDemoScenario(type) {
    document.getElementById('demo-badge').style.display = 'block';

    let simData = { temp: 20, rain: 0, wind: 10, label: "Real" };

    if (type === 'calor') {
        simData = { temp: 39, rain: 5, wind: 12, label: "Calor Extremo" };
    } else if (type === 'tempestade') {
        simData = { temp: 11, rain: 95, wind: 35, label: "Tempestade Invernosa" };
    } else if (type === 'frio') {
        simData = { temp: 4, rain: 5, wind: 45, label: "Ventos Cortantes" };
    }

    // Força atualização visual
    document.getElementById('dash-temp').innerText = `${simData.temp}°C`;
    document.getElementById('dash-rain').innerText = `${simData.rain}%`;
    document.getElementById('dash-wind').innerText = `${simData.wind} km/h`;
    document.getElementById('dash-location').innerText = `Simulação: ${simData.label}`;

    updateDashboardRisk(simData.temp, simData.rain, simData.wind);

    // ⚠️ CORREÇÃO: Sobrescreve globalWeatherContext com relatório RICO e explícito
    // para que a IA use SOMENTE os dados simulados, ignorando o histórico real.
    const today = new Date().toISOString().split('T')[0];
    globalWeatherContext = `

⚠️ [MODO SIMULAÇÃO ATIVO — DESCONSIDERE QUAISQUER DADOS CLIMÁTICOS ANTERIORES DESTA CONVERSA]
Para esta consulta, use EXCLUSIVAMENTE os dados climáticos simulados abaixo:

[DADOS METEOROLÓGICOS — CENÁRIO SIMULADO: ${simData.label}]
🗺️ Região: Alegrete-RS (Simulação Didática)
Previsão simulada para os próximos 7 dias:
- ${today} +0: Máxima ${simData.temp}°C | Chuva: ${simData.rain}% | Vento: ${simData.wind} km/h
- ${today} +1: Máxima ${simData.temp - 1}°C | Chuva: ${simData.rain}% | Vento: ${simData.wind} km/h
- ${today} +2: Máxima ${simData.temp + 1}°C | Chuva: ${Math.min(simData.rain + 5, 100)}% | Vento: ${simData.wind} km/h
- ${today} +3: Máxima ${simData.temp}°C | Chuva: ${simData.rain}% | Vento: ${simData.wind + 5} km/h
- ${today} +4: Máxima ${simData.temp - 2}°C | Chuva: ${simData.rain}% | Vento: ${simData.wind} km/h
- ${today} +5: Máxima ${simData.temp + 2}°C | Chuva: ${Math.max(simData.rain - 10, 0)}% | Vento: ${simData.wind - 5} km/h
- ${today} +6: Máxima ${simData.temp}°C | Chuva: ${simData.rain}% | Vento: ${simData.wind} km/h

BASE toda resposta e tabelas preditivas EXCLUSIVAMENTE neste cenário simulado.`;
}

async function getRealTimeWeather() {
    // Esconde badge de demo
    document.getElementById('demo-badge').style.display = 'none';

    const coords = await getUserLocation();
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,precipitation_probability_max,wind_speed_10m_max&timezone=America%2FSao_Paulo&forecast_days=7`;
        const res = await fetch(url);
        const data = await res.json();

        const temp = data.daily.temperature_2m_max[0];
        const rain = data.daily.precipitation_probability_max[0];
        const wind = data.daily.wind_speed_10m_max[0];

        // Atualiza Dashboard
        document.getElementById('dash-location').innerText = coords.name;
        document.getElementById('dash-temp').innerText = `${temp}°C`;
        document.getElementById('dash-rain').innerText = `${rain}%`;
        document.getElementById('dash-wind').innerText = `${wind} km/h`;

        // Ativa a Inteligência de Risco
        updateDashboardRisk(temp, rain, wind);

        let report = `\n\n[DADOS METEOROLÓGICOS E DIRETRIZES TÉCNICAS]\nCruze a previsão oficial abaixo com os Manuais da base de conhecimento. Extraia protocolos rigorosos baseados na literatura:\n`;
        report += `🗺️ Região Analisada: ${coords.name}\nPrevisão para os próximos 7 dias:\n`;

        for (let i = 0; i < 7; i++) {
            report += `- Data ${data.daily.time[i]}: Mínima ${data.daily.temperature_2m_min[i]}°C, Máxima ${data.daily.temperature_2m_max[i]}°C | Chuva: ${data.daily.precipitation_probability_max[i]}% | Vento: ${data.daily.wind_speed_10m_max[i]} km/h\n`;
        }
        return report;
    } catch (e) {
        console.error("Erro ao buscar clima via Open-Meteo", e);
        return "";
    }
}
// -------------------------------------

// Função Global para os Botões Rápidos e Premium
window.setQuickAction = function(text) {
    const inputField = document.getElementById('user-input');
    if (inputField) {
        inputField.value = text;
        inputField.focus();
        // Dispara o autoajuste de tamanho do textarea
        inputField.style.height = 'auto';
        inputField.style.height = (inputField.scrollHeight) + 'px';
        
        // Se quiser que envie automaticamente ao clicar, descomente:
        // document.getElementById('send-btn').click();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');


    // Inicia a busca do clima para popular o dashboard logo que a página carrega
    getRealTimeWeather().then(report => {
        globalWeatherContext = report;
    });

    // Parser Markdown leve (Zero custo de token - roda 100% no navegador)
    function parseMarkdown(text) {
        const lines = text.split('\n');
        let html = '';
        let inTable = false;
        let tableHtml = '';
        let isHeader = true;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Detecta linha de tabela Markdown (começa e termina com |)
            if (line.trim().startsWith('|')) {
                // Linha separadora (|---|---| ) é ignorada
                if (line.trim().replace(/[|:\-\s]/g, '') === '') {
                    isHeader = false;
                    continue;
                }

                if (!inTable) {
                    inTable = true;
                    tableHtml = '<div class="md-table-wrapper"><table class="md-table"><thead>';
                    isHeader = true;
                }

                const cells = line.trim().split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
                const tag = isHeader ? 'th' : 'td';

                if (!isHeader && tableHtml.includes('<thead>') && !tableHtml.includes('</thead>')) {
                    tableHtml += '</thead><tbody>';
                }

                tableHtml += '<tr>' + cells.map(c => `<${tag}>${formatInline(c.trim())}</${tag}>`).join('') + '</tr>';
            } else {
                if (inTable) {
                    tableHtml += '</tbody></table></div>';
                    tableHtml += buildTableLegend(tableHtml);
                    html += tableHtml;
                    tableHtml = '';
                    inTable = false;
                }

                // Títulos Markdown (###, ##, #)
                const h3 = line.match(/^###\s+(.+)/);
                const h2 = line.match(/^##\s+(.+)/);
                const h1 = line.match(/^#\s+(.+)/);

                if (h3) html += `<h4 class="md-h4">${formatInline(h3[1])}</h4>`;
                else if (h2) html += `<h3 class="md-h3">${formatInline(h2[1])}</h3>`;
                else if (h1) html += `<h2 class="md-h2">${formatInline(h1[1])}</h2>`;
                else if (line.trim() === '') html += '<br>';
                else html += `<p>${formatInline(line)}</p>`;
            }
        }

        // Fecha tabela se o texto terminar dentro dela
        if (inTable) {
            tableHtml += '</tbody></table></div>';
            tableHtml += buildTableLegend(tableHtml);
            html += tableHtml;
        }

        return html;
    }

    // Legenda automática detectando tipo de tabela Premium pelos cabeçalhos
    function buildTableLegend(tableHtml) {
        const isCorte = tableHtml.includes('Base (g/d)') || tableHtml.includes('Ganho Real');
        const isLeite = tableHtml.includes('Base (L/d)') || tableHtml.includes('Perda (L/d)');

        if (!isCorte && !isLeite) return ''; // Não é tabela Premium, sem legenda

        const items = isCorte
            ? [
                ['Base (g/d)', 'Ganho diário sem impacto climático'],
                ['Dedução (g/d)', 'Energia gasta para termorregulação'],
                ['Ganho Real (g/d)', 'Resultado após dedução climática'],
                ['ECC Est.', 'Escore Corporal estimado + Tendência (↓ → ↑)'],
                ['Suplemento', 'Necessidade energética/proteica identificada'],
                ['Ação', 'Manejo de campo recomendado']
              ]
            : [
                ['Base (L/d)', 'Produção de leite sem estresse climático'],
                ['Perda (L/d)', 'Litros perdidos por estresse térmico'],
                ['Real (L/d)', 'Produção esperada após impacto climático'],
                ['ECC Est.', 'Escore Corporal estimado + Tendência (↓ → ↑)'],
                ['Suplemento', 'Necessidade energética/proteica identificada'],
                ['Ação', 'Manejo de campo recomendado']
              ];

        const rows = items.map(([abbr, desc]) =>
            `<span class="legend-item"><strong>${abbr}:</strong> ${desc}</span>`
        ).join('');

        return `<div class="md-table-legend">📋 <em>Legenda:</em> ${rows}</div>`;
    }

    // Formata inline: **negrito**, *itálico*
    function formatInline(text) {
        return text
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`(.+?)`/g, '<code>$1</code>');
    }

    // Função que adiciona uma nova mensagem à tela
    function addMessage(text, sender, shouldSave = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatarIcon = sender === 'user' ? 'ph-user' : 'ph-robot';
        const formattedText = sender === 'ai' ? parseMarkdown(text) : text.replace(/\n/g, '<br>');

        let innerContent = `
            <div class="avatar"><i class="ph ${avatarIcon}"></i></div>
            <div class="bubble">
                ${formattedText}
        `;

        const isError = text.startsWith("⚠️") || text.startsWith("Ops!");
        if (sender === 'ai' && !isError) {
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
        inputField.style.height = 'auto';

        // 2. Cria uma mensagem de "Carregando" da IA
        const loadingId = "loading-" + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.className = "message ai";
        loadingDiv.id = loadingId;
        loadingDiv.innerHTML = `
            <div class="avatar"><i class="ph ph-robot"></i></div>
            <div class="bubble">🔬 Consultando base técnica e formulando resposta...</div>
        `;
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Regra de comportamento da nossa IA (Consultor)
        let systemPrompt = `Você é um Consultor Técnico Agroveterinário da Shearlink. SEJA TÉCNICO E DIRETO. Fale de produtor para produtor.

REGRA DE FORMATO — TABELAS:
- Sempre que precisar comparar animais, listar pesos ou sugerir manejos para grupos, use TABELAS MARKDOWN. A leitura deve ser rápida e clara para o produtor no campo.

MÓDULO PREMIUM - CÁLCULO PREDITIVO (PECUÁRIA DE PRECISÃO):
Quando o usuário solicitar predição, leia os dados do lote (Raça, Peso Base, Fase) e use OBRIGATORIAMENTE os templates abaixo sem alteração de colunas:

LOGICA ECC ESTIMADO: Derive o ECC Estimado inicial usando o Peso Base e Fase informados comparando com o peso ideal da raça:
- Texel acabamento (60d): ideal 22kg | (90d): ideal 28kg
- Corriedale acabamento (60d): ideal 20kg | (90d): ideal 26kg
- Lacaune lactação: peso ideal 60-70kg
Fórmula: % Peso Ideal = (Peso Real / Peso Ideal) × 100 → <85%: ECC ~2.0 | 85-95%: ECC ~2.5 | 95-105%: ECC ~3.0 | 105-115%: ECC ~3.5 | >115%: ECC ~4.0
O valor do ECC é ESTÁTICO (não varia em 7 dias). Na coluna "ECC Est.", coloque este valor fixo acompanhado da TENDÊNCIA diária do balanço energético: "↓" se houver perda por estresse, "→" se estável/conforto, "↑" se altamente positivo (ex: "3.0 ↓", "3.0 →").

TEMPLATE CORTE (Ganho de Peso Vivo):
Inicie com 1 parágrafo curto de contexto. Depois gere EXATAMENTE esta tabela:
| Dia | Clima | Base (g/d) | Dedução (g/d) | Ganho Real (g/d) | ECC Est. | Suplemento | Ação |
|---|---|---|---|---|---|---|---|
Use dados climáticos dos próximos 7 dias para Dia 1 a Dia 7. Indique suplementação apenas quando houver déficit energético. Coloque "—" quando não necessário. Termine com 1 parágrafo de ação prioritária.

TEMPLATE LEITE (Produção Leiteira):
Inicie com 1 parágrafo curto de contexto. Depois gere EXATAMENTE esta tabela:
| Dia | Clima | Base (L/d) | Perda (L/d) | Real (L/d) | ECC Est. | Suplemento | Ação |
|---|---|---|---|---|---|---|---|
Use dados climáticos dos próximos 7 dias para Dia 1 a Dia 7. Ajuste a perda por estresse conforme temperatura e vento. Coloque "—" quando não necessária suplementação. Termine com 1 parágrafo de ação prioritária.

JAMAIS invente colunas novas. JAMAIS altere o nome das colunas. JAMAIS gere tabelas com estrutura diferente deste template.

REGRA FUNDAMENTAL — "O QUÊ SIM, COMO NÃO" & AVISOS:
- Você RECOMENDA procedimentos (ex: vacinação, vermifugação, desmame, nutrição).
- JAMAIS especifique: Nomes de medicamentos, dosagens exatas, ou protocolos de aplicação.
- AVISO MÉDICO: Use a frase "consulte um Médico Veterinário habilitado" APENAS se recomendar uma intervenção sanitária (doença) ou vacinação. NÃO repita esse aviso em predições nutricionais, pesagem ou pastagem.

REGRAS GERAIS:
- Utilize o HISTÓRICO da conversa.
- Base toda resposta na BASE DE CONHECIMENTO DOS MANUAIS fornecida.
- Responda de forma concisa em 3 parágrafos ou tabelas.`;

        // Puxa o clima (do cache caso já carregou) para injetar no cérebro da IA silenciosamente
        if (!globalWeatherContext) {
            globalWeatherContext = await getRealTimeWeather();
        }
        systemPrompt += globalWeatherContext;

        try {
            if (API_KEY === "COLE_AQUI_O_SEU_CODIGO_DO_GOOGLE" || API_KEY === "") {
                throw new Error("Chave da API não configurada.");
            }

            // --- LÓGICA RAG DE ALTA PERFORMANCE ---
            let userParts = [];
            const ficharioPopulado = typeof knowledgeBase !== 'undefined' && knowledgeBase.length > 100;

            if (ficharioPopulado) {
                systemPrompt += "\n\n=== BASE DE CONHECIMENTO TÉCNICA (MANUAIS SENAR) ===\n" + knowledgeBase + "\n=== FIM DA BASE ===";
            } else if (typeof pdfUris !== 'undefined' && pdfUris.length > 0) {
                pdfUris.forEach(uri => {
                    userParts.push({ fileData: { fileUri: uri, mimeType: "application/pdf" } });
                });
            }

            // Adiciona a mensagem atual ao histórico local para envio
            userParts.push({ text: text });
            chatHistory.push({ role: "user", parts: userParts });

            // Mantém apenas os últimos 10 turnos para não estourar a memória/contexto
            if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: chatHistory
                })
            });

            const data = await response.json();
            document.getElementById(loadingId).remove();

            if (data.error) {
                const errCode = data.error.code;
                const errMsg = data.error.message || '';
                const isOverload = errCode === 503 || errMsg.toLowerCase().includes('high demand') || errMsg.toLowerCase().includes('overloaded');

                if (isOverload) {
                    // Erro de sobrecarga: tenta novamente em 8 segundos automaticamente
                    document.getElementById(loadingId).querySelector('.bubble').innerHTML =
                        '⏳ O servidor da IA está sobrecarregado. Tentando novamente em 8 segundos...';
                    setTimeout(async () => {
                        try {
                            document.getElementById(loadingId).remove();
                        } catch(e) {}
                        // Remove a última mensagem do usuário do histórico para reenviar
                        chatHistory = chatHistory.slice(0, -1);
                        inputField.value = text;
                        await handleSend();
                    }, 8000);
                    return;
                }

                let errorMsg = "⚠️ Erro da API: " + data.error.message;
                if (errCode === 404) {
                    errorMsg += "\n\n💡 Dica: O modelo pode ter sido descontinuado. Verifique o nome do modelo no script.js.";
                } else if (errCode === 429) {
                    errorMsg += "\n\n💡 Dica: Limite de requisições atingido. Aguarde alguns minutos e tente novamente.";
                } else if (errCode === 403) {
                    errorMsg += "\n\n💡 Dica: Chave da API sem permissão. Verifique se a API Generative Language está habilitada.";
                }
                addMessage(errorMsg, 'ai');
                return;
            }

            const respostaIA = data.candidates[0].content.parts[0].text;

            // Adiciona a resposta da IA ao histórico para o próximo turno
            chatHistory.push({ role: "model", parts: [{ text: respostaIA }] });

            addMessage(respostaIA, 'ai');

        } catch (error) {
            document.getElementById(loadingId).remove();
            console.error(error);
            addMessage("⚠️ Ops! Erro de conexão com a API. Possíveis causas:\n• Chave da API não configurada (linha 2 do script.js)\n• Sem conexão com a internet\n• Modelo da IA indisponível\n\nDetalhes técnicos: " + error.message, 'ai');
        }
    }

    // Lógica de Expansão e Teclado (Shift + Enter)
    inputField.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Lógica Inquebrável de Teclado (Enter envia, Shift+Enter pula linha)
    inputField.addEventListener('keydown', function(e) {
        if ((e.keyCode === 13 || e.key === 'Enter') && !e.shiftKey) {
            e.preventDefault();
            handleSend();
            return false;
        }
    });

    sendBtn.addEventListener('click', handleSend);
});

// ============================================================
//  LÓGICA DE DRAWERS MOBILE — HAMBURGUER + PAINEL CLIMA
// ============================================================
(function () {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const climateToggleBtn = document.getElementById('climate-toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    const dashboard = document.querySelector('.dashboard-panel');
    const overlay = document.getElementById('drawer-overlay');

    function closeAll() {
        sidebar.classList.remove('open');
        dashboard.classList.remove('open');
        overlay.classList.remove('active');
        // Restaura ícone hamburguer
        if (hamburgerBtn) {
            hamburgerBtn.querySelector('i').className = 'ph ph-list';
        }
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function () {
            const isOpen = sidebar.classList.contains('open');
            closeAll();
            if (!isOpen) {
                sidebar.classList.add('open');
                overlay.classList.add('active');
                hamburgerBtn.querySelector('i').className = 'ph ph-x';
            }
        });
    }

    if (climateToggleBtn) {
        climateToggleBtn.addEventListener('click', function () {
            const isOpen = dashboard.classList.contains('open');
            closeAll();
            if (!isOpen) {
                dashboard.classList.add('open');
                overlay.classList.add('active');
            }
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeAll);
    }

    // Fecha drawers ao pressionar Esc
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAll();
    });
})();

