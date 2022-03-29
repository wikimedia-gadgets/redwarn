export default function <T>(): [Promise<T>, (result: T) => void, () => any] {
    let _res, _rej;
    return [
        new Promise<T>((res, rej) => {
            _res = res;
            _rej = rej;
        }),
        _res,
        _rej,
    ];
}
