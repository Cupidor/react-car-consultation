import { LockTwoTone, UserOutlined } from '@ant-design/icons';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, useModel } from 'umi';
import { LoginSystem } from '@/services/login';
import { queryUser } from '@/services/user';

import styles from './index.less';

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const goto = (role: string) => {
  if (!history) return;
  setTimeout(() => {
    switch (role) {
      case '用户':
        history.push('/home');
        break
      case '商家':
        history.push('/shop');
        break
      case '管理员':
        history.push('/shopManagement');
        break
      default:
        break
    }

  }, 10);
};

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await queryUser(localStorage.getItem('userId'));
    if (userInfo.code === '0000') {
      if (userInfo.result) {
        setInitialState({
          ...initialState,
          currentUser: userInfo.result,
        });
        goto(userInfo.result.type);
      }
    } else {
      if (userInfo.message) {
        message.error(userInfo.message);
      }
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      // 登录
      const msg = await LoginSystem({ ...values });
      if (msg.code === '0000') {
        message.success('登录成功！');
        localStorage.setItem('userName', msg.result.uname);
        localStorage.setItem('userId', msg.result.id);
        localStorage.setItem('userType', msg.result.type);
        await fetchUserInfo();
      } else {
        message.error(msg.message);
      }
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.login}>
          <div className={styles.top}>
            <div className={styles.desc}>车讯汽车咨询系统</div>
          </div>
          <div className={styles.main}>
            <ProForm
              initialValues={{
                autoLogin: true,
              }}
              submitter={{
                searchConfig: {
                  submitText: intl.formatMessage({
                    id: 'pages.login.submit',
                    defaultMessage: '登录',
                  }),
                },
                render: (_, dom) => dom.pop(),
                submitButtonProps: {
                  loading: submitting,
                  size: 'large',
                  style: {
                    width: '100%',
                  },
                },
              }}
              onFinish={async (values) => {
                handleSubmit(values);
              }}
            >
              <Tabs activeKey={type} onChange={setType}>
                <Tabs.TabPane
                  key="account"
                  tab={intl.formatMessage({
                    id: 'pages.login.accountLogin.tab',
                    defaultMessage: '账户密码登录',
                  })}
                />
              </Tabs>
              {type === 'account' && (
                <>
                  <ProFormText
                    name="uName"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined className={styles.prefixIcon} />,
                    }}
                    placeholder={intl.formatMessage({
                      id: 'pages.login.username.placeholder',
                      defaultMessage: '用户名: 请输入',
                    })}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.login.username.required"
                            defaultMessage="请输入用户名!"
                          />
                        ),
                      },
                    ]}
                  />
                  <ProFormText.Password
                    name="pwd"
                    fieldProps={{
                      size: 'large',
                      prefix: <LockTwoTone className={styles.prefixIcon} />,
                    }}
                    placeholder={intl.formatMessage({
                      id: 'pages.login.password.placeholder',
                      defaultMessage: '密码: 请输入',
                    })}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.login.password.required"
                            defaultMessage="请输入密码！"
                          />
                        ),
                      },
                    ]}
                  />
                </>
              )}
              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <ProFormCheckbox noStyle name="autoLogin">
                  <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
                </ProFormCheckbox>
                <a
                  style={{
                    float: 'right',
                  }}
                  onClick={() => history.push('/user/register')}
                >
                  <FormattedMessage id="pages.login.forgotPassword" defaultMessage="立即注册" />
                </a>
              </div>
            </ProForm>
          </div>
        </div>
      </div>
      {/*<Footer />*/}
    </div>
  );
};

export default Login;
