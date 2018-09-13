# canvas方法封装，例如绘制多行文字(也可绘制单行文字以及文字超出是否显示省略号)，绘制圆角矩形。
```
const canvasApi = require('zhf.canvas-api');
```
* 画多行文字
> canvasApi.drawMoreLineText({ctx, text, x, y, fontSize, fontFamily, lineHeight, lineWidth, lineNum, isFillEllipsis, drawMethod});
* 画圆角矩形
> canvasApi.drawRoundRect(ctx, x, y, w, h, r);
* 设置阴影
> canvasApisetShadow(ctx, offsetX, offsetY, blur, color);
