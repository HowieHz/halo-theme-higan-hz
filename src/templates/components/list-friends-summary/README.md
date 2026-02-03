# List Friends Summary Component

A component for listing friends' posts, used to display the list of articles from the [friends plugin](https://github.com/chengzhongxue/plugin-friends-new).

Related documentation: <https://docs.kunkunyu.com/docs/plugin-friends/finder-api>

## Usage

Head Content (for including necessary scripts/styles)

```html
<th:block th:insert="~{components/list-friends-summary/template :: headContent}"></th:block>
```

Content Insertion

```html
<th:block th:insert="~{components/list-friends-summary/template :: content(friends, pageTemplateName)}"></th:block>
```

## Parameters

- `friends`: [UrlContextListResult\<FriendPostVo\>](#urlcontextlistresultfriendpostvo) - Friends' Posts data, including pagination information.
- `pageTemplateName`: pass in a string representing the page template name.

## TypeDefinitions

### FriendPostVo

```jsonc
{
  "metadata": {
    "name": "string", // Unique identifier
    "generateName": "string",
    "version": 0,
    "creationTimestamp": "2024-01-16T16:13:17.925131783Z", // Creation time
  },
  "apiVersion": "friend.moony.la/v1alpha1",
  "kind": "FriendPost",
  "spec": {
    "authorUrl": "string", // Author link
    "author": "string", // Author name
    "logo": "string", // Author logo
    "title": "string", // Title
    "postLink": "string", // Link
    "description": "string", // Content
    "pubDate": "date", // Article publication time
  },
}
```

### UrlContextListResult\<FriendPostVo\>

```jsonc
{
  "page": 0, // Current page number
  "size": 0, // Number of items per page
  "total": 0, // Total number
  "items": "List<#FriendPostVo>", // Subscription article list data
  "first": true, // Whether it is the first page
  "last": true, // Whether it is the last page
  "hasNext": true, // Whether there is a next page
  "hasPrevious": true, // Whether there is a previous page
  "totalPages": 0, // Total pages
  "prevUrl": "string", // Previous page link
  "nextUrl": "string", // Next page link
}
```
