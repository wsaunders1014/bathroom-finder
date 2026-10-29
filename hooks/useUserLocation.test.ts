import { expect, test, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useUserLocation } from './useUserLocation';


test('sets status to denied when permission is refused', () => {
    const watchPosition = vi.fn();
    Object.defineProperty(navigator, "geolocation", {
        value: { watchPosition, clearWatch: vi.fn() },
        configurable: true,
    })
    const { result } = renderHook(() => useUserLocation());

    const onError = watchPosition.mock.calls[0][1];
    act(() => {
        onError({ code: 1, PERMISSION_DENIED: 1 })
    });
    expect(result.current.status).toBe("denied")

})
test('sets status to unavailable on other errors', () => {
    const watchPosition = vi.fn();
    Object.defineProperty(navigator, "geolocation", {
        value: { watchPosition, clearWatch: vi.fn() },
        configurable: true,
    })
    const { result } = renderHook(() => useUserLocation());

    const onError = watchPosition.mock.calls[0][1];
    act(() => {
        onError({ code: 2, PERMISSION_DENIED: 1 })
    });
    expect(result.current.status).toBe("unavailable")

})
test('stores the position and set status to located on success', () => {
    const watchPosition = vi.fn();
    Object.defineProperty(navigator, "geolocation", {
        value: { watchPosition, clearWatch: vi.fn() },
        configurable: true,
    })
    const { result } = renderHook(() => useUserLocation());

    const onSuccess = watchPosition.mock.calls[0][0];
    act(() => {
        onSuccess({ coords:{latitude: 34, longitude: -118} })
    });
    expect(result.current.status).toBe("located")
    expect(result.current.position).toEqual([34, -118]);
})
test('stop watching when unmounted', ()=>{
    const watchPosition = vi.fn(()=> 42);
    const clearWatch = vi.fn();
     Object.defineProperty(navigator, "geolocation", {
        value: { watchPosition, clearWatch },
        configurable: true,
    })
    const { unmount } = renderHook(() => useUserLocation());
    unmount();
    expect(clearWatch).toHaveBeenCalledWith(42)

})
test('retry resets status and starts a new watch', ()=>{
    const watchPosition = vi.fn();
    Object.defineProperty(navigator, "geolocation", {
        value: { watchPosition, clearWatch: vi.fn() },
        configurable: true,
    })
    const { result } = renderHook(() => useUserLocation());

    const onError = watchPosition.mock.calls[0][1];
    act(() => {
        onError({code:1, PERMISSION_DENIED:2})
        result.current.retry();
    });
    expect(result.current.status).toBe("locating")
})