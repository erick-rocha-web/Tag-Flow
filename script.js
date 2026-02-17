// ==============================
// Sidebar toggle
// ==============================
const toggleBtn = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");

function setExpanded(isOpen) {
  if (!toggleBtn) return;
  toggleBtn.setAttribute("aria-expanded", String(isOpen));
}

if (toggleBtn && sidebar) {
  setExpanded(!sidebar.classList.contains("closed"));
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
    setExpanded(!sidebar.classList.contains("closed"));
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
  { key: "select", title: "<select>", desc: "Caixa de seleção (dropdown).", example: `<select>\n  <option>Opção 1</option>\n  <option>Opção 2</option>\n</select>`, keywords: ["select", "selecao", "seleção", "dropdown", "opcao", "opção", "lista suspensa"] }
];

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
