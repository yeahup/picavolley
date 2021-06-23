# pocavolley

원본 참고 : https://gorisanson.github.io/pikachu-volleyball/ko/
(문제 시 본 프로 삭제하겠습니다.)

*피카츄 배구 테스트입니다.

로컬 플레이 : index.html

멀티 플레이 : node 통해서 데몬 실행 후 http://localhost:3600으로 접속 


npm install

node start server.js

현재 먼저 접속한 2명씩 매칭이 되며, 1P 기준으로 플레이어 위치, 공 위치 등을 동기화하고 있습니다.

socketio 활용하였으나, 단순 좌표 텍스트인데도 버벅임이 있는데, 실시간 통신 시 조언 부탁드립니다.
