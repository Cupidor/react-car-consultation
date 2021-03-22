// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    isSeller: currentUser && currentUser.user_type === '商家',
    isBuyer: currentUser && currentUser.user_type === '用户',
    isAdministrator: currentUser && currentUser.user_type === '管理员',
  };
}
