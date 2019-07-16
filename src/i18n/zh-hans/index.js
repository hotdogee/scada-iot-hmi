export default {
  TREAT: {
    // treatment type
    IVF: '试管婴儿疗程',
    CryoEgg: '冷冻卵子疗程',
    TO: '解冻卵子疗程',
    FNT: '新鲜+解冻卵子疗程',
    FET: '解冻胚胎植入疗程',
    IUI: '人工授精疗程',
    OD: '捐卵疗程',
    OR: '授卵疗程',
    None: '目前無疗程',
    //
    Treatment: '本次疗程',
    type: '种类',
    Physician: '{name} 医师',
    RevisitDate: '下次回诊日',
    CryoExpiryDate: '冷冻到期日',
    time: '时间',
    Event: '事件',
    Detail: '疗程階段',
    MRS: '{name} 小姐',
    MR: '{name} 先生',
    Fee: '应缴金额: {count} 元',
    NoRevisitEvent: '无下次回诊事件',
    //
    BUCKETS: {
      CryoAt: '{date} 冷冻',
      expirydate: '{date} 到期',
      thawdate: '{date} 解冻',
      'bucket-embryo': '胚胎',
      'bucket-egg': '卵子',
      'bucket-sperm': '精子',
      day: '天数',
      grade: '等级',
      moveout: '已移出',
      destroyed: '已销毁'
    },
    // Bucket
    ThawDate: '解冻日',
    NoData: '無資料',
    // treatment
    Cryo: '冷冻库存',
    History: '历史疗程',
    OPU: '取卵资讯',
    OPUDate: '取卵日期',
    OPUCount: '取卵数量',
    FertilizationNo: '受精颗数',
    Oocyte: '卵子',
    Embryo: '胚胎',
    Sperm: '精子',
    ETDate: '植入日期',
    ETCount: '植入数量',
    ETGrade: '植入等级',
    Norecenttreatment: '无进行中疗程',
    etInfo: '植入资讯',
    cryoInfo: '冷冻资讯',
    thawInfo: '解冻资讯',
    //
    MedicationPlan: '用药计划',
    Result: '检验报告',
    MedicationNotify: '用药提醒',
    PregnantResult: '怀孕结果',
    EmbryoAlbum: '卵胚相簿',
    nomedicationtoday: '本日无用药',
    etalbum: '植入相簿',
    cryoalbum: '冷冻相簿',
    thawalbum: '解冻相簿',
    nodatanow: '暂无资料',
    grade: '等级',
    quantity: '数量',
    cell: '细胞数',
    date: '日期',
    E2: 'E2',
    P4: 'P4',
    LH: 'LH',
    FSH: 'FSH',
    HCG: 'HCG'
  },
  PREG: {
    Unconfirm: '未确认',
    Pregnant: '已怀孕',
    NonPregnant: '未怀孕',
    congratulation: '恭喜您！ ',
    PregnancyTestDate: '验孕日期',
    PregnancyTest: '验孕结果',
    EDC: '预产期'
  },
  LOGIN: {
    passworderror: '帐号或密码错误',
    account: '身份证字号 / 护照 / 统一证号',
    password: '密码',
    pwtwice: '再次输入密码',
    login: '登入',
    forgot: '忘记密码?',
    first: '第一次使用?',
    signup: '註冊',
    email: '信箱',
    enterEmail: '输入信箱',
    send: '重置密码',
    emailerror: '请输入正确的e-mail',
    verifycode: '请输入验证码',
    verifyerror: '验证码错误',
    verifyexpired: '验证码逾期',
    settingpassword: '设定密码',
    account_opt: '帐号',
    required: '此栏位必填',
    requiredStar: ' *',
    verify: '验证密码',
    Passwordsmustmatch: '密码不一致',
    password6: '密码长度至少6码',
    optional: '外国人非必填',
    verifyEmail: '已发送验证信至',
    sendAgain: '重新发送',
    waitVerify: '待信箱确认',
    waitHospital: '待院方核可',
    success: '注册成功',
    logout: '登出',
    logoutConfirm: '您确定要登出？'
  },
  MEDIC: {
    stat: '立即使用',
    today: '今日一次',
    morning: '早上',
    noon: '中午',
    night: '晚上',
    bedtime: '睡前',
    defaultnotify: '预设提醒时间',
    default: '依预设时间提醒',
    medications: '本次疗程用药',
    medicationtoday: '今日用药',
    pendinglist: '待服用',
    alreadytaken: '已服用'
  },
  SETTING: {
    Language: '语言',
    cancel: '取消',
    comfirm: '确认',
    traditionalChinese: '繁体中文',
    simplifiedChinese: '簡體中文',
    english: '英文',
    thai: '泰文',
    'vi-vn': '越南文',
    sysnotify: '系统通知',
    medicnotify: '用药提醒',
    profile: '个人资料',
    management: '个人管理',
    edit: '编辑',
    changepassword: '修改密码',
    setting: '帐户设定',
    changeemail: '修改信箱',
    requirepassword: '输入密码',
    newemailaddress: '输入新信箱',
    required: '此栏位必填',
    emailerror: '请输入正确的e-mail',
    change: '更改',
    password: '输入旧密码',
    newpassword: '输入新密码',
    verify: '验证密码',
    email_notverify: '未验证',
    success: '成功!',
    success_password: '您的密码已成功修改 !',
    success_password_set: '您的密码已成功设置 !',
    success_email: '您的信箱已成功修改 !',
    fail: '失败',
    fail_password: '密码错误，请再试一次!'
  },
  PROFILE: {
    name: '姓名',
    serial: '病历号码',
    birthday: '生日',
    phone: '手机',
    country: '国籍',
    email: '信箱'
  },
  DOCTOR: {
    hospital: '{name} 医院',
    team: '团队介绍',
    doctors: '医师团队',
    speciality: '专长',
    background: '经历',
    embryologists: '实验室团队',
    consultants: '咨询团队',
    BINFLUX: {
      content:
        '沛智生殖医学中心成立于民国2017年，一直以来秉持服务不孕症患者的理念，不断充实设备，引进最新的技术，加强人员训练，通过卫福部评鉴合格的人工生殖机构。 ',
      doctorchen: '陈圈圈医师',
      infertility: '不孕症',
      art: '人工生殖试管婴儿）',
      reproductiveendocrine: '生殖内分泌',
      landssurgery: '腹腔镜及子宫镜手术',
      nationalbinflux: '国立沛智大学生殖医学博士',
      mrschen: '陈小姐'
    }
  },
  ACCESS: {
    direction: '交通',
    MMH: {
      address: '台北市中山区中山北路二段92号'
    },
    BINFLUX: {
      binfluxhospital: '北区沛智医院/儿童医院',
      binfluxaddress: '地址：台北市松山区民生东路二段128号3楼'
    }
  },
  HEALTHEDUCATION: {
    playlist: '播放清单',
    healtheducation: '卫教资讯',
    commonquestion: '常见问题',
    videos: '影片专区',
    BINFLUX: {
      aboutinfertility: '关于不孕症',
      aboutgene: '关于基因',
      abouttreatment: '关于疗程',
      aboutbbt: '认识基础体温',
      whatisinffertility: '什么是不孕症',
      spermegguterus: '怀孕必备条件：精＋卵＋子宫',
      medicationtrigger: '迷思1-排卵针篇',
      fertilization: '迷思2-受孕篇',
      treatment: '迷思3-疗程篇',
      transfernumber: '胚胎植入数量',
      howtodecreasepressure: '如何减轻治疗中的压力?',
      pgs: '胚胎着床前染色体筛检（PGS）',
      pgd: '胚胎着床前基因诊断（PGD）',
      iui: '人工授精疗程',
      ivf: '试管婴儿疗程说明',
      oocytefreezing: '冷冻卵子疗程'
    }
  },
  HOSPITALS: {
    MMH: '马偕纪念医院'
  },
  HOSPITAL: {
    hospitalinformation: '院所资讯',
    officialwebsite: '官网连结',
    call: '一键拨打',
    team: '团队介绍',
    direction: '交通',
    healtheducation: '卫敎FAQ',
    consultation: '我要咨询',
    survey: '满意度调查',
    BINFLUX: {
      northhospital: '北区沛智医院',
      southhospital: '南区沛智医院'
    }
  },
  CONSULTATION: {
    contactus: '我要咨询',
    iwanttosay: '我想要说...',
    uploadphoto: '上传图片',
    required: '必填',
    aboutqs: '请选择类别',
    treatment: '疗程相关',
    billing: '费用问题',
    opinion: '意见反应',
    other: '其他问题',
    send: '送出'
  },
  QUESTIONNAIRE: {
    survey: '满意度调查',
    loading: '载入中...'
  },
  REGISTRATION: {
    myappointment: '我的挂号 ',
    morningclinic: '上午诊',
    yourno: '预约号码',
    progressno: '目前叫号',
    cancel: '取消挂号',
    progress: '看诊进度',
    appointment: '预约挂号',
    yes: '确认取消',
    no: '保留',
    BINFLUX: {
      doctorchen: '陈圈圈医师',
      northhospital: '北区沛智医院',
      infertility: '不孕科',
      '203room': '203诊',
      onsiteregistration: '各时段门诊看诊时间：',
      morningclinicam: '上午诊 — 09:00-12:00',
      afternoonclinicpm: '下午诊 — 14:00-17:00',
      eveningclinicnight: '夜间诊 — 18:00-21:00',
      notice: '医师会因为诊疗时间不同，看诊进度快慢不一，仅供参考，如有变动依诊间看诊为主。 ',
      appointtime: '时间：2018-5-20（三）'
    }
  },
  PROGRESS: {
    progress: '看诊进度',
    outpatientclinic: '门诊',
    bloodtest: '抽血',
    ultrasonicroom: '超音波室',
    BINFLUX: {
      doctorchen: '陈圈圈医师',
      '203room': '203诊',
      aarea: 'A区',
      '23counter': '23柜台',
      ultrasonicroom1: '超音波室1'
    }
  },
  APPOINTMENT: {
    makeanappointment: '预约挂号',
    selectdr: '选择医生',
    room: '诊别',
    morning: '上午',
    afternoon: '下午',
    evening: '夜间',
    checkyourappt: '预约确认',
    yourno: '预约号码',
    myappointment: '我的挂号',
    BINFLUX: {
      doctorchen: '陈圈圈医师',
      doctorlai: '赖方方医师',
      fully: '已满',
      already: '已约',
      closed: '休诊'
    }
  },
  PAYMENT: {
    payment: '缴费',
    pendinglist: '待缴费用',
    detail: '明细',
    date: '帐单日期',
    medicalinstitution: '医疗院所',
    charge: '收费',
    transactionfee: '刷卡手续费',
    totalcharge: '应缴金额',
    pay: '缴费去',
    historyrecord: '已缴款纪录',
    paymentday1: '2018-4-20（三)',
    paymentday2: '2018-5-28（三)',
    BINFLUX: {
      northhospital: '北区沛智医院'
    }
  },
  NOTIFICATION: {
    notification: '讯息',
    notic: '公告',
    general: '一般',
    test: '测试',
    update: '更新',
    warning: '警示',
    medication: '用药',
    treatment: '疗程',
    revisit: '回诊',
    info: '资讯',
    today: '今天',
    yesterday: '昨天',
    noMsg: '無讯息'
  },
  EVENT: {
    TR: '施打破卵针',
    OPU: '取卵',
    ET: '植入',
    PT: '验孕',
    Revisit: '回诊'
  },
  TIMELINE: {
    ST: '开始',
    OPU: '取卵',
    ET: '植入',
    IUI: 'IUI 植入',
    PT: '验孕',
    isPT: '验孕結果',
    bloodtest: '抽血',
    ThawEgg: '解冻卵',
    ThawEmbryo: '解冻胚',
    CryoEgg: '冻卵',
    cryo: '冷冻',
    thaw: '解冻',
    END: '结案'
  },
  SYSTEM: {
    loading: '资料载入中...请稍候'
  }
}
