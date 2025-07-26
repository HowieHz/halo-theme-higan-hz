/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-order"],
  rules: {
    // 嵌套选择器规则
    "selector-nested-pattern": "^&|&$",
    "no-descending-specificity": null,

    // 颜色函数与透明度
    "color-function-notation": "modern", // 使用现代颜色函数表示法 rgba(27 31 36 / 15%)
    "alpha-value-notation": "percentage", // 使用百分比表示透明度 15% 而非 0.15

    // 媒体查询
    "media-feature-range-notation": "context", // 使用上下文表示法 (width >= 480px)

    // 允许 CSS at unknown 值语
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["tailwind"],
      },
    ],

    // 属性排序
    "order/properties-alphabetical-order": true,

    // 空行规则
    // 控制属性声明前是否应该有空行
    "declaration-empty-line-before": "never",
    // 控制选择器规则（整个样式块）前是否应该有空行
    "rule-empty-line-before": [
      "always",
      {
        except: ["first-nested"],
        ignore: ["after-comment"],
      },
    ],
    // 控制注释前是否应该有空行
    "comment-empty-line-before": [
      "always",
      {
        except: ["first-nested"],
        ignore: ["stylelint-commands", "after-comment"],
      },
    ],

    // 其他规则
    "no-empty-source": null, // 允许空文件
    "max-nesting-depth": 99, // 限制嵌套深度
    "color-hex-length": "short", // 使用短十六进制颜色代码
    "declaration-block-single-line-max-declarations": 1, // 单行最多声明数
    "unit-allowed-list": ["px", "em", "rem", "%", "s", "vh", "vw", "deg", "fr", "vmax", "vmin", "ms"], // 允许的单位
  },
};
