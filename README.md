# PÁGINAS GMR MÍDIAS

Repositório independente das páginas publicadas para clientes da GMR Mídias.
Cada pasta de primeiro nível corresponde a um slug público e contém sua própria
página e seus próprios assets.

## Estrutura

```text
/<slug-do-cliente>/
  index.html
  assets e arquivos específicos

/proposta/
  materiais comerciais da GMR Mídias

clients.json
  inventário central das páginas
```

## Publicação

As páginas são publicadas pelo fluxo integrado do repositório e servidas no domínio:

`https://pages.gmrmidias.com/<slug>/`

Os slugs existentes não devem ser renomeados sem criar redirecionamento, pois
podem estar em uso por clientes.

## Regras de manutenção

- Um cliente por pasta.
- Todo cliente precisa de `index.html` na raiz da própria pasta.
- Assets de um cliente ficam dentro da pasta dele.
- Não compartilhar dados, links ou imagens entre clientes por cópia acidental.
- Atualizar `clients.json` ao adicionar ou remover uma página.
- Não versionar credenciais, dependências ou arquivos locais de sistema.
