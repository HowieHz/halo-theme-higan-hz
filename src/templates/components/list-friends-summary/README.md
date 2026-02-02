# list-friends-summary Component

朋友圈文章列表组件，用于显示来自朋友圈插件的文章列表。

## Usage

```html
<th:block th:insert="~{components/list-friends-summary/template :: content(${friends})}"></th:block>
```

## Parameters

- `friends`: UrlContextListResult<FriendPostVo> - 朋友圈文章列表数据，包含分页信息

## Features

- 显示文章标题、作者、发布时间、描述
- 支持分页
- 响应式设计
- 悬停效果
- 与主题其他列表组件风格一致
