jest.mock('../../src/hooks/useWeb3');

import { renderHook } from '@testing-library/react-hooks';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { LedgerHQFrameConnector } from 'web3-ledgerhq-frame-connector';
import { LedgerHQConnector } from 'web3-ledgerhq-connector';
import { useConnectorInfo } from '../../src/hooks/useConnectorInfo';
import { useWeb3 } from '../../src/hooks/useWeb3';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;

const mockConnector = (Connector: any) => {
  class EmptyConnector {}
  const connector = new EmptyConnector();
  Object.setPrototypeOf(connector, Connector.prototype);
  mockUseWeb3.mockReturnValue({ active: true, connector } as any);
};

beforeEach(() => {
  mockUseWeb3.mockReturnValue({} as any);
  delete window.ethereum;
});

describe('useConnectorInfo', () => {
  test('should detect gnosis', async () => {
    mockConnector(SafeAppConnector);
    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isGnosis, ...rest } = result.current;

    expect(isGnosis).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect ledger live', async () => {
    mockConnector(LedgerHQConnector);
    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isLedger, ...rest } = result.current;

    expect(isLedger).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect ledger live', async () => {
    mockConnector(LedgerHQFrameConnector);
    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isLedgerLive, ...rest } =
      result.current;

    expect(isLedgerLive).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect walletconnect', async () => {
    mockConnector(WalletConnectConnector);
    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isWalletConnect, ...rest } =
      result.current;

    expect(isWalletConnect).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect coinbase', async () => {
    mockConnector(WalletLinkConnector);
    window.ethereum = { isCoinbaseWallet: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isCoinbase, isWalletLink, ...rest } =
      result.current;

    expect(isCoinbase).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect injected', async () => {
    mockConnector(InjectedConnector);
    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, ...rest } = result.current;

    expect(isInjected).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect metamask', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isMetaMask: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, isMetamask, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isMetamask).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect imToken', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isImToken: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, isImToken, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isImToken).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect Trust', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isTrust: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, isTrust, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isTrust).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should not detect connector', async () => {
    mockUseWeb3.mockReturnValue({ active: false } as any);

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, ...flags } = result.current;

    expect(Object.values(flags).includes(true)).toBeFalsy();
    expect(connectorName).toBeUndefined();
    expect(providerName).toBeUndefined();
  });
});
