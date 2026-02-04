import { renderHook, act } from '@testing-library/react';
import useDebounce from '../useDebounce';

describe('useDebounce', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('should update the value after the delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'test', delay: 500 },
    });

    // Update value
    rerender({ value: 'updated', delay: 500 });

    // Value should not have changed yet
    expect(result.current).toBe('test');

    // Advance time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now value should have changed
    expect(result.current).toBe('updated');
  });

  it('should cancel the timeout if value changes quickly', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'test', delay: 500 },
    });

    // Update to value 1
    rerender({ value: 'update1', delay: 500 });

    // Advance less than delay
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Update to value 2
    rerender({ value: 'update2', delay: 500 });

    // Advance remaining time for first update (300ms)
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should not be update1 because it was cancelled
    expect(result.current).toBe('test');

    // Advance remaining time for second update (200ms more to complete 500ms from second change)
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe('update2');
  });
});
