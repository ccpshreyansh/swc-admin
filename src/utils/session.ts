const SESSION_KEY = "jewellery_admin_session";
const SESSION_DURATION = 12 * 60 * 60 * 1000; // 12 hours

export const saveSession = (shopConfig: any) => {
  const session = {
    shopConfig,
    expiresAt: Date.now() + SESSION_DURATION,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  const session = JSON.parse(raw);

  if (Date.now() > session.expiresAt) {
    clearSession();
    return null;
  }

  return session.shopConfig;
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
