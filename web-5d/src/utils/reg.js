// 平台正则验证

// 手机号验证

export const phoneReg = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/g

// 邮箱验证
export const emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g

// 身份证正则验证
export const cardReg = /\d{15}|\d{18}/g

// 账号正则 字母开头 4-15位数  允许数字下划线
export const accountReg = /^[a-zA-Z][a-zA-Z0-9_]{4,15}/g

// 密码正则验证 密码包含 数字,英文,字符中的两种以上，长度6-20
export const passwordReg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/g
