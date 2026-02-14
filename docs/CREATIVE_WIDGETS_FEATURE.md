# Creative Widgets Feature - 创意小挂件功能

## Feature Overview / 功能概述

This feature adds decorative festival widgets to your Halo theme website. The widgets can be displayed in different positions with various patterns and animations, perfect for adding festive atmosphere to your site.

此功能为您的 Halo 主题网站添加装饰性的节日小挂件。挂件可以在不同位置显示，支持多种图案和动画效果，非常适合为网站增添节日气氛。

## Features / 功能特性

### 1. Master Switch / 总开关
- Enable or disable the widget feature with a single switch
- 通过单个开关启用或禁用挂件功能

### 2. Display Range / 显示范围
- **Global**: Show widgets on all pages
- **Homepage Only**: Show widgets only on the homepage
- **全局显示**: 在所有页面显示挂件
- **仅首页**: 仅在首页显示挂件

### 3. Position Options / 位置选项
- **Top Left**: Display widget in the top-left corner
- **Top Right**: Display widget in the top-right corner
- **Diagonal**: Display widgets in both top corners
- **左上角**: 在左上角显示挂件
- **右上角**: 在右上角显示挂件
- **对角**: 在左上角和右上角同时显示挂件

### 4. Available Patterns / 可用图案

#### Lantern (灯笼)
- Perfect for Chinese New Year and traditional festivals
- 适合春节和中国传统节日
- Red color with golden "福" (fortune) character
- 红色配金色"福"字

#### Zongzi (粽子)
- Ideal for Dragon Boat Festival (端午节)
- 适合端午节
- Green bamboo leaf wrapping
- 绿色竹叶包裹

#### Christmas Hat (圣诞帽)
- Great for Christmas celebrations
- 适合圣诞节庆祝
- Classic red and white Santa hat
- 经典红白圣诞老人帽子

#### Birthday Cake (生日蛋糕)
- Perfect for birthday celebrations
- 适合生日庆祝
- Three-tier pink cake with candle
- 三层粉色蛋糕配蜡烛

### 5. Animation Effects / 动画效果

#### Static (静止)
- No animation, widgets remain still
- 无动画，挂件保持静止

#### Swing (晃动)
- Gentle swinging animation
- 温和的晃动动画
- Animates with a 3-second cycle
- 3秒循环动画

### 6. Opacity Control / 透明度控制
- Adjustable opacity from 0 to 1
- 可调节透明度从 0 到 1
- Default: 0.85 (85% opacity)
- 默认值: 0.85（85% 不透明度）

### 7. Responsive Design / 响应式设计
- Desktop: 80px width
- Tablet: 60px width (≤768px)
- Mobile: 50px width (≤480px)
- 桌面端: 80px 宽度
- 平板端: 60px 宽度 (≤768px)
- 手机端: 50px 宽度 (≤480px)

## Configuration / 配置方法

### In Halo Admin Panel / 在 Halo 管理后台

1. Navigate to: Theme Settings → Overall Style (总体样式)
2. Find the "Creative Widgets" section
3. Configure the following options:

```
启用创意小挂件 (Enable Creative Widgets): ON
显示范围 (Display Range): 全局显示 (Global)
挂件位置 (Widget Position): 对角 (Diagonal)
挂件图案 (Widget Pattern): 灯笼 (Lantern)
动画效果 (Animation Effect): 晃动 (Swing)
透明度 (Opacity): 0.85
```

## Technical Details / 技术细节

### Files Added / 新增文件

1. **Configuration Files** / 配置文件
   - `settings.yaml` - Chinese configuration
   - `i18n-settings/settings.en.yaml` - English configuration

2. **SVG Assets** / SVG 资源文件
   - `public/assets/images/widgets/lantern.svg`
   - `public/assets/images/widgets/zongzi.svg`
   - `public/assets/images/widgets/christmas-hat.svg`
   - `public/assets/images/widgets/birthday-cake.svg`

3. **Template Files** / 模板文件
   - `src/templates/fragments/layout.html` - Widget display logic

4. **Style Files** / 样式文件
   - `src/styles/mixins/creative-widgets.css` - Widget styles and animations
   - `src/styles/main.css` - Import statement

### CSS Classes / CSS 类名

- `.creative-widgets` - Main container
- `.creative-widget` - Individual widget wrapper
- `.creative-widget-left` - Left position widget
- `.creative-widget-right` - Right position widget
- `.creative-widget-swing` - Swinging animation
- `.creative-widget-img` - Widget image

### Animation Keyframes / 动画关键帧

```css
@keyframes widget-swing {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}
```

## Usage Scenarios / 使用场景

1. **Chinese New Year / 春节**: Use Lantern pattern
2. **Dragon Boat Festival / 端午节**: Use Zongzi pattern
3. **Christmas / 圣诞节**: Use Christmas Hat pattern
4. **Birthdays / 生日**: Use Birthday Cake pattern
5. **Any Celebration / 任何庆祝活动**: Choose appropriate pattern

## Best Practices / 最佳实践

1. **Choose appropriate patterns** based on the current festival or season
   根据当前节日或季节选择合适的图案

2. **Use diagonal position** for maximum visual impact
   使用对角位置以获得最大视觉效果

3. **Enable swinging animation** for more lively appearance
   启用晃动动画以获得更生动的外观

4. **Adjust opacity** if widgets interfere with content readability
   如果挂件影响内容可读性，请调整透明度

5. **Use homepage-only mode** for a subtle effect
   使用仅首页模式以获得微妙的效果

## Browser Compatibility / 浏览器兼容性

- ✅ Chrome 111+
- ✅ Edge 111+
- ✅ Firefox 114+
- ✅ Safari 16.4+

## Performance / 性能

- Minimal impact on page load time
- 对页面加载时间影响最小
- SVG images are lightweight and scalable
- SVG 图像轻量且可缩放
- CSS animations are hardware-accelerated
- CSS 动画使用硬件加速

## Accessibility / 无障碍性

- Widgets have `pointer-events: none` to not interfere with clicks
- 挂件设置了 `pointer-events: none` 不干扰点击
- Widgets are hidden when printing
- 打印时自动隐藏挂件
- Alt text provided for all images
- 所有图像都提供了替代文本

## Future Enhancements / 未来增强

Potential features for future versions:
未来版本的潜在功能：

- [ ] More widget patterns (snowflakes, fireworks, etc.)
- [ ] Custom widget upload
- [ ] Position offset control
- [ ] Size adjustment
- [ ] Multiple widgets support
- [ ] Seasonal auto-switching

## Credits / 致谢

Developed for the Halo Theme Higan-Hz project
为 Halo Theme Higan-Hz 项目开发

---

© 2026 HowieHz - MIT License
