'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (name, factory) {
    if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined') {
        // nodejs - commonjs canon
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // requirejs - amd canon
        define(factory);
    } else if (window) {
        // window - browser canon
        if (Object.prototype.toString.call(window.zhf).slice(8, -1).toLowerCase() !== 'object') {
            window.zhf = {};
        }
        window.zhf[name] = factory();
    }
})('canvasApi', function () {
    return {
        /*
            canvas，设置字体，只有一个font属性，所以后续如果更改文字大小，也需要重新设置font。
            每次重置font都应该设置上fontFamily。
            所以把font封装到内部是正确的做法。
            如果拿出来的话，需要正则匹配文字大小。如果用户设置了错误的font。则正则会匹配不到进而报错。
            font封装到内部，然后对齐方式使用middle。之后对y轴坐标处理一下，可以完美绘制多行或者单行文本。
        */
        drawMoreLineText: function drawMoreLineText() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            // canvas绘制多行文本，或者单行文本，超出显示省略号。源码：https://github.com/zhouhuafei/zhf.canvas-api/blob/master/src/index.js
            var ctx = opts.ctx; // 绘画环境
            var text = opts.text || ''; // 文本
            var x = opts.x || 0; // x轴坐标
            var y = opts.y || 0; // y轴坐标
            var fontSize = opts.fontSize || 12; // 文字大小
            var fontFamily = opts.fontFamily || 'sans-serif'; // 字体
            var lineHeight = opts.lineHeight || 18; // 行高，这里的数值是值像素，不是倍数。
            var lineWidth = opts.lineWidth || 300; // 行宽
            var lineNum = opts.lineNum; // 行数(默认不限制行数)
            var isFillEllipsis = opts.isFillEllipsis !== false; // 超出是否填充省略号(默认true)，默认false的写法：opts.isFillEllipsis === true;
            var drawMethod = opts.drawMethod || 'fillText'; // 绘画方式：fillText，strokeText
            if (!ctx) {
                return;
            }
            ctx.font = fontSize + 'px ' + fontFamily;
            ctx.textBaseline = 'middle';
            y = y + fontSize / 2 + (lineHeight - fontSize) / 2; // 重置y轴坐标到精准的位置。
            var items = [];
            var str = '';
            // 超过了宽度，则吧超过之前的字符放入items
            for (var i = 0; i < text.length; i++) {
                str += text[i];
                if (ctx.measureText(str).width > lineWidth) {
                    items.push(str.substring(0, str.length - 1));
                    str = '';
                    i--;
                }
            }
            if (!items.length) {
                // 如果文本没超出单行宽度。
                items.push(text);
            } else {
                // 如果文本超出了单行宽度。
                // 如果存在剩余的，则把剩余的填入
                var endText = text.split(items.join(''))[1];
                if (endText) {
                    items.push(endText);
                }
            }
            // 如果超出了指定行数。
            if (!isNaN(lineNum) && items.length > lineNum) {
                items.length = lineNum;
                if (isFillEllipsis) {
                    // 如果做省略号填充
                    var _str = items[items.length - 1];
                    var strLen = _str.length;
                    for (var _i = 0; _i < strLen; _i++) {
                        if (ctx.measureText(_str + '...').width > lineWidth) {
                            _str = _str.substring(0, _str.length - 1);
                        } else {
                            items[items.length - 1] = _str + '...';
                        }
                    }
                }
            }
            // 绘画文字
            items.forEach(function (v, i) {
                ctx[drawMethod](v, x, y + i * (fontSize + (lineHeight - fontSize) / 2));
            });
        },
        drawRoundRect: function drawRoundRect(ctx, x, y, w, h, r) {
            // 绘制圆角矩形
            if (w < 2 * r) {
                r = w / 2;
            }
            if (h < 2 * r) {
                r = h / 2;
            }
            ctx.beginPath();
            ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
            ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
            ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
            ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
            ctx.closePath();
        },
        setShadow: function setShadow(ctx, offsetX, offsetY, blur, color) {
            // 设置阴影
            ctx.shadowOffsetX = offsetX;
            ctx.shadowOffsetY = offsetY;
            ctx.shadowBlur = 20;
            ctx.shadowColor = color;
        }
    };
});