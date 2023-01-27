# Whatsapp-GPT

## :scroll: Descrição

Bot do whatsapp para uso integrado com a API da OpenAI, desenvolvido em NodeJS e Typescript.

## :gear: Parâmetros (variáveis de ambiente)

| Variável | Usado no handler | Descrição | Obrigatório? |
| -------- | --------- | ----------- | ------------ |
| `ALLOWED_GROUPS` | ai  | Lista de grupos em que o bot pode ser utilizado. Para obter o ID de cada grupo, mude o handler no `index.ts` para `WhatsappListGroups`, onde todos os grupos serão listados com os seus respectivos IDs. | |
| `AI_WHITELIST` | ai | Lista de usuários em que o bot pode ser utilizado via DM. A lista deve conter o ID dos usuários, esse ID segue o seguinte formato (*número do telefone completo*@c.us). Ex: `55998765432@c.us`. Se essa env não for definida, todos os usuários da DM podem utilizar o bot. | |
| `AUTO_SEEN_GROUPS` | auto_seen_groups | Lista de grupos em que o bot deve marcar as mensagens como lidas automaticamente. | |
| `HANDLERS` | * | Lista de handlers que serão utilizados, separados por vírgula (ver na tabela abaixo). | :heavy_check_mark: |
| `OPENAI_API_KEY` | ai | Chave de API da OpenAI. Para criar uma, é necessário ter uma conta criada na OpenAI. O token pode ser gerado [aqui](https://beta.openai.com/account/api-keys). | :heavy_check_mark: |
| `SESSION_NAME` | * | Nome que identifica a sessão no whatsapp. Após fazer a leitura do QR Code na primeira execução, a sessão ficará salva localmente no diretório `tokens/<session-name>`, na raiz do projeto. | :heavy_check_mark: |

### Handlers

Os handlers são basicamente as funcionalidades que o bot pode ter. Cada handler é responsável por uma funcionalidade específica, e podem ser utilizados em conjunto. A tabela abaixo lista os handlers disponíveis e suas respectivas classes:

| Handler | Classe | Descrição |
| ------- | --------- | ----------- |
| **ai** | WhatsappAIHandler | Handler que utiliza a API da OpenAI para responder as mensagens. |
| **auto_seen_groups** | WhatsappAutoSeenGroups | Marca as mensagens de grupos "indesejados" como lidas automaticamente. |
| **list_contacts** | WhatsappListContacts | Lista todos os contatos de conversa do usuário logado (bot). |
| **list_groups** | WhatsappListGroups | Lista todos os grupos do usuário logado (bot). |

## :running_man: Execução

O primeiro passo para executar localmente é copiar o arquivo `.env.example` para `.env` e preencher as variáveis de acordo com os handlers que forem usados, conforme as tabelas acima.

Com o NodeJS e o Yarn instalados, basta rodar os seguintes comandos:

```bash
# instalar dependências
$ yarn

# fazer o build do código no diretório dist
$ yarn build

# iniciar o bot
$ yarn start
```
