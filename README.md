# Whatsapp-GPT

## :scroll: Descrição

Bot do whatsapp para uso integrado com a API da OpenAI, desenvolvido em NodeJS 18 e Typescript.

## :gear: Como rodar

O primeiro passo para executar local é copiar o arquivo `.env.example` para `.env` e preencher as variáveis de ambiente.

| Variável | Descrição | Obrigatório? |
| -------- | --------- | ----------- |
| `ALLOWED_GROUPS` | Lista de grupos em que o bot pode ser utilizado. Para obter o ID de cada grupo, mude o handler no `index.ts` para `WhatsappListGroups`, onde todos os grupos serão listados com os seus respectivos IDs. |  |
| `OPENAI_API_KEY` | Chave de API da OpenAI. Para criar uma, é necessário ter uma conta criada na OpenAI. O token pode ser gerado [aqui](https://beta.openai.com/account/api-keys).  | :heavy_check_mark: |
| `SESSION_NAME` | Nome que identifica a sessão no whatsapp. Após fazer a leitura do QR Code na primeira execução, a sessão ficará salva localmente no diretório `tokens/<session-name>`, na raiz do projeto. | :heavy_check_mark: |

Com o NodeJS e o Yarn instalados, basta rodar os seguintes comandos:

```bash
# instalar dependências
$ yarn

# fazer o build do código no diretório dist
$ yarn build

# iniciar o bot
$ yarn start
```
