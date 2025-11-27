# Script para monitorear intentos de login en tiempo real
# Ejecutar en una ventana de PowerShell separada

Write-Host "=== Monitoreando intentos de login ===" -ForegroundColor Cyan
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

# Limpiar logs anteriores
docker logs backend --tail 0 --follow 2>&1 | ForEach-Object {
    if ($_ -match "login" -or $_ -match "POST" -or $_ -match "401" -or $_ -match "200") {
        $timestamp = Get-Date -Format "HH:mm:ss"
        Write-Host "[$timestamp] $_" -ForegroundColor Green
    }
}
