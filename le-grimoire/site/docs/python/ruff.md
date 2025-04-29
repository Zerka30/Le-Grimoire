---
outline: deep
---

<div id="header" align="center">
  <img src="/images/docs/python/ruff/logo.png" width="600px"/>
</div>
<br><br>

# Ruff - A better alternative to flake8, black, isort, ...

## Introduction

Ruff est un linter et formateur Python ultra-performant, développé par [astral.sh](https://astral.sh/) qui sont également à l'origine de [uv](https://docs.astral.sh/uv/), un gestionnaire de paquets Python moderne. Ruff est écrit en Rust ce qui lui permet d'être plus performant que ses concurrents, tout en étant un All-in-one afin de remplacer les outils traditionnels dans un workflow Python tels que [flake8](https://flake8.pycqa.org/en/latest/), [isort](https://isort.readthedocs.io/en/stable/), [black](https://black.readthedocs.io/en/stable/) ...

Astral nous fournit un benchmark comparatif afin de montrer les performances de Ruff par rapport à ses concurrents :

<div class="center">
  <img src="/images/docs/python/ruff/benchmark.svg" alt="Ruff Benchmark" />
</div>

## Installation

Pour installer Ruff, différentes solutions sont possibles :

1. Avec `pip` : 
```bash
pip install ruff
```

2. Avec `pipx` : 
```bash
pipx install ruff
```

3. Si vous utilisez un gestionnaire de paquets Python comme `uv` ou `poetry` : 
```bash
# uv
uv add --dev ruff

# poetry
poetry add --dev ruffWith
```

---
Il existe des méthodes d'installation alternatives dépendant de votre système d'exploitation. Plus d'informations directement dans la documentation officielle : [docs.astral.sh/ruff/installation/](https://docs.astral.sh/ruff/installation/)

--- 

## Utilisation

Ruff se comporte comme un CLI (Command Line Interface), il est donc possible d'utiliser les commandes suivantes :
- `ruff check .` : Lint tous les fichiers dans le répertoire courant.
- `ruff format .` : Formate tous les fichiers dans le répertoire courant.
- `ruff check . --select I --fix` : Formate tous les fichiers mais uniquements les imports (équivalent à `isort`).

--- 

## Intégrations 

Si vous aviez pour habitude d'utiliser `flake8`, `black` ou encore `isort` directement au sein de votre IDE préféré. Sachez que vous ne serai pas perdu à faire le switch vers `ruff` car lui aussi propose de nombreuses intégrations.

### VSCode

Pour VSCode ou tout autre "VSCode Based" (Cursor, ...), il existe un plugin officiel directement sur le marketplace : [Ruff](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff). 

1. Ouvrez le menu `Extensions` et recherchez `Ruff`.

2. Cliquez sur `Installer`.

3. Configurez les paramètres dans le fichier `settings.json` de VSCode. Les plus importants sont :

```json
{

  "ruff.enable": true,
  "ruff.configurationPreference": "filesystemFirst", // editorFirst, filesystemFirst, editorOnly
  "ruff.fixAll": true,           // Corrige les problèmes
  "ruff.lint.enable": true,      // Sinon Ruff fonctionne uniquement en formatter
  "ruff.lint.run": "onType",     // Quand on lint ? onType, onSave
  "ruff.lint.ignore": ["E203"],  // Ignorer certaines erreurs
  "ruff.run": "onType",          // Quand on format ? onType, onSave
  "ruff.lineLength": 120,        // Si on veut pas utiliser la ligne de 80 caractères
  "ruff.organizeImports": false, // Si on veut pas utiliser isort
  "ruff.exclude": null,          // Exclure des fichiers
}
```

### Gestionnaire de paquets (uv, poetry, ...)

Ruff propose également une intégrations avec les gestionnaires de paquets Python tels que `uv`, `poetry` ... au travers du fichier `pyproject.toml`. 

1. On installer Ruff en mode développement : `poetry add --dev ruff` ou `uv add --dev ruff`

2. On configure Ruff dans le fichier `pyproject.toml` :

```toml
[tool.ruff]
line-length = 120
lint.ignore = [
    "E203", # Whitespace before ':'
    "E712",
]

[tool.ruff.lint.isort]
order-by-type = true
relative-imports-order = "closest-to-furthest"
extra-standard-library = ["typing"]
section-order = ["future", "standard-library", "third-party", "first-party", "local-folder"]
known-first-party = []
```

### Pre-commit

Ruff s'intègre également très facilement avec `pre-commit`. Pour ce faire, il suffit d'ajouter la configuration suivante à notre fichier `.pre-commit-config.yaml` :

```yaml
- repo: https://github.com/astral-sh/ruff-pre-commit
  rev: v0.11.6
  hooks:
    - id: ruff
      args: [--fix]
    - id: ruff-format
      args: [--diff, --target-version, py312]
```

Puis, il suffit de lancer `pre-commit install` pour activer le hook.

Une fois le hook installé, on peut lancer `pre-commit run --all-files` pour lancer le hook sur tous les fichiers afin de vérifier que tout est bon.

--- 

