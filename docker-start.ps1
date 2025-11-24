# Script para iniciar Docker (Frontend con nginx como proxy)

Write-Host "🚀 Iniciando servicios de Docker..." -ForegroundColor Cyan
Write-Host ""

# Detener todos los contenedores primero
Write-Host "⏹️  Deteniendo contenedores existentes..." -ForegroundColor Yellow
docker-compose down

Write-Host ""
Write-Host "▶️  Iniciando servicios (sin Traefik)..." -ForegroundColor Green
docker-compose up -d

# Esperar un momento
Write-Host ""
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Verificar estado
Write-Host ""
Write-Host "✅ Servicios iniciados:" -ForegroundColor Green
docker-compose ps

Write-Host ""
Write-Host "🌐 Acceso a la aplicación:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost" -ForegroundColor White
Write-Host "   Backend API: http://localhost/api/health" -ForegroundColor White
Write-Host "   PgAdmin: http://localhost:5050" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Credenciales:" -ForegroundColor Cyan
Write-Host "   Usuario: admin" -ForegroundColor White
Write-Host "   Contraseña: admin123" -ForegroundColor White
Write-Host ""
Write-Host "📝 Nota: Nginx en el frontend hace proxy al backend" -ForegroundColor Yellow
Write-Host "📝 Traefik está deshabilitado (perfil: with-traefik)" -ForegroundColor Yellow
