
## Por que o ATS Flow existe

Muitos criadores de currículos:

- bloqueiam recursos básicos atrás de paywalls  
- armazenam seus dados em plataformas de terceiros  
- geram PDFs que quebram a leitura por ATS  
- priorizam aparência visual em vez de legibilidade por máquinas  

O ATS Flow segue um caminho diferente:

- **ATS-first** — coluna única, estrutura limpa e amigável a parsers  
- **Content-first** — seu currículo vive em dados estruturados  
- **Reprodutível** — a mesma entrada gera sempre o mesmo resultado  
- **Privacidade em primeiro lugar** — sem contas, rastreamento ou analytics  
- **Aberto e portátil** — exporte a qualquer momento, hospede onde quiser  

## Funcionalidades

### Criação de currículo
- Editor visual com preview em tempo real  
- Importação / exportação de dados JSON  
- Renderização de layout em tempo real  
- Exportação de PDF com um clique  

### Otimização para ATS
- Estrutura em coluna única  
- HTML semântico limpo  
- Tipografia e espaçamento amigáveis a parsers  
- Links clicáveis preservados no PDF  

### Privacidade e controle
- Nenhuma conta necessária  
- Execução local (serviço de PDF hospedado é opcional)  

## Exemplo de saída

PDF A4 pronto para impressão

<table>
<tr>
<td>
<img src="packages/web/public/examples/cv-example.png" alt="Example" width="300" />
</td>
</tr>
</table>

## Início rápido

```bash
# Clonar o repositório
git clone https://github.com/fabriciotrinndade/ats-resume-generator-html

# Instalar dependências
pnpm install

# Build dos pacotes internos (obrigatório)
pnpm -r build
```

Configurar ambiente:

```bash
# Copiar arquivo de exemplo
cp packages/web/.env.example packages/web/.env.local
```

Edite `packages/web/.env.local`:

```env
# Opção A: serviço PDF local (Docker)
VITE_PDF_SERVICE_URL=http://localhost:3000

# Opção B: serviço PDF hospedado
# VITE_PDF_SERVICE_URL=https://your-service.onrender.com
```

Inicie o editor web:

```
pnpm -C packages/web dev
```

Abra:

```
http://localhost:5173
```

Executar exportação PDF localmente (Docker):

```bash
# Construir a imagem
docker build -t ats-pdf-service ./services/pdf

# Rodar o serviço
docker run --rm -p 3000:3000 ats-pdf-service
```

Usando um serviço PDF hospedado:

```VITE_PDF_SERVICE_URL=https://your-service.onrender.com```

Nenhuma configuração local necessária.

## Tech Stack

| Categoria	        | Tecnologia                       |
| ---------------   | -------------------------------- |
| Frontend	        | React + Vite                     |
| Linguagem	        | TypeScript + JavaScript          |
| Estilização	        | Tailwind CSS                     |
| PDF Service       | Node.js + Express                |
| PDF Engine	     | Puppeteer Core                   |
| Headless          | Chromium	@sparticuz/chromium   |
| Gerenciador pacotes	  | pnpm workspaces                  |
| Containerização  | Docker (pdf-service)             |
| Runtime	        | Node.js                          |

## Contribuindo

Contribuições são bem-vindas.

- Faça um fork do repositório

- Crie uma branch

- Commit suas alterações

- Abra um Pull Request