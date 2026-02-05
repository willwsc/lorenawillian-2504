// Navegação suave e funcionalidades da landing page

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== NAVEGAÇÃO SUAVE ==========
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    
    // Adicionar evento de clique suave para todos os links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                const nav = document.getElementById('nav');
                nav.classList.remove('active');

                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
     
            }
        });
    });
    
    // ========== HEADER SCROLL EFFECT ==========
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Atualizar link ativo baseado na seção visível
        updateActiveNavLink();
        
        lastScroll = currentScroll;
    });
    
    // ========== ATUALIZAR LINK ATIVO NA NAVEGAÇÃO ==========
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('.section, .hero');
        const scrollPosition = window.pageYOffset + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
        // ========== MENU MOBILE TOGGLE ==========
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');

            // aria-expanded (acessibilidade)
            menuToggle.setAttribute('aria-expanded', nav.classList.contains('active') ? 'true' : 'false');

            // travar scroll do body quando menu estiver aberto
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';

            // Animar o botão hamburger
            const spans = menuToggle.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    
        // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('active');

            // aria-expanded (acessibilidade)
            menuToggle.setAttribute('aria-expanded', 'false');

            // destravar scroll
            document.body.style.overflow = '';

            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    
    // ========== FORMULÁRIO RSVP ==========
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpMessage = document.getElementById('rsvpMessage');
    
    if (rsvpForm) {
        const submitButton = rsvpForm.querySelector('button[type="submit"]');
        const acompanhantesInput = document.getElementById('acompanhantes');
        const membrosFamiliaGroup = document.getElementById('membrosFamiliaGroup');
        const membrosFamiliaInput = document.getElementById('membrosFamilia');

        const setAcompanhantesDefault = () => {
            if (!acompanhantesInput) {
                return;
            }

            acompanhantesInput.value = '0';
        };

        const toggleMembrosFamiliaField = () => {
            if (!acompanhantesInput || !membrosFamiliaGroup || !membrosFamiliaInput) {
                return;
            }

            const acompanhantesCount = Number.parseInt(acompanhantesInput.value, 10);
            const hasAcompanhantes = Number.isFinite(acompanhantesCount) && acompanhantesCount > 0;

            membrosFamiliaGroup.hidden = !hasAcompanhantes;
            membrosFamiliaInput.required = hasAcompanhantes;

            if (!hasAcompanhantes) {
                membrosFamiliaInput.value = '';
            }
        };

        if (acompanhantesInput) {
            acompanhantesInput.addEventListener('input', toggleMembrosFamiliaField);
            acompanhantesInput.addEventListener('change', toggleMembrosFamiliaField);
        }

        setAcompanhantesDefault();
        toggleMembrosFamiliaField();

        rsvpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Obter valores do formulario
            const formData = {
                nome: document.getElementById('nome').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefone: document.getElementById('telefone').value.trim(),
                presenca: document.getElementById('presenca').value,
                acompanhantes: document.getElementById('acompanhantes').value,
                membrosFamilia: membrosFamiliaInput ? membrosFamiliaInput.value.trim() : '',
                mensagem: document.getElementById('mensagem').value.trim()
            };
            
            // Validacao basica
            if (!formData.nome || !formData.email || !formData.presenca) {
                showMessage('Por favor, preencha todos os campos obrigatorios!', 'error');
                return;
            }
            
            // Validacao de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showMessage('Por favor, insira um e-mail valido!', 'error');
                return;
            }

            const originalButtonText = submitButton ? submitButton.textContent : '';
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
            }

            try {
                const response = await fetch('/api/rsvp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const result = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(result.error || 'Falha ao enviar.');
                }

                showMessage('Obrigado pela confirmacao! Sua presenca e muito importante para nos.', 'success');
                saveRSVPToLocalStorage(formData);
                
                setTimeout(() => {
                    rsvpForm.reset();
                    setAcompanhantesDefault();
                    toggleMembrosFamiliaField();
                    hideMessage();
                }, 5000);
            } catch (err) {
                showMessage('Nao foi possivel enviar agora. Tente novamente.', 'error');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }
        });
    }

    function showMessage(message, type) {
        rsvpMessage.textContent = message;
        rsvpMessage.className = `rsvp-message ${type}`;
        rsvpMessage.style.display = 'block';
        
        // Scroll suave até a mensagem
        rsvpMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    function hideMessage() {
        rsvpMessage.style.display = 'none';
        rsvpMessage.className = 'rsvp-message';
    }

        // ========== MAPA (alternar Capela / Recepção) ==========
    (function mapToggle() {
    const mapFrame = document.getElementById('mapFrame');
    const mapTitle = document.getElementById('mapTitle');
    const mapAddress = document.getElementById('mapAddress');
    const mapLink = document.getElementById('mapLink');

    const btnCapela = document.getElementById('btnCapela');
    const btnRecepcao = document.getElementById('btnRecepcao');

    if (!mapFrame || !mapTitle || !mapAddress || !mapLink || !btnCapela || !btnRecepcao) return;

    const locais = {
        capela: {
            title: "Capela Sagrada Família",
            address: "Endereço: Av. José Ventura, 599 — Londrina/PR",
            embed: "https://www.google.com/maps?q=Av.%20Jos%C3%A9%20Ventura,%20599,%20Londrina%20PR&output=embed",
            link: "https://www.google.com/maps/search/?api=1&query=Av.+Jos%C3%A9+Ventura,+599,+Londrina+PR"
        },
        recepcao: {
            title: "Chácara Recanto da Paz",
            address: "Endereço: Estrada Canaã, 1135 — Londrina/PR",
            embed: "https://www.google.com/maps?q=Estrada%20Cana%C3%A3,%201135,%20Londrina%20PR&output=embed",
            link: "https://www.google.com/maps/search/?api=1&query=Estrada+Cana%C3%A3,+1135,+Londrina+PR"
        }
    };


    function setLocal(tipo) {
        const local = locais[tipo];
        mapTitle.textContent = local.title;
        mapAddress.textContent = local.address;
        mapFrame.src = local.embed;
        mapLink.href = local.link;

        btnCapela.classList.toggle('active', tipo === 'capela');
        btnRecepcao.classList.toggle('active', tipo === 'recepcao');
    }

    btnCapela.addEventListener('click', () => setLocal('capela'));
    btnRecepcao.addEventListener('click', () => setLocal('recepcao'));

    // inicia com Capela
    setLocal('capela');
    })();

    
    function saveRSVPToLocalStorage(data) {
        try {
            let rsvpData = JSON.parse(localStorage.getItem('rsvpData')) || [];
            data.timestamp = new Date().toISOString();
            rsvpData.push(data);
            localStorage.setItem('rsvpData', JSON.stringify(rsvpData));
        } catch (e) {
            console.log('Não foi possível salvar no localStorage:', e);
        }
    }
    
    // ========== FUNCIONALIDADE DE PRESENTES (MERCADO PAGO) ==========
    const presenteButtons = document.querySelectorAll('.btn-presente');

    (function initPresentesPayment() {
        if (!presenteButtons.length) return;

        function getButtonByGiftId(giftId) {
            return Array.from(presenteButtons).find(
                btn => btn.getAttribute('data-presente') === giftId
            );
        }

        function getGiftLabel(button, fallback) {
            return button?.getAttribute('data-presente-label') || fallback;
        }

        function applyMassGiftImages() {
            const extensions = ['webp', 'jpg', 'jpeg', 'png'];

            function loadByExtension(imgElement, giftId, extIndex, onSuccess, onFail) {
                if (extIndex >= extensions.length) {
                    onFail();
                    return;
                }

                const extension = extensions[extIndex];
                imgElement.onload = onSuccess;
                imgElement.onerror = function handleImageError() {
                    loadByExtension(imgElement, giftId, extIndex + 1, onSuccess, onFail);
                };
                imgElement.src = `images/presentes/${giftId}.${extension}`;
            }

            presenteButtons.forEach((button) => {
                const giftId = button.getAttribute('data-presente');
                if (!giftId) return;

                const imageContainer = button.closest('.presente-card')?.querySelector('.presente-image');
                const placeholder = imageContainer?.querySelector('.image-placeholder-presente');

                if (!imageContainer || !placeholder || imageContainer.querySelector('img')) {
                    return;
                }

                const giftLabel = getGiftLabel(button, giftId);
                const image = document.createElement('img');
                image.loading = 'lazy';
                image.alt = giftLabel;

                loadByExtension(
                    image,
                    giftId,
                    0,
                    () => {
                        placeholder.remove();
                        imageContainer.appendChild(image);
                    },
                    () => {
                        image.remove();
                    }
                );
            });
        }

        function marcarPresenteComoPago(giftId) {
            const button = getButtonByGiftId(giftId);
            if (!button) return;

            const giftLabel = getGiftLabel(button, giftId);

            button.disabled = true;
            button.textContent = 'Pago com sucesso!';
            button.style.display = '';
            button.style.backgroundColor = '#28a745';

            const card = button.closest('.presente-card');
            if (!card || card.querySelector('.confirmacao')) return;

            const confirmacao = document.createElement('div');
            confirmacao.className = 'confirmacao';
            confirmacao.innerHTML = `
                <p>Presente recebido pelos noivos: <strong>${giftLabel}</strong></p>
            `;
            card.appendChild(confirmacao);
        }

        async function carregarPresentesPagos() {
            try {
                const response = await fetch('/api/gifts-status');
                const result = await response.json().catch(() => ({}));
                if (!response.ok || !Array.isArray(result.paidGifts)) {
                    return;
                }

                result.paidGifts.forEach(marcarPresenteComoPago);
            } catch (error) {
                console.log('Nao foi possivel carregar status dos presentes:', error);
            }
        }

        const params = new URLSearchParams(window.location.search);
        const paymentStatus = params.get('payment_status');
        const giftId = params.get('gift');

        if (paymentStatus) {
            const statusMessage = {
                approved: 'Pagamento aprovado! Muito obrigado pelo presente e carinho. ❤',
                pending: 'Pagamento pendente. Assim que for confirmado, ele aparecera no Mercado Pago.',
                failure: 'Pagamento nao concluido. Voce pode tentar novamente a qualquer momento.'
            };

            const giftButton = giftId ? getButtonByGiftId(giftId) : null;
            const giftLabel = giftButton ? getGiftLabel(giftButton, giftId) : giftId;

            const message = statusMessage[paymentStatus] || 'Status de pagamento recebido.';
            alert(giftLabel ? `${message}\n\nPresente: ${giftLabel}` : message);

            if (paymentStatus === 'approved' && giftId) {
                marcarPresenteComoPago(giftId);
            }

            params.delete('payment_status');
            params.delete('gift');
            const cleanQuery = params.toString();
            const cleanUrl = `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ''}${window.location.hash}`;
            window.history.replaceState({}, document.title, cleanUrl);
        }

        presenteButtons.forEach(button => {
            if (!button.disabled) {
                button.textContent = 'Pagar com Pix ou Cartao';
            }

            button.addEventListener('click', async function() {
                const giftId = this.getAttribute('data-presente');
                const giftLabel = getGiftLabel(this, giftId);

                if (!giftId) return;

                const confirmar = confirm(
                    `Voce sera redirecionado(a) ao Mercado Pago para pagar "${giftLabel}" com Pix ou cartao. Deseja continuar?`
                );

                if (!confirmar) return;

                const originalText = this.textContent;
                this.disabled = true;
                this.textContent = 'Gerando pagamento...';

                try {
                    const response = await fetch('/api/create-payment-preference', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            giftName: giftId,
                            giftLabel,
                            origin: window.location.origin,
                            siteUrl: window.location.origin
                        })
                    });

                    const result = await response.json().catch(() => ({}));

                    if (!response.ok) {
                        throw new Error(result.error || 'Nao foi possivel iniciar o pagamento.');
                    }

                    const checkoutUrl = result.checkoutUrl || result.sandboxCheckoutUrl;
                    if (!checkoutUrl) {
                        throw new Error('Link de pagamento indisponivel.');
                    }

                    window.location.href = checkoutUrl;
                } catch (error) {
                    alert(error.message || 'Erro ao iniciar pagamento. Tente novamente.');
                    this.disabled = false;
                    this.textContent = originalText;
                }
            });
        });

        applyMassGiftImages();
        carregarPresentesPagos();
    })();
    // ========== ANIMAÇÃO DE ELEMENTOS AO SCROLL ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animateElements = document.querySelectorAll('.detalhe-card, .padrinho-card, .presente-card, .galeria-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ========== INICIALIZAÇÃO ==========
    // Definir link ativo inicial
    if (window.pageYOffset < 100) {
        const inicioLink = document.querySelector('a[href="#inicio"]');
        if (inicioLink) {
            inicioLink.classList.add('active');
        }
    }
    
    // Prevenir comportamento padrão de links vazios
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });

        // ========== CONTAGEM REGRESSIVA ==========
    (function countdown() {
    const d = document.getElementById('cdDays');
    const h = document.getElementById('cdHours');
    const m = document.getElementById('cdMinutes');
    const s = document.getElementById('cdSeconds');

    if (!d || !h || !m || !s) return;

    // 25/04/2026 17:00 (hora local)
    const weddingDate = new Date(2026, 3, 25, 17, 0, 0);

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
        const now = new Date();
        const diff = weddingDate.getTime() - now.getTime();

        // DEBUG (olhe no console do navegador: F12)
        console.log('NOW:', now.toString());
        console.log('WEDDING:', weddingDate.toString());
        console.log('DIFF(ms):', diff);

        if (diff <= 0) {
        d.textContent = '00';
        h.textContent = '00';
        m.textContent = '00';
        s.textContent = '00';
        return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        d.textContent = pad(days);
        h.textContent = pad(hours);
        m.textContent = pad(minutes);
        s.textContent = pad(seconds);
    }

    tick();
    setInterval(tick, 1000);
    })();


    
    console.log('🎉 Site de casamento carregado com sucesso!');
});















