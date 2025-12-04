import type { Rule } from 'antd/es/form';

export const requiredRule: Rule = {
  required: true,
  message: '此项为必填项',
};

export const emailRule: Rule = {
  type: 'email',
  message: '请输入有效的邮箱地址',
};

export const passwordRule: Rule = {
  min: 6,
  message: '密码长度不能小于6位',
};

export const confirmPasswordRule = (passwordField: string): Rule => ({
  validator: async (_, value) => {
    if (!value || value === passwordField) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('两次输入的密码不一致'));
  },
});

export const phoneRule: Rule = {
  pattern: /^1[3-9]\d{9}$/,
  message: '请输入有效的手机号码',
};

export const isbnRule: Rule = {
  pattern: /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
  message: '请输入有效的ISBN号码',
};

export const urlRule: Rule = {
  type: 'url',
  message: '请输入有效的URL地址',
};

export const numberRule: Rule = {
  type: 'number',
  message: '请输入有效的数字',
};

export const integerRule: Rule = {
  type: 'integer',
  message: '请输入有效的整数',
};

export const positiveNumberRule: Rule = {
  validator: async (_, value) => {
    if (!value || value > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请输入大于0的数字'));
  },
};

export const dateRule: Rule = {
  type: 'date',
  message: '请选择有效的日期',
};

export const dateRangeRule: Rule = {
  type: 'array',
  message: '请选择有效的日期范围',
};

export const maxLengthRule = (max: number): Rule => ({
  max,
  message: `长度不能超过${max}个字符`,
});

export const minLengthRule = (min: number): Rule => ({
  min,
  message: `长度不能小于${min}个字符`,
});

export const customRule = (validator: (value: string | number | boolean | null) => Promise<boolean>, message: string): Rule => ({
  validator: async (_, value) => {
    const isValid = await validator(value);
    if (isValid) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(message));
  },
}); 