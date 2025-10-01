function init3DEffect() {
    const productCards = document.querySelectorAll('.product-card');
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Funktion für 3D- und Zoom-Effekt (Produktkarten)
    function applyProductCardEffects(card) {
        let isHovering = false;
        let animationFrameId = null;
        let lastX = 0;
        let lastY = 0;
        let lastTime = performance.now();
        let scale = 1;
        let hoverTimeout = null;
        const damping = 0.2;
        const velocityThreshold = 100;

        function updateTransform(x, y, rect, deltaTime) {
            lastX = lastX + (x - lastX) * damping;
            lastY = lastY + (y - lastY) * damping;

            const velocityX = Math.abs(x - lastX) / deltaTime;
            const velocityY = Math.abs(y - lastY) / deltaTime;
            const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            const smoothingFactor = velocity > velocityThreshold ? damping * 0.5 : damping;

            lastX = lastX + (x - lastX) * smoothingFactor;
            lastY = lastY + (y - lastY) * smoothingFactor;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((centerY - lastY) / centerY) * 15;
            const rotateY = ((lastX - centerX) / centerX) * 15;
            
            card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale}) translateZ(50px)`;
            card.style.boxShadow = `0 8px 32px rgba(255, 0, 0, ${0.5 + scale * 0.3})`;
        }

        const updateZoom = () => {
            if (!isHovering) return;
            const currentTime = performance.now();
            const hoverTime = (currentTime - lastTime) / 1000;
            
            scale = 1 + 0.3 * (1 - Math.exp(-hoverTime));
            
            const rect = card.getBoundingClientRect();
            updateTransform(lastX, lastY, rect, (currentTime - lastTime) / 1000);
            lastTime = currentTime;
            
            animationFrameId = requestAnimationFrame(updateZoom);
        };

        card.addEventListener('mouseenter', () => {
            isHovering = true;
            card.style.transition = 'transform 0.3s ease-out, z-index 0s';
            lastTime = performance.now();
            
            hoverTimeout = setTimeout(() => {
                card.style.zIndex = '10';
                animationFrameId = requestAnimationFrame(updateZoom);
            }, 2000);
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            updateTransform(x, y, rect, (performance.now() - lastTime) / 1000);
        });

        card.addEventListener('mouseleave', () => {
            isHovering = false;
            clearTimeout(hoverTimeout);
            cancelAnimationFrame(animationFrameId);
            scale = 1;
            lastX = 0;
            lastY = 0;
            card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1), z-index 0s';
            card.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)';
            card.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.5)';
            card.style.zIndex = '1';
        });
    }

    // Funktion für 3D-Effekt ohne Zoom (Feature-Karten)
    function applyFeatureCardEffects(card) {
        let lastX = 0;
        let lastY = 0;
        const damping = 0.2;
        const velocityThreshold = 100;

        const updateTransform = (x, y, rect, deltaTime) => {
            lastX = lastX + (x - lastX) * damping;
            lastY = lastY + (y - lastY) * damping;

            const velocityX = Math.abs(x - lastX) / deltaTime;
            const velocityY = Math.abs(y - lastY) / deltaTime;
            const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            const smoothingFactor = velocity > velocityThreshold ? damping * 0.5 : damping;

            lastX = lastX + (x - lastX) * smoothingFactor;
            lastY = lastY + (y - lastY) * smoothingFactor;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((centerY - lastY) / centerY) * 15;
            const rotateY = ((lastX - centerX) / centerX) * 15;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            card.style.boxShadow = `0 8px 32px rgba(255, 0, 0, 0.6)`;
        };

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            updateTransform(x, y, rect, 0.016);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
            card.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.5)';
        });
    }

    // Produktkarten initialisieren
    productCards.forEach(card => {
        applyProductCardEffects(card);
    });

    // Feature-Karten initialisieren
    featureCards.forEach(card => {
        applyFeatureCardEffects(card);
    });

    // Event-Listener für Lizenzoptionen
    document.addEventListener('click', function(e) {
        if (e.target.closest('.license-option')) {
            const options = e.target.closest('#licenseOptions').querySelectorAll('.license-option');
            options.forEach(opt => opt.classList.remove('selected'));
            e.target.closest('.license-option').classList.add('selected');
            const price = parseFloat(e.target.closest('.license-option').dataset.price);
            updateCryptoAmount(price);
        }
    });
}

// Initialisieren der 3D-Effekte nach dem Laden des DOM
document.addEventListener('DOMContentLoaded', init3DEffect);