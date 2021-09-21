# Amazonia Minada API

**Busca Geral**
----
Método que permite uma busca geral para Substância, Estado, Solicitante (Empresa), Terras Indígenas, Unidades de Conservação ou Etnias de Terras Indígenas, retornando as opções disponíveis no Banco de Dados que são iniciadas com a string fornecida.

* **URL:**
  
      /api/search/:searchTerm

* **Método:**

  `GET`

* **Parâmetros na URL:**

  **Obrigatórios:**
          
    - searchTerm:[string] - Palavra que será utilizada na busca

* **Parâmetros no Body:**

  Nenhum

* **Exemplo:**

      /api/search/amaz

* **Resposta:**

    * **Código:** <span style="color:green">**200**</span> <br/>
      **Conteúdo:**

      ```javascript
        [
          {
            "type": "state",
            "value": "Amazonas"
          },
          {
            "type": "company",
            "value": "AMAZON GLOBAL CONSULT LTDA"
          },
          {
            "type": "company",
            "value": "Amazonas Exploração e Mineração Ltda."
          },
          {
            "type": "company",
            "value": "AMAZON STONE S.A."
          },
          {
            "type": "company",
            "value": "Amazonas Comercio Atacadista de Joias e Participaçoes Ltda Epp"
          }
        ]
      ```
      **Descrição:** Retorna um array de objetos contendo o tipo de dado [substance (substância), company (solicitante), state (estado), reserve (terra indígena), unity (unidade de conservação) ou ethnicity (etnia de terras indígenas)] e o valor (nome) das opções que são iniciadas pela string determinada.
      
    * **Código:** <span style="color:red">**500**</span> <br />
      **Conteúdo:**
      ```javascript
      {
        "message": "Internal Server Error"
      }
      ```
      **Descrição:** Erro interno do servidor.


**Listar Requerimentos**
----
Método que permite uma filtragem dos requerimentos minerários em Unidades de Conservação e em Terras Indígenas.

* **URL:**
  
      /api/invasions

* **Método:**

  `POST`

* **Parâmetros na URL:**

  - page?:[number] - Número da página de registros a ser retornada, retorna a primeira página caso um número não seja informado.
  - pageSize?:[number] - Número de requerimentos por página, caso não seja informado são retornados 10 por página.
  - output?:[string] - Formato de saída (permitidos: csv).

* **Parâmetros no Body:**

  ```javascript
  {
    "filters": {
      "state": [], //Array de strings com o nome dos estados
      "company": [], //Array de strings com o nome das empresas
      "reserve": [], //Array de strings com o nome das Terras Indígenas
      "unity": [], //Array de strings com o nome das Unidades de Conservação
      "year": [], //Array de inteiros com os anos
      "substance": [], //Array de strings com o nome das substâncias
      "reservePhase": [], //Array de strings com as fases do processo de homologação das terras indígenas
      "reserveEthnicity": [], //Array de strings com o nome das etinias de terras indígenas
      "requirementPhase": [], //Array de strings com as fases dos requerimentos de mineração
    },
    "enableUnity": true, //Boolean para ativar/desativar dados de ucs (default: true)
    "enableReserve": true, //Boolean para ativar/desativar dados de Terras Indígenas (default: true)
  }
  ```
  **Descrição:** Todos os filtros são parâmetros opcionais e podem ser combinados.

* **Exemplo:**

  **Rota:**
      /api/invasions?page=1&pageSize=2

  **Body:**
    ```javascript
    {
      "filters": {
        "state": ["Amazonas"],
        "reserve": ["Andirá-Marau"],
      },
      "enableReserve": true
    }
    ```

* **Resposta:**

    * **Código:** <span style="color:green">**200**</span> <br/>
      **Conteúdo:**

      ```javascript
        {
          "values": [
            {
              "company": "Falcon Metais Ltda",
              "process": "880816/2008",
              "area": 9928.68,
              "year": 2008,
              "state": "AM",
              "territory": "Andirá-Marau",
              "reservePhase": "Regularizada",
              "reserveEthnicity": "Múra",
              "type": "indigenousLand",
              "miningProcess": "REQUERIMENTO DE PESQUISA",
              "substance": "OURO"
            },
            {
              "company": "Falcon Metais Ltda",
              "process": "880819/2008",
              "area": 9932.87,
              "year": 2008,
              "state": "AM",
              "territory": "Andirá-Marau",
              "reservePhase": "Regularizada",
              "reserveEthnicity": "Múra",
              "type": "indigenousLand",
              "miningProcess": "REQUERIMENTO DE PESQUISA",
              "substance": "OURO"
            }
          ],
          "pages": 10,
          "results": 20
        }
      ```
      **Descrição:** Retorna um array de objetos contendo os dados de cada requerimento que se enquadra nos filtros definidos, o número de páginas e a quantidade de requerimentos.
      
    * **Código:** <span style="color:red">**500**</span> <br />
      **Conteúdo:**
      ```javascript
      {
        "message": "Internal Server Error"
      }
      ```
      **Descrição:** Erro interno do servidor.

**Estatísticas**
----
Método que retorna as estatísticas gerais (número de requerimentos e área) de Terras Indígenas e Unidades de Conservação de acordo com os filtros.

* **URL:**
  
      /api/statistics

* **Método:**

  `POST`

* **Parâmetros na URL:**

  Nenhum

* **Parâmetros no Body:**

  ```javascript
  {
    "filters": {
      "state": [], //Array de strings com o nome dos estados
      "company": [], //Array de strings com o nome das empresas
      "reserve": [], //Array de strings com o nome das Terras Indígenas
      "unity": [], //Array de strings com o nome das Unidades de Conservação
      "year": [], //Array de inteiros com os anos
      "substance": [], //Array de strings com o nome das substâncias
      "reservePhase": [], //Array de strings com as fases do processo de homologação das terras indígenas
      "reserveEthnicity": [], //Array de strings com o nome das etinias de terras indígenas
      "requirementPhase": [], //Array de strings com as fases dos requerimentos de mineração
    }
  }
  ```
  **Descrição:** Todos os filtros são parâmetros opcionais e podem ser combinados.

* **Exemplo:**

  **Rota:**
      /api/statistics

  **Body:**
    ```javascript
    {
      "filters": {
        "state": ["Amazonas"],
        "reserve": ["Andirá-Marau"]
      }
    }
    ```

* **Resposta:**

    * **Código:** <span style="color:green">**200**</span> <br/>
      **Conteúdo:**

      ```javascript
        {
          "requirementsIncidence": {
            "reserve": 19,
            "unity": 0,
            "total": 19
          },
          "requiredArea": {
            "reserve": 40742.13,
            "unity": 0,
            "total": 40742.13
          }
        }
      ```
      **Descrição:** Retorna um objeto contendo as estatísticas dos requerimentos que se enquadram nos filtros definidos.
      
    * **Código:** <span style="color:red">**500**</span> <br />
      **Conteúdo:**
      ```javascript
      {
        "message": "Internal Server Error"
      }
      ```
      **Descrição:** Erro interno do servidor.

**Listar Fases do Processo de Homologação das Terras Indígenas**
----
Método que retorna as opções de fase do processo de homologação de terras indígenas.

* **URL:**
  
      /api/reserves/phase

* **Método:**

  `GET`

* **Parâmetros na URL:**

  Nenhum

* **Parâmetros no Body:**

  Nenhum

* **Exemplo:**

  **Rota:**
      /api/reserves/phase

  **Body:**
    ```javascript
    {
      "filters": {
        "state": ["Amazonas"],
        "reserve": ["Andirá-Marau"]
      }
    }
    ```

* **Resposta:**

    * **Código:** <span style="color:green">**200**</span> <br/>
      **Conteúdo:**

      ```javascript
        [
          "Declarada",
          "Delimitada",
          "Em Estudo",
          "Encaminhada RI",
          "Homologada",
          "Regularizada"
        ]
      ```
      **Descrição:** Retorna um array contendo as opções das fases do processo de homologação de terras indígenas.
      
    * **Código:** <span style="color:red">**500**</span> <br />
      **Conteúdo:**
      ```javascript
      {
        "message": "Internal Server Error"
      }
      ```
      **Descrição:** Erro interno do servidor.

**Listar Fases do Requerimento de Mineração**
----
Método que retorna as opções de fase do requerimento de mineração.

* **URL:**
  
      /api/invasions/phase

* **Método:**

  `GET`

* **Parâmetros na URL:**

  Nenhum

* **Parâmetros no Body:**

  Nenhum

* **Resposta:**

    * **Código:** <span style="color:green">**200**</span> <br/>
      **Conteúdo:**

      ```javascript
        [
          "APTO PARA DISPONIBILIDADE",
          "AUTORIZAÇÃO DE PESQUISA",
          "CONCESSÃO DE LAVRA",
          "DIREITO DE REQUERER A LAVRA",
          "DISPONIBILIDADE",
          "LAVRA GARIMPEIRA",
          "LICENCIAMENTO",
          "REQUERIMENTO DE LAVRA",
          "REQUERIMENTO DE LAVRA GARIMPEIRA",
          "REQUERIMENTO DE LICENCIAMENTO",
          "REQUERIMENTO DE PESQUISA",
          "REQUERIMENTO DE REGISTRO DE EXTRAÇÃO"
        ]
      ```
      **Descrição:** Retorna um array contendo as opções das fases dos requerimentos de mineração.
      
    * **Código:** <span style="color:red">**500**</span> <br />
      **Conteúdo:**
      ```javascript
      {
        "message": "Internal Server Error"
      }
      ```
      **Descrição:** Erro interno do servidor.

**Ranking de frequência e de área**
----
Método que retorna o ranking de acordo com o território e o tipo de dado especificado

* **URL:**
  
      /api/invasions/ranking/:territoryType/:dataType

* **Método:**

  `POST`

* **Parâmetros na URL:**

  - territoryType:[string] - Tipo de território a ser utilizado na construção do ranking('company', 'state', 'unity', 'reserve').
  - dataType:[string] - Tipo de dado a ser retornado, 'requirementsIncidence' para a frequencia de requerimentos em território e 'requiredArea' para área total dos requerimentos por território.
  - page?:[number] - Número da página de registros a ser retornada, retorna todos os registros caso um número não seja informado.

* **Parâmetros no Body:**

  ```javascript
  {
    "filters": {
      "state": [], //Array de strings com o nome dos estados
      "company": [], //Array de strings com o nome das empresas
      "reserve": [], //Array de strings com o nome das Terras Indígenas
      "unity": [], //Array de strings com o nome das Unidades de Conservação
      "year": [], //Array de inteiros com os anos
      "substance": [], //Array de strings com o nome das substâncias
    }
  }
  ```

* **Exemplo:**

  **Rota:**
      /api/invasions/ranking/company/value?page=1

* **Resposta:**

    * **Código:** <span style="color:green">**200**</span> <br/>
      **Conteúdo:**

      ```javascript
        {
          "x": [
            "VALE S.A.",
            "MINERAÇÃO SERRA MORENA LTDA",
            "Iguape Sociedade de Mineração Iguape Ltda",
            "Rio Grande Mineração S A",
            "Mineração Guanhães Ltda"
          ],
          "position": [
            1,
            2,
            3,
            4,
            5
          ],
          "series": [
            {
              "id": "indigenousLand",
              "data": [
                447938.31,
                469529.25,
                446421.21,
                429561.29,
                276058.67
              ]
            },
            {
              "id": "protectedArea",
              "data": [
                112761.6,
                49983.95,
                0,
                7460.83,
                80000
              ]
            }
          ],
          "pageAmount": 125,
          "dataType": "requiredArea"
        }
      ```
      **Descrição:** Retorna um array de series que contém os valores de cada tipo de dado, um array com as respectivas posições e um com os nomes dos territórios.
      
    * **Código:** <span style="color:red">**500**</span> <br />
      **Conteúdo:**
      ```javascript
      {
        "message": "Internal Server Error"
      }
      ```
      **Descrição:** Erro interno do servidor.
