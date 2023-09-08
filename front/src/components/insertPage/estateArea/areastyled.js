import { styled } from "styled-components";

export const Container = styled.div`
  width: 85%;
  height: 170px;
  /* border: 1px solid black; */
  border-bottom: 1px solid rgb(219 195 158);

  display: flex;
  align-items: center;

  & span {
    color: #168fff;
  }
`;
export const Title = styled.div`
  width: 140px;
  height: 170px;
  /* border: 1px solid black; */
  text-align: left;
  line-height: 150px;
  /* font-size: smaller; */
    display: flex;
  align-items: center;
  font-weight: 600;
  padding-left: 10px;
  font-size: 17px;
  background-color: rgb(255, 229, 197);
`;
export const AreaBox = styled.div`
  width: 90%;
  height: 150px;
  /* border: 1px solid black; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;

  & p {
    padding-left: 10px;
    font-weight: 600;
    /* font-size : smaller */
  }
`;
export const Equel = styled.div`
  width: 50px;
  height: 80px;
  /* border: 1px solid black; */
  line-height: 80px;
  font-size: x-large;
  font-weight: 600;
`;

export const AreaDiv = styled.div`
  width: 15%;
  height: 80px;
  border: 1px solid lightgray;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-left: 10px;

  & input {
    width: 50%;
    height: 30px;
    /* border: none; */
    padding-left: 10px;
  }
`;
export const AreaDivBox = styled.div`
  width: 100%;
  display: flex;
  /* border: 1px solid black; */
`;
