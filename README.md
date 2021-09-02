# Amazonia Minada API

**Busca Geral**
----
Método que permite uma busca geral para Estado, Solicitante (Empresa), Terras Indígenas ou Unidades de Conservação, retornando as opções disponíveis no Banco de Dados que são iniciadas com a string fornecida.

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
      **Descrição:** Retorna um array de objetos contendo o tipo de dado [company (solicitante), state (estado), reserve (terra indígena) ou unity (unidade de conservação)] e o valor (nome) das opções que são iniciadas pela string determinada.
      
    * **Código:** <span style="color:red">**500**</span> <br />
      **Conteúdo:**
      ```javascript
      {
        message: 'Internal Server Error'
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

  Nenhum

* **Parâmetros no Body:**

  ```javascript
  {
    "filters": {
      "state": [], //Array de strings com o nome dos estados
      "company": [], //Array de strings com o nome das empresas
      "reserve": [], //Array de strings com o nome das Terras Indígenas
      "unity": [], //Array de strings com o nome das Unidades de Conservação
    }
  }
  ```
  **Descrição:** Todos os filtros são parâmetros opcionais e podem ser combinados.

* **Exemplo:**

  **Rota:**
      /api/invasions

  **Body:**
    ```javascript
    {
      "filters": {
        "state": ["Amazonas"],
        "reserve": ["Andirá-Marau"],
        "company": ["José Aparecido da Silva"]
      }
    }
    ```

* **Resposta:**

    * **Código:** <span style="color:green">**200**</span> <br/>
      **Conteúdo:**

      ```javascript
        [
          {
            "company": "José Aparecido da Silva",
            "process": "880039/2009",
            "area": 9603.9,
            "year": 2009,
            "state": "AM",
            "territory": "Andirá-Marau",
            "type": "Terra Indígena"
          }
        ]
      ```
      **Descrição:** Retorna um array de objetos contendo os dados de cada requerimento que se enquadra nos filtros definidos.
      
    * **Código:** <span style="color:red">**500**</span> <br />
      **Conteúdo:**
      ```javascript
      {
        message: 'Internal Server Error'
      }
      ```
      **Descrição:** Erro interno do servidor.