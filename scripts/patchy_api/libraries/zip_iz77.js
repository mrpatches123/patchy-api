var LZ77 = function () {
	var r = String.fromCharCode, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", t = {};
	function n(r, o) {
		if (!t[r]) {
			t[r] = {};
			for (var e = 0; e < r.length; e++)t[r][r.charAt(e)] = e;
		} return t[r][o];
	} var s = {
		compressToBase64: function (r) {
			if (null == r) return "";
			var e = s._compress(r, 6, (function (r) {
				return o.charAt(r);
			}));
			switch (e.length % 4) {
				default: case 0: return e;
				case 1: return e + "===";
				case 2: return e + "==";
				case 3: return e + "=";
			}
		}, decompressFromBase64: function (r) {
			return null == r ? "" : "" == r ? null : s._decompress(r.length, 32, (function (e) {
				return n(o, r.charAt(e));
			}));
		}, compressToUTF16: function (o) {
			return null == o ? "" : s._compress(o, 15, (function (o) {
				return r(o + 32);
			})) + " ";
		}, decompressFromUTF16: function (r) {
			return null == r ? "" : "" == r ? null : s._decompress(r.length, 16384, (function (o) {
				return r.charCodeAt(o) - 32;
			}));
		}, compressToUint8Array: function (r) {
			for (var o = s.compress(r), e = new Uint8Array(2 * o.length), t = 0, n = o.length;
				t < n;
				t++) {
				var i = o.charCodeAt(t);
				e[2 * t] = i >>> 8, e[2 * t + 1] = i % 256;
			} return e;
		}, decompressFromUint8Array: function (o) {
			if (null == o) return s.decompress(o);
			for (var e = new Array(o.length / 2), t = 0, n = e.length;
				t < n;
				t++)e[t] = 256 * o[2 * t] + o[2 * t + 1];
			var i = [];
			return e.forEach((function (o) {
				i.push(r(o));
			})), s.decompress(i.join(""));
		}, compressToEncodedURIComponent: function (r) {
			return null == r ? "" : s._compress(r, 6, (function (r) {
				return e.charAt(r);
			}));
		}, decompressFromEncodedURIComponent: function (r) {
			return null == r ? "" : "" == r ? null : (r = r.replace(/ /g, "+"), s._decompress(r.length, 32, (function (o) {
				return n(e, r.charAt(o));
			})));
		}, compress: function (o) {
			return s._compress(o, 16, (function (o) {
				return r(o);
			}));
		}, _compress: function (r, o, e) {
			if (null == r) return "";
			var t, n, s, i = {}, a = {}, p = "", c = "", u = "", l = 2, f = 3, h = 2, d = [], m = 0, w = 0;
			for (s = 0;
				s < r.length;
				s += 1)if (p = r.charAt(s), Object.prototype.hasOwnProperty.call(i, p) || (i[p] = f++, a[p] = !0), c = u + p, Object.prototype.hasOwnProperty.call(i, c)) u = c;
				else {
					if (Object.prototype.hasOwnProperty.call(a, u)) {
						if (u.charCodeAt(0) < 256) {
							for (t = 0;
								t < h;
								t++)m <<= 1, w == o - 1 ? (w = 0, d.push(e(m)), m = 0) : w++;
							for (n = u.charCodeAt(0), t = 0;
								t < 8;
								t++)m = m << 1 | 1 & n, w == o - 1 ? (w = 0, d.push(e(m)), m = 0) : w++, n >>= 1;
						} else {
							for (n = 1, t = 0;
								t < h;
								t++)m = m << 1 | n, w == o - 1 ? (w = 0, d.push(e(m)), m = 0) : w++, n = 0;
							for (n = u.charCodeAt(0), t = 0;
								t < 16;
								t++)m = m << 1 | 1 & n, w == o - 1 ? (w = 0, d.push(e(m)), m = 0) : w++, n >>= 1;
						} 0 == --l && (l = Math.pow(2, h), h++), delete a[u];
					} else for (n = i[u], t = 0;
						t < h;
						t++)m = m << 1 | 1 & n, w == o - 1 ? (w = 0, d.push(e(m)), m = 0) : w++, n >>= 1;
					0 == --l && (l = Math.pow(2, h), h++), i[c] = f++, u = String(p);
				} if ("" !== u) {
					if (Object.prototype.hasOwnProperty.call(a, u)) {
						if (u.charCodeAt(0) < 256) {
							for (t = 0;
								t < h;
								t++)m <<= 1, w == o - 1 ? (w = 0, d.push(e(m)), m = 0) : w++;
							for (n = u.charCodeAt(0), t = 0;
								t < 8;
								t++)m = m << 1 | 1 & n, w == o - 1 ? (w = 0, d.push(e(m)), m = 0) : w++, n >>= 1;
						} else {
							for (n = 1, t = 0;
								t < h;
								t++)m = m << 1 | n, w == o - 1 ? (w = 0, d.push(e(m)), m = 0) : w++, n = 0;
							for (n = u.charCodeAt(0), t = 0;
								t < 16;
								t++)m = m << 1 | 1 & n, w == o - 1 ? (w = 0, d.push(e(m)), m = 0) : w++, n >>= 1;
						} 0 == --l && (l = Math.pow(2, h), h++), delete a[u];
					} else for (n = i[u], t = 0;
						t < h;
						t++)m = m << 1 | 1 & n, w == o - 1 ? (w = 0, d.push(e(m)), m = 0) : w++, n >>= 1;
					0 == --l && (l = Math.pow(2, h), h++);
				} for (n = 2, t = 0;
				t < h;
				t++)m = m << 1 | 1 & n, w == o - 1 ? (w = 0, d.push(e(m)), m = 0) : w++, n >>= 1;
			for (;
				;
			) {
				if (m <<= 1, w == o - 1) {
					d.push(e(m));
					break;
				} w++;
			} return d.join("");
		}, decompress: function (r) {
			return null == r ? "" : "" == r ? null : s._decompress(r.length, 32768, (function (o) {
				return r.charCodeAt(o);
			}));
		}, _decompress: function (o, e, t) {
			var n, s, i, a, p, c, u, l = [], f = 4, h = 4, d = 3, m = "", w = [], v = { val: t(0), position: e, index: 1 };
			for (n = 0;
				n < 3;
				n += 1)l[n] = n;
			for (i = 0, p = Math.pow(2, 2), c = 1;
				c != p;
			)a = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = e, v.val = t(v.index++)), i |= (a > 0 ? 1 : 0) * c, c <<= 1;
			switch (i) {
				case 0: for (i = 0, p = Math.pow(2, 8), c = 1;
					c != p;
				)a = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = e, v.val = t(v.index++)), i |= (a > 0 ? 1 : 0) * c, c <<= 1;
					u = r(i);
					break;
				case 1: for (i = 0, p = Math.pow(2, 16), c = 1;
					c != p;
				)a = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = e, v.val = t(v.index++)), i |= (a > 0 ? 1 : 0) * c, c <<= 1;
					u = r(i);
					break;
				case 2: return "";
			}for (l[3] = u, s = u, w.push(u);
				;
			) {
				if (v.index > o) return "";
				for (i = 0, p = Math.pow(2, d), c = 1;
					c != p;
				)a = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = e, v.val = t(v.index++)), i |= (a > 0 ? 1 : 0) * c, c <<= 1;
				switch (u = i) {
					case 0: for (i = 0, p = Math.pow(2, 8), c = 1;
						c != p;
					)a = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = e, v.val = t(v.index++)), i |= (a > 0 ? 1 : 0) * c, c <<= 1;
						l[h++] = r(i), u = h - 1, f--;
						break;
					case 1: for (i = 0, p = Math.pow(2, 16), c = 1;
						c != p;
					)a = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = e, v.val = t(v.index++)), i |= (a > 0 ? 1 : 0) * c, c <<= 1;
						l[h++] = r(i), u = h - 1, f--;
						break;
					case 2: return w.join("");
				}if (0 == f && (f = Math.pow(2, d), d++), l[u]) m = l[u];
				else {
					if (u !== h) return null;
					m = s + s.charAt(0);
				} w.push(m), l[h++] = s + m.charAt(0), s = m, 0 == --f && (f = Math.pow(2, d), d++);
			}
		}
	};
	return s;
}();
const { compress, decompress } = LZ77;

export { compress, decompress };
