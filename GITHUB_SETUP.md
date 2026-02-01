# 🚀 Guia para Push no GitHub

O repositório Git já está inicializado e pronto para ser enviado ao GitHub!

## 📋 Passos para fazer Push no GitHub

### 1. Criar o Repositório no GitHub

1. Acesse [GitHub.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Preencha:
   - **Repository name**: `projeto-casamento` (ou o nome que preferir)
   - **Description**: "Site de casamento - Landing page completa"
   - **Visibility**: Escolha Public ou Private
   - **NÃO marque** "Initialize this repository with a README" (já temos um)
5. Clique em **"Create repository"**

### 2. Conectar o Repositório Local ao GitHub

Após criar o repositório no GitHub, você verá uma página com instruções. Use os comandos abaixo:

```bash
# Adicionar o remote (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/projeto-casamento.git

# Ou se preferir usar SSH:
# git remote add origin git@github.com:SEU_USUARIO/projeto-casamento.git

# Verificar se foi adicionado corretamente
git remote -v
```

### 3. Fazer o Push

```bash
# Enviar o código para o GitHub
git push -u origin main
```

Se for a primeira vez usando HTTPS, o GitHub pode pedir suas credenciais.

### 4. Verificar no GitHub

Acesse seu repositório no GitHub e verifique se todos os arquivos foram enviados corretamente!

## 📁 Estrutura que será enviada

```
projetoCasamento/
├── .gitignore          # Arquivos ignorados pelo Git
├── README.md           # Documentação do projeto
├── index.html          # Landing page principal
├── css/
│   └── style.css       # Estilos
├── js/
│   └── script.js       # JavaScript
├── asssets/            # Assets (fonts, icons)
├── detalhes.html       # (arquivo antigo - pode remover)
├── galeria.html        # (arquivo antigo - pode remover)
├── presentes.html      # (arquivo antigo - pode remover)
└── rsvp.html           # (arquivo antigo - pode remover)
```

**Nota:** Os arquivos `detalhes.html`, `galeria.html`, `presentes.html` e `rsvp.html` são da versão antiga (múltiplas páginas). A nova landing page está toda no `index.html`. Você pode removê-los se quiser.

## 🔄 Comandos Git Úteis

```bash
# Ver status dos arquivos
git status

# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para o GitHub
git push

# Ver histórico de commits
git log

# Ver branches
git branch
```

## 🌐 GitHub Pages (Opcional)

Para hospedar o site gratuitamente no GitHub Pages:

1. No repositório do GitHub, vá em **Settings**
2. Role até **Pages** no menu lateral
3. Em **Source**, selecione **main** branch
4. Clique em **Save**
5. Seu site estará disponível em: `https://SEU_USUARIO.github.io/projeto-casamento`

## ✅ Checklist

- [x] Repositório Git inicializado
- [x] Arquivo .gitignore criado
- [x] README.md criado
- [x] Commit inicial feito
- [ ] Repositório criado no GitHub
- [ ] Remote adicionado
- [ ] Push realizado
- [ ] GitHub Pages configurado (opcional)

---

**Boa sorte com o push! 🎉**
