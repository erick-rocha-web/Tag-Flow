// ==============================
// Sidebar toggle + comportamento por breakpoint (desktop abre / mobile fecha)
// + mede altura real do header (pra sidebar ficar perfeita no mobile)
// ==============================
const toggleBtn = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const topbar = document.querySelector(".topbar");

const MOBILE_BREAKPOINT = 900; // <= 900: começa fechado

function setExpanded(isOpen) {
  if (!toggleBtn) return;
  toggleBtn.setAttribute("aria-expanded", String(isOpen));
}

function setSidebarOpen(isOpen) {
  if (!sidebar) return;
  sidebar.classList.toggle("closed", !isOpen);
  setExpanded(isOpen);
}

function measureTopbarHeight() {
  if (!topbar) return;
  const h = Math.ceil(topbar.getBoundingClientRect().height);
  document.documentElement.style.setProperty("--topbar-h", `${h}px`);
}

function applyInitialSidebarState() {
  // Desktop: aberto | Tablet/Mobile: fechado
  const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
  setSidebarOpen(!isMobile);
}

if (toggleBtn && sidebar) {
  // mede altura logo no início
  measureTopbarHeight();

  // define estado inicial correto por tela
  applyInitialSidebarState();

  // toggle manual
  toggleBtn.addEventListener("click", () => {
    const willOpen = sidebar.classList.contains("closed");
    setSidebarOpen(willOpen);
    // se header mudou por quebrar linha, mede de novo
    measureTopbarHeight();
  });

  // se redimensionar (ou girar o celular), ajusta:
  // - altura do header
  // - estado inicial (desktop aberto / mobile fechado)
  window.addEventListener("resize", () => {
    measureTopbarHeight();
    applyInitialSidebarState();
  });

  // garante medida após fontes/layout assentarem
  window.addEventListener("load", () => {
    measureTopbarHeight();
  });
}

// ==============================
// Helpers de normalização
// ==============================
function norm(str) {
  return (str || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[<>/.,;:!?()"']/g, " ") // limpa pontuação
    .replace(/\s+/g, " ")
    .trim();
}

// Palavras que a gente IGNORA na busca (stopwords)
const STOPWORDS = new Set([
  "tag", "tags", "html", "do", "da", "de", "dos", "das",
  "para", "pra", "pro", "por", "em", "no", "na", "nos", "nas",
  "um", "uma", "uns", "umas",
  "como", "usar", "uso", "exemplo", "mostra", "mostrar",
  "preciso", "qual", "quais", "o", "a", "os", "as",
  "me", "ajuda", "ajudar", "sobre", "com", "sem",

  // extras
  "quero", "queria", "pode", "poderia", "fazer", "colocar", "criar",
  "explicar", "explicacao", "explicação", "dizer", "mostre",
  "aqui", "isso", "essa", "esse", "essas", "esses",
  "deixa", "deixar", "porfavor", "por", "favor"
]);

function tokenize(query) {
  const cleaned = norm(query);
  if (!cleaned) return [];

  const tokens = cleaned
    .split(" ")
    .map(t => t.trim())
    .filter(Boolean)
    .filter(t => !STOPWORDS.has(t));

  // remove "tag" grudado (ex: "tagimagem")
  return tokens.map(t => t.replace(/^tag/, ""));
}

// ==============================
// Aliases (sinônimos PT/EN) -> key da TAG
// ==============================
const ALIAS_MAP = {
  // --- doctype ---
  "doctype": "doctype",
  "doctype html": "doctype",
  "declaracao": "doctype",
  "declaracao do html": "doctype",
  "declaracao html": "doctype",
  "declaracao do documento": "doctype",
  "tipo do documento": "doctype",
  "versao do html": "doctype",
  "html5": "doctype",

  // --- html (raiz) ---
  "html": "html",
  "tag html": "html",
  "documento": "html",
  "documento html": "html",
  "raiz": "html",
  "tag raiz": "html",
  "elemento raiz": "html",
  "pagina": "html",
  "página": "html",
  "estrutura do documento": "html",

  // --- head ---
  "head": "head",
  "cabeca": "head",
  "cabeça": "head",
  "metadados": "head",
  "dados da pagina": "head",
  "dados da página": "head",
  "informacoes da aba": "head",
  "informações da aba": "head",
  "titulo da aba": "head",
  "título da aba": "head",
  "favicon": "head",
  "link do css": "head",
  "importar css": "head",
  "script no head": "head",
  "meta": "head",
  "charset": "head",
  "viewport": "head",

  // --- body ---
  "body": "body",
  "corpo": "body",
  "conteudo": "body",
  "conteúdo": "body",
  "conteudo visivel": "body",
  "conteúdo visível": "body",
  "parte visivel": "body",
  "o que aparece": "body",

  // --- header ---
  "header": "header",
  "cabecalho": "header",
  "cabeçalho": "header",
  "topo": "header",
  "parte de cima": "header",
  "area superior": "header",
  "área superior": "header",

  // --- nav ---
  "nav": "nav",
  "menu": "nav",
  "menu de navegacao": "nav",
  "menu de navegação": "nav",
  "navegacao": "nav",
  "navegação": "nav",
  "barra de navegacao": "nav",
  "barra de navegação": "nav",
  "links do menu": "nav",

  // --- main ---
  "main": "main",
  "principal": "main",
  "conteudo principal": "main",
  "conteúdo principal": "main",
  "area principal": "main",
  "área principal": "main",

  // --- section ---
  "section": "section",
  "secao": "section",
  "seção": "section",
  "sessao": "section",
  "sessão": "section",
  "bloco": "section",
  "bloco de conteudo": "section",
  "bloco de conteúdo": "section",
  "separar conteudo": "section",
  "separar conteúdo": "section",

  // --- article ---
  "article": "article",
  "artigo": "article",
  "post": "article",
  "noticia": "article",
  "notícia": "article",
  "conteudo independente": "article",
  "conteúdo independente": "article",
  "card": "article",

  // --- aside ---
  "aside": "aside",
  "lateral": "aside",
  "barra lateral": "aside",
  "sidebar": "aside",
  "conteudo lateral": "aside",
  "conteúdo lateral": "aside",
  "extras": "aside",

  // --- footer ---
  "footer": "footer",
  "rodape": "footer",
  "rodapé": "footer",
  "fim da pagina": "footer",
  "fim da página": "footer",

  // --- p ---
  "p": "p",
  "paragrafo": "p",
  "parágrafo": "p",
  "paragrafos": "p",
  "parágrafos": "p",
  "texto": "p",
  "texto comum": "p",
  "texto normal": "p",
  "descricao": "p",
  "descrição": "p",

  // --- h (h1..h6) ---
  "h1": "h",
  "h2": "h",
  "h3": "h",
  "h4": "h",
  "h5": "h",
  "h6": "h",
  "h": "h",
  "titulo": "h",
  "título": "h",
  "titulos": "h",
  "títulos": "h",
  "cabecalho de texto": "h",
  "cabeçalho de texto": "h",
  "heading": "h",
  "headline": "h",
  "titulo principal": "h",
  "título principal": "h",
  "subtitulo": "h",
  "subtítulo": "h",

  // --- span ---
  "span": "span",
  "trecho": "span",
  "destacar trecho": "span",
  "inline": "span",
  "texto pequeno": "span",
  "marcar parte do texto": "span",

  // --- strong ---
  "strong": "strong",
  "negrito": "strong",
  "bold": "strong",
  "importante": "strong",
  "forte": "strong",
  "destaque forte": "strong",

  // --- em ---
  "em": "em",
  "italico": "em",
  "itálico": "em",
  "enfase": "em",
  "ênfase": "em",
  "destaque leve": "em",

  // --- br ---
  "br": "br",
  "quebra de linha": "br",
  "pular linha": "br",
  "linha nova": "br",
  "enter": "br",
  "pular": "br",
  "quebra": "br",
  "quebrar": "br",

  // --- hr ---
  "hr": "hr",
  "linha": "hr",
  "linha horizontal": "hr",
  "separador": "hr",
  "divisor": "hr",
  "separar": "hr",
  "divisao": "hr",
  "divisão": "hr",

  // --- code ---
  "code": "code",
  "codigo": "code",
  "código": "code",
  "mostrar codigo": "code",
  "mostrar código": "code",
  "snippet": "code",
  "trecho de codigo": "code",
  "trecho de código": "code",

  // --- pre ---
  "pre": "pre",
  "preformatado": "pre",
  "pre formatado": "pre",
  "pré-formatado": "pre",
  "texto preformatado": "pre",
  "mantem espacos": "pre",
  "mantém espaços": "pre",

  // --- a ---
  "a": "a",
  "link": "a",
  "links": "a",
  "ancora": "a",
  "âncora": "a",
  "hiperlink": "a",
  "hyperlink": "a",
  "url": "a",
  "href": "a",
  "redirecionar": "a",
  "ir para": "a",

  // --- img ---
  "img": "img",
  "imagem": "img",
  "imagens": "img",
  "foto": "img",
  "fotos": "img",
  "figura": "img",
  "figuras": "img",
  "image": "img",
  "picture": "img",
  "colocar imagem": "img",
  "mostrar imagem": "img",

  // --- video ---
  "video": "video",
  "vídeo": "video",
  "videos": "video",
  "vídeos": "video",
  "mp4": "video",
  "player de video": "video",
  "player de vídeo": "video",
  "filme": "video",

  // --- audio ---
  "audio": "audio",
  "áudio": "audio",
  "som": "audio",
  "musica": "audio",
  "música": "audio",
  "mp3": "audio",
  "player de audio": "audio",
  "player de áudio": "audio",

  // --- iframe ---
  "iframe": "iframe",
  "incorporar": "iframe",
  "embed": "iframe",
  "frame": "iframe",
  "site dentro": "iframe",
  "pagina dentro": "iframe",
  "página dentro": "iframe",
  "colocar um site dentro": "iframe",

  // --- ul ---
  "ul": "ul",
  "lista": "ul",
  "listas": "ul",
  "lista com pontos": "ul",
  "lista de pontos": "ul",
  "marcadores": "ul",
  "pontos": "ul",
  "bolinhas": "ul",
  "bullet": "ul",
  "bullets": "ul",
  "unordered": "ul",
  "unordered list": "ul",
  "lista nao ordenada": "ul",
  "lista não ordenada": "ul",

  // --- ol ---
  "ol": "ol",
  "lista numerada": "ol",
  "lista ordenada": "ol",
  "numerada": "ol",
  "numeros": "ol",
  "números": "ol",
  "ordered": "ol",
  "ordered list": "ol",
  "sequencia": "ol",
  "sequência": "ol",
  "passos": "ol",
  "step by step": "ol",

  // --- li ---
  "li": "li",
  "item": "li",
  "itens": "li",
  "items": "li",
  "item da lista": "li",
  "linha da lista": "li",
  "ponto da lista": "li",

  // --- dl ---
  "dl": "dl",
  "lista de definicao": "dl",
  "lista de definição": "dl",
  "definicoes": "dl",
  "definições": "dl",
  "glossario": "dl",
  "glossário": "dl",
  "termo e definicao": "dl",
  "termo e definição": "dl",

  // --- table ---
  "table": "table",
  "tabela": "table",
  "tabelas": "table",
  "planilha": "table",
  "grid": "table",
  "quadro": "table",

  // --- tr ---
  "tr": "tr",
  "linha da tabela": "tr",
  "row": "tr",
  "linha": "tr",

  // --- th ---
  "th": "th",
  "cabecalho da tabela": "th",
  "cabeçalho da tabela": "th",
  "titulo da coluna": "th",
  "título da coluna": "th",
  "header da tabela": "th",

  // --- td ---
  "td": "td",
  "coluna": "td",
  "celula": "td",
  "célula": "td",
  "valor": "td",
  "dado": "td",

  // --- form ---
  "form": "form",
  "formulario": "form",
  "formulário": "form",
  "contato": "form",
  "enviar dados": "form",
  "enviar formulario": "form",
  "enviar formulário": "form",

  // --- label ---
  "label": "label",
  "rotulo": "label",
  "rótulo": "label",
  "etiqueta": "label",
  "nome do campo": "label",
  "titulo do campo": "label",
  "título do campo": "label",

  // --- input ---
  "input": "input",
  "campo": "input",
  "entrada": "input",
  "caixa de texto": "input",
  "digitar": "input",
  "email": "input",
  "senha": "input",
  "text": "input",

  // --- textarea ---
  "textarea": "textarea",
  "mensagem": "textarea",
  "texto grande": "textarea",
  "multilinha": "textarea",
  "comentario": "textarea",
  "comentário": "textarea",
  "area de texto": "textarea",
  "área de texto": "textarea",

  // --- button ---
  "button": "button",
  "botao": "button",
  "botão": "button",
  "clicar": "button",
  "acao": "button",
  "ação": "button",
  "enviar": "button",
  "confirmar": "button",

  // --- select ---
  "select": "select",
  "selecao": "select",
  "seleção": "select",
  "dropdown": "select",
  "opcao": "select",
  "opção": "select",
  "lista suspensa": "select",
  "combobox": "select"


};

// ==============================
// Banco de Tags
// ==============================
const TAGS = [
  { key: "doctype", title: "<!DOCTYPE html>", desc: "Declara o tipo de documento (HTML5). Deve ser a primeira linha do arquivo HTML.", example: `<!DOCTYPE html>\n<html lang="pt-br">\n  ...\n</html>`, keywords: ["doctype", "html5", "tipo do documento", "declaração", "declaracao"] },
  { key: "html", title: "<html>", desc: "Elemento raiz que envolve todo o documento HTML.", example: `<html lang="pt-br">\n  ...\n</html>`, keywords: ["html", "documento", "pagina", "página", "site"] },
  { key: "head", title: "<head>", desc: "Contém metadados (não aparecem na página) como título, links de CSS e scripts.", example: `<head>\n  <meta charset="UTF-8">\n  <title>Minha página</title>\n</head>`, keywords: ["head", "metadados", "meta", "title", "titulo", "título", "aba", "cabeça", "cabeca"] },
  { key: "body", title: "<body>", desc: "Contém todo o conteúdo visível da página.", example: `<body>\n  <h1>Olá</h1>\n</body>`, keywords: ["body", "corpo", "conteudo", "conteúdo", "visivel", "visível"] },
  { key: "header", title: "<header>", desc: "Cabeçalho da página ou de uma seção.", example: `<header>\n  <h1>Meu site</h1>\n</header>`, keywords: ["header", "cabeçalho", "cabecalho", "topo"] },
  { key: "nav", title: "<nav>", desc: "Área de navegação (menu de links).", example: `<nav>\n  <a href="#home">Home</a>\n</nav>`, keywords: ["nav", "menu", "navegação", "navegacao", "links"] },
  { key: "main", title: "<main>", desc: "Conteúdo principal da página (idealmente único por página).", example: `<main>\n  <section>...</section>\n</main>`, keywords: ["main", "principal", "conteudo principal", "conteúdo principal"] },
  { key: "section", title: "<section>", desc: "Define uma seção do conteúdo (um bloco temático).", example: `<section>\n  <h2>Sobre</h2>\n  <p>Conteúdo...</p>\n</section>`, keywords: ["section", "seção", "secao", "bloco", "sessao", "sessão"] },
  { key: "article", title: "<article>", desc: "Conteúdo independente (post, notícia, card completo).", example: `<article>\n  <h2>Post</h2>\n  <p>Texto...</p>\n</article>`, keywords: ["article", "artigo", "post", "noticia", "notícia"] },
  { key: "aside", title: "<aside>", desc: "Conteúdo lateral/relacionado (sidebar, extras).", example: `<aside>\n  <p>Conteúdo lateral</p>\n</aside>`, keywords: ["aside", "lateral", "sidebar", "barra lateral"] },
  { key: "footer", title: "<footer>", desc: "Rodapé da página ou de uma seção.", example: `<footer>\n  <p>Rodapé</p>\n</footer>`, keywords: ["footer", "rodape", "rodapé", "fim"] },

  { key: "p", title: "<p>", desc: "Esta tag é usada para colocar um parágrafo na tela do seu site.", example: `<p>Seu parágrafo escrito aqui dentro</p>`, keywords: ["p", "paragrafo", "parágrafo", "texto", "frase"] },
  { key: "h", title: "<h1> até <h6>", desc: "Tags de título. <h1> é o mais importante, <h6> o menos importante.", example: `<h1>Título principal</h1>\n<h2>Título de seção</h2>`, keywords: ["h1", "h2", "h3", "h4", "h5", "h6", "titulo", "título", "heading", "titulos", "títulos"] },
  { key: "span", title: "<span>", desc: "Container inline para destacar um trecho e aplicar estilo.", example: `<p>Olá <span class="destaque">mundo</span></p>`, keywords: ["span", "trecho", "destaque", "inline"] },
  { key: "strong", title: "<strong>", desc: "Dá forte importância ao texto (normalmente aparece em negrito).", example: `<strong>Importante</strong>`, keywords: ["strong", "negrito", "importante", "bold"] },
  { key: "em", title: "<em>", desc: "Ênfase no texto (normalmente itálico).", example: `<em>Ênfase</em>`, keywords: ["em", "italico", "itálico", "enfase", "ênfase"] },
  { key: "br", title: "<br>", desc: "Quebra de linha simples. Não tem fechamento.", example: `Linha 1<br>\nLinha 2`, keywords: ["br", "quebra de linha", "pular linha", "linha nova"] },
  { key: "hr", title: "<hr>", desc: "Linha horizontal para separar conteúdo. Não tem fechamento.", example: `<hr>`, keywords: ["hr", "linha", "separador", "divisor", "divisao", "divisão"] },
  { key: "code", title: "<code>", desc: "Usada para mostrar código dentro do texto.", example: `<p>Use a tag <code>&lt;img&gt;</code>.</p>`, keywords: ["code", "codigo", "código", "snippet", "trecho de código"] },
  { key: "pre", title: "<pre>", desc: "Texto pré-formatado (mantém espaços e quebras de linha).", example: `<pre>\nTexto  com   espaços\n</pre>`, keywords: ["pre", "preformatado", "pré-formatado", "espacos", "espaços"] },

  { key: "a", title: "<a>", desc: "Cria um link para outra página, site ou seção.", example: `<a href="https://exemplo.com">Clique aqui</a>`, keywords: ["a", "link", "ancora", "âncora", "href", "url", "site", "hyperlink"] },
  { key: "img", title: "<img>", desc: "Insere uma imagem na página. Não tem fechamento.", example: `<img src="foto.jpg" alt="Descrição da imagem">`, keywords: ["img", "image", "imagem", "foto", "figura", "picture", "imagens", "fotos"] },
  { key: "video", title: "<video>", desc: "Insere um vídeo (use controls para controles).", example: `<video controls src="video.mp4"></video>`, keywords: ["video", "vídeo", "mp4", "movie", "player"] },
  { key: "audio", title: "<audio>", desc: "Insere um áudio (use controls para controles).", example: `<audio controls src="som.mp3"></audio>`, keywords: ["audio", "áudio", "som", "mp3", "musica", "música"] },
  { key: "iframe", title: "<iframe>", desc: "Incorpora outra página dentro da sua.", example: `<iframe src="https://exemplo.com" width="600" height="400"></iframe>`, keywords: ["iframe", "incorporar", "embed", "frame", "site dentro"] },

  { key: "ul", title: "<ul>", desc: "Lista não ordenada (com marcadores).", example: `<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>`, keywords: ["ul", "lista", "listas", "marcadores", "pontos", "bolinhas", "bullet", "bullets", "unordered", "nao ordenada", "não ordenada"] },
  { key: "ol", title: "<ol>", desc: "Lista ordenada (numerada).", example: `<ol>\n  <li>Passo 1</li>\n  <li>Passo 2</li>\n</ol>`, keywords: ["ol", "lista numerada", "lista ordenada", "numerada", "numeros", "números", "ordered", "sequencia", "sequência", "passos"] },
  { key: "li", title: "<li>", desc: "Item de uma lista (dentro de ul/ol).", example: `<li>Item</li>`, keywords: ["li", "item", "itens", "items", "item da lista"] },
  { key: "dl", title: "<dl>", desc: "Lista de definições (termo + descrição).", example: `<dl>\n  <dt>Termo</dt>\n  <dd>Definição</dd>\n</dl>`, keywords: ["dl", "glossario", "glossário", "definicao", "definição", "lista de definição"] },
  { key: "table", title: "<table>", desc: "Cria uma tabela.", example: `<table>\n  <tr><th>Nome</th></tr>\n  <tr><td>Erick</td></tr>\n</table>`, keywords: ["table", "tabela", "tabelas", "planilha", "grid"] },
  { key: "tr", title: "<tr>", desc: "Linha da tabela.", example: `<tr>\n  <td>...</td>\n</tr>`, keywords: ["tr", "linha da tabela", "row"] },
  { key: "th", title: "<th>", desc: "Célula de cabeçalho da tabela.", example: `<th>Título</th>`, keywords: ["th", "cabecalho da tabela", "cabeçalho da tabela", "titulo da coluna", "título da coluna"] },
  { key: "td", title: "<td>", desc: "Célula comum da tabela.", example: `<td>Valor</td>`, keywords: ["td", "celula", "célula", "coluna", "dado", "valor"] },

  { key: "form", title: "<form>", desc: "Cria um formulário para envio de dados.", example: `<form action="/enviar" method="POST">\n  <input type="text" name="nome">\n  <button type="submit">Enviar</button>\n</form>`, keywords: ["form", "formulario", "formulário", "enviar dados", "contato"] },
  { key: "label", title: "<label>", desc: "Rótulo ligado a um campo do formulário.", example: `<label for="nome">Nome</label>\n<input id="nome" type="text">`, keywords: ["label", "rotulo", "rótulo", "etiqueta"] },
  { key: "input", title: "<input>", desc: "Campo de entrada. Não tem fechamento.", example: `<input type="text" placeholder="Digite aqui">`, keywords: ["input", "campo", "entrada", "digitar", "senha", "email", "caixa de texto"] },
  { key: "textarea", title: "<textarea>", desc: "Campo de texto grande (multilinha).", example: `<textarea placeholder="Escreva..."></textarea>`, keywords: ["textarea", "texto grande", "multilinha", "mensagem", "comentario", "comentário"] },
  { key: "button", title: "<button>", desc: "Botão clicável.", example: `<button type="button">Clique</button>`, keywords: ["button", "botao", "botão", "clicar", "acao", "ação"] },
  { key: "select", title: "<select>", desc: "Caixa de seleção (dropdown).", example: `<select>\n  <option>Opção 1</option>\n  <option>Opção 2</option>\n</select>`, keywords: ["select", "selecao", "seleção", "dropdown", "opcao", "opção", "lista suspensa"] },

  // --- Head / Metadados ---
  { key: "title", title: "<title>", desc: "Define o título do documento (aparece na aba do navegador). Fica dentro de <head>.", example: `<head>\n  <title>TagFlow</title>\n</head>`, keywords: ["title", "titulo", "título", "nome da aba", "aba do navegador", "tab title", "titulo da pagina", "título da página"] },
  { key: "meta", title: "<meta>", desc: "Define metadados (charset, viewport, description, SEO). Tag vazia (não fecha).", example: `<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="description" content="Descrição do site">`, keywords: ["meta", "metadados", "charset", "viewport", "description", "descricao", "descrição", "seo", "open graph", "og", "twitter card"] },
  { key: "link", title: "<link>", desc: "Conecta recursos externos (CSS, ícone, fontes). Tag vazia (não fecha).", example: `<link rel="stylesheet" href="style.css">\n<link rel="icon" href="favicon.png">`, keywords: ["link", "link tag", "stylesheet", "css externo", "importar css", "favicon", "icone", "ícone", "fonte", "fonts", "preload", "prefetch"] },
  { key: "style", title: "<style>", desc: "Insere CSS dentro do HTML (CSS interno).", example: `<style>\n  body { font-family: Arial; }\n</style>`, keywords: ["style", "css interno", "estilo", "estilos", "folha de estilo", "css no html"] },
  {
    key: "script",
    title: "<script>",
    desc: "Carrega ou escreve JavaScript (interno ou externo).",
    example: `<script src="script.js"></script>\n<script>\n  console.log("Olá");\n</script>`,
    keywords: ["script", "javascript", "js", "carregar js", "arquivo js", "codigo js", "código js", "script externo", "script interno"]
  },
  {
    key: "noscript",
    title: "<noscript>",
    desc: "Mostra conteúdo alternativo se o JavaScript estiver desativado no navegador.",
    example: `<noscript>Ative o JavaScript para usar este site.</noscript>`,
    keywords: ["noscript", "sem javascript", "js desativado", "fallback", "mensagem sem js"]
  },
  {
    key: "base",
    title: "<base>",
    desc: "Define a URL base e o target padrão para links na página. Tag vazia (não fecha).",
    example: `<head>\n  <base href="https://exemplo.com/" target="_blank">\n</head>`,
    keywords: ["base", "url base", "base href", "target padrao", "target padrão", "links relativos"]
  },

  // --- Layout / Agrupamento ---
  {
    key: "div",
    title: "<div>",
    desc: "Container genérico (sem semântica). Muito usado para agrupar elementos e aplicar CSS.",
    example: `<div class="card">\n  <h2>Título</h2>\n  <p>Conteúdo...</p>\n</div>`,
    keywords: ["div", "container", "bloco", "caixa", "wrapper", "agrupador", "agrupamento"]
  },

  // --- Texto / Semântica inline ---
  {
    key: "small",
    title: "<small>",
    desc: "Texto secundário/menor (ex: observações, direitos autorais).",
    example: `<p>Preço: R$ 10 <small>(promoção limitada)</small></p>`,
    keywords: ["small", "texto pequeno", "observacao", "observação", "nota", "copyright"]
  },
  {
    key: "mark",
    title: "<mark>",
    desc: "Marca/destaca um trecho como relevância (tipo marca-texto).",
    example: `<p>Resultado: <mark>HTML</mark> encontrado</p>`,
    keywords: ["mark", "destaque", "marcar", "marca texto", "highlight", "realcar", "realçar"]
  },
  {
    key: "del",
    title: "<del>",
    desc: "Texto removido (conteúdo deletado).",
    example: `<p><del>R$ 100</del> R$ 80</p>`,
    keywords: ["del", "deletado", "removido", "riscado", "preco antigo", "preço antigo"]
  },
  {
    key: "ins",
    title: "<ins>",
    desc: "Texto inserido (conteúdo adicionado).",
    example: `<p>Agora com <ins>frete grátis</ins>!</p>`,
    keywords: ["ins", "inserido", "adicionado", "novo texto", "inserted"]
  },
  {
    key: "dfn",
    title: "<dfn>",
    desc: "Marca o termo que está sendo definido (definição).",
    example: `<p><dfn>HTML</dfn> é uma linguagem de marcação.</p>`,
    keywords: ["dfn", "definicao", "definição", "termo definido", "definition"]
  },
  {
    key: "bdi",
    title: "<bdi>",
    desc: "Isola direção de texto (útil com idiomas/RTL) sem afetar o contexto.",
    example: `<p>Usuário: <bdi>إريك</bdi></p>`,
    keywords: ["bdi", "direcao de texto", "direção de texto", "rtl", "idioma", "isolamento"]
  },
  {
    key: "bdo",
    title: "<bdo>",
    desc: "Sobrescreve a direção do texto (dir='rtl' ou 'ltr').",
    example: `<p><bdo dir="rtl">Texto invertido</bdo></p>`,
    keywords: ["bdo", "rtl", "ltr", "direcao", "direção", "texto invertido"]
  },
  {
    key: "ruby",
    title: "<ruby>",
    desc: "Anotações de pronúncia/explicação (muito usado em japonês/chinês).",
    example: `<ruby>漢 <rt>kan</rt></ruby>`,
    keywords: ["ruby", "furigana", "rt", "pronuncia", "pronúncia", "anotacao", "anotação"]
  },
  {
    key: "rt",
    title: "<rt>",
    desc: "Texto de anotação dentro de <ruby>.",
    example: `<ruby>漢 <rt>kan</rt></ruby>`,
    keywords: ["rt", "ruby texto", "anotacao ruby", "anotação ruby", "pronuncia ruby"]
  },
  {
    key: "rp",
    title: "<rp>",
    desc: "Parênteses de fallback para navegadores que não suportam ruby.",
    example: `<ruby>漢<rp>(</rp><rt>kan</rt><rp>)</rp></ruby>`,
    keywords: ["rp", "ruby fallback", "parenteses ruby", "parênteses ruby"]
  },

  // --- Links / Navegação avançada ---
  {
    key: "area",
    title: "<area>",
    desc: "Define uma área clicável dentro de um <map> (image map). Tag vazia (não fecha).",
    example: `<img src="mapa.png" usemap="#mapa">\n<map name="mapa">\n  <area shape="rect" coords="0,0,100,100" href="#topo" alt="Topo">\n</map>`,
    keywords: ["area", "mapa clicavel", "mapa clicável", "imagem clicavel", "image map", "coordenadas", "coords"]
  },
  {
    key: "map",
    title: "<map>",
    desc: "Cria um mapa de imagem para usar com <area>.",
    example: `<map name="mapa">\n  <area shape="circle" coords="50,50,25" href="#x" alt="X">\n</map>`,
    keywords: ["map", "image map", "mapa de imagem", "mapa clicavel", "mapa clicável"]
  },

  // --- Mídia / Conteúdo incorporado ---
  {
    key: "picture",
    title: "<picture>",
    desc: "Permite imagens responsivas usando <source> + <img>.",
    example: `<picture>\n  <source srcset="img.webp" type="image/webp">\n  <img src="img.jpg" alt="Descrição">\n</picture>`,
    keywords: ["picture", "imagem responsiva", "source", "srcset", "webp", "jpg", "art direction"]
  },
  {
    key: "source",
    title: "<source>",
    desc: "Define arquivos alternativos para <picture>, <audio> ou <video>. Tag vazia (não fecha).",
    example: `<video controls>\n  <source src="video.mp4" type="video/mp4">\n</video>`,
    keywords: ["source", "fonte", "arquivo alternativo", "srcset", "type", "midia alternativa", "mídia alternativa"]
  },
  {
    key: "track",
    title: "<track>",
    desc: "Legendas para <video>/<audio> (subtitles). Tag vazia (não fecha).",
    example: `<video controls>\n  <source src="video.mp4" type="video/mp4">\n  <track kind="subtitles" src="legendas.vtt" srclang="pt" label="Português">\n</video>`,
    keywords: ["track", "legenda", "subtitles", "caption", "closed captions", "vtt", "srclang"]
  },
  {
    key: "object",
    title: "<object>",
    desc: "Incorpora um recurso externo (PDF, mídia) de forma genérica.",
    example: `<object data="arquivo.pdf" type="application/pdf" width="600" height="400"></object>`,
    keywords: ["object", "pdf", "incorporar pdf", "embed pdf", "conteudo externo", "conteúdo externo"]
  },
  {
    key: "param",
    title: "<param>",
    desc: "Parâmetros para <object>. Tag vazia (não fecha).",
    example: `<object data="video.mp4">\n  <param name="autoplay" value="true">\n</object>`,
    keywords: ["param", "parametro", "parâmetro", "object param", "autoplay"]
  },
  {
    key: "embed",
    title: "<embed>",
    desc: "Incorpora conteúdo externo. Tag vazia (não fecha).",
    example: `<embed src="arquivo.pdf" type="application/pdf" width="600" height="400">`,
    keywords: ["embed", "incorporar", "pdf embed", "conteudo incorporado", "conteúdo incorporado"]
  },

  // --- Interativos ---
  {
    key: "details",
    title: "<details>",
    desc: "Cria um bloco que abre/fecha (accordion nativo).",
    example: `<details>\n  <summary>Ver mais</summary>\n  <p>Conteúdo...</p>\n</details>`,
    keywords: ["details", "abrir e fechar", "accordion", "toggle", "detalhes", "colapsar", "expandir"]
  },
  {
    key: "summary",
    title: "<summary>",
    desc: "Título clicável do <details>.",
    example: `<details>\n  <summary>Clique para abrir</summary>\n  <p>Conteúdo...</p>\n</details>`,
    keywords: ["summary", "titulo do details", "título do details", "cabecalho do details", "cabeçalho do details"]
  },
  {
    key: "dialog",
    title: "<dialog>",
    desc: "Cria uma caixa de diálogo/modal nativa (pode usar showModal() via JS).",
    example: `<dialog open>\n  <p>Olá!</p>\n  <form method="dialog">\n    <button>Fechar</button>\n  </form>\n</dialog>`,
    keywords: ["dialog", "modal", "popup", "janela", "caixa de dialogo", "caixa de diálogo"]
  },

  // --- Canvas / SVG ---
  {
    key: "canvas",
    title: "<canvas>",
    desc: "Área de desenho via JavaScript (gráficos, jogos).",
    example: `<canvas id="meuCanvas" width="300" height="150"></canvas>`,
    keywords: ["canvas", "desenho", "grafico", "gráfico", "jogo", "2d", "webgl"]
  },
  {
    key: "svg",
    title: "<svg>",
    desc: "Gráficos vetoriais (ícones, formas).",
    example: `<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="60" cy="60" r="50" />\n</svg>`,
    keywords: ["svg", "vetor", "vetorial", "icone", "ícone", "grafico vetorial", "desenho vetorial"]
  },

  // --- Tabelas (completando) ---
  {
    key: "caption",
    title: "<caption>",
    desc: "Legenda/título de uma tabela.",
    example: `<table>\n  <caption>Notas</caption>\n  <tr><th>Nome</th><th>Nota</th></tr>\n</table>`,
    keywords: ["caption", "legenda da tabela", "titulo da tabela", "título da tabela", "nome da tabela"]
  },
  {
    key: "thead",
    title: "<thead>",
    desc: "Agrupa o cabeçalho da tabela.",
    example: `<table>\n  <thead>\n    <tr><th>Nome</th></tr>\n  </thead>\n</table>`,
    keywords: ["thead", "cabecalho da tabela", "cabeçalho da tabela", "header da tabela"]
  },
  {
    key: "tbody",
    title: "<tbody>",
    desc: "Agrupa o corpo principal da tabela.",
    example: `<table>\n  <tbody>\n    <tr><td>Erick</td></tr>\n  </tbody>\n</table>`,
    keywords: ["tbody", "corpo da tabela", "dados da tabela", "body da tabela"]
  },
  {
    key: "tfoot",
    title: "<tfoot>",
    desc: "Agrupa o rodapé da tabela.",
    example: `<table>\n  <tfoot>\n    <tr><td>Total</td></tr>\n  </tfoot>\n</table>`,
    keywords: ["tfoot", "rodape da tabela", "rodapé da tabela", "footer da tabela", "total"]
  },
  {
    key: "colgroup",
    title: "<colgroup>",
    desc: "Agrupa colunas para aplicar estilos.",
    example: `<table>\n  <colgroup>\n    <col span="1">\n    <col span="1">\n  </colgroup>\n</table>`,
    keywords: ["colgroup", "grupo de colunas", "colunas", "estilo por coluna"]
  },
  {
    key: "col",
    title: "<col>",
    desc: "Define propriedades de coluna dentro de <colgroup>. Tag vazia (não fecha).",
    example: `<colgroup>\n  <col span="1">\n  <col span="1">\n</colgroup>`,
    keywords: ["col", "coluna", "colunas", "estilo de coluna", "largura da coluna"]
  },

  // --- Formulários (completando) ---
  {
    key: "option",
    title: "<option>",
    desc: "Opção dentro de <select>.",
    example: `<select>\n  <option value="1">Opção 1</option>\n</select>`,
    keywords: ["option", "opcao", "opção", "item do select", "item do dropdown"]
  },
  {
    key: "optgroup",
    title: "<optgroup>",
    desc: "Agrupa opções dentro do <select>.",
    example: `<select>\n  <optgroup label="Grupo 1">\n    <option>Opção</option>\n  </optgroup>\n</select>`,
    keywords: ["optgroup", "grupo de opcoes", "grupo de opções", "grupo no select"]
  },
  {
    key: "datalist",
    title: "<datalist>",
    desc: "Lista de sugestões para um <input> (autocomplete).",
    example: `<input list="frutas">\n<datalist id="frutas">\n  <option value="Maçã">\n  <option value="Banana">\n</datalist>`,
    keywords: ["datalist", "sugestoes", "sugestões", "autocomplete", "lista de sugestoes", "auto completar"]
  },
  {
    key: "output",
    title: "<output>",
    desc: "Mostra o resultado de um cálculo (normalmente ligado a form).",
    example: `<form oninput="saida.value = (parseInt(a.value||0) + parseInt(b.value||0))">\n  <input id="a" type="number"> +\n  <input id="b" type="number"> =\n  <output name="saida"></output>\n</form>`,
    keywords: ["output", "resultado", "saida", "saída", "calculo", "cálculo", "retorno"]
  },
  {
    key: "fieldset",
    title: "<fieldset>",
    desc: "Agrupa campos do formulário (com borda opcional).",
    example: `<fieldset>\n  <legend>Dados</legend>\n  <label>Nome <input type="text"></label>\n</fieldset>`,
    keywords: ["fieldset", "grupo de campos", "agrupar inputs", "form group", "grupo do formulario", "grupo do formulário"]
  },
  {
    key: "legend",
    title: "<legend>",
    desc: "Título/legenda do <fieldset>.",
    example: `<fieldset>\n  <legend>Informações</legend>\n</fieldset>`,
    keywords: ["legend", "titulo do fieldset", "título do fieldset", "nome do grupo"]
  },
  {
    key: "progress",
    title: "<progress>",
    desc: "Barra de progresso.",
    example: `<progress value="70" max="100"></progress>`,
    keywords: ["progress", "progresso", "barra de progresso", "loading", "carregando"]
  },
  {
    key: "meter",
    title: "<meter>",
    desc: "Mede um valor dentro de um intervalo (ex: nível).",
    example: `<meter value="0.6">60%</meter>`,
    keywords: ["meter", "medidor", "nivel", "nível", "percentual", "indicador"]
  },

  // --- Outras tags úteis / comuns ---
  {
    key: "address",
    title: "<address>",
    desc: "Informações de contato do autor/organização (endereço, email etc).",
    example: `<address>\n  Contato: <a href="mailto:email@exemplo.com">email@exemplo.com</a>\n</address>`,
    keywords: ["address", "endereco", "endereço", "contato", "contact", "autor", "empresa"]
  },
  {
    key: "figure",
    title: "<figure>",
    desc: "Agrupa mídia (imagem, gráfico) e legenda.",
    example: `<figure>\n  <img src="foto.jpg" alt="Descrição">\n  <figcaption>Legenda da imagem</figcaption>\n</figure>`,
    keywords: ["figure", "figura", "imagem com legenda", "mídia com legenda", "media caption"]
  },
  {
    key: "figcaption",
    title: "<figcaption>",
    desc: "Legenda para um <figure>.",
    example: `<figure>\n  <img src="foto.jpg" alt="Descrição">\n  <figcaption>Legenda</figcaption>\n</figure>`,
    keywords: ["figcaption", "legenda", "caption", "legenda de imagem", "legenda do figure"]
  },
  {
    key: "time",
    title: "<time>",
    desc: "Representa datas/horários (útil para SEO e acessibilidade).",
    example: `<time datetime="2026-02-17">17/02/2026</time>`,
    keywords: ["time", "data", "hora", "datetime", "calendario", "calendário", "horario", "horário"]
  },
  {
    key: "data",
    title: "<data>",
    desc: "Associa um valor legível com um valor de máquina (value).",
    example: `<data value="123">Produto 123</data>`,
    keywords: ["data", "value", "dado", "valor", "machine readable", "valor interno"]
  },
  {
    key: "kbd",
    title: "<kbd>",
    desc: "Indica entrada do teclado (atalhos).",
    example: `<p>Pressione <kbd>Ctrl</kbd> + <kbd>S</kbd>.</p>`,
    keywords: ["kbd", "teclado", "atalho", "shortcut", "ctrl", "ctrl s", "comando"]
  },
  {
    key: "samp",
    title: "<samp>",
    desc: "Saída de um programa (texto de console).",
    example: `<samp>Erro: arquivo não encontrado</samp>`,
    keywords: ["samp", "saida", "saída", "console", "output", "terminal"]
  },
  {
    key: "var",
    title: "<var>",
    desc: "Representa uma variável em contexto matemático/programação.",
    example: `<p>O valor de <var>x</var> é 10.</p>`,
    keywords: ["var", "variavel", "variável", "matematica", "matemática", "variavel no texto"]
  },
  {
    key: "sub",
    title: "<sub>",
    desc: "Texto subscrito (abaixo da linha).",
    example: `H<sub>2</sub>O`,
    keywords: ["sub", "subscrito", "subscript", "embaixo", "abaixo"]
  },
  {
    key: "sup",
    title: "<sup>",
    desc: "Texto sobrescrito (acima da linha).",
    example: `2<sup>10</sup>`,
    keywords: ["sup", "sobrescrito", "superscript", "emcima", "em cima", "acima"]
  },
  {
    key: "wbr",
    title: "<wbr>",
    desc: "Sugere um ponto onde a palavra pode quebrar linha. Tag vazia (não fecha).",
    example: `supercalifragilistic<wbr>expialidocious`,
    keywords: ["wbr", "quebra de palavra", "word break", "quebra de linha em palavra", "ponto de quebra"]
  },

  // --- Tags obsoletas/depreciadas (pra ficar “todas mesmo”) ---
  {
    key: "center",
    title: "<center>",
    desc: "OBSOLETA: centralizava conteúdo. Hoje use CSS (text-align, flex, grid).",
    example: `<!-- OBSOLETA -->\n<center>Texto centralizado</center>`,
    keywords: ["center", "centralizar", "tag center", "obsoleta", "depreciada", "deprecated"]
  },
  {
    key: "font",
    title: "<font>",
    desc: "OBSOLETA: definia fonte/cor/tamanho. Hoje use CSS.",
    example: `<!-- OBSOLETA -->\n<font color="red" size="5">Texto</font>`,
    keywords: ["font", "cor no html", "tamanho fonte", "tag font", "obsoleta", "deprecated"]
  },
  {
    key: "marquee",
    title: "<marquee>",
    desc: "OBSOLETA: texto rolando (efeito). Não use em projetos reais.",
    example: `<!-- OBSOLETA -->\n<marquee>Texto rolando...</marquee>`,
    keywords: ["marquee", "texto rolando", "efeito", "scroll text", "obsoleta"]
  },
  {
    key: "frameset",
    title: "<frameset>",
    desc: "OBSOLETA: layout por frames. Hoje use CSS e iframes (quando necessário).",
    example: `<!-- OBSOLETA -->\n<frameset cols="50%,50%">\n  <frame src="a.html">\n  <frame src="b.html">\n</frameset>`,
    keywords: ["frameset", "frame layout", "frames", "obsoleta", "deprecated"]
  },
  {
    key: "frame",
    title: "<frame>",
    desc: "OBSOLETA: usado dentro de <frameset>.",
    example: `<!-- OBSOLETA -->\n<frame src="pagina.html">`,
    keywords: ["frame", "frameset", "obsoleta", "deprecated"]
  },
  {
    key: "big",
    title: "<big>",
    desc: "OBSOLETA: aumentava o texto. Hoje use CSS.",
    example: `<!-- OBSOLETA -->\n<big>Texto maior</big>`,
    keywords: ["big", "texto grande", "obsoleta", "deprecated"]
  },
  {
    key: "tt",
    title: "<tt>",
    desc: "OBSOLETA: fonte monoespaçada. Hoje use CSS ou <code>.",
    example: `<!-- OBSOLETA -->\n<tt>texto monoespaçado</tt>`,
    keywords: ["tt", "monoespacado", "monoespaçado", "obsoleta", "deprecated"]
  },
  {
    key: "strike",
    title: "<strike>",
    desc: "OBSOLETA: texto riscado. Hoje use <s> ou CSS.",
    example: `<!-- OBSOLETA -->\n<strike>Texto riscado</strike>`,
    keywords: ["strike", "riscado", "tachado", "obsoleta", "deprecated"]
  }
];

// ==============================
// PATCH DE CONSISTÊNCIA (NÃO MUDA O RESTO)
// - garante que b, i, u, s, abbr, cite, blockquote, template existam e funcionem
// - corrige q caso esteja apontando errado (ex: mostrando marquee)
// - remove duplicatas dessas keys (pra evitar colisão)
// ==============================
(function fixBrokenTags() {
  if (!Array.isArray(TAGS)) return;

  const MUST_KEYS = new Set(["b", "i", "u", "s", "abbr", "cite", "blockquote", "template", "q"]);

  // 1) remove duplicatas APENAS dessas chaves (mantém a primeira ocorrência)
  const seen = new Set();
  for (let idx = TAGS.length - 1; idx >= 0; idx--) {
    const k = TAGS[idx]?.key;
    if (!k || !MUST_KEYS.has(k)) continue;

    if (seen.has(k)) {
      TAGS.splice(idx, 1);
    } else {
      seen.add(k);
    }
  }

  // 2) garante que "q" esteja correto (se existir e estiver errado, substitui)
  const qIndex = TAGS.findIndex(t => t && t.key === "q");
  const correctQ = {
    key: "q",
    title: "<q>",
    desc: "Citação curta dentro do texto (normalmente o navegador coloca aspas automaticamente).",
    example: `<p>Ele disse: <q>isso é incrível</q>.</p>`,
    keywords: ["q", "citacao", "citação", "citacao curta", "citação curta", "quote", "frase citada", "aspas", "quote inline"]
  };

  if (qIndex >= 0) {
    // se a descrição tiver cara de marquee (ou não tiver nada a ver), troca
    const qDesc = (TAGS[qIndex].desc || "").toLowerCase();
    const qTitle = (TAGS[qIndex].title || "").toLowerCase();
    const smellsWrong =
      qTitle.includes("marquee") ||
      qDesc.includes("marquee") ||
      qDesc.includes("texto rolando") ||
      qDesc.includes("rolando");

    if (smellsWrong) TAGS[qIndex] = correctQ;
  } else {
    TAGS.push(correctQ);
  }

  // 3) adiciona/garante as 8 tags
  const ensures = [
    {
      key: "b",
      title: "<b>",
      desc: "Deixa o texto em negrito APENAS visualmente (sem indicar importância). Para importância use <strong>.",
      example: `<p>Isso é <b>negrito visual</b>.</p>`,
      keywords: ["b", "negrito", "bold", "negrito visual", "destaque visual", "sem semantica", "sem semântica"]
    },
    {
      key: "i",
      title: "<i>",
      desc: "Deixa o texto em itálico APENAS visualmente (sem indicar ênfase). Para ênfase use <em>.",
      example: `<p>Isso é <i>itálico visual</i>.</p>`,
      keywords: ["i", "italico", "itálico", "italico visual", "itálico visual", "sem semantica", "sem semântica"]
    },
    {
      key: "u",
      title: "<u>",
      desc: "Sublinha o texto (visual). Use com cuidado, porque pode parecer link.",
      example: `<p><u>Texto sublinhado</u></p>`,
      keywords: ["u", "sublinhado", "underline", "linha embaixo", "texto sublinhado"]
    },
    {
      key: "s",
      title: "<s>",
      desc: "Texto riscado (indica que não é mais válido/atual).",
      example: `<p><s>R$ 100</s> R$ 80</p>`,
      keywords: ["s", "riscado", "tachado", "strikethrough", "preco antigo", "preço antigo", "desatualizado"]
    },
    {
      key: "abbr",
      title: "<abbr>",
      desc: "Marca uma abreviação/sigla com significado (tooltip no atributo title).",
      example: `<p><abbr title="HyperText Markup Language">HTML</abbr></p>`,
      keywords: ["abbr", "abreviacao", "abreviação", "sigla", "tooltip", "title", "abreviar"]
    },
    {
      key: "cite",
      title: "<cite>",
      desc: "Marca o título de uma obra (livro, filme, artigo, música).",
      example: `<p>Eu recomendo <cite>Clean Code</cite>.</p>`,
      keywords: ["cite", "citacao", "citação", "referencia", "referência", "obra", "titulo de obra", "título de obra"]
    },
    {
      key: "blockquote",
      title: "<blockquote>",
      desc: "Citação em bloco (trecho citado, geralmente mais longo).",
      example: `<blockquote>\n  "Uma citação longa aqui."\n</blockquote>`,
      keywords: ["blockquote", "citacao", "citação", "quote", "citar", "citacao longa", "citação longa"]
    },
    {
      key: "template",
      title: "<template>",
      desc: "Guarda HTML “inativo” (não renderiza). Pode ser clonado via JavaScript para gerar conteúdo dinâmico.",
      example: `<template id="card">\n  <div class="card">\n    <h3>Título</h3>\n    <p>Texto...</p>\n  </div>\n</template>`,
      keywords: ["template", "modelo", "template html", "conteudo invisivel", "conteúdo invisível", "clonar", "clone", "content"]
    }
  ];

  for (const obj of ensures) {
    const idx = TAGS.findIndex(t => t && t.key === obj.key);
    if (idx >= 0) {
      // se existir mas estiver “vazio”/quebrado, substitui
      const bad =
        !TAGS[idx].title ||
        !TAGS[idx].desc ||
        !TAGS[idx].example ||
        !Array.isArray(TAGS[idx].keywords) ||
        TAGS[idx].keywords.length === 0;

      if (bad) TAGS[idx] = obj;
    } else {
      TAGS.push(obj);
    }
  }
})();


// ==============================
// Busca inteligente
// ==============================
function findTag(query) {
  const cleaned = norm(query);
  if (!cleaned) return { tag: null, reason: "empty" };

  // se digitou "<img>"
  const bracketless = cleaned.replace(/[<>]/g, "").trim();
  const directKey = TAGS.find(t => norm(t.key) === bracketless);
  if (directKey) return { tag: directKey, reason: "direct-key" };

  // tokens úteis
  const tokens = tokenize(query);
  if (tokens.length === 0) return { tag: null, reason: "only-stopwords" };

  // alias por frase (tokens juntos) e por token
  const phrase = tokens.join(" ");
  if (ALIAS_MAP[phrase]) {
    const hit = TAGS.find(t => t.key === ALIAS_MAP[phrase]);
    if (hit) return { tag: hit, reason: "alias-phrase" };
  }
  for (const token of tokens) {
    if (ALIAS_MAP[token]) {
      const hit = TAGS.find(t => t.key === ALIAS_MAP[token]);
      if (hit) return { tag: hit, reason: "alias-token" };
    }
  }

  // match exato por key/keyword
  for (const token of tokens) {
    for (const t of TAGS) {
      if (norm(t.key) === token) return { tag: t, reason: "exact-key" };
      const kws = (t.keywords || []).map(norm);
      if (kws.includes(token)) return { tag: t, reason: "exact-keyword" };
    }
  }

  // score
  const scores = new Map();
  for (const token of tokens) {
    for (const t of TAGS) {
      const keyN = norm(t.key);
      const kws = (t.keywords || []).map(norm);

      let s = 0;
      if (kws.some(k => k.includes(token) || token.includes(k))) s += 2;
      if (keyN.includes(token) || token.includes(keyN)) s += 2;
      if (token.length >= 4 && (kws.includes(token) || keyN === token)) s += 1;

      if (s > 0) scores.set(t.key, (scores.get(t.key) || 0) + s);
    }
  }

  if (scores.size === 0) return { tag: null, reason: "no-match" };

  const ordered = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const [bestKey, bestScore] = ordered[0];
  const secondScore = ordered[1]?.[1] ?? 0;

  const MIN_SCORE = 3;
  const GAP = 2;

  if (bestScore < MIN_SCORE || (bestScore - secondScore) < GAP) {
    return { tag: null, reason: "ambiguous" };
  }

  return { tag: TAGS.find(t => t.key === bestKey) || null, reason: "scored" };
}

// ==============================
// Render (usa seus IDs do HTML)
// ==============================
const titleEl = document.getElementById("result-title");
const descEl = document.getElementById("result-desc");
const codeEl = document.getElementById("code-out");

function render(tag) {
  if (!titleEl || !descEl || !codeEl) return;

  if (!tag) {
    titleEl.textContent = "Pesquisa não reconhecida";
    descEl.textContent =
      "Digite só a palavra-chave. Exemplos: imagem, parágrafo, link, título, lista, tabela, formulário.";
    codeEl.textContent =
      `Exemplos válidos:
- imagem
- parágrafo
- link
- título
- lista
- tabela
- formulário`;
    return;
  }

  titleEl.textContent = `${tag.title}: ${tag.desc}`;
  descEl.textContent = "Exemplo:";
  codeEl.textContent = tag.example;
}

// ==============================
// MENU DO HTML (onclick="loadTag('...')")
// ==============================
function loadTag(key) {
  const { tag } = findTag(key);
  render(tag);
}
// deixa acessível no HTML inline
window.loadTag = loadTag;

// ==============================
// Pesquisa (botão + Enter)
// ==============================
const input = document.getElementById("tag-input");
const searchBtn = document.getElementById("search-btn");

function searchNow() {
  const { tag } = findTag(input?.value || "");
  render(tag);
}

if (searchBtn) {
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchNow();
  });
}

if (input) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchNow();
    }
  });
}
// ==============================
// Modal: Sobre mim (ADICIONADO)
// ==============================
const openAbout = document.getElementById("open-about");
const aboutModal = document.getElementById("about-modal");
const closeAbout = document.getElementById("close-about");

let lastFocus = null;

function openModal() {
  if (!aboutModal) return;
  lastFocus = document.activeElement;

  aboutModal.classList.add("is-open");
  aboutModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  // foca no botão de fechar (bom pra acessibilidade)
  closeAbout?.focus();
}

function closeModal() {
  if (!aboutModal) return;

  aboutModal.classList.remove("is-open");
  aboutModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  // devolve foco pra onde estava
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

openAbout?.addEventListener("click", (e) => {
  e.preventDefault();
  openModal();
});

closeAbout?.addEventListener("click", closeModal);

// Clicar fora do modal (overlay) fecha
aboutModal?.addEventListener("click", (e) => {
  if (e.target === aboutModal) closeModal();
});

// ESC fecha
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && aboutModal?.classList.contains("is-open")) {
    closeModal();
  }
});