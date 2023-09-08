import axios from 'axios';

// axios.defaults.baseURL = 'http://3.37.244.154:8080/api';    // aws 에서 탄력적 ip 주소 넣음
// axios.defaults.baseURL = 'http://3.37.244.154:8080';    // aws 에서 탄력적 ip 주소 넣음 || aws 배포용 🚀
// axios.defaults.baseURL = 'http://localhost:8080';   // 로컬 테스트용 🔵
axios.defaults.baseURL = 'https://www.jaeyeong.site:8080';   // 로컬 테스트용 🔵


// // ⭐ axios 뽑아서 사용할 때 withCredentials : true 항상 적용하는 법 ⭐
// const instance = axios.create({
//     // baseURL : 'http://3.37.244.154:8080/api',   // aws 에서 탄력적 ip 주소 넣음
//     // baseURL : 'http://3.37.244.154:8080',    // aws 에서 탄력적 ip 주소 넣음 || aws 배포용 🚀
//     baseURL : 'http://localhost:8080',  // 로컬 테스트용 🔵
//     withCredentials: true, // withCredentials 옵션을 설정
// });

// export default instance;
// ⭐⭐

export default axios;

