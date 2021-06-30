import { renderHook, act } from '@testing-library/react-hooks';
import { useLidoSWR } from './useLidoSWR';
import { sleep } from './testUtils';

describe('useLidoSWR', () => {
  test('should fetch data', async () => {
    const expected = 1;
    const { result } = renderHook(() => useLidoSWR('/data', () => expected));

    expect(result.current.data).toBeUndefined();
    await act(() => sleep(0));
    expect(result.current.data).toBe(expected);
  });

  test('should update data correctly', async () => {
    const expected = 1;
    const mockFetcher = jest.fn(() => expected);
    const { result } = renderHook(() => useLidoSWR('/update', mockFetcher));

    expect(result.current.data).toBeUndefined();
    await act(() => sleep(0));
    expect(result.current.data).toBe(expected);
    expect(mockFetcher).toHaveBeenCalledTimes(1);

    await act(async () => {
      await expect(result.current.update()).resolves.toBe(expected);
    });
    expect(result.current.data).toBe(expected);
    expect(mockFetcher).toHaveBeenCalledTimes(2);
  });

  test('should set loading', async () => {
    const { result } = renderHook(() => useLidoSWR('/loading', () => 1));

    expect(result.current.loading).toBe(true);
    await act(() => sleep(0));
    expect(result.current.loading).toBe(false);
  });

  test('should set initial loading', async () => {
    const { result } = renderHook(() => useLidoSWR('/initial', () => 1));

    expect(result.current.initialLoading).toBe(true);
    await act(() => sleep(0));
    expect(result.current.initialLoading).toBe(false);
  });

  test('should catch an error', async () => {
    const { result } = renderHook(() =>
      useLidoSWR('/error', async () => {
        throw new Error();
      }),
    );

    expect(result.current.error).toBeUndefined();
    await act(() => sleep(0));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
