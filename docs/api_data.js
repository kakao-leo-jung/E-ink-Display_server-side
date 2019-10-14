define({ "api": [
  {
    "type": "delete",
    "url": "/todo",
    "title": "DeleteTodo",
    "name": "DeleteTodo",
    "group": "Todo",
    "description": "<p>jwt 토큰과 todo 의 _id 값을 통해 현재 유저의 해당 todo 를 삭제합니다. url parameter 에 넣는 _id 값은 GET 을 통해 todolist 를 호출 했을 때 각 todo 객에가 지니고 있는 &quot;_id&quot; 의 value 값 입니다.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "jwt",
            "description": "<p>헤더에 JWT 토큰을 넣습니다.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "헤더 예제",
          "content": "{\n    // retrofit2 : HashMap 에 key값은 \"jwt\", value값은 \"eyJ...\" 로 설정\n    \"jwt\" : \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDUxODRjMWU5ZDMxZjRmYmYzNDQ3NDQiLCJ1c2VySWQiOiIxMDA4MjgzNDcwMzc2MDQ2NjA3MDAiLCJpYXQiOjE1NzEwNDAxNTcsImV4cCI6MTU3MTEyNjU1NywiaXNzIjoiY29tLmpjcC5tYWdpY2FwcGxpY2F0aW9uIiwic3ViIjoidXNlckF1dGgifQ.RcjjVWBSd5LOXPqqPIV-ZXVsBKOxob7vWm7tBJi4rjM\"\n}",
          "type": "form"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": ":_id",
            "description": "<p>지울 todo 정보의 고유 아이디 값</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "파라미터(url) 예제",
          "content": "URL : http://169.56.98.117/todo/5d9ed8a64d73a91bcc4526d7",
          "type": "path"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>삭제 완료 메세지</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>성공 상태 200</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공 시 응답 :",
          "content": "HTTP/1.1 200 OK\n{\n    \"message\": \"Todo delete success!\",\n    \"status\": 200\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_JWT",
            "description": "<p>JWT 가 헤더에 실려있지 않습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_JWT",
            "description": "<p>JWT 가 유효하지 않습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NOUSER_DB",
            "description": "<p>해당 유저의 정보가 DB에서 찾을 수 없습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ERR_CRUDDB",
            "description": "<p>내부 DB 작업에 실패하였습니다.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "실패 : NO_JWT",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"name\" : \"NO_JWT\",\n    \"message\": \"Please put JWT in your request header!\",\n    \"status\": 401\n}",
          "type": "json"
        },
        {
          "title": "실패 : INAVLID_JWT",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"name\" : \"INVALID_JWT\",\n    \"message\": \"Your JWT is invalid!\",\n    \"status\": 401\n}",
          "type": "json"
        },
        {
          "title": "실패 : NOUSER_DB",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"name\" : \"NOUSER_DB\",\n    \"message\": \"Cannot find userId in database!\",\n    \"status\": 500\n}",
          "type": "json"
        },
        {
          "title": "실패 : ERR_CRUDDB",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"name\" : \"ERR_CRUDDB\",\n    \"message\": \"Cannot CRUD your Todo in database!\",\n    \"status\": 400\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/todo.js",
    "groupTitle": "Todo"
  },
  {
    "type": "get",
    "url": "/todo",
    "title": "유저의 GetTodoList",
    "name": "GetTodo",
    "group": "Todo",
    "description": "<p>현재 유저가 등록한 Todo 리스트를 반환합니다. 반환받을 때 각 todo 의 _id 값으로 put, delete 요청을 할 수 있습니다.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "jwt",
            "description": "<p>헤더에 JWT 토큰을 넣습니다.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "헤더 예제",
          "content": "{\n    // retrofit2 : HashMap 에 key값은 \"jwt\", value값은 \"eyJ...\" 로 설정\n    \"jwt\" : \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDUxODRjMWU5ZDMxZjRmYmYzNDQ3NDQiLCJ1c2VySWQiOiIxMDA4MjgzNDcwMzc2MDQ2NjA3MDAiLCJpYXQiOjE1NzEwNDAxNTcsImV4cCI6MTU3MTEyNjU1NywiaXNzIjoiY29tLmpjcC5tYWdpY2FwcGxpY2F0aW9uIiwic3ViIjoidXNlckF1dGgifQ.RcjjVWBSd5LOXPqqPIV-ZXVsBKOxob7vWm7tBJi4rjM\"\n}",
          "type": "form"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "null",
            "optional": false,
            "field": "No",
            "description": "<p>Parameter 요청 파라미터 없음.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "파라미터(x) 예제",
          "content": "No Parameter",
          "type": "null"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Todo[]",
            "optional": false,
            "field": "todoLists",
            "description": "<p>JSONArray<Todo> 의 모양으로 Todo 의 리스트를 가짐</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>DB에 저장된 Todo의 고유값 - put, delete 요청할 때 사용</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Todo 의 제목</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "selected",
            "description": "<p>Todo 체크되었는지 여부.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공 시 응답 :",
          "content": "HTTP/1.1 200 OK\n{\n    \"todoLists\":\n        [\n            {\n                \"_id\": \"5d9ed8a64d73a91bcc4526d7\",\n                \"title\": \"MagicCalender 만들기2\",\n                \"selected\": true\n            },\n            {\"_id\": \"5d9ed8aa4d73a91bcc4526d8\", \"title\": \"MagicCalender 만들기3\", \"selected\": true},\n            {\"_id\": \"5d9efdeaec5df242401dd1a7\", \"title\": \"새로운 post modified!!\", \"selected\": false},\n            {\"_id\": \"5d9efe6b21e6cb42d3071cde\", \"title\": \"새로운 post 테스트2\", \"selected\": false},\n            {\"_id\": \"5d9f00a421e6cb42d3071cdf\", \"title\": \"Android post test\", \"selected\": false},\n            {\"_id\": \"5da309dd93968368d2266635\", \"title\": \"New Post Test good!\", \"selected\": false}\n        ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_JWT",
            "description": "<p>JWT 가 헤더에 실려있지 않습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_JWT",
            "description": "<p>JWT 가 유효하지 않습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NOUSER_DB",
            "description": "<p>해당 유저의 정보가 DB에서 찾을 수 없습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ERR_CRUDDB",
            "description": "<p>내부 DB 작업에 실패하였습니다.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "실패 : NO_JWT",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"name\" : \"NO_JWT\",\n    \"message\": \"Please put JWT in your request header!\",\n    \"status\": 401\n}",
          "type": "json"
        },
        {
          "title": "실패 : INAVLID_JWT",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"name\" : \"INVALID_JWT\",\n    \"message\": \"Your JWT is invalid!\",\n    \"status\": 401\n}",
          "type": "json"
        },
        {
          "title": "실패 : NOUSER_DB",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"name\" : \"NOUSER_DB\",\n    \"message\": \"Cannot find userId in database!\",\n    \"status\": 500\n}",
          "type": "json"
        },
        {
          "title": "실패 : ERR_CRUDDB",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"name\" : \"ERR_CRUDDB\",\n    \"message\": \"Cannot CRUD your Todo in database!\",\n    \"status\": 400\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/todo.js",
    "groupTitle": "Todo"
  },
  {
    "type": "post",
    "url": "/todo",
    "title": "유저의 InsertTodo",
    "name": "PostTodo",
    "group": "Todo",
    "description": "<p>새로운 todo 목록을 저장합니다.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "jwt",
            "description": "<p>헤더에 JWT 토큰을 넣습니다.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "헤더 예제",
          "content": "{\n    // retrofit2 : HashMap 에 key값은 \"jwt\", value값은 \"eyJ...\" 로 설정\n    \"jwt\" : \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDUxODRjMWU5ZDMxZjRmYmYzNDQ3NDQiLCJ1c2VySWQiOiIxMDA4MjgzNDcwMzc2MDQ2NjA3MDAiLCJpYXQiOjE1NzEwNDAxNTcsImV4cCI6MTU3MTEyNjU1NywiaXNzIjoiY29tLmpjcC5tYWdpY2FwcGxpY2F0aW9uIiwic3ViIjoidXNlckF1dGgifQ.RcjjVWBSd5LOXPqqPIV-ZXVsBKOxob7vWm7tBJi4rjM\"\n}",
          "type": "form"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Todo 제목</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "selected",
            "description": "<p>Todo 체크 여부</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "파라미터(body) 예제",
          "content": "{\n    \"title\": \"MagicCalender 만들기 테스트\",\n    \"selected\": false\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "News[]",
            "optional": false,
            "field": "news_array",
            "description": "<p>JSONArray<News> 의 형태로 News 의 리스트를 가짐.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>뉴스 제목</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "summary",
            "description": "<p>뉴스 소제목</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "contents",
            "description": "<p>뉴스 본문</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "imgaeUrl",
            "description": "<p>뉴스 섬네일 이미지 URL</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공 시 응답 :",
          "content": "HTTP/1.1 200 OK\n{\n    \"news_array\":\n        [\n            {\n                \"title\": \"총수 지분 높을수록 대기업 ‘내부 거래’ 많았다\",\n                \"summary\": \"SK 46조4000억원, 현대차 33조1000억원, 삼성 25조...\",\n                \"contents\": \"공정위 ‘대기업 내부거래 현황’199조원 중 10대 그룹이 151조원SK 46조원...\",\n                \"imageUrl\": \"https://imgnews.pstatic.net/image/025/2019/10/15/0002944698_001_20191015001220252.jpg\"\n            },\n            {\"title\": \"노벨경제학상 빈곤 퇴치 3인…바네르지·뒤플로는 부부\", \"summary\": \"2019년 노벨 경제학상은 빈곤 연구를 전문으로...\",…},\n            {\"title\": \"황교안 “송구스럽다로 넘어갈 일 아니다” 홍익표 “개혁 마무리 못하고 사퇴 아쉽다”\", \"summary\": \"황교안 자유한국당...\",…},\n            {\"title\": \"삼성SDI 2000억원 들여 ESS 화재 막는다\", \"summary\": \"삼성SDI가 또 불거진 에너지저장장치(ESS) 화재 논란에 선제적...\",…},\n            {\"title\": \"남북축구 생중계 결국 무산…“평양 상부서 홍보말라 지시”\", \"summary\": \"15일 평양에서 열리는 카타르 월드컵 2차 예선 남북...\",…}\n        ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FAILED_NEWS",
            "description": "<p>서버에서 네이버뉴스를 크롤링하는데 실패했습니다.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "실패 : FAILED_NEWS",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"name\" : \"FAILED_NEWS\",\n    \"message\": \"Failed to crawl naver headline news!\",\n    \"status\": 500\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/news.js",
    "groupTitle": "Todo"
  },
  {
    "type": "post",
    "url": "/todo",
    "title": "유저의 InsertTodo",
    "name": "PostTodo",
    "group": "Todo",
    "description": "<p>새로운 todo 목록을 저장합니다.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "jwt",
            "description": "<p>헤더에 JWT 토큰을 넣습니다.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "헤더 예제",
          "content": "{\n    // retrofit2 : HashMap 에 key값은 \"jwt\", value값은 \"eyJ...\" 로 설정\n    \"jwt\" : \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDUxODRjMWU5ZDMxZjRmYmYzNDQ3NDQiLCJ1c2VySWQiOiIxMDA4MjgzNDcwMzc2MDQ2NjA3MDAiLCJpYXQiOjE1NzEwNDAxNTcsImV4cCI6MTU3MTEyNjU1NywiaXNzIjoiY29tLmpjcC5tYWdpY2FwcGxpY2F0aW9uIiwic3ViIjoidXNlckF1dGgifQ.RcjjVWBSd5LOXPqqPIV-ZXVsBKOxob7vWm7tBJi4rjM\"\n}",
          "type": "form"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Todo 제목</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "selected",
            "description": "<p>Todo 체크 여부</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "파라미터(body) 예제",
          "content": "{\n    \"title\": \"MagicCalender 만들기 테스트\",\n    \"selected\": false\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>DB에 저장된 Todo의 고유값 - put, delete 요청할 때 사용</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Todo 의 제목</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "selected",
            "description": "<p>Todo 체크되었는지 여부.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공 시 응답 :",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"5da46cff9ea01463ba5c2eca\",\n    \"title\": \"MagicCalendar 만들기 테스트\",\n    \"selected\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_JWT",
            "description": "<p>JWT 가 헤더에 실려있지 않습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_JWT",
            "description": "<p>JWT 가 유효하지 않습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NOUSER_DB",
            "description": "<p>해당 유저의 정보가 DB에서 찾을 수 없습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ERR_CRUDDB",
            "description": "<p>내부 DB 작업에 실패하였습니다.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "실패 : NO_JWT",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"name\" : \"NO_JWT\",\n    \"message\": \"Please put JWT in your request header!\",\n    \"status\": 401\n}",
          "type": "json"
        },
        {
          "title": "실패 : INAVLID_JWT",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"name\" : \"INVALID_JWT\",\n    \"message\": \"Your JWT is invalid!\",\n    \"status\": 401\n}",
          "type": "json"
        },
        {
          "title": "실패 : NOUSER_DB",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"name\" : \"NOUSER_DB\",\n    \"message\": \"Cannot find userId in database!\",\n    \"status\": 500\n}",
          "type": "json"
        },
        {
          "title": "실패 : ERR_CRUDDB",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"name\" : \"ERR_CRUDDB\",\n    \"message\": \"Cannot CRUD your Todo in database!\",\n    \"status\": 400\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/todo.js",
    "groupTitle": "Todo"
  },
  {
    "type": "put",
    "url": "/todo",
    "title": "유저의 UpdateTodo",
    "name": "PutTodo",
    "group": "Todo",
    "description": "<p>jwt 토큰과 todo 의 _id 값을 통해 현재 유저의 해당 todo 를 요청받은 body 의 내용으로 업데이트합니다. url parameter 에 넣는 _id 값은 GET 을 통해 todolist 를 호출 했을 때 각 todo 객에가 지니고 있는 &quot;_id&quot; 의 value 값 입니다.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "jwt",
            "description": "<p>헤더에 JWT 토큰을 넣습니다.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "헤더 예제",
          "content": "{\n    // retrofit2 : HashMap 에 key값은 \"jwt\", value값은 \"eyJ...\" 로 설정\n    \"jwt\" : \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDUxODRjMWU5ZDMxZjRmYmYzNDQ3NDQiLCJ1c2VySWQiOiIxMDA4MjgzNDcwMzc2MDQ2NjA3MDAiLCJpYXQiOjE1NzEwNDAxNTcsImV4cCI6MTU3MTEyNjU1NywiaXNzIjoiY29tLmpjcC5tYWdpY2FwcGxpY2F0aW9uIiwic3ViIjoidXNlckF1dGgifQ.RcjjVWBSd5LOXPqqPIV-ZXVsBKOxob7vWm7tBJi4rjM\"\n}",
          "type": "form"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Todo 제목</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "selected",
            "description": "<p>Todo 체크 여부</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": ":_id",
            "description": "<p>고칠 todo 정보의 고유 아이디 값</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "파라미터(body) 예제",
          "content": "{\n    \"title\": \"MagicCalender 만들기 수정하기\",\n    \"selected\": true\n}",
          "type": "json"
        },
        {
          "title": "파라미터(url) 예제",
          "content": "URL : http://169.56.98.117/todo/5d9ed8a64d73a91bcc4526d7",
          "type": "path"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>DB에 저장된 Todo의 고유값 - put, delete 요청할 때 사용</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Todo 의 제목</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "selected",
            "description": "<p>Todo 체크되었는지 여부.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공 시 응답 :",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"5d9ed8a64d73a91bcc4526d7\",\n    \"title\": \"MagicCalendar 만들기 수정하기\",\n    \"selected\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_JWT",
            "description": "<p>JWT 가 헤더에 실려있지 않습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_JWT",
            "description": "<p>JWT 가 유효하지 않습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NOUSER_DB",
            "description": "<p>해당 유저의 정보가 DB에서 찾을 수 없습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ERR_CRUDDB",
            "description": "<p>내부 DB 작업에 실패하였습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_TODOBODYKEY",
            "description": "<p>Body 값에 userId 값은 들어있으면 안됩니다.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "실패 : NO_JWT",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"name\" : \"NO_JWT\",\n    \"message\": \"Please put JWT in your request header!\",\n    \"status\": 401\n}",
          "type": "json"
        },
        {
          "title": "실패 : INAVLID_JWT",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"name\" : \"INVALID_JWT\",\n    \"message\": \"Your JWT is invalid!\",\n    \"status\": 401\n}",
          "type": "json"
        },
        {
          "title": "실패 : NOUSER_DB",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"name\" : \"NOUSER_DB\",\n    \"message\": \"Cannot find userId in database!\",\n    \"status\": 500\n}",
          "type": "json"
        },
        {
          "title": "실패 : ERR_CRUDDB",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"name\" : \"ERR_CRUDDB\",\n    \"message\": \"Cannot CRUD your Todo in database!\",\n    \"status\": 400\n}",
          "type": "json"
        },
        {
          "title": "실패 : INVALID_TODOBODYKEY",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"name\" : \"INVALID_TODOBODYKEY\",\n    \"message\": \"Invalid body property is included! : userId\",\n    \"status\": 400\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/todo.js",
    "groupTitle": "Todo"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "GetUserInfo",
    "name": "GetUser",
    "group": "User",
    "description": "<p>헤더에 JWT 를 실어 /user 로 GET 요청을 해주세요. 서버는 해당 JWT를 통해 현재 구글 로그인된 계정의 개인정보를 반환합니다.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "jwt",
            "description": "<p>헤더에 JWT 토큰을 넣습니다.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "헤더 예제",
          "content": "{\n    // retrofit2 : HashMap 에 key값은 \"jwt\", value값은 \"eyJ...\" 로 설정\n    \"jwt\" : \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDUxODRjMWU5ZDMxZjRmYmYzNDQ3NDQiLCJ1c2VySWQiOiIxMDA4MjgzNDcwMzc2MDQ2NjA3MDAiLCJpYXQiOjE1NzEwNDAxNTcsImV4cCI6MTU3MTEyNjU1NywiaXNzIjoiY29tLmpjcC5tYWdpY2FwcGxpY2F0aW9uIiwic3ViIjoidXNlckF1dGgifQ.RcjjVWBSd5LOXPqqPIV-ZXVsBKOxob7vWm7tBJi4rjM\"\n}",
          "type": "form"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "null",
            "optional": false,
            "field": "No",
            "description": "<p>Parameter 요청 파라미터 없음.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "파라미터(x) 예제",
          "content": "No Parameter",
          "type": "null"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>유저 고유 번호 값(구글)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>유저 이메일 값</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>유저 풀네임</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "picture",
            "description": "<p>유저 구글 사진 URL</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "given_name",
            "description": "<p>유저 이름</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "family_name",
            "description": "<p>유저 이름(성)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "locale",
            "description": "<p>유저 지역 정보</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공 시 응답 :",
          "content": "HTTP/1.1 200 OK\n{\n    \"userId\": \"100828347037604660700\",\n    \"email\": \"dfjung4254@gmail.com\",\n    \"name\": \"KH J\",\n    \"picture\": \"https://lh4.googleusercontent.com/-3WsHZ5SaYco/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reBRCZFXpXnux85nyxUAdlQxv6rVw/s96-c/photo.jpg\",\n    \"given_name\": \"KH\",\n    \"family_name\": \"J\",\n    \"locale\": \"ko\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_JWT",
            "description": "<p>JWT 가 헤더에 실려있지 않습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_JWT",
            "description": "<p>JWT 가 유효하지 않습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NOUSER_DB",
            "description": "<p>해당 유저의 정보가 DB에서 찾을 수 없습니다.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "실패 : NO_JWT",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"message\": \"Please put JWT in your request header!\",\n    \"status\": 401\n}",
          "type": "json"
        },
        {
          "title": "실패 : INAVLID_JWT",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"message\": \"Your JWT is invalid!\",\n    \"status\": 401\n}",
          "type": "json"
        },
        {
          "title": "실패 : NOUSER_DB",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"message\": \"Cannot find userId in database!\",\n    \"status\": 500\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/weather/:latitude/:longitude",
    "title": "GetWeatherInfo",
    "name": "GetWeather",
    "group": "Weather",
    "description": "<p>OpenWeatherMap API 를 호출하여 날씨 정보를 대신 호출하고 반환합니다. 안드로이드 어플리케이션에서 위도와 경도 값, 그리고 jwt를 통해 인증 절차를 거쳐야 합니다. jwt 인증을 거치는 이유는 OpenWeatherMap free티어(분당 60회)를 사용하고 있는데 오픈소스로 공개할 경우 jwt 인증 없이 외부에서 무분별하게 호출이 가능하기 때문입니다.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "jwt",
            "description": "<p>헤더에 JWT 토큰을 넣습니다.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "헤더 예제",
          "content": "{\n    // retrofit2 : HashMap 에 key값은 \"jwt\", value값은 \"eyJ...\" 로 설정\n    \"jwt\" : \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDUxODRjMWU5ZDMxZjRmYmYzNDQ3NDQiLCJ1c2VySWQiOiIxMDA4MjgzNDcwMzc2MDQ2NjA3MDAiLCJpYXQiOjE1NzEwNDAxNTcsImV4cCI6MTU3MTEyNjU1NywiaXNzIjoiY29tLmpjcC5tYWdpY2FwcGxpY2F0aW9uIiwic3ViIjoidXNlckF1dGgifQ.RcjjVWBSd5LOXPqqPIV-ZXVsBKOxob7vWm7tBJi4rjM\"\n}",
          "type": "form"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "double",
            "optional": false,
            "field": "latitude",
            "description": "<p>알고자 하는 날씨의 지역 위도 정보</p>"
          },
          {
            "group": "Parameter",
            "type": "double",
            "optional": false,
            "field": "longitude",
            "description": "<p>알고자 하는 날씨의 지역 경도 정보</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "파라미터(url) 예제",
          "content": "URL : http://169.56.98.117/weather/37.564/127.001",
          "type": "path"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>해당 위도, 경도의 도시 이름</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "weather",
            "description": "<p>날씨 정보</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "weather_description",
            "description": "<p>날씨 정보 설명</p>"
          },
          {
            "group": "Success 200",
            "type": "double",
            "optional": false,
            "field": "temperature",
            "description": "<p>평균 온도(F)</p>"
          },
          {
            "group": "Success 200",
            "type": "double",
            "optional": false,
            "field": "temperature_max",
            "description": "<p>최고 온도(F)</p>"
          },
          {
            "group": "Success 200",
            "type": "double",
            "optional": false,
            "field": "temperature_min",
            "description": "<p>최저 온도(F)</p>"
          },
          {
            "group": "Success 200",
            "type": "integer",
            "optional": false,
            "field": "pressure",
            "description": "<p>기압</p>"
          },
          {
            "group": "Success 200",
            "type": "integer",
            "optional": false,
            "field": "humidity",
            "description": "<p>습도</p>"
          },
          {
            "group": "Success 200",
            "type": "double",
            "optional": false,
            "field": "wind_speed",
            "description": "<p>풍속</p>"
          },
          {
            "group": "Success 200",
            "type": "integer",
            "optional": false,
            "field": "clouds",
            "description": "<p>운량</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공 시 응답 :",
          "content": "HTTP/1.1 200 OK\n{\n    \"city\": \"Kwanghŭi-dong\",\n    \"weather\": \"Clouds\",\n    \"weather_description\": \"overcast clouds\",\n    \"temperature\": 297.27,\n    \"temperature_max\": 298.71,\n    \"temperature_min\": 295.93,\n    \"pressure\": 1019,\n    \"humidity\": 51,\n    \"wind_speed\": 0.45,\n    \"clouds\": 100\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_JWT",
            "description": "<p>JWT 가 헤더에 실려있지 않습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_JWT",
            "description": "<p>JWT 가 유효하지 않습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NOUSER_DB",
            "description": "<p>해당 유저의 정보가 DB에서 찾을 수 없습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_LONANDLAT",
            "description": "<p>위도, 경도 좌표가 유효하지 않습니다.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FAILED_OWM",
            "description": "<p>OpenWeatherMap 호출에 실패했습니다.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "실패 : NO_JWT",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"message\": \"Please put JWT in your request header!\",\n    \"status\": 401\n}",
          "type": "json"
        },
        {
          "title": "실패 : INAVLID_JWT",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"message\": \"Your JWT is invalid!\",\n    \"status\": 401\n}",
          "type": "json"
        },
        {
          "title": "실패 : NOUSER_DB",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"message\": \"Cannot find userId in database!\",\n    \"status\": 500\n}",
          "type": "json"
        },
        {
          "title": "실패 : NO_LONANDLAT",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"message\": \"Please put latitude and longitude in your request parameter!\",\n    \"status\": 400\n}",
          "type": "json"
        },
        {
          "title": "실패 : FAILED_OWM",
          "content": "HTTP/1.1 500 Bad Request\n{\n    \"message\": \"Failed to GET openweathermap!\",\n    \"status\": 500\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/weather.js",
    "groupTitle": "Weather"
  }
] });
