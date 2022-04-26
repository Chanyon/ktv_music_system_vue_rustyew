// 随机账号和密码
module.exports = () =>{
  const accountList = ['a','b','c','d','e','f','g','h','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',1,2,3,4,5,6,7,8,9];
  const passwordList = ['1','2','3','4','5','6','7','8','9','0'];
  let name1="",name2="",pwd="";
  let len = accountList.length;
  for(let i = 0; i < 8; i++){
    name1 += accountList[Math.floor(Math.random()*len)];
  }
  for (let i = 0; i < 3; i++) {
    name2 += accountList[Math.floor(Math.random()*len)];  
  }
  for (let k = 0; k < 6; k++) {
    pwd += passwordList[Math.floor(Math.random()*10)];
  }
  const account = name1+'@'+name2+'.com';
  const password = pwd;
  return {account,password};

}