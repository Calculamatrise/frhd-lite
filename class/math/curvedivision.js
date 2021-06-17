export default function(t, e, i) {
    function o(t, e, i, s, n, r) {
        f.push(t, e),
        a(t, e, i, s, n, r, 0),
        f.push(n, r)
    }
    function a(t, e, i, o, h, l, c) {
        if (!(c > g)) {
            var u = (t + i) / 2
              , p = (e + o) / 2
              , d = (i + h) / 2
              , x = (o + l) / 2
              , _ = (u + d) / 2
              , b = (p + x) / 2
              , T = h - t
              , C = l - e
              , k = Math.abs((i - h) * C - (o - l) * T);
            if (k > m) {
                if (v * (T * T + C * C) >= k * k) {
                    if (w > y)
                        return void f.push(_, b);
                    var S = Math.abs(Math.atan2(l - o, h - i) - Math.atan2(o - e, i - t));
                    if (S >= Math.PI && (S = 2 * Math.PI - S),
                    y > S)
                        return void f.push(_, b)
                }
            } else if (T = _ - (t + h) / 2,
            C = b - (e + l) / 2,
            v >= T * T + C * C)
                return void f.push(_, b);
            a(t, e, u, p, _, b, c + 1),
            a(_, b, d, x, h, l, c + 1)
        }
    }
    var h = t.x
      , l = t.y
      , c = e.x
      , u = e.y
      , p = i.x
      , d = i.y
      , f = []
      , v = .25
      , g = 10
      , m = 1e-30
      , y = 0
      , w = .01;
    return o(h, l, c, u, p, d), f;
}