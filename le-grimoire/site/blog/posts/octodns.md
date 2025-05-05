---
title: OctoDNS - How to manage DNS as code
description: Découvrez comment gérer vos zones DNS comme du code avec OctoDNS, l'outil qui révolutionne la gestion DNS multi-fournisseurs. Un guide pratique pour automatiser et sécuriser votre infrastructure DNS.
thumbnail: /images/blog/octodns/cover.png
author: Raphaël Hien
date: 2025-04-29
tags: ['dns', 'as-code']
isPublished: false

outline: deep
layout: PostLayout
---

# OctoDNS - How to manage DNS as code

[[toc]]

## Introduction

Dans le monde de l'informatique moderne, de plus en plus d'entreprise cherche à automatiser autant de tâches que possible. Cela permet de gagner du temps, de gagner en qualité, et d'éviter de nombreuses erreurs humaines. Ces automatisations passent par la mise en place de système « as Code ». 

C'est pourquoi, j'ai longtemps rêvé d'un système qui me permettrait de gérer mes zones DNS de cette manière. L'idée étant que quand je déploie un nouveau service, en quelques secondes, je puisse mettre à jour ma zones DNS pour que mon service soit accessible, sans devoir passer par les interfaces de mes fournisseurs qui sont toutes différentes, avec leurs spécificités propres.

### Qu'est ce que OctoDNS ?
[**OctoDNS**](https://github.com/octodns/octodns) est un outil open source écrit en python et développé par [ross](https://github.com/ross) qui permet de gérer ces zones DNS as code. Cette solution offre une approche complètement différente en reposant sur trois principes clés :
1. **Configuration déclarative** : Tous les enregistrements DNS sont définis dans des fichiers `.yml`
2. **Source de vérité** : Les fichiers YAML deviennent la référence absolue de notre configuration
3. **Abstraction des fournisseurs** : Une syntaxe unifiée indépendante des spécificités de chaque provider

L'outil prend déjà en charge de nombreux fournisseurs DNS tels que :
- Amazon Route 53
- Cloudflare
- Google Cloud DNS
- OVH
- Infomaniak
- Et bien d'autres...

Toutefois, si votre provider n'est pas encore supporté, il vous sera très facile développer votre propre plugin pour l'intégrer. La modularité est l'un des atouts majeurs de cet outil, et sa base en Python rend le développement d'extensions particulièrement accessible.

De plus, OctoDNS intègre également des fonctionnalités de validation et de prévisualisation des changements avant leur application, réduisant ainsi les risques d'erreurs lors des modifications DNS.

## Comment ça marche ?

Dans le cadre de cet article, nous allons mettre en place une configuration de base, en utilisant un unique provider : Infomaniak. 

Toutefois, la configuration utilisée ici est parfaitement compatible avec d'autres providers, et facilement adaptable pour la mise en place dans des environments plus complexes.

La structure de notre projet sera la suivante :

```bash
octodns/
├── zones/
│   ├── home.zerka.dev.yaml
│   └── ...
├── venv/
│   └── ...
├── octodns.yaml
└── README.md
```

Le point d'entrée de notre configuration sera le fichier `octodns.yaml` qui contiendra la configuration globale de notre infrastructure. Et les fichiers de configurations seront respectivement définis dans le répertoire `zones/`.

### Installation

Pour commencer, nous devons installer OctoDNS. La documentation officielle nous incite explicitement à utiliser un environnement virtuel Python.

1. Donc, on crée un environnement virtuel Python :
```bash
python3 -m venv venv
source venv/bin/activate
```

2. On active l'environnement virtuel : 
```bash
source venv/bin/activate
```

3. On installe OctoDNS : 
```bash
pip install octodns
```
  
On peut ensuite vérifier que l'installation s'est bien passée en faisant un `octodns-sync --version` qui devrait nous retourner la version installée.
```bash
(octodns) ➜ raphael@XPS-Raph:~ $ octodns-sync --version
octoDNS 1.11.0
```

Maintenant que nous avons installé OctoDNS, nous devons installer les différents plugins nécessaires pour supporter nos différents fournisseurs DNS.  
Pour cela, il suffit de faire un `pip install octodns-<provider>`. Par exemple, pour mon cas, j'utilise Infomaniak, j'installe le plugin dédié avec la commande suivante :

```bash
pip install octodns-infomaniak
```

::: info
Initialement, j'avais commencé à développer le plugin `octodns-infomaniak` mais par manque de temps, c'est [M0NsTeRRR](https://github.com/M0NsTeRRR) qui a redévelopper le plugin depuis zéro.  
Merci à lui pour son travail !
:::

Vous êtes maintenant prêt à gérer vos zones DNS avec OctoDNS !

### Configuration

Maintenant, que notre installation est terminée, nous pouvons commencer à mettre en place notre configuration. 

Pour commencer, nous devons créer un fichier de configuration principal qui servira de point d'entrée pour toute notre configuration OctoDNS.
```bash
touch octodns.yaml
```

Ce fichier est composé de 2 grandes sections qui sont obligatoires :
- `providers` : Cette section permet de configurer les fournisseurs DNS que nous utilisons.
- `zones` : Cette section permet de configurer les zones DNS que nous souhaitons gérer.

#### Providers

La section `providers` permet de définir les différents fournisseurs DNS que nous souhaitons utiliser. Nous pouvons configurer autant de providers que nécessaire, tout en veillant à ce que chaque identifiant soit unique.

Par exemple, pour mon cas avec Infomaniak, voici ce que cela donnerais :

```yaml
---
providers:
  infomaniak:
    class: octodns_infomaniak.InfomaniakProvider
    token: env/INFOMANIAK_TOKEN
```

Dans cette configuration, nous définissons :
- `infomaniak`: Correspondant à l'identifiant de notre provider.
- `class`: La classe de notre provider, qui nous est fourni par la documentation de notre plugin.
- `token`: Le token qui nous permettra d'accéder à l'API d'Infomaniak au travers d'une variable d'environnement nommée INFOMANIAK_TOKEN.

::: tip
Chaque provider définit ça propre structure de configuration. Il est donc nécessaire de se référer à la documentation de votre provider.
:::

Dans la structure de notre projet, nous définissons un répertoire `zones` qui contient les fichiers de configuration pour chaque zone DNS que nous souhaitons gérer. Cela facilite la gestion des différentes zones DNS que nous souhaitons gérer, et améliore la lisibilité de notre configuration.

Nous devons donc définir un provider local qui nous permettra de lire les fichiers de configuration dans le répertoire `./zones`. Ce provider, c'est le provider `yaml`. 

On rajoute donc la configuration suivante dans notre fichier principal :

```yaml
providers:
  config:
    class: octodns.provider.yaml.YamlProvider
    directory: ./zones
```

#### Zones

La section `zones` dans notre fichier de configuration global permet de "mapper" les zones DNS avec les providers que nous avons défini dans la section `providers`.

Voici un exemple de configuration intéressante :
```yaml
---
providers:
  include: providers/infomaniak.yaml
  config:
    class: octodns.provider.yaml.YamlProvider
    directory: ./zones

zones:
  "zerka.dev.": &zerka
    sources:
      - config
    targets:
      - infomaniak

  "home.zerka.dev.": *zerka
  "cloud.zerka.dev.": *zerka

  "raphaelhien.fr.": &raphael
    sources:
      - config
    targets:
      - infomaniak

  "raphaelhien.ch.":
    alias: raphaelhien.fr.
```

Intéressons nous dans un premier temps à la zone `zerka.dev.`. Ici, je décris la zone `zerka.dev.`, en lui assignant comme source le provider `config` et comme target le provider `infomaniak`. En d'autre termes, nous faisons référence au fichier de configuration dans le répertoire `./zones` pour la lecture et l'écriture sur le provider `infomaniak`.

Ensuite, je décrit les zones `home.zerka.dev.` et `cloud.zerka.dev.` en utilisant l'alias `&zerka` défini précédemment, ce qui signifie que ces deux zones utiliseront la même configuration que la zone `zerka.dev.`.

Et enfin, je décris une zone `raphaelhien.fr.` comme la zone `zerka.dev.` mais qui pourrait ici très bien utiliser un provider différent. Et je défini un alias `raphaelhien.ch.` se qui veut dire que toutes les entrées de la zone `raphaelhien.fr.` seront automatiquement appliquées à la zone `raphaelhien.ch.`.

::: info
Nous n'avons ici, pas encore défini les enregistrements DNS pour chaque zone. Nous avons uniquement défini les sources et les targets pour chacune de nos zones.
:::

## Utilisation

Lorsque vous utilisez OctoDNS, il réalise un diff entre les enregistrements DNS actuellement définis (récupérés depuis le provider via l'API) et les enregistrements DNS définis dans les fichiers de configuration. Si vous souhaitez donc migrer votre système de gestion actuel vers OctoDNS, il faut absolument redéfinir *tous* les enregistrements DNS dans les fichiers de configuration auquel cas vous risqueriez de perdre des enregistrements DNS.

Mais heureusement, OctoDNS nous permet de réaliser cette migration facilement avec la commande suivante qui va nous permettre de faire un dump intégral de notre zone DNS actuelle.

```bash
(octodns) ➜ raphael@XPS-Raph:~ $ octodns-dump --config-file octodns.yaml --output-dir ./zones home.zerka.dev. infomaniak
```

::: warning
Il faut tout de même que votre zone soit défini dans votre fichier de configuration global, afin que OctoDNS puisse lire les enregistrements DNS actuellement définis. Sinon, vous aurez une erreur de type `Unknown zone name home.zerka.dev.`.
:::

Une fois que le dump est fait, nous pouvons donc commencer à gérer notre zone DNS sans trop de risque. Par exemple, ajoutons un enregistrement `CNAME` pour le service `demo.home.zerka.dev.` qui pointera vers `traefik.home.zerka.dev.`. On ajoute donc dans le fichier `home.zerka.dev.yaml` la configurations suivante : 

```yaml
demo:
  type: CNAME
  value: traefik.home.zerka.dev.
```

Puis, on vérifie que notre configuration est valide en lançant la commande suivante :

```bash
(octodns) ➜ raphael@XPS-Raph:~ $ octodns-validate --config-file octodns.yaml home.zerka.dev.
```

Si tout est bon, nous pouvons lancer la commande suivante pour appliquer nos modifications :

```bash
(octodns) ➜ raphael@XPS-Raph:~/Workspace/octodns-blog $ octodns-sync --config-file octodns.yaml
2025-04-29T14:48:12  [127034523914368] INFO  Manager __init__: config_file=octodns.yaml, (octoDNS 1.11.0)
2025-04-29T14:48:12  [127034523914368] INFO  Manager _config_executor: max_workers=1
2025-04-29T14:48:12  [127034523914368] INFO  Manager _config_include_meta: include_meta=False
2025-04-29T14:48:12  [127034523914368] INFO  Manager _config_enable_checksum: enable_checksum=False
2025-04-29T14:48:12  [127034523914368] INFO  Manager _config_auto_arpa: auto_arpa=False
2025-04-29T14:48:12  [127034523914368] INFO  Manager __init__: global_processors=[]
2025-04-29T14:48:12  [127034523914368] INFO  Manager __init__: global_post_processors=[]
2025-04-29T14:48:12  [127034523914368] INFO  Manager __init__: provider=config (octodns.provider.yaml 1.11.0)
2025-04-29T14:48:12  [127034523914368] INFO  Manager __init__: provider=infomaniak (octodns_infomaniak 0.1.5)
2025-04-29T14:48:12  [127034523914368] INFO  Manager sync: eligible_zones=[], eligible_targets=[], dry_run=True, force=False, plan_output_fh=<stdout>, checksum=None
2025-04-29T14:48:12  [127034523914368] INFO  Manager sync:   zone=home.zerka.dev.
2025-04-29T14:48:12  [127034523914368] INFO  Manager sync:     sources=['config']
2025-04-29T14:48:12  [127034523914368] INFO  Manager sync:     processors=[]
2025-04-29T14:48:12  [127034523914368] INFO  Manager sync:     targets=['infomaniak']
2025-04-29T14:48:12  [127034523914368] INFO  YamlProvider[config] populate:   found 12 records, exists=True
2025-04-29T14:48:12  [127034523914368] INFO  InfomaniakProvider[infomaniak] plan: desired=home.zerka.dev.
2025-04-29T14:48:12  [127034523914368] INFO  InfomaniakProvider[infomaniak] populate:   found 11 records, exists=True
2025-04-29T14:48:12  [127034523914368] INFO  InfomaniakProvider[infomaniak] plan:   Creates=1, Updates=0, Deletes=0, Existing=11, Meta=False
2025-04-29T14:48:12  [127034523914368] INFO  Plan
********************************************************************************
* home.zerka.dev.
********************************************************************************
* infomaniak (InfomaniakProvider)
*   Create <CnameRecord CNAME 3600, demo.home.zerka.dev., traefik.home.zerka.dev.> (config)
*   Summary: Creates=1, Updates=0, Deletes=0, Existing=11, Meta=False
********************************************************************************
```

Cette commande nous permet de voir les changements qui seront appliqués. Ici, on voit bien que l'on va crée un enregistrement `CNAME` pour le service `demo.home.zerka.dev.` qui pointera vers `traefik.home.zerka.dev.`. On peut donc appliquer les changements en rajoutant le flag `--doit` à la commande.

```bash
(octodns) ➜ raphael@XPS-Raph:~/Workspace/octodns-blog $ octodns-sync --config-file octodns.yaml --doit
2025-04-29T14:49:30  [123934443401344] INFO  Manager __init__: config_file=octodns.yaml, (octoDNS 1.11.0)
2025-04-29T14:49:30  [123934443401344] INFO  Manager _config_executor: max_workers=1
2025-04-29T14:49:30  [123934443401344] INFO  Manager _config_include_meta: include_meta=False
2025-04-29T14:49:30  [123934443401344] INFO  Manager _config_enable_checksum: enable_checksum=False
2025-04-29T14:49:30  [123934443401344] INFO  Manager _config_auto_arpa: auto_arpa=False
2025-04-29T14:49:30  [123934443401344] INFO  Manager __init__: global_processors=[]
2025-04-29T14:49:30  [123934443401344] INFO  Manager __init__: global_post_processors=[]
2025-04-29T14:49:30  [123934443401344] INFO  Manager __init__: provider=config (octodns.provider.yaml 1.11.0)
2025-04-29T14:49:30  [123934443401344] INFO  Manager __init__: provider=infomaniak (octodns_infomaniak 0.1.5)
2025-04-29T14:49:30  [123934443401344] INFO  Manager sync: eligible_zones=[], eligible_targets=[], dry_run=False, force=False, plan_output_fh=<stdout>, checksum=None
2025-04-29T14:49:30  [123934443401344] INFO  Manager sync:   zone=home.zerka.dev.
2025-04-29T14:49:30  [123934443401344] INFO  Manager sync:     sources=['config']
2025-04-29T14:49:30  [123934443401344] INFO  Manager sync:     processors=[]
2025-04-29T14:49:30  [123934443401344] INFO  Manager sync:     targets=['infomaniak']
2025-04-29T14:49:30  [123934443401344] INFO  YamlProvider[config] populate:   found 12 records, exists=True
2025-04-29T14:49:30  [123934443401344] INFO  InfomaniakProvider[infomaniak] plan: desired=home.zerka.dev.
2025-04-29T14:49:30  [123934443401344] INFO  InfomaniakProvider[infomaniak] populate:   found 11 records, exists=True
2025-04-29T14:49:30  [123934443401344] INFO  InfomaniakProvider[infomaniak] plan:   Creates=1, Updates=0, Deletes=0, Existing=11, Meta=False
2025-04-29T14:49:30  [123934443401344] INFO  Plan
********************************************************************************
* home.zerka.dev.
********************************************************************************
* infomaniak (InfomaniakProvider)
*   Create <CnameRecord CNAME 3600, demo.home.zerka.dev., traefik.home.zerka.dev.> (config)
*   Summary: Creates=1, Updates=0, Deletes=0, Existing=11, Meta=False
********************************************************************************


2025-04-29T14:49:30  [123934443401344] INFO  InfomaniakProvider[infomaniak] apply: making 1 changes to home.zerka.dev.
2025-04-29T14:49:30  [123934443401344] INFO  InfomaniakProvider[infomaniak] Create <CnameRecord CNAME 3600, demo.home.zerka.dev., traefik.home.zerka.dev.> (config)
2025-04-29T14:49:30  [123934443401344] INFO  Manager sync:   1 total changes
```

Si l'on regarde notre zone DNS, sur l'interface d'Infomaniak, on voit bien que l'enregistrement `CNAME` a été crée.

![Infomaniak](/images/blog/octodns/infomaniak_zone.png)

### Automatisation

Mais ce qui nous intéresse nous, c'est pas d'avoir a effectuer ces changements manuellement. Nous souhaitons que ces changements soit effectué automatiquement. Pour cela, nous allons mettre en place un pipeline CI/CD qui va nous permettre de détecter les changements sur nos services et de les appliquer automatiquement.

On définit donc un pipeline Gitlab CI/CD qui va nous permettre de détecter les changements sur nos services et de les appliquer automatiquement.

```yaml
---
stages:
  - test
  - deploy

variables:
  INFOMANIAK_TOKEN: ${INFOMANIAK_TOKEN}

.rules:
  - &rule-mr
    if: $CI_PIPELINE_SOURCE == 'merge_request_event'
    when: on_success
  - &rule-branch
    if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

test:
  stage: test
  image: python:3.9-slim
  before_script:
    - pip install octodns octodns-infomaniak
  script:
    - octodns-sync --config octodns.yaml
  rules:
    - *rule-mr
    - *rule-branch

deploy:
  stage: deploy
  image: python:3.9-slim
  before_script:
    - pip install octodns octodns-infomaniak
  script:
    - octodns-sync --config octodns.yaml --doit
  rules:
    - *rule-branch
  when: on_success
```

Ce pipeline contient 2 jobs, dans un premier temps, le job `test` qui va nous permettre de valider notre configuration et de nous assurer que tout est bon. Et dans un second temps, le job `deploy` qui va nous permettre d'appliquer nos changements.

Ces jobs sont conditionnés par 2 règles :
- `rule-mr` : Cette règle va nous permettre de détecter les changements sur une merge request
- `rule-branch` : Cette règle va nous permettre de détecter les changements sur la branche principale

On a donc une solution très simple et efficace pour gérer nos zones DNS avec OctoDNS de manière automatisée.

## Conclusion

OctoDNS représente une véritable solution pour gérer ses zones DNS en adoptant une approche "as code". Il nous permet de :
- **Centraliser** toutes nos configurations DNS dans un format unifié
- **Automatiser** les déploiements via des pipelines CI/CD
- **Sécuriser** nos modifications grâce aux validations et prévisualisations
- **Standardiser** nos pratiques indépendamment des fournisseurs utilisés

Dans un monde où l'infrastructure as code devient la norme, OctoDNS s'impose comme une solution incontournable pour les équipes DevOps en permettant d'intégrer la gestion DNS dans les workflows d'automatisation, réduisant ainsi les erreurs humaines tout en accélérant les déploiements conformément aux pratiques DevOps actuelles.