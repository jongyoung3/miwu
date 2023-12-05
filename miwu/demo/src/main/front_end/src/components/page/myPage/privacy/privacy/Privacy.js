import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfoInput from '../infoInput/InfoInput';

import "./Privacy.scss";
const Privacy = (props) => {
    class Info {
        constructor(id, label, name, value, placeholder, handler, condition, validity, isDisabled) {
            this.id = id; // 아이디
            this.label = label; // 라벨링
            this.name = name; // 태그 이름
            this.value = value;
            this.placeholder = placeholder; // input box 안 설명
            this.handler = handler;
            this.condition = condition; // 입력 조건 안내
            this.validity = validity;
            this.isDisabled = isDisabled;
        }
    }
    class Query {
        constructor(id, q) {
            this.id = id; // 아이디
            this.q = q;
        }
    }

    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [name, setName] = useState("");
    const [queryId, setQueryId] = useState(1);
    const [answer, setAnswer] = useState("");

    const [idValidity, setIdValidity] = useState(true);
    const [pwValidity, setPwValidity] = useState(true);
    const [nameValidity, setNameValidity] = useState(true);
    const [answerValidity, setAnswerValidity] = useState(false);
    const [isIdDuplicated, setIsIdDuplicated] = useState(false);
    const [checkedIdDuplicated, setCheckedIdDuplicated] = useState(false);

    const updateId = (event) => {    
        setId(event.currentTarget.value);
        setIdValidity(checkIdValidity(id));
        setCheckedIdDuplicated(false);
        // console.log("updateId: " + idValidity);
    } // 아이디 값이 변경되면, 상태값도 업데이트함

    const updatePw = (event) => {
        setPw(event.currentTarget.value);
        setPwValidity(checkPwValidity(pw));
        // console.log("updatePw: " + pwValidity);
    } // 비밀번호 값이 변경되면, 상태값도 업데이트함

    const updateName = (event) => {
        setName(event.currentTarget.value);
        setNameValidity(checkNameValidity(name));
    } // 이름 값이 변경되면, 상태값도 업데이트함
    
    const updateQueryId = (event) => {
        setQueryId(event.currentTarget.value);
    } // 힌트 질문 선택값이 변경되면, 상태값도 업데이트함

    const updateAnswer = (event) => {
        setAnswer(event.currentTarget.value);
        setAnswerValidity(checkAnswerValidity(answer));
    } // 힌트 대답 값이 변경되면, 상태값도 업데이트함

    const checkIdValidity = (id) => { // 아이디 유효성 검사
        return /[a-zA-Z0-9]{6,10}$/.test(id);
    }

    const checkPwValidity = (pw) => { // 비밀번호 유효성 검사
        return /[a-zA-Z0-9`~!@#$%^&*()-_=+]{6,20}$/.test(pw);
    }

    const checkNameValidity = (name) => { // 이름 유효성 검사
        return /[가-힣]{2,4}$/.test(name); 
    }

    const checkAnswerValidity = (answer) => { // 힌트 유효성 검사
        return /[가-힣0-9]+/.test(answer);
    }
    const infoData = [
        new Info(
            1,
            "이름", 
            "name", 
            "사용자님의 이름을 입력해주세요",
            name,
            updateName,
            "",
            nameValidity,
            true,
        ),
        new Info(
            2, // 고유 id
            "아이디", // 라벨링
            "user_id", // 태그 이름
            "예: miwu0928", // input box 안 설명
            props.id,
            updateId,
            "소문자, 대문자, 숫자로 6자 이상 10자 이하", // 조건 안내
            idValidity,
            true,
        ),
        new Info(
            3,
            "비밀번호", 
            "password", 
            "비밀번호를 입력해주세요",
            pw,
            updatePw,
            "소문자, 대문자, 숫자, 특수문자로 6자 이상 20자 이하",
            pwValidity,
            false,
        ),  
    ];

    var infoList = [];
    for (let i = 0; i < infoData.length; i++) {
        infoList.push(
            <InfoInput 
                key={infoData[i].id} 
                label={infoData[i].label} 
                name={infoData[i].name} 
                placeholder={infoData[i].placeholder}
                handler={infoData[i].handler}
                condition={infoData[i].condition}
                notice={infoData[i].notice}
                validity={infoData[i].validity}
                isDisabled={infoData[i].isDisabled}
            />
        );
    }
    
    const queryData = [
        new Query(1, "내가 좋아하는 여행지는?"),
        new Query(2, "내 고향은?"),
        new Query(3, "테스트 질문"),
    ];

    const queryList = queryData.map((query) => (
        <option key={query.id} value={query.id}>
            {query.q}
        </option>
    ));
    
    useEffect(() => {
        axios.post('/api/privacy_read', 
        {
            user_id: props.id,
        },
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
        ).then((response) => {
            setPw(response.data[1]); // 비밀번호
            setName(response.data[2]); // 이름
            setQueryId(response.data[3]); // 비밀번호 찾기 힌트 질문
            setAnswer(response.data[4]); // 비밀번호 찾기 힌트 대답
        })
        .catch((error) => { // 실패했을 경우 에러 출력
            console.log(error);
        })    
    }, []); 
    
    useEffect(() => {
        axios.post('/api/privacy_update', 
        {
            queryId: queryId,
            answer: answer,
        },
        ).then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
    }, )
    return (
        <div id="privacy">
            <h1>개인정보 수정</h1>
            {infoList}
        </div>
    );
}
export default Privacy;