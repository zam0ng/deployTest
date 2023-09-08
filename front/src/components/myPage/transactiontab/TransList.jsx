import React from 'react'
import { EstateAllInfo, DateImg, OtherInfo, JustState,Ta } from '../checktab/checkstyled';
// import axios from 'axios';
import axios from '../../../Axios'
import { serverUrl } from 'components/serverURL';
import { useMutation, useQueryClient } from 'react-query';
import { useContext } from 'react';
import { MypageGlobal } from '../Mypage';
const TransList = ({ data, el }) => {
  const { updatedata } = useContext(MypageGlobal);

  console.log(updatedata);
  console.log(data);

  // createdAt 시간 바꾸기
  let ta = new Date(data.createdAt);

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
  const ImgUrl = data.Real_estate.img_1?.substr(12);

  const checkCancel = async (el) => {
    const data = await axios.get("/mypage/checkcancel", {
      params: { el },
      withCredentials: true,
    })
    return data.data;
  }
  const resubmit = async (el)=>{
    const data = await axios.get("/mypage/rewardresumit",{
      params : {el},
      withCredentials : true,
    })
    return data.data;
  }

  const queryClient = useQueryClient();
  const mutation = useMutation(checkCancel, {
    onSuccess: (data) => {
      console.log(data);
      if (data == "찜취소성공") {
        queryClient.invalidateQueries('mycheck');
      }
    }
  })
  const resubmitmutation = useMutation(resubmit, {
    onSuccess : (data)=>{
      console.log(data);
      if (data =="재등록 완료"){
        queryClient.invalidateQueries('cancelList');
      }
    }
  })


  const checkCancelBtn = async (el) => {
    mutation.mutate({ el });
  }
  const resubmitBtn =async(el)=>{
    console.log(el);
    resubmitmutation.mutate({el});
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
        {/* <span>{state}</span> */}
        {el === "check" ? <button onClick={() => { checkCancelBtn(data.real_estate_id) }}>찜취소</button> :

          updatedata.id == data.seller ? data.Real_estate.state == 4 ?
          <><span>보상금액<br></br> :{(data.Real_estate.balance).toLocaleString()}원</span>
            <button onClick={()=>{resubmitBtn(data.real_estate_id)}}>재등록</button>
          </> :
          <>
            <span>보상금액<br></br> :{(data.Real_estate.balance).toLocaleString()}원</span>
            <span>재등록 완료</span>
          </>
          :
          <><span>보상금액<br></br> :{(data.Real_estate.balance * 2).toLocaleString()}원</span></>
          
          }
      </JustState>


    </EstateAllInfo>
  )
}

export default TransList