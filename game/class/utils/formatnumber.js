export default function(t) {
    t = parseInt(t, 10);
    let e = Math.floor(t / 6e4)
        , i = (t - 6e4 * e) / 1e3;
    return i = i.toFixed(2),
    10 > e && (e = e),
    10 > i && (i = "0" + i),
    e + ":" + i;
}