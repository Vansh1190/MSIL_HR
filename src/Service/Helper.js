import CryptoJS from "react-native-crypto-js";

export const Decrypt = (string="") => {
    // let string = "ErcDvcX+gOhmKs14mnCpFA==";
    let key = "kq5ruimd1d3wu3p6vy3b4dg770oi87xs";

    let rawData = CryptoJS.enc.Base64.parse(string);
    key = CryptoJS.enc.Latin1.parse(key);
    let iv = CryptoJS.enc.Latin1.parse("");
    let plaintextData = CryptoJS.AES.decrypt(
        { ciphertext: rawData },
        key,
        { iv: iv });
    let decryptedJWT = plaintextData.toString(CryptoJS.enc.Utf8);
    return decryptedJWT;
  }

  export const encrypyDecrypt = (string="") => {  
    let key = "kq5ruimd1d3wu3p6vy3b4dg770oi87xs";
    let parsedkey = CryptoJS.enc.Latin1.parse(key);
    let iv = CryptoJS.enc.Latin1.parse("");
    let encrypted = CryptoJS.AES.encrypt(string, parsedkey, {iv:iv});
    return encrypted.toString();
    // // console.log($1);
    // return "abcd";
  }