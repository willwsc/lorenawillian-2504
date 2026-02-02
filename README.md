# Site de Casamento - Lorena & Willian

Landing page completa e personalizável para casamento, totalmente independente de plataformas externas.

## 🎨 Características

- ✅ Landing page única com todas as seções integradas
- ✅ Design moderno e elegante
- ✅ Totalmente responsivo (mobile, tablet, desktop)
- ✅ Navegação suave entre seções
- ✅ Formulário de confirmação de presença (RSVP)
- ✅ Lista de presentes interativa
- ✅ Galeria de fotos e padrinhos
- ✅ Sem dependências externas - 100% local
- ✅ Fácil de personalizar

## 📁 Estrutura do Projeto

```
projetoCasamento/
├── index.html          # Landing page principal (única página)
├── css/
│   └── style.css       # Estilos completos e responsivos
├── js/
│   └── script.js       # Funcionalidades e interatividade
├── asssets/           # Pasta para imagens, fontes e ícones
│   ├── fonts/
│   └── icons/
└── README.md           # Este arquivo
```

## 🚀 Como Usar

### 1. Rodar Localmente

```bash
# Navegue até a pasta do projeto
cd projetoCasamento

# Inicie um servidor HTTP local
python3 -m http.server 8000 --bind 0.0.0.0
```

Acesse no navegador: **http://localhost:8000**

### 2. Personalizar

#### Cores
Edite as variáveis CSS no arquivo `css/style.css`:

```css
:root {
    --primary-color: #d4a574;    /* Cor principal */
    --secondary-color: #8b6f47;  /* Cor secundária */
    --accent-color: #f5e6d3;      /* Cor de destaque */
}
```

#### Conteúdo
- **Informações dos noivos**: Edite a seção `#sobre` no `index.html`
- **Detalhes do casamento**: Atualize data, horário e local na seção `#detalhes`
- **Padrinhos**: Adicione fotos e nomes na seção `#galeria`
- **Presentes**: Personalize a lista na seção `#presentes`

#### Imagens
1. Adicione suas imagens na pasta `asssets/` (ou crie uma pasta `images/`)
2. Substitua os placeholders de imagem pelos seus arquivos
3. Atualize os caminhos no HTML

#### Chave PIX
Edite a função `showPixInfo()` no arquivo `js/script.js` para adicionar sua chave PIX.

## 📱 Seções da Landing Page

1. **Hero/Início** - Banner principal com nomes dos noivos
2. **Sobre Nós** - História do casal
3. **O Grande Dia** - Data, horário, local e mapa
4. **Padrinhos** - Fotos e nomes dos padrinhos
5. **Confirme sua Presença** - Formulário RSVP
6. **Lista de Presentes** - Presentes disponíveis

## 🎯 Funcionalidades

### Navegação
- Menu fixo no topo
- Scroll suave entre seções
- Menu mobile responsivo
- Indicador de seção ativa

### Formulário RSVP
- Validação de campos
- Salvamento local (localStorage)
- Mensagens de confirmação
- Campos: nome, email, telefone, presença, acompanhantes, mensagem

### Lista de Presentes
- Seleção interativa de presentes
- Salvamento de escolhas (localStorage)
- Suporte para PIX com informações personalizadas

### Animações
- Fade-in ao scroll
- Efeitos hover
- Transições suaves

## 🔧 Tecnologias

- HTML5
- CSS3 (com variáveis CSS)
- JavaScript (Vanilla - sem dependências)
- Design responsivo com CSS Grid e Flexbox

## 📝 Notas

- Os dados do formulário RSVP são salvos no `localStorage` do navegador
- As escolhas de presentes também são salvas localmente
- Para produção, você pode integrar com um backend para salvar os dados em um banco de dados
- O projeto não possui dependências externas - tudo funciona offline

## 🎨 Personalização Avançada

### Adicionar Google Maps
Na seção `#detalhes`, substitua o `.mapa-placeholder` por um iframe do Google Maps:

```html
<iframe 
    src="https://www.google.com/maps/embed?pb=..." 
    width="100%" 
    height="400" 
    style="border:0;" 
    allowfullscreen="" 
    loading="lazy">
</iframe>
```

### Integrar Backend
Para salvar os dados do RSVP em um servidor, edite a função de submit no `js/script.js`:

```javascript
// Exemplo com fetch API
fetch('/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
    showMessage('Confirmação enviada com sucesso!', 'success');
});
```

## 📄 Licença

Este projeto é livre para uso pessoal. Personalize como desejar!

---

**Feito com ❤️ para o grande dia de Lorena & Willian**


## Pagamento de presentes (Mercado Pago)

A lista de presentes foi integrada com checkout online do Mercado Pago, com suporte a cartao de credito e PIX.

### Variaveis de ambiente

Configure no ambiente de deploy:

- `MP_ACCESS_TOKEN`: Access Token da conta Mercado Pago.
- `SITE_URL`: URL publica do site (ex.: `https://seusite.com`).

### Endpoint criado

- `POST /api/create-payment-preference`
  - Entrada: `{ "giftName": "Nome do presente" }`
  - Saida: URL de checkout para redirecionamento ao Mercado Pago.

### Fluxo no frontend

- Cada botao da lista de presentes abre o checkout do item correspondente.
- O retorno de status ocorre via query string (`payment_status`) com mensagens para aprovado, pendente ou falha.


### Persistencia real de presentes pagos

Para gravar compras globalmente (visivel para todos os visitantes), configure o Vercel KV e o webhook do Mercado Pago:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Com isso:

- `POST /api/mercadopago-webhook` recebe notificacoes de pagamento aprovado.
- `GET /api/gifts-status` retorna a lista de presentes ja pagos.

No Vercel, crie um banco KV em **Storage > KV** e conecte ao projeto para injetar as variaveis automaticamente.
