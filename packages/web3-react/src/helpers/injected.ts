declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isTrust?: boolean;
      isImToken?: boolean;
    };
  }
}

export const hasInjected = (): boolean => {
  try {
    return !!window.ethereum;
  } catch (error) {
    return false;
  }
};

export const isMetamaskProvider = (): boolean => {
  try {
    return !!window.ethereum?.isMetaMask;
  } catch (error) {
    return false;
  }
};

export const isImTokenProvider = (): boolean => {
  try {
    return !!window.ethereum?.isImToken;
  } catch (error) {
    return false;
  }
};

export const isTrustProvider = (): boolean => {
  try {
    return !!window.ethereum?.isTrust;
  } catch (error) {
    return false;
  }
};