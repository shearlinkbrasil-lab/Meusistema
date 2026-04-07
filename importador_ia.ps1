$apiKeyMatch = Select-String -Pattern 'const API_KEY = "(.*?)";' -Path "script.js"
if (-not $apiKeyMatch) { 
    Write-Host "Erro: API Key não encontrada no script.js"
    exit 1 
}
$apiKey = $apiKeyMatch.Matches[0].Groups[1].Value

$pdfs = Get-ChildItem -Path "Documentos" -Filter "*.pdf"
if ($pdfs.Count -eq 0) { 
    Write-Host "AVISO: Nenhum arquivo .pdf encontrado na pasta Documentos."
    exit 0 
}

foreach ($pdf in $pdfs) {
    Write-Host "Lendo documento escaneado: $($pdf.Name)... (O Google está processando a imagem, aguarde até 30s)"
    
    $bytes = [System.IO.File]::ReadAllBytes($pdf.FullName)
    $base64 = [Convert]::ToBase64String($bytes)
    
    $body = @{
        contents = @(
            @{
                parts = @(
                    @{ text = "Você está analisando um documento em PDF escaneado (possivelmente escrito em máquina de escrever). TRANSCREVA COM PERFEIÇÃO TÉCNICA E EXTRAIA de forma limpa todas as regras e guias relativas à ovinocultura, esquila e manejo animal presentes no documento. Apresente em tópicos e texto estruturado e limpo." },
                    @{ inlineData = @{ mimeType = "application/pdf"; data = $base64 } }
                )
            }
        )
    } | ConvertTo-Json -Depth 10

    try {
        $response = Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$apiKey" -Method Post -Body $body -ContentType "application/json"
        
        $extraido = $response.candidates[0].content.parts[0].text
        
        # Como as aspas invertidas existem no extraído às vezes (markdown de código), substituímos para não quebrar nosso JS
        $extraidoSeguro = $extraido -replace '`', "'"
        
        $contentToAppend = "`n`n// Conteúdo importado do PDF: $($pdf.Name)`nknowledgeBase += `` `n`n=================`nARQUIVO: $($pdf.Name)`n=================`n$($extraidoSeguro)`n ``;`n"
        
        Add-Content -Path "knowledge.js" -Value $contentToAppend -Encoding UTF8
        Write-Host " ---> Regras da esquila extraídas e salvas no Cérebro com sucesso!"
    } catch {
        Write-Host " ---> ERRO AO PROCESSAR $($pdf.Name): $($_.Exception.Message)"
    }
}

Write-Host "`n[SUCESSO] Operação finalizada! O aplicativo agora contém essas informações."
