// import { Quasar } from 'quasar'
export default function () {
  return {
    user: {
      _id: '',
      accountSelected: 0,
      // accounts: [{ type: 'email', value: 'noemail@gmail.com', status: 'guest' }],
      accounts: [
        {
          type: 'email',
          value: 'noemail@gmail.com',
          email_verified: false
        }
        // {
        //   type: 'email',
        //   value: 'maureenmaureen81711@gmail.com',
        //   verificationId: 123456
        // }
      ],
      tfa: {},
      // authorizationSelected: 第一筆通過的授權的 id,
      authorizations: [],
      locale: 'default',
      avatar: '',
      fullName: 'Guest', // 姓名
      displayName: 'Guest',
      birthday: '',
      nationality: '',
      identification: '',
      alienResidentCertification: '',
      passportNum: '',
      created: '',
      updated: ''
    },
    key: null,
    publicKey: null,
    // to check user is sign-in or not
    accessToken: null,
    payload: null,
    errors: {},
    pending: false
  }
}
