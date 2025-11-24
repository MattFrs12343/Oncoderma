# Script para reconstruir el frontend con la nueva configuración

Write-Host "🔄 Reconstruyendo el frontend..." -ForegroundColor Cyan

# Detener el contenedor del frontend
Write-Host "⏹️  Deteniendo contenedor del frontend..." -ForegroundColor Yellow
docker-compose stop frontend

# Reconstruir la imagen del frontend
Write-Host "🔨 Reconstruyendo imagen del frontend..." -ForegroundColor Yellow
docker-compose build frontend

# Iniciar el contenedor del frontend
Write-Host "▶️  Iniciando contenedor del frontend..." -ForegroundColor Yellow
docker-compose up -d frontend

Write-Host "✅ Frontend reconstruido exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Ahora puedes acceder a tu aplicación desde Cloudflare Tunnel" -ForegroundColor Cyan
Write-Host "   URL: https://inexpensive-twins-utc-organised.trycloudflare.com" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Credenciales de prueba:" -ForegroundColor Cyan
Write-Host "   Usuario: admin" -ForegroundColor White
Write-Host "   Contraseña: admin123" -ForegroundColor White
