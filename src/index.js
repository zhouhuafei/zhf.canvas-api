(function (name, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') { // nodejs - commonjs canon
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) { // requirejs - amd canon
        define(factory);
    } else if (window) { // window - browser canon
        if (Object.prototype.toString.call(window.zhf).slice(8, -1).toLowerCase() !== 'object') {
            window.zhf = {};
        }
        window.zhf[name] = factory();
    }
})('canvasApi', function () {
    return {
        drawMoreLineText(opts = {}) { // canvas绘制多行文本，或者单行文本，超出显示省略号。源码：https://github.com/zhouhuafei/zhf.canvas-api/blob/master/src/index.js
            const ctx = opts.ctx; // 绘画环境
            const text = opts.text || ''; // 文本
            const x = opts.x || 0; // x轴坐标
            let y = opts.y || 0; // y轴坐标
            const fontSize = opts.fontSize || 12; // 文字大小
            const fontFamily = opts.fontFamily || 'sans-serif'; // 字体
            const lineHeight = opts.lineHeight || 18; // 行高，这里的数值是值像素，不是倍数。
            const lineWidth = opts.lineWidth || 300; // 行宽
            const lineNum = opts.lineNum; // 行数(默认不限制行数)
            const isFillEllipsis = opts.isFillEllipsis !== false; // 超出是否填充省略号(默认true)，默认false的写法：opts.isFillEllipsis === true;
            const drawMethod = opts.drawMethod || 'fillText'; // 绘画方式：fillText，strokeText
            if (!ctx) {
                return;
            }
            ctx.font = `${fontSize}px ${fontFamily}`;
            ctx.textBaseline = 'middle';
            y = y + fontSize / 2 + (lineHeight - fontSize) / 2; // 重置y轴坐标到精准的位置。
            const items = [];
            let str = '';
            // 超过了宽度，则吧超过之前的字符放入items
            for (let i = 0; i < text.length; i++) {
                str += text[i];
                if (ctx.measureText(str).width > lineWidth) {
                    items.push(str.substring(0, str.length - 1));
                    str = '';
                    i--;
                }
            }
            if (!items.length) { // 如果文本没超出单行宽度。
                items.push(text);
            } else { // 如果文本超出了单行宽度。
                // 如果存在剩余的，则把剩余的填入
                const endText = text.split(items.join(''))[1];
                if (endText) {
                    items.push(endText);
                }
            }
            // 如果超出了指定行数。
            if (!isNaN(lineNum) && items.length > lineNum) {
                items.length = lineNum;
                if (isFillEllipsis) { // 如果做省略号填充
                    let str = items[items.length - 1];
                    const strLen = str.length;
                    for (let i = 0; i < strLen; i++) {
                        if (ctx.measureText(`${str}...`).width > lineWidth) {
                            str = str.substring(0, str.length - 1);
                        } else {
                            items[items.length - 1] = `${str}...`;
                        }
                    }
                }
            }
            // 绘画文字
            items.forEach(function (v, i) {
                ctx[drawMethod](v, x, y + i * (fontSize + (lineHeight - fontSize) / 2));
            });
        },
    };
});
