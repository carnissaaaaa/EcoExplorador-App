# 🌿 EcoExplorador — Biomas do Brasil

O **EcoExplorador** é um aplicativo mobile desenvolvido em **React Native** com **Expo (SDK 56)** e **TypeScript**. Seu objetivo principal é educar e conscientizar os usuários sobre a rica biodiversidade do Brasil, exibindo informações geográficas, fauna, flora, curiosidades e estatísticas de desmatamento/preservação dos 6 biomas brasileiros (Amazônia, Caatinga, Cerrado, Mata Atlântica, Pampa e Pantanal).

---

## 👥 Membros da Equipe (Grupo Ecoexplorador)
*   [João Kelvin Monteiro Veras]
*   [Davi César Batista Monteiro]
*   [Kauê Lázaro Damasceno]
*   [Davi Batista de Morais]
*   [João Gabriel da Silva Antunes]
*   [Ronald Teobaldo dos Santos]

---

## 🚀 Funcionalidades do Aplicativo

### 🔒 1. Tela de Login e Validação Segura
*   Interface moderna com animações de círculos flutuantes em segundo plano.
*   Validação estrita de e-mail e regras de senha escolar (mínimo de 6 caracteres, contendo pelo menos 1 maiúscula, 1 minúscula e 1 número).
*   Visualização/ocultação de senha interativa.
*   Modal estilizado para tratamento de erros e informações.

### 🏠 2. Painel Principal (Home Dashboard)
*   **Você Sabia? (Eco-Fatos):** Card informativo dinâmico que rotaciona curiosidades ecológicas a cada 8 segundos com transições de esmaecimento.
*   **Busca em Tempo Real:** Barra de pesquisa para filtrar os cards de bioma reativamente à medida que você digita.
*   **Cards de Biomas:** Listagem interativa com imagens de alta definição brasileiras e autênticas, taxa de desmatamento e links de exploração.

### 🍃 3. Tela de Detalhes do Bioma
*   **Aba "Sobre":** Resumo descritivo, tipo de solo e curiosidades detalhadas de cada ecossistema.
*   **Aba "Fauna" e "Flora":** Grid moderno exibindo a biodiversidade animal e vegetal representativa de cada bioma com ícones personalizados.
*   **Estilização Premium:** Imagem de cabeçalho centralizada com bordas arredondadas e margens alinhadas.

### 📊 4. Gráfico Comparativo Interativo
*   Substituição do antigo mapa por um painel de gráficos interativos horizontais.
*   Métricas de **Território**, **Desmatamento (Desmate)** e **Área Preservada** (calculada dinamicamente via fórmula $100\% - desmatamento$).
*   Micro-animações de expansão de largura das barras (mola/timing) e pulsação sutil no bioma selecionado.

### 🛡️ 5. Tela de Preservação e Sustentabilidade
*   **Ações Práticas Interativas:** Linha de balões de ícones (*Gestão de Resíduos, Reduzir Plástico, Mobilidade Sustentável, Plantar Árvores*) que exibem explicações dinâmicas ao clique.
*   **Consumo Consciente:** Dicas modernas sobre redução de recursos.
*   **Apoio a ONGs:** Divulgação de instituições ecológicas nacionais como SOS Mata Atlântica, WWF Brasil e IPÊ.

### 🍔 6. Navegação Lateral (Side Menu)
*   Drawer customizado exibindo informações do usuário logado, navegação direta para todas as telas e função de logout seguro.

---

## 🛠️ Tecnologias Utilizadas
*   **React Native** e **Expo (SDK 56)**
*   **TypeScript** (compilação e tipagem estática)
*   **React Navigation** (Navegação em pilha e telas isoladas)
*   **Expo Vector Icons** (Ionicons)
*   **React Native Web** (Compatibilidade responsiva em navegadores)

---

## 💻 Como Executar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter instalado em seu computador:
*   [Node.js](https://nodejs.org/) (recomendado versão 18 ou superior)
*   Gerenciador de pacotes `npm` ou `yarn`

### 1. Clonar o repositório
```bash
git clone https://github.com/carnissaaaaa/EcoExplorador-App.git
cd meu-app
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Iniciar o Metro Bundler
```bash
npm start
```
*   Pressione `w` no terminal para rodar no **Navegador Web** (React Native Web).
*   Pressione `a` para rodar no emulador **Android**.
*   Escaneie o QR Code exibido pelo terminal usando o aplicativo do **Expo Go** em seu celular físico.

---

## 📦 Como Compilar o APK (Processo de Build EAS)

O projeto está configurado para compilar na nuvem da Expo gerando um arquivo `.apk` diretamente para testes:

1.  **Instalar o EAS CLI globalmente**:
    ```bash
    npm install -g eas-cli
    ```
2.  **Efetuar login na sua conta da Expo**:
    ```bash
    eas login
    ```
3.  **Configurar o projeto (Apenas na primeira execução)**:
    ```bash
    eas build:configure
    ```
4.  **Gerar o APK na nuvem**:
    ```bash
    eas build -p android --profile preview
    ```
5.  **Download do APK:** Ao final da compilação na nuvem, o terminal fornecerá um link de download direto e um **QR Code**. Faça o download e renomeie o arquivo para `ecoexplorador.apk`.

---

## 📸 Capturas de Tela
As capturas de tela das principais interfaces do aplicativo estão salvas na pasta:
*   `./screenshots/` (ou no anexo do Relatório da Equipe).
