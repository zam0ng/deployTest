import React, { useEffect, useState } from 'react'
import {DateImg,OtherInfo,JustState,Ta} from '../checktab/checkstyled'
import { MypageGlobal } from '../Mypage';
import { useContext } from 'react';
import {UpdateBtn, EstateAllInfo} from './registerstyled';
import axios from '../../../Axios';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { serverUrl } from 'components/serverURL';
const RegisterList = ({data}) => {
  const {getmyregisterinfo} =useContext(MypageGlobal);
  const userID = getmyregisterinfo.user_id;
  const [state,setState] = useState("");
  const [btnName,setbtnName] = useState();
  const [btnName2,setbtnName2] = useState();
  // console.log(data);
  useEffect(()=>{

    if( data.seller == userID && data.approved == 0 && data.cancel==null && data.completed ==0){
      setState("판매승인");
      setbtnName("승인");
      setbtnName2("판매취소");
    }
    else if(data.seller == userID && data.approved==1 && data.cancel==null && data.completed==0){
      setState("판매중");
      setbtnName("판매취소");
      setbtnName2("");
    }
    else if(data.seller==userID && data.completed==2){
      setState("판매완료");
      setbtnName("");
      setbtnName2("");
    }
    else if(data.seller==userID && data.cancel==userID){
      setState("판매취소");
      setbtnName("재등록");
      setbtnName2("");
    }
    else if(data.buyer==userID && data.approved==0 && data.cancel==null && data.completed ==0){
      setState("승인대기");
      setbtnName("구매취소");
      setbtnName2("");
    }
    else if(data.buyer==userID && data.approved==1 && data.cancel==null && data.completed==0){
      setState("구매중");
      setbtnName("구매취소");
      setbtnName2("");
    }
    else if(data.buyer==userID && data.completed==2){
      setState("구매완료");
      setbtnName("");
      setbtnName2("");
    }
    else if(data.buyer==userID && data.cancel==userID){
      setState("구매취소");
      setbtnName("");
      setbtnName2("");
    }

  },[data])

  let ta;
  if(data.completed==0){
    ta = new Date(data.createdAt);
  }
  else{
    ta = new Date(data.updatedAt);
  }

    const options = {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedDate = formatter.format(ta);

    const revisedFormattedDate = formattedDate.replace(
        /(\d{2})\/(\d{2})\/(\d{4})/,
        "$3/$1/$2"
    );
    //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

    // const ImgUrl = data.Real_estate.img_1?.split("\\")[2];
    const ImgUrl = data.Real_estate.img_1?.substr(12);



    const transactionStateUpdate = async(el)=>{
      const data = await axios.get("/mypage/transactionStateUpdate",{
        params : {el},
        withCredentials : true,
      })
      return data;
    }
    const approvedUpdate = async(el)=>{
      const data = await axios.get("/mypage/approvedUpdate",{
        params : {el},
        withCredentials : true,
        responseType: 'blob',

      })
      return data;
    }
    const queryClient = useQueryClient();

    const approveMutation = useMutation(approvedUpdate,{
      onSuccess : async(data)=>{
          try {
            queryClient.invalidateQueries(['getmyregister'])

            const blob = new Blob([data.data], { type: 'application/pdf' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'contract.pdf';
            downloadLink.click();
          } catch (error) {
            console.log("jsx 승인 에서 오류남 ",error);
          }

        }
      });


    const mutation = useMutation(transactionStateUpdate,{
      onSuccess : async(data)=>{
        console.log("거래 상태 업데이트 완료 ",data)
        if(data.data=="성공"){

          queryClient.invalidateQueries(['getmyregister'])
          alert('판매 취소가 완료되었습니다.')
        }
        else if(data.data=='판매취소완료'){
          queryClient.invalidateQueries(['getmyregister'])
          alert('판매 취소가 완료되었습니다.')

        }
        else if(data.data=='판매자잔고부족'){
          alert("잔고금액이 계약금의 2배보다 적어 판매 취소가 불가능합니다.")
        }
        else if(data.data=='구매취소완료'){
          queryClient.invalidateQueries(['getmyregister']);
        }
        else if(data.data=='재등록 완료'){
          queryClient.invalidateQueries(['getmyregister']);

        }
      }
    })
    const customConfirm = (message) => {
      return window.confirm(message);
    };

    const transactionStateUpdateBtn=(btnname,estateId,userID,transactionID,deposit,buyerID,sellerID,approved,balance) =>{
      console.log("params",btnname);

      if(btnname=="승인"){
        approveMutation.mutate({btnname,estateId,userID,transactionID,deposit,buyerID,sellerID,balance});
        alert("승인이 완료되었습니다. 다운로드 창에서 계약서를 확인해주세요.")
      }
      else if(btnname=="판매취소"){
        if(approved==1){

          if(customConfirm('거래중인 매물을 판매 취소할 경우 계약금 2배를 구매자에게 배상합니다.')){

            mutation.mutate({btnname,estateId,userID,transactionID,deposit,buyerID,sellerID,balance});
          }
          else{
            return;
          }
        }
        else{
          mutation.mutate({btnname,estateId,userID,transactionID,deposit,buyerID,sellerID,balance});
        }


      }
      else if(btnname=="구매취소"){
        if(approved==1){

          if(customConfirm('거래중인 매물을 구매 취소할 경우 계약금을 돌려받을 수 없습니다..')){

            mutation.mutate({btnname,estateId,userID,transactionID,deposit,buyerID,sellerID,balance});
          }
          else{
            return;
          }
        }
        else{
          mutation.mutate({btnname,estateId,userID,transactionID,deposit,buyerID,sellerID,balance});
        }


      }
      else if(btnname=="재등록"){
        mutation.mutate({btnname,estateId,userID,transactionID});
      }
      else if(btnname=="구매중"){
        approveMutation.mutate({btnname,estateId,userID,transactionID,deposit,buyerID,sellerID,balance});
        alert("다운로드 창에서 계약서를 확인해주세요.")
      }
    }
    // 돈 단위 바꾸기
    const changeMoney = (td) => {
      let uk = parseInt(td / 100000000);
      let ukrest = (td % 100000000).toString().padStart(8, "0");
      let manwon = (ukrest / 10000)
      if (uk > 0) {

          if (ukrest == 0) {
              return (uk + "억");

          }
          else {
              return (uk + "억" + manwon + "만원");

          }
      }
      else {
          return (manwon + "만원");
      }
  }
  const detailpageblank = (el) => {
    const currentURL = window.location.origin;
    const url = `${currentURL}/detail/${el}`;
    window.open(url, '_blank');
};


  return (
    <EstateAllInfo>
      <Ta onClick={()=>{detailpageblank(data.Real_estate.id)}}>
      <DateImg>
        <span>{revisedFormattedDate}</span>
        <img src={`${serverUrl}estate_imgs/${ImgUrl}`}></img>
      </DateImg>
      <OtherInfo>
        <div>{changeMoney(data.Real_estate.deposit)}</div>
        <div>{data.Real_estate.jibun}&nbsp;{data.Real_estate.additional_address}</div>
        <div><span>{data.Real_estate.area}㎡</span><span>,&nbsp;{data.Real_estate.type}</span></div>
      </OtherInfo>
      </Ta>
      <JustState>
        <span>{state}</span>
        {btnName ? <UpdateBtn onClick={()=>{transactionStateUpdateBtn(btnName,data.Real_estate.id,userID,data.id,data.Real_estate.deposit,data.buyer,data.seller,data.approved,data.Real_estate.balance)}}>{btnName}</UpdateBtn> :<></>}
        {btnName2 ? <UpdateBtn onClick={()=>{transactionStateUpdateBtn(btnName2,data.Real_estate.id,userID,data.id,data.Real_estate.deposit,data.buyer,data.seller,data.approved,data.Real_estate.balance)}}>{btnName2}</UpdateBtn> :<></>}
        {state ==="구매중" ? <UpdateBtn onClick={()=>{transactionStateUpdateBtn(state,data.Real_estate.id,userID,data.id,data.Real_estate.deposit,data.buyer,data.seller,data.approved,data.Real_estate.balance)}} width={"65px"}>계약서 다운</UpdateBtn> : <></>}
      </JustState>


    </EstateAllInfo>
  )
}

export default RegisterList