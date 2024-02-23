<p>- Goals :&nbsp;</p>
<p>&nbsp; &nbsp;* 로그인 관련 로직 전반적인 개념 확립</p>
<p>&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;ㄴ refreshToken, accessToken 생성 과정 및 발급</p>
<p>&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;ㄴ logout 처리 과정</p>
<p>&nbsp; &nbsp;* Error Handling&nbsp;</p>
<p>&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;ㄴ filter 이외에도 더 나은 방법 고민</p>
<p>&nbsp; &nbsp;* CI/CD 구현</p>
<p>&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;ㄴ CI : github action, CD : AWS code deploy 사용</p>
<p>&nbsp; &nbsp;* DB연동(Local, Server) </p>
<p>&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;ㄴ Pg Admin아닌 명령어로 데이터 관리</p>
<p>&nbsp; &nbsp;* 동시성제어(상품예약 및 구입기능) </p>
<p>&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;ㄴ Artillery로 측정 과정 및 결과 확인</p>
<p>&nbsp; &nbsp;* ...ing&nbsp;</p>
<p></p>
--------
<p></p>
<p>&nbsp;- As-is :&nbsp;</p>
<p>&nbsp; &nbsp;* 로그인</p>
<p>&nbsp; &nbsp;* 에러핸들링(filter)</p>
<p>&nbsp; &nbsp;* CI/CD 구현</p>
<p>&nbsp; &nbsp;* DB연동(Local)</p>
<p>&nbsp;- To-be :&nbsp;</p>
<p>&nbsp; &nbsp;* DB 계속해서 명령어로 관리</p>
<p>&nbsp; &nbsp;* 동시성제어</p>
